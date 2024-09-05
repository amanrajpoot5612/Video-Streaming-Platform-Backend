import  Router  from "express";
import registerUser from '../controllers/user.controller.js'

const router = Router();
console.log("USER ROUTER CALLED")
try {
    router.route("/register").post(registerUser)
    console.log("NO ERROR FOUND IN USER ROUTE FILE")
} catch (error) {
    console.log("ERROR FOUND IN USER ROUTE FILE", error)
}
console.log("USER ROUTER CALLED")




export default router