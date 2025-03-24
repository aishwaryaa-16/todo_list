import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import transporter from "./nodemailer.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = email;
  try {
    const mailOptions = {
      from: "aishwarya.murali1603@gmail.com",
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    };
    const response = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully", response);
  } catch (error) {
    console.log("Error sending verification", error);
  }
};

export const sendWelcomeEmail = async (email, username) => {
  const recipient = email;
  try {
    const mailOptions = {
      from: "aishwarya.murali1603@gmail.com",
      to: recipient,
      subject: "Welcome to Taskify",
      html: WELCOME_EMAIL_TEMPLATE,
      category: "Welcome user",
    };
    const response = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully", response);
  } catch (error) {
    console.log("Error sending welcome email", error);
  }
};

export const sendPasswordResetEmail = async (email, reset_url) => {
  const recipient = email;
  try {
    const mailOptions = {
      from: "aishwarya.murali1603@gmail.com",
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", reset_url),
      category: "Password reset",
    };
    const response = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully", response);
  } catch (error) {
    console.log("Error sending password reset email", error);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipient = email;
  try {
    const mailOptions = {
      from: "aishwarya.murali1603@gmail.com",
      to: recipient,
      subject: "Reset password successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password reset success",
    };
    const response = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully", response);
  } catch (error) {
    console.log("Error sending password reset success email", error);
  }
};
