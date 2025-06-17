import 'dotenv/config'
import express from "express";
import app from './app.js';
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDb from "./db/index.js";

const port = process.env.PORT || 8000;
console.log("Loaded URI:", process.env.MONGODB_URI);

connectDb()
.then( () => {
    app.listen(port, () =>{
        console.log(`Server is running at port : ${port}`);
    })
})
.catch((err) =>{
    console.log(`MongoDb connection failed ${err}`);
})


// const app = express();

// ;( async () =>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error", (error) => {
//             console.log("Error" , error);
//             throw error;
//         })

//         app.listen(process.env.PORT, () =>{
//             console.log("App is listening on port:", `${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.log("Error DB connection rejected", error);
//         throw error;
//     }
// })()        //  IFFEE

// function connectDb () {

// }

