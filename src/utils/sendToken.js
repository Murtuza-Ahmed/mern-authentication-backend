import { generateRefreshToken } from "./jwt.js";
import { HTTP_STATUS } from "./statusCodes.js";
import { config } from "dotenv"

config({ path: "./config.env" })

export const sendToken = (user, res) => {
  const token = generateRefreshToken(user)
  res.status(HTTP_STATUS.OK).cookie("token", token, { expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000), httpOnly: true }).json({
    success: true,
    message: "Reset password successfully",
    token,
    user
  });
};