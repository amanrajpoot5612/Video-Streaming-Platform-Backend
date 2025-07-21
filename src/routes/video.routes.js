import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { getAllVideo, uploadVideo} from '../controllers/video.controller.js'
import {verifyJWT} from '../middleware/auth.middleware.js'


const router = Router();

router.route('/upload').post(
    verifyJWT,
    upload.fields([
    {
        name: "videoFile",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]) , uploadVideo)

router.route('/get-all').get(getAllVideo)

export default router;
