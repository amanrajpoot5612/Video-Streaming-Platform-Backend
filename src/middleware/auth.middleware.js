import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new apiError(401, "Unauthorized: No token provided");
  }

  console.log("TOKEN RECEIVED:", token);

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === "JsonWebTokenError") {
      throw new apiError(401, "Malformed or invalid token");
    }
    if (err.name === "TokenExpiredError") {
      throw new apiError(401, "Token has expired, please login again");
    }

    // Any other JWT error
    throw new apiError(401, "Authentication failed");
  }

  console.log("TOKEN DECODED:", decodedToken);

  const user = await User.findById(decodedToken?._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new apiError(401, "User not found or token invalid");
  }

  req.user = user;
  next();
});
