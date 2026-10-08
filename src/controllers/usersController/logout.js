import mongoose from "mongoose";
import { asyncHandler } from "#middlewares/asyncHandler.js";
import { HTTP_STATUS } from "#utils/statusCodes.js";

export const logout = asyncHandler(async (req, res, next) => {
  const User = mongoose.model("Users");

  const { _id } = req.user;

  const user = await User.findById(_id);
  if (!user || !user.refreshToken) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: "User already logged out or token invalid",
    });
  }

  user.refreshToken = null;
  await user.save({ validateModifiedOnly: true });

  const isProduction = process.env.NODE_ENV === "production";

  return res.status(HTTP_STATUS.OK).clearCookie("refreshToken", {
    httpOnly: true,
    // Must match the options used when the cookie was set, otherwise the
    // browser keeps the cookie (logout would silently fail in production).
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  }).json({
    success: true,
    message: "Logout successful",
  });
})