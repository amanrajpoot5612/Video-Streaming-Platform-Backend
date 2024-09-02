import 'dotenv/config'
import express from "express";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDb from "./db/index.js";

connectDb()
.then(
    app.listen((process.env.PORT || 8000), (req,res) =>{
        console.log(`Server is running at port : ${process.env.Port}`);
    })
)
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

