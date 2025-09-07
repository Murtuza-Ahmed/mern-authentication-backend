import Joi from "joi"

// user validation
export const userValidation = Joi.object({
  name: Joi.string().min(2).max(20).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 20 characters"
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "string.empty": "Email is required"
  }),
  phone: Joi.string().pattern(/^(\+92|0)?3\d{9}$/).required().messages({
    "string.pattern.base": "Phone must be valid number (11 digits)",
    "string.empty": "Phone is required"
  }),
  password: Joi.string().min(8).pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "string.pattern.base":
      "Password must include uppercase, lowercase, number, and special character",
    "string.empty": "Password is required"
  }),
  verificationMethod: Joi.string().valid("email", "phone").required().messages({
    "any.only": "Verification method must be either email or phone",
    "string.empty": "Verification method is required"
  })
})