import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

console.log('=== DETAILED EMAIL TEST ===\n');

// Check environment variables
console.log('1. Environment Variables Check:');
console.log('   EMAIL_HOST:', process.env.EMAIL_HOST || '(default) smtp.gmail.com');
console.log('   EMAIL_PORT:', process.env.EMAIL_PORT || '(default) 587');
console.log('   EMAIL_USER:', process.env.EMAIL_USER || '(not set)');
console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? `SET (${process.env.EMAIL_PASS.length} chars)` : '(not set)');
console.log('   EMAIL_FROM:', process.env.EMAIL_FROM || '(not set)');

// Validate configuration
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.log('\n❌ ERROR: EMAIL_USER or EMAIL_PASS not set in .env file');
  process.exit(1);
}

console.log('\n2. Creating Transporter...');
try {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: true,  // Enable logging
    debug: true    // Enable debug output
  });
  
  console.log('✅ Transporter created successfully');
  
  console.log('\n3. Verifying Connection...');
  transporter.verify((error, success) => {
    if (error) {
      console.log('❌ Connection verification failed:');
      console.log('   Message:', error.message);
      if (error.code) console.log('   Code:', error.code);
      if (error.command) console.log('   Command:', error.command);
      if (error.response) console.log('   Response:', error.response);
      
      console.log('\n🔧 TROUBLESHOOTING TIPS:');
      console.log('   1. Make sure you are using a Gmail App Password, not your regular password');
      console.log('   2. Ensure 2-Factor Authentication is enabled on your Google account');
      console.log('   3. Check if your firewall is blocking outgoing connections on port 587');
      console.log('   4. Try generating a new App Password');
    } else {
      console.log('✅ Connection verified successfully');
      
      console.log('\n4. Sending Test Email...');
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,  // Send to yourself
        subject: 'Email Configuration Test - Chat App',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Email Configuration Test</h2>
            <p>This is a <b>test email</b> to verify that your email configuration is working correctly.</p>
            <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h3>Configuration Details:</h3>
              <ul>
                <li><b>Host:</b> ${process.env.EMAIL_HOST || 'smtp.gmail.com'}</li>
                <li><b>Port:</b> ${process.env.EMAIL_PORT || '587'}</li>
                <li><b>User:</b> ${process.env.EMAIL_USER}</li>
              </ul>
            </div>
            <p>If you received this email, your email configuration is working!</p>
          </div>
        `
      };
      
      transporter.sendMail(mailOptions, (sendError, info) => {
        if (sendError) {
          console.log('❌ Failed to send email:');
          console.log('   Message:', sendError.message);
          if (sendError.code) console.log('   Code:', sendError.code);
          if (sendError.command) console.log('   Command:', sendError.command);
          if (sendError.response) console.log('   Response:', sendError.response);
        } else {
          console.log('✅ Email sent successfully!');
          console.log('   Message ID:', info.messageId);
          console.log('   Accepted:', info.accepted);
          console.log('   Rejected:', info.rejected);
        }
        
        console.log('\n=== TEST COMPLETE ===');
      });
    }
  });
  
} catch (error) {
  console.log('❌ Error creating transporter:');
  console.log('   Message:', error.message);
  console.log('   Stack:', error.stack);
}