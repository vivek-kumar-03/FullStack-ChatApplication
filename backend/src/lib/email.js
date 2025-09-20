import nodemailer from "nodemailer";

// Create a transporter object using the default SMTP transport
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  // Log email configuration for debugging
  console.log("Email configuration:");
  console.log("- EMAIL_HOST:", process.env.EMAIL_HOST || "smtp.gmail.com");
  console.log("- EMAIL_PORT:", process.env.EMAIL_PORT || 587);
  console.log("- EMAIL_USER:", emailUser);
  console.log("- EMAIL_PASS length:", emailPass ? emailPass.length : "NOT SET");
  console.log("- EMAIL_FROM:", process.env.EMAIL_FROM || emailUser);
  
  // Validate required configuration
  if (!emailUser || !emailPass) {
    throw new Error("Email configuration is incomplete. Please check EMAIL_USER and EMAIL_PASS in your .env file.");
  }
  
  const config = {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    logger: true,
    debug: true
  };
  
  console.log("Creating transporter with config:", JSON.stringify(config, null, 2));
  
  return nodemailer.createTransport(config);
};

// Send verification email
export const sendVerificationEmail = async (email, token) => {
  try {
    console.log("Attempting to send verification email to:", email);
    console.log("Using token:", token);
    
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to our Chat Application!</h2>
          <p>Thank you for signing up. Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            If you didn't create an account, please ignore this email.
          </p>
        </div>
      `,
    };

    console.log("Mail options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    console.log("Sending email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully. Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending verification email:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });
    
    // Additional error details for common issues
    if (error.response) {
      console.error("SMTP Response:", error.response);
    }
    if (error.responseCode) {
      console.error("SMTP Response Code:", error.responseCode);
    }
    
    throw error;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, token) => {
  try {
    console.log("Attempting to send password reset email to:", email);
    
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You have requested to reset your password. Please click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            If you didn't request a password reset, please ignore this email.
          </p>
        </div>
      `,
    };

    console.log("Mail options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully. Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });
    throw error;
  }
};