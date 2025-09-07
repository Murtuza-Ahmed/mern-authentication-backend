import mongoose from "mongoose";
import { userValidation } from "../../validations/schemas.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import { HTTP_STATUS } from "../../utils/statusCodes.js";
import { sendVerificationCode } from "../../hooks/sendVerificationCode.js";


export const register = asyncHandler(async (req, res, next) => {
  const User = mongoose.model("User")
  const { name, email, phone, password, verificationMethod } = req.body

  const { error } = userValidation.validate({ name, email, phone, password, verificationMethod });

  if (error) {
    return next(new ErrorHandler(error.details[0].message, HTTP_STATUS.BAD_REQUEST))
  }

  const exitingUser = await User.findOne({
    $or: [{ email }, { phone }],
    accountVerified: true
  });

  if (exitingUser) {
    if (exitingUser.email === email) {
      return next(new ErrorHandler("Email already exits", HTTP_STATUS.BAD_REQUEST))
    }
    if (exitingUser.phone === phone) {
      return next(new ErrorHandler("Phone number already exits", HTTP_STATUS.BAD_REQUEST))
    }
  }

  const registrationAttemptByUser = await User.find({
    $or: [
      { email, accountVerified: false },
      { phone, accountVerified: false }
    ]
  })

  if (registrationAttemptByUser.length >= 2) {
    return next(new ErrorHandler("Too many registration attempts. Please wait 30 minutes before trying again.", HTTP_STATUS.BAD_REQUEST))
  }

  const userData = {
    name,
    email,
    phone,
    password
  }

  const user = await User.create(userData)

  const verificationCode = await user.generateVerificationCode()
  await user.save()
  sendVerificationCode(verificationMethod, verificationCode, email, phone)

  return res.status(HTTP_STATUS.OK).json({
    success: true
  })
})