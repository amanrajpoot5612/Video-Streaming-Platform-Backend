import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv'
import asyncHandler from './utils/asyncHandler.js';

const app = express();
dotenv.config();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))

app.use(express.static("public"))
app.use(cookieParser);


// routes
// import userRouter from './routes/user.routes.js'

// // routes declaration
// try {
//     console.log("/api/v1/user NO ERROR FOUND 1")
//     app.use("/api/v1/users", userRouter)
//     console.log("/api/v1/user NO ERROR FOUND 2")
// } catch (error) {
//     console.log("/api/v1/user ERROR FOUND", error)
// }

export default app;