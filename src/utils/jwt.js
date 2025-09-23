import jwt from "jsonwebtoken"
import crypto from "crypto"
import logger from "./logger.js"
import { config } from "dotenv";

config({ path: "./config.env" });

const JWT_SECRET = process.env.JWT_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error("JWT secrets are not defined in environment variables")
}

// Access Token
export const generateAccessToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' })
}

// Refresh Token
export const generateRefreshToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
  }

  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' })
}

// Verify Token
export const verifyToken = (token) => {
  try {
    console.log("Verifying token:", token)
    return jwt.verify(token, JWT_REFRESH_SECRET)
  } catch (error) {
    logger.error("Token verification failed:", error)
    return null
  }
}

// Decode Token
export const decodeToken = (token) => {
  try {
    return jwt.decode(token, { complete: true })
  } catch (error) {
    logger.error("Token decoding failed:", error)
    return null
  }
}

// Hash Token
export const hashToken = (token) => {
  try {
    return crypto.createHash("sha256").update(token).digest("hex")
  } catch (error) {
    logger.error("Token hashing failed:", error)
    return null
  }
}