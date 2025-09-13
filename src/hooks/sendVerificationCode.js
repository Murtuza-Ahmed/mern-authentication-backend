import twilio from "twilio";
import { generateEmailTemplate } from "./emailTemplate.js"
import { sendEmail } from "./sendEmail.js"
import ErrorHandler from "../utils/errorHandler.js";
import { HTTP_STATUS } from "../utils/statusCodes.js";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)


export async function sendVerificationCode(verificationMethod, verificationCode, email, phone) {
  try {
    if (verificationMethod === "email") {
      const message = generateEmailTemplate(verificationCode)
      sendEmail({ email, subject: "Your Verification Code", message })
    } else if (verificationMethod === "phone") {
      const verificationCodeWithSpace = verificationCode.toString().split("").join(" ")
      await client.calls.create({
        twiml: `<Response>
      <Say>
      your verification code ${verificationCodeWithSpace}.
      app ka verification code hy ${verificationCodeWithSpace}
      </Say>
      </Response>`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      })
    } else {
      throw new ErrorHandler("Invalid Verification method", HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }
  } catch (error) {
    throw error
  }
}