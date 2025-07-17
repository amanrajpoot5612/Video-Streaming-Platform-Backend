import dotenv from 'dotenv'

dotenv.config();

const port = process.env.PORT;
const mongodbURL = process.env.MONGODB_URI;
const corsLocal = process.env.CORS_ORIGIN_LOCAL;
const corsProd = process.env.CORS_ORIGIN_PROD;
const accessToken = process.env.ACCESS_TOKEN_SECRET; 
const accessExpiry = process.env.ACCESS_TOKEN_EXPIRY;
const refreshToken = process.env.REFRESH_TOKEN_SECRET; 
const refreshExpiry = process.env.REFRESH_TOKEN_EXPIRY;
const cloudinaryName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryKey = process.env.CLOUDINARY_API_KEY;
const cloudinarySecret = process.env.CLOUDINARY_API_SECRET;
const cloudinaryURL = process.env.CLOUDINARY_URL;

export {
    port,
    mongodbURL,
    corsLocal,
    corsProd,
    accessToken,
    accessExpiry,
    refreshToken,
    refreshExpiry,
    cloudinaryName,
    cloudinaryKey,
    cloudinarySecret,
    cloudinaryURL
}