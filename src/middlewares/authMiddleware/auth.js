import { asyncHandler } from "#middlewares/asyncHandler.js";
import ErrorHandler from "#utils/errorHandler.js";
import { HTTP_STATUS } from "#utils/statusCodes.js";
import { verifyAccessToken } from "#utils/jwt.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ErrorHandler("Unauthorized: No token provided", HTTP_STATUS.UNAUTHORIZED));
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return next(new ErrorHandler("Invalid or expired token", HTTP_STATUS.UNAUTHORIZED))
  }

  req.user = decoded
  next()
})