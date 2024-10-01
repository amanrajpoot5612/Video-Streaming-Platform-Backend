import asyncHandler from "../utils/asyncHandler.js"
import apiError from "../utils/apiError.js"
import User from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js"
const registerUser = asyncHandler( async (req, res) =>{
    // res.status(200).send("Done")
    const {fullName, username, email, password} = req.body
    console.log(fullName + " " +   email + " " + password + " " + username );
})

    if(
        [fullName, email, username, password].some((field) =>
        field.trim() === ""
        )
    ){
        throw new apiError(400, "All fields are required")
    }

    const existedUser = user.findOne(
        {
            $or: [{ username }, { email }]
        }
    )

    if(existedUser){
        throw new apiError(409, "User with email or username existed");
    }

    const avatarLocalPath =req.files?.avatar[0]?.path
    const CoverImageLocalPath = req.files?.avatar[0]?.path

    if(!avatarLocalPath){
        throw new apiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(CoverImageLocalPath)

    if(!avatar){
        throw new apiError(400, "Avatar file is required")
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


export default registerUser;