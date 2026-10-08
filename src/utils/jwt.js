import jwt from "jsonwebtoken";
import logger from "./logger.js";

// Read env lazily (at call time, not import time) so a missing variable
// fails with a clear error instead of crashing the whole app on startup.
const getSecrets = () => {
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!accessSecret || !refreshSecret) {
    throw new Error("JWT secrets are not defined in environment variables");
  }

  return {
    accessSecret,
    refreshSecret,
    accessExpiresIn: process.env.JWT_ACCESS_SECRET_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_SECRET_EXPIRES_IN || "7d",
  };
};

// Access Token
export const generateAccessToken = (user) => {
  const { accessSecret, accessExpiresIn } = getSecrets();
  const payload = {
    userId: user._id,
    email: user.email,
    type: "access",
  };

  return jwt.sign(payload, accessSecret, { expiresIn: accessExpiresIn });
};

// Refresh Token
export const generateRefreshToken = (user) => {
  const { refreshSecret, refreshExpiresIn } = getSecrets();
  const payload = {
    userId: user._id,
    email: user.email,
    type: "refresh",
  };

  return jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiresIn });
};

// Verify Access Token
export const verifyAccessToken = (token) => {
  try {
    const { accessSecret } = getSecrets();
    return jwt.verify(token, accessSecret);
  } catch (error) {
    logger.info("Token verification failed:", error);
    return null;
  }
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  try {
    const { refreshSecret } = getSecrets();
    return jwt.verify(token, refreshSecret);
  } catch (error) {
    logger.error("Token verification failed:", error);
    return null;
  }
};
