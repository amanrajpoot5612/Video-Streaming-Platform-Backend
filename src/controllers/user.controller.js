import asyncHandler from "../utils/asyncHandler.js"
import apiError from "../utils/apiError.js"
// import { User } from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"


// Generating access and refresh token
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        console.log(`Access token: ${accessToken}`);

        const refreshToken = await user.generateRefreshToken()
        console.log(`Refresh token: ${refreshToken}`);

        console.log("token generated in gaft");

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        console.log("Something went wrong while generating access and refresh token");
        throw new apiError(500, "Server halted , Please try again later")
    }
}

// Register user controller
const registerUser = asyncHandler(async (req, res) => {

    // Parsing form data
    const { fullName, username, email, password } = req.body
    console.log(fullName + " " + email + " " + password + " " + username);
    console.log(req.body);

    //Trim fields
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new apiError(400, "All fields are required")
    }

    // Check for user
    const existedUser = await User.findOne(
        {
            $or: [{ username }, { email }]
        }
    ) || null;

    // Conditionals for existing user
    if (existedUser) {
        return res.status(409).json(
            new apiResponse(409 , null , "Username already exists")
        )
    }

    const avatarLocalPath = req?.files?.avatar?.[0]?.path || null;
    const coverImageLocalPath = req?.files?.coverImage?.[0]?.path || null;

    // Logging local paths
    console.log("Avatar Path:", avatarLocalPath);
    console.log("Cover Path:", coverImageLocalPath);

    // Handle avatar error directly
    if (!avatarLocalPath) {
        return res.status(400).json(
            new apiResponse(400, null, "Avatar file is required")
        );
    }

    // Handle cover image error directly
    if (!coverImageLocalPath) {
        return res.status(400).json(
            new apiResponse(400, null, "Cover file is required")
        );
    }


    // Upload on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)


    // Uploading error
    if (!avatar) {
        return res.status(400).json(
            new apiResponse(400, null, "Choose another Avatar file or try again later")
        );
    }

    // Uploading error
    if (!coverImage) {
        return res.status(400).json(
            new apiResponse(400, null, "Choose another Cover Image or try again later")
        );
    }

    // Create user
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // Create user
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new apiError(405, "Server error occured")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    if (!accessToken || !refreshToken) {
        throw new apiError(402, "Server halted , Please try again later")
    }

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }

    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(200, createdUser, "User registered successfully")
        )

})

// Login user controller
const loginUser = asyncHandler(async (req, res) => {
    // req.body --> data
    // username/email
    // find the user
    // password check
    // access and refresh token
    // send cookies
    // res.send

    // Data received
    const { email, username, password } = req.body

    // Check for data
    if (!username && !email) {
        throw new apiError(400, "Username or email required")
    }

    // console.log("email and password received to backend , checking for user in");

    // Find user
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    // console.log("user found");

    // Conditional for user not found
    if (!user) {
        throw new apiError(404, "User doesn't exist")
    }

    // Password validation
    const isPasswordValid = await user.isPasswordCorrect(password)

    // Condition for password validation
    if (!isPasswordValid) {
        throw new apiError(401, "Incorrect password")
    }

    // console.log("password validated");

    // Generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    if (!accessToken || !refreshToken) {
        throw new apiError(404, "Server halted , Please try again later")
    }
    // console.log("tokens generated");

    // Saving, updating and sending user details
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //setting options
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }

    // res
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie(accessToken, options)
        .clearCookie(refreshToken, options)
        .json(new apiResponse(200, {}, "User logged out successfully"))

})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new apiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken._id)

        if (!user) {
            throw new apiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new apiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new apiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._Id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new apiError(400, "Invalid old password")
    }

    user.password = newPassword

    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new apiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = req.user;
    console.log(`User in get current user ${user}`);
    
    return res.status(200).json(
        new apiResponse(200, user, "Fetched successfully")
    )
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body

    if (!fullName || !email) {
        throw new apiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                email,
                fullName
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new apiResponse(user, "Account details updated successfully", 200))
})

const getProfile = asyncHandler(async (req ,res) =>{
    console.log('Profile path hitted');
    
    const userId = req.user._id

    const user = await User.findById(userId).select("-password -refreshToken");

    if(!user){
        return res.status(404)
        .json({
            success: false,
            message: "User not found"
        })
    }

    const videos = await Video.find({
        owner: userId,
    }).sort({
        createdAt: -1
    })
    // console.log(`user controller: ${user}`);
    console.log(`user controller: ${videos}`);
    
    return res.status(200).json(
        new apiResponse(200, {user, videos}, 'User fetched')
    )

})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    getProfile
};