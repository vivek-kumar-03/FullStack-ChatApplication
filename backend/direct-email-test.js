import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

async function testEmail() {
  console.log('Testing email configuration...');
  
  // Check if required env vars are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('❌ ERROR: EMAIL_USER or EMAIL_PASS not set in .env file');
    return;
  }
  
  console.log('Email config:');
  console.log('- EMAIL_HOST:', process.env.EMAIL_HOST || 'smtp.gmail.com');
  console.log('- EMAIL_PORT:', process.env.EMAIL_PORT || 587);
  console.log('- EMAIL_USER:', process.env.EMAIL_USER);
  console.log('- EMAIL_PASS: SET');
  
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    console.log('✅ Transporter created successfully');
    
    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection verified');
    
    // Send test email
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: 'Test Email from Chat App',
      text: 'This is a test email to verify email configuration is working.',
      html: '<p>This is a <b>test email</b> to verify email configuration is working.</p>'
    };
    
    console.log('Sending test email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    
  } catch (error) {
    console.log('❌ Error testing email:', error.message);
    console.log('Error code:', error.code);
    if (error.response) {
      console.log('SMTP Response:', error.response);
    }
    if (error.command) {
      console.log('Failed command:', error.command);
    }
  }
}

testEmail();