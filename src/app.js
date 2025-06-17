import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors';                      
import dotenv from 'dotenv'
import asyncHandler from './utils/asyncHandler.js';

const app = express();
dotenv.config();
app.use(cors({                                  //Initialize express
    origin: process.env.CORS_ORIGIN,            
    credentials:true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
                                                                        //Standardisation
app.use(express.static("public"))
app.use(cookieParser());


// routes
import userRouter from './routes/user.routes.js'                

// // routes declaration
    app.use("/api/v1/users", userRouter)
    // app.use("/api/v1/admin", adminRouter)
    // app.use("/api/v1/product", productRouter)
    // app.use("/api/v1/skills", skillsRouter)
    // app.use("/api/v1/users", userRouter)


export default app;