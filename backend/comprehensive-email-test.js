import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

console.log('=== COMPREHENSIVE EMAIL CONFIGURATION TEST ===\n');

// Check environment variables
console.log('1. Environment Variables Check:');
console.log('   EMAIL_HOST:', process.env.EMAIL_HOST || 'smtp.gmail.com (default)');
console.log('   EMAIL_PORT:', process.env.EMAIL_PORT || '587 (default)');
console.log('   EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? `SET (${process.env.EMAIL_PASS.length} characters)` : 'NOT SET');
console.log('   EMAIL_FROM:', process.env.EMAIL_FROM || process.env.EMAIL_USER || 'NOT SET');

// Validate required configuration
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.log('\n❌ CRITICAL ERROR: EMAIL_USER or EMAIL_PASS not set in .env file');
  console.log('   Please check your .env file and make sure these variables are properly configured.');
  process.exit(1);
}

console.log('\n2. Testing Transporter Creation...');

try {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Add debugging options
    logger: true,
    debug: true
  });
  
  console.log('✅ Transporter created successfully');
  
  console.log('\n3. Testing SMTP Connection...');
  
  transporter.verify((error, success) => {
    if (error) {
      console.log('❌ SMTP Connection Failed:');
      console.log('   Message:', error.message);
      console.log('   Code:', error.code);
      if (error.command) console.log('   Failed Command:', error.command);
      if (error.response) console.log('   SMTP Response:', error.response);
      
      // Common error solutions
      console.log('\n💡 TROUBLESHOOTING TIPS:');
      console.log('   1. Make sure you are using an App Password, not your regular Gmail password');
      console.log('   2. Ensure 2-factor authentication is enabled on your Google account');
      console.log('   3. Generate a new App Password from your Google Account settings');
      console.log('   4. Check if your firewall/antivirus is blocking the connection');
      console.log('   5. Try using a different network connection');
    } else {
      console.log('✅ SMTP Connection Successful');
      
      console.log('\n4. Testing Email Sending...');
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to yourself for testing
        subject: 'Test Email from Chat App - Comprehensive Test',
        text: 'This is a test email to verify that the email configuration is working correctly.',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Email Configuration Test</h2>
            <p>This is a <b>test email</b> to verify that the email configuration is working correctly.</p>
            <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h3>Configuration Details:</h3>
              <ul>
                <li><b>Host:</b> ${process.env.EMAIL_HOST || 'smtp.gmail.com'}</li>
                <li><b>Port:</b> ${process.env.EMAIL_PORT || '587'}</li>
                <li><b>User:</b> ${process.env.EMAIL_USER}</li>
                <li><b>Secure:</b> false</li>
              </ul>
            </div>
            <p>If you received this email, your email configuration is working correctly!</p>
          </div>
        `
      };
      
      transporter.sendMail(mailOptions, (sendError, info) => {
        if (sendError) {
          console.log('❌ Email Sending Failed:');
          console.log('   Message:', sendError.message);
          console.log('   Code:', sendError.code);
          if (sendError.command) console.log('   Failed Command:', sendError.command);
          if (sendError.response) console.log('   SMTP Response:', sendError.response);
        } else {
          console.log('✅ Email Sent Successfully!');
          console.log('   Message ID:', info.messageId);
          console.log('   Accepted:', info.accepted);
          console.log('   Rejected:', info.rejected);
        }
        
        console.log('\n=== TEST COMPLETE ===');
      });
    }
  });
  
} catch (error) {
  console.log('❌ Transporter Creation Failed:');
  console.log('   Message:', error.message);
  console.log('   Stack:', error.stack);
}