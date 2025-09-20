import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

console.log('Testing email configuration...');

// Check environment variables
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS: SET (length: ' + (process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0) + ')');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.log('❌ Email configuration is incomplete');
  process.exit(1);
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

console.log('✅ Transporter created');

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Connection failed:', error.message);
    if (error.code) console.log('Error code:', error.code);
    if (error.command) console.log('Failed command:', error.command);
  } else {
    console.log('✅ Connection verified');
    
    // Send test email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Test Email Verification',
      text: 'This is a test email to verify email configuration.'
    };
    
    transporter.sendMail(mailOptions, (sendError, info) => {
      if (sendError) {
        console.log('❌ Failed to send email:', sendError.message);
        if (sendError.code) console.log('Error code:', sendError.code);
      } else {
        console.log('✅ Email sent successfully');
        console.log('Message ID:', info.messageId);
      }
    });
  }
});