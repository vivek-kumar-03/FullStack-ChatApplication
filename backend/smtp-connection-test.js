import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

async function testSMTPConnection() {
  console.log('=== SMTP CONNECTION TEST ===\n');
  
  // Check environment variables
  console.log('Environment Variables:');
  console.log('- EMAIL_HOST:', process.env.EMAIL_HOST || 'smtp.gmail.com');
  console.log('- EMAIL_PORT:', process.env.EMAIL_PORT || 587);
  console.log('- EMAIL_USER:', process.env.EMAIL_USER);
  console.log('- EMAIL_PASS: SET (length: ' + (process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0) + ')');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('\n❌ ERROR: EMAIL_USER or EMAIL_PASS not set');
    return;
  }
  
  try {
    console.log('\nCreating transporter...');
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Enable debugging
      logger: true,
      debug: true
    });
    
    console.log('✅ Transporter created successfully');
    
    console.log('\nVerifying SMTP connection...');
    await transporter.verify();
    
    console.log('✅ SMTP connection verified successfully!');
    
    console.log('\nAttempting to send test email...');
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'SMTP Connection Test',
      text: 'This is a test email to verify SMTP connection is working.'
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('- Message ID:', info.messageId);
    
    console.log('\n=== ALL TESTS PASSED ===');
    
  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
    
    if (error.code) {
      console.log('- Error Code:', error.code);
    }
    
    if (error.command) {
      console.log('- Failed Command:', error.command);
    }
    
    if (error.response) {
      console.log('- SMTP Response:', error.response);
    }
    
    console.log('\n=== TROUBLESHOOTING TIPS ===');
    console.log('1. Make sure you are using a Gmail App Password, not your regular password');
    console.log('2. Ensure 2-Factor Authentication is enabled on your Google account');
    console.log('3. Check if your firewall is blocking outgoing connections on port 587');
    console.log('4. Try using a different network connection');
    console.log('5. Generate a new App Password from your Google Account settings');
  }
}

testSMTPConnection();