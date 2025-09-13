import { asyncHandler } from "../../middlewares/asyncHandler";
import User from "../../models/Users";
import { registerWithOtpValidation } from "../../validations/schemas";

export const registerWithOtp = asyncHandler(async (req, res, next) => {
  const { name, email, phone, password, verificationMethod } = req.body;

  const { error } = registerWithOtpValidation.validate({ name, email, phone, password })

  if (error) {
    return next(new ErrorHandler(error.details[0].message, HTTP_STATUS.BAD_REQUEST))
  }

  let user = await User.findOne({
    $or: [{ email }, { phone }]
  })

  // Already verified → don't allow new registration
  if (user && user.accountVerified) {
    return next(new ErrorHandler("User already exists. Please login.", HTTP_STATUS.BAD_REQUEST))
  }

  // Already registered but not verified → update info + resend OTP
  if (user && !user.accountVerified) {
    user.name = name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.password = password;
  } else {
    // New user → create new record
    user = new User({
      name,
      email,
      phone,
      password,
      accountVerified: false
    });
  }
});