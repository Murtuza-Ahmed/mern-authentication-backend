import { asyncHandler } from "#middlewares/asyncHandler.js";
import User from "#models/Users.js";
import ErrorHandler from "#utils/errorHandler.js";
import { sendToken } from "#utils/sendToken.js";
import { HTTP_STATUS } from "#utils/statusCodes.js";
import { resetPasswordValidation } from "../../validations/schemas.js";
import crypto from "crypto";

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  const { error } = resetPasswordValidation.validate(req.body);
  if (error) {
    return next(
      new ErrorHandler(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
    );
  }

  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return next(new ErrorHandler("Reset password token is invalid or has been expired", HTTP_STATUS.GONE));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return sendToken(user, res, "Password reset successful");
});