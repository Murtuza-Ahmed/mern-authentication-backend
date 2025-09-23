import { asyncHandler } from "../asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import { HTTP_STATUS } from "../../utils/statusCodes.js";
import { decodeToken, verifyToken } from "../../utils/jwt.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ErrorHandler("Unauthorized: No token provided", HTTP_STATUS.UNAUTHORIZED));
  }

  const token = authHeader.split(" ")[1];
  const decode = decodeToken(token)
  const verify = verifyToken(token)
  console.log("Decode:", decode)
  console.log("Token:", token);
  console.log("verify token:", verify);

  return
})