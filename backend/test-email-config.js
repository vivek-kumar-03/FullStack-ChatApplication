import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

console.log('Environment Variables Check:');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET (length: ' + process.env.EMAIL_PASS.length + ')' : 'NOT SET');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM);

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.log('❌ ERROR: Email configuration is incomplete!');
  console.log('Please check your .env file and make sure EMAIL_USER and EMAIL_PASS are set.');
} else {
  console.log('✅ Email configuration appears to be complete.');
  
  // Test creating a transporter
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    console.log('✅ Transporter created successfully');
    
    // Verify the connection
    transporter.verify((error, success) => {
      if (error) {
        console.log('❌ Transporter verification failed:', error.message);
        if (error.code) {
          console.log('Error code:', error.code);
        }
        if (error.command) {
          console.log('Failed command:', error.command);
        }
      } else {
        console.log('✅ Transporter verification successful');
      }
    });
  } catch (error) {
    console.log('❌ Error creating transporter:', error.message);
  }
}