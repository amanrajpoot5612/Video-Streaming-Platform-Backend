import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from 'fs'



    // Configuration

    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

    const uploadOnCloudinary = async (localFilePath) => {
        try {
            if (!localFilePath) return null;
            //upload file on cloudinary
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto"    
            })
        // console.log(response);
            fs.unlinkSync(localFilePath);
            // file uploaded successfully
            // console.log("file is uploaded on cloudinary", response.url);
            return response;
        } catch (error) {
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
                }  // remove the file from server
            return null;
        }
    }
    
// Upload an image
    
// const uploadResult = await cloudinary.uploader
// .upload(
//     'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//         public_id: 'shoes',
//     }
// )
// .catch((error) => {
//     console.log(error);
// });

// console.log(uploadResult);


export default uploadOnCloudinary