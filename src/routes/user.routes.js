import  Router  from "express";
import {registerUser,  loginUser, logoutUser, refreshAccessToken, getCurrentUser, getProfile } from '../controllers/user.controller.js'
import { upload } from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
console.log("user router");

router.route("/register").post( upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]) , registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT , logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/current-user").get(verifyJWT, getCurrentUser) //less details
router.route("/profile").get(verifyJWT, getProfile) // full blown user


export default router