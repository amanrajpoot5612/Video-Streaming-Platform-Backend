import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log("multer called");
      
      cb(null, path.join(process.cwd(), "public", "temp"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  export const upload = multer(
    {
        storage, 
    })