/**
 * Remove sensitive fields before sending a user object to the client.
 * Never leak password hashes, tokens, or verification/reset secrets.
 */
const SENSITIVE_FIELDS = [
  "password",
  "refreshToken",
  "accessToken",
  "verificationCode",
  "verificationCodeExpire",
  "resetPasswordToken",
  "resetPasswordExpire",
];

export const sanitizeUser = (user) => {
  const obj =
    user && typeof user.toJSON === "function" ? user.toJSON() : { ...user };
  for (const field of SENSITIVE_FIELDS) {
    delete obj[field];
  }
  return obj;
};
