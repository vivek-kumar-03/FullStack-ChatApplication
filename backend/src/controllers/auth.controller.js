import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../lib/email.js";
import crypto from "crypto";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    console.log("Signup request received:", { fullName, email });
    
    // Validate input
    if (!fullName || !email || !password) {
      console.log("Validation failed: missing required fields");
      return res.status(400).json({ message: "Full name, email, and password are required" });
    }

    if (password.length < 6) {
      console.log("Validation failed: password too short");
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Validation failed: invalid email format");
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    // Check if user already exists
    console.log("Checking if user already exists:", email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User found:", { 
        email: existingUser.email, 
        isVerified: existingUser.isVerified 
      });
      
      if (existingUser.isVerified) {
        console.log("User already exists and is verified");
        return res.status(400).json({ message: "User with this email already exists" });
      } else {
        console.log("Removing unverified user to allow re-registration");
        // If user exists but is not verified, we can allow re-signup
        // Remove the unverified user to allow re-registration
        await User.findByIdAndDelete(existingUser._id);
      }
    }

    // Hash password
    console.log("Hashing password");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    console.log("Generating verification token");
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    
    console.log("Generated verification token:", verificationToken);
    console.log("Token expires at:", new Date(verificationTokenExpires));

    // Create new user
    console.log("Creating new user");
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
      isVerified: false,
    });

    await newUser.save();
    console.log("New user created:", {
      email: newUser.email,
      fullName: newUser.fullName,
      verificationToken: newUser.verificationToken,
      verificationTokenExpires: newUser.verificationTokenExpires,
      isVerified: newUser.isVerified
    });

    // Send verification email
    console.log("Attempting to send verification email");
    try {
      console.log("Calling sendVerificationEmail with:", { email, token: verificationToken });
      await sendVerificationEmail(email, verificationToken);
      console.log("Verification email sent successfully to:", email);
      
      res.status(201).json({
        message: "Account created successfully! Please check your email to verify your account."
      });
    } catch (emailError) {
      console.error("Failed to send verification email to:", email, emailError);
      console.error("Email error details:", {
        message: emailError.message,
        code: emailError.code,
        command: emailError.command,
        stack: emailError.stack
      });
      // Still create the account but inform the user about the email issue
      res.status(201).json({
        message: "Account created successfully! However, we couldn't send the verification email. Please contact support or try again later."
      });
    }
  } catch (error) {
    console.error("Error in signup controller:", error);
    res.status(500).json({ message: "Internal Server Error: " + error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    // Find user with this token and check if it's not expired
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    // Update user to verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Redirect to login page with success message
    const loginUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/login?verified=true`;
    res.redirect(302, loginUrl);
  } catch (error) {
    console.log("Error in verifyEmail controller", error.message);
    // Redirect to login page with error message
    const loginUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/login?verified=false&error=verification_failed`;
    res.redirect(302, loginUrl);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email before logging in" });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      message: "Logged in successfully!"
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      // For security, we don't reveal if the email exists
      return res.status(200).json({ 
        message: "If an account with that email exists, a password reset link has been sent." 
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ 
        message: "Please verify your email before resetting your password" 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    // Save token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // Send reset email
    try {
      await sendPasswordResetEmail(email, resetToken);
    } catch (emailError) {
      console.error("Error sending password reset email:", emailError);
      return res.status(500).json({ message: "Error sending password reset email" });
    }

    res.status(200).json({ 
      message: "If an account with that email exists, a password reset link has been sent." 
    });
  } catch (error) {
    console.log("Error in forgotPassword controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Find user with this token and check if it's not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password and remove reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      message: "Password reset successfully! You can now log in with your new password."
    });
  } catch (error) {
    console.log("Error in resetPassword controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    console.log("CheckAuth called for user:", req.user._id);
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};