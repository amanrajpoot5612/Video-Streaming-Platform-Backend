const asyncHandler  =(requestHandler) => {
    console.log("ASYNC HANDLER CALLED IN TRY BLOCK")
    try {
        return (req, res, next) => {
            Promise.resolve(requestHandler(req, res, next))
            .catch((error) => next(error))
            console.log("ASYNC HANDLER CALLED IN TRY BLOCK TWICE")
        }
    } catch (error) {
        console.log("ERROR IN ASYNC HANDLER CODE")
    }
}

export default asyncHandler;


// const asyncHandler = (fn) => async (req ,res, next) =>{
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             messaage: error.messaage
//         })
//     }
// }