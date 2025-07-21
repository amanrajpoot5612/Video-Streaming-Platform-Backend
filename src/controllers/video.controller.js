import { Video } from "../models/video.model.js";
import apiError from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";



const uploadVideo = asyncHandler(async (req , res) => {
    const {title, description, duration} = req.body;
    console.log("video uploaded started");
    
    const videoFileLocal = req.files?.videoFile?.[0]?.path;
    const thumbnailLocal = req.files?.thumbnail?.[0]?.path;

    //validation
    if(!title || !description || !videoFileLocal || !thumbnailLocal){
        throw new apiError(400 , "All fields are required", [
            "title",
            "description",
            "duration",
            "videoFile",
            "thumbnail"
        ])
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocal)
    const videoFile = await uploadOnCloudinary(videoFileLocal)
    console.log("Uploaded on cloudinary");
    

    if(!videoFile){
        throw new apiError(400, "Video file is required ( not uploaded on cloudinary)")
    }

    if(!thumbnail){
            throw new apiError(400, "Thumbnail file is required ( not uploaded on cloudinary)")
        }

    const newVideo = await Video.create({
        title,
        description,
        duration,
        videoFile: videoFile.secure_url,
        thumbnail: thumbnail.secure_url,
        owner: req.user._id
    });

    return res
        .status(201)
        .json(new apiResponse(201 , newVideo , "Video uploaded successfully"))
})

const getAllVideo = asyncHandler(async (req, res) => {
    const videos = await Video.find()
    console.log(`All videos: ${videos}`);
    
    return res.status(200).
    json(videos, "All Videos fetched successfully", 200)
})

export {
    uploadVideo,
    getAllVideo
};