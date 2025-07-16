import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
// import { configDotenv } from "dotenv";
// import dotenv from "dotenv";
// import 'dotenv/config'
// import dotenv from "dotenv";
// dotenv.config();

import 'dotenv/config'

//`${process.env.MONGODB_URI}/${DB_NAME}`

const connectDb = async () =>{
    try {
        console.log(process.env.MONGODB_URI);
        
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        // console.log("Loaded URI:", process.env.MONGODB_URI);

        console.log(`Database connected !! Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        // console.log("DB URI:", `${process.env.MONGODB_URI}/${DB_NAME}`);
        // console.log("Loaded URI:", process.env.MONGODB_URI);

        console.log(`Error in connecting DB ${error}`);
        process.exit(1)
    }
}

export default connectDb