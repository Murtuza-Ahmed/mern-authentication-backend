import { generateAccessToken, generateRefreshToken } from "./jwt.js";
import { sanitizeUser } from "./sanitizeUser.js";
import { HTTP_STATUS } from "./statusCodes.js";

export const sendToken = async (user, res, message = "Success") => {
  const refreshToken = generateRefreshToken(user);
  const accessToken = generateAccessToken(user);

  // Only the refresh token is persisted (used to detect logout).
  user.refreshToken = refreshToken;
  await user.save({ validateModifiedOnly: true });

  const safeUser = sanitizeUser(user);
  safeUser.accessToken = accessToken; // in-memory only, for the client

  return res
    .status(HTTP_STATUS.OK)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json({
      success: true,
      message,
      accessToken,
      user: safeUser,
    });
};
