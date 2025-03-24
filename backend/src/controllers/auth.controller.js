import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../lib/generateVerificationToken.js";
import { sendVerificationEmail } from "../nodemailer/emails.js"; 
import { sendWelcomeEmail } from "../nodemailer/emails.js";
import { sendResetSuccessEmail } from "../nodemailer/emails.js";
import { sendPasswordResetEmail } from "../nodemailer/emails.js";
import crypto from "crypto";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!email || !fullName || !password) {
      console.log(email, fullName, password);
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const user = await User.findOne({ email });  //mongodb query-uses mongoose-i.e an interface btw js and mongodb
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10); //generate salt
    const hashedPassword = await bcrypt.hash(password, salt); //hash the password
    const verificationToken = generateVerificationToken();
    const newUser = new User({    //mongodb query to store new user into the database
      email,
      fullName,
      password: hashedPassword,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    if (newUser) {
      //generate JWT token--if user closes the tab after logging in, the token is stored in the cookie and the user is logged in, as in the details are stored as a cookie in the LS temporarily , preventing the user from logging in again
      generateToken(newUser._id, res);
      await newUser.save();
      await sendVerificationEmail(newUser.email, verificationToken);
      return res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Failed to create user" });
    }
  } catch (error) {
    console.error("Error in signup controller:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  console.log(code);
  try {
    const user = await User.findOne({  //checks if the verification code entered by the user is matches the one in the database
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.fullName);
    res.status(201).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) { //when user logs in with password , it is hashed and compared with the hashed password in the database, if matched
      generateToken(user._id, res);
      user.lastLogin = new Date();
      await user.save();
      return res.status(200).json({
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        // profilePicture: user.profilePicture,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Error in login controller:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt"); //jwt token in cookie is cleared-when user logs out
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();
    //send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }
    //update password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    await sendResetSuccessEmail(user.email);
    res
      .status(200)
      .json({ success: true, message: "Password reset successfull" });
  } catch (error) {
    console.log("Error sending in password reset email", error);
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in checkAuth controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};