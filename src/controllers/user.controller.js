import asyncHandler from "../utils/asyncHandler.js"
import apiError from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js"
import jwt from "json-web-token"

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}
    } catch (error) {
        throw new apiError(500, "Something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler( async (req, res) =>{
    // res.status(200).send("Done")
    const {fullName, username, email, password} = req.body
    console.log(fullName + " " +   email + " " + password + " " + username );
    console.log(req.body);
    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new apiError(400, "All fields are required")
    }

    const existedUser =  await User.findOne(
        {
            $or: [{ username }, { email }]
        }
    )

    if(existedUser){
        throw new apiError(409, "User with email or username existed");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const CoverImageLocalPath = req.files?.coverImage?.[0]?.path || null
    console.log(avatarLocalPath);

    if(!avatarLocalPath){
        throw new apiError(400, "Avatar file is required (no local path)")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(CoverImageLocalPath)
    // console.log(avatar);
    if(!avatar){
        throw new apiError(400, "Avatar file is required ( not uploaded on cloudinary)")
    }

    const user  = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered successfully")
    )

})

const loginUser = asyncHandler( async (req, res) => {
    // req.body --> data
    // username/email
    // find the user
    // password check
    // access and refresh token
    // send cookies
    // res.send

    
    const {email, username, password} = req.body
    
    if(!username && !email){
        throw new apiError(400, "Username or email required")
    }
    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new apiError(404, "User doesn't exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new apiError(401, "Password incorrect")
    }

    const {accessToken, refreshToken}  = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

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

const logoutUser = asyncHandler(async (req, res) =>{
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

const refreshAccessToken = asyncHandler( async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new apiError(401, "Unauthorized request")
    }
    
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken._id)
    
        if(!user){
            throw new apiError(401, "Invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new apiError(401, "Refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
        
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new apiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler( async (req, res) => {
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._Id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new apiError(400, "Invalid old password")
    }

    user.password = newPassword
    
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new apiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler( async (req, res) => {
    return res
    .status(200)
    .json(200, req.user, "Current user fetched successfully")
})

const updateAccountDetails = asyncHandler( async (req, res) => {
    const {fullName, email } = req.body

    if(!fullName || !email){
        throw new apiError(400, "All fields are required")
    }

    const user  = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                email,
                fullName
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new apiResponse(200, user, "Account details updated successfully"))
})

export { registerUser, 
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser
};