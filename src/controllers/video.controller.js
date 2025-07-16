import { Video } from "../models/video.model.js";
import apiError from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";



const uploadVideo = asyncHandler(async (req , res) => {
    const {title, description, duration} = req.body;
    console.log("video uploaded started");
    
    const videoFile = req.files?.videoFile?.[0]?.path;
    const thumbnail = req.files?.thumbnail?.[0]?.path;

    //validation
    if(!title || !description || !videoFile || !thumbnail){
        throw new apiError(400 , "All fields are required", [
            "title",
            "description",
            "duration",
            "videoFile",
            "thumbnail"
        ])
    }

    const newVideo = await Video.create({
        title,
        description,
        duration,
        videoFile,
        thumbnail,
        owner: req.user._id
    });

    return res
        .status(201)
        .json(new apiResponse(201 , newVideo , "Video uploaded successfully"))
})

export {uploadVideo};