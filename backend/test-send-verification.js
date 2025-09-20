// Test the sendVerificationEmail function directly
require('dotenv').config();
const { sendVerificationEmail } = require('./src/lib/email.js');

async function testSendVerification() {
  console.log('Testing sendVerificationEmail function...');
  
  try {
    // Check if environment variables are loaded
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Missing email configuration in .env file');
      process.exit(1);
    }
    
    console.log('Sending test verification email...');
    const testEmail = process.env.EMAIL_USER; // Send to yourself
    const testToken = 'test-token-12345';
    
    const result = await sendVerificationEmail(testEmail, testToken);
    console.log('Verification email sent successfully!');
    console.log('Message ID:', result.messageId);
  } catch (error) {
    console.log('Error sending verification email:');
    console.log('Message:', error.message);
    console.log('Stack:', error.stack);
    if (error.code) console.log('Code:', error.code);
    if (error.command) console.log('Command:', error.command);
  }
}

testSendVerification();