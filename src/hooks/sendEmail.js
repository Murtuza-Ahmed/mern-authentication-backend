import nodeMailer from "nodemailer"

export const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodeMailer.createTransport({
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"MERN Auth System" <${process.env.SMTP_MAIL}>`,
      to: email,
      subject,
      html: message,
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "Invalid email or email service error",
    };
  }
};