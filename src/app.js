import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv'
import asyncHandler from './utils/asyncHandler.js';
import videoRouter from './routes/video.routes.js'
import { corsLocal, corsProd1, corsProd2, corsProd3 } from '../auth/auth.js';
import apiError from './utils/apiError.js';

const app = express();
dotenv.config();

// proxy
app.set("trust proxy", 1);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow server-to-server

    const allowedOrigins = [
      corsProd1,
      corsProd2,
      corsProd3,
      corsLocal
    ];

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));



//json parser
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))


//Standardisation
app.use(express.static("public"))
app.use(cookieParser());



// routes
import userRouter from './routes/user.routes.js'

// // routes declaration
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/users", userRouter)
app.get('/loaderio-ed392aaaf49b37a5018b548ffa655995.txt', (req, res) => {
  res.send('loaderio-ed392aaaf49b37a5018b548ffa655995');
});

// app.use("/api/v1/admin", adminRouter)
// app.use("/api/v1/product", productRouter)
// app.use("/api/v1/skills", skillsRouter)
// app.use("/api/v1/users", userRouter)


// error handlers
app.use((err, req, res, next) => {
      console.error("🔥 ERROR MIDDLEWARE", err); // Add this line to debu
    if (err instanceof apiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || [],
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        });
    }

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errors: [],
        // stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
});


export default app;