import { asyncHandler } from "#middlewares/asyncHandler.js";
import User from "#models/Users.js";
import { HTTP_STATUS } from "#utils/statusCodes.js";

export const getUser = asyncHandler(async (req, res, next) => {
  const user = req.user;

  // Never expose password hashes, tokens, or verification/reset secrets.
  const userData = await User.findById(user._id).select(
    "-password -refreshToken -accessToken -verificationCode -verificationCodeExpire -resetPasswordToken -resetPasswordExpire"
  );

  if (!userData) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    data: userData
  });
});