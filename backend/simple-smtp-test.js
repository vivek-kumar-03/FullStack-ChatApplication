// Simple SMTP test
require('dotenv').config();

console.log('Testing SMTP configuration...');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'NOT SET');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.log('❌ Email configuration missing');
  process.exit(1);
}

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ SMTP connection failed:', error.message);
    if (error.code) console.log('Code:', error.code);
    if (error.command) console.log('Command:', error.command);
  } else {
    console.log('✅ SMTP connection successful');
  }
});