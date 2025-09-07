import mongoose from "mongoose";
import { userValidation } from "../../validations/schemas.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";

export const register = asyncHandler(async (req, res, next) => {
  const User = mongoose.model("User")
  const { name, email, phone, password, verificationMethod } = req.body

  const { error } = userValidation.valid({ name, email, phone, password, verificationMethod });

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400))
  }

  const exitingUser = await User.findOne({
    $or: [{ email }, { phone }],
    accountVerified: true
  });

  if (exitingUser) {
    if (exitingUser.email === email) {
      return next(new ErrorHandler("Email already exits", 400))
    }
    if (exitingUser.phone === phone) {
      return next(new ErrorHandler("Phone number already exits", 400))
    }
  }

  const registrationAttemptByUser = await User.find({
    $or: [
      { email, accountVerified: false },
      { phone, accountVerified: false }
    ]
  })

  if (registrationAttemptByUser.length >= 2) {
    return next(new ErrorHandler("Too many registration attempts. Please wait 30 minutes before trying again.", 400))
  }
})