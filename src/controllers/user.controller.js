import asyncHandler from "../utils/asyncHandler.js"

// const registerUser = asyncHandler( async (req, res) =>{
//     console.log("REGISTER USER CALLED")
//    try {
//     console.log("REGISTER USER CALLED")
//     res.status(200).json({
//         message: "ok"
//     })
//    } catch (error) {
//     console.log("REGISTER USER NOT EXECUTED")
//    }
// })

const registerUser = () => {
    console.log("REGISTER USER CALLED")
    try {
        console.log("REGISTER USER CALLED")
    res.status(200).json({
        message: "ok"
    })
    } catch (error) {
      console.log("ERROR IN REGISTER USER FILE", error)  
    }
}


export default registerUser;