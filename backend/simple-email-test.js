// Simple email test script
import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

console.log('Starting email test...');

// Check if environment variables are loaded
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.log('Missing email configuration');
  process.exit(1);
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

console.log('Transporter created');

// Test the connection
transporter.verify()
  .then(() => {
    console.log('SMTP connection successful');
    
    // Try to send a test email
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Test Email',
      text: 'This is a test email'
    };
    
    return transporter.sendMail(mailOptions);
  })
  .then((info) => {
    console.log('Email sent successfully');
    console.log('Message ID:', info.messageId);
  })
  .catch((error) => {
    console.log('Error occurred:');
    console.log('Message:', error.message);
    console.log('Code:', error.code);
    if (error.command) console.log('Command:', error.command);
    if (error.response) console.log('Response:', error.response);
  });