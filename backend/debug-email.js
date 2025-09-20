import dotenv from 'dotenv';
dotenv.config();
import { sendVerificationEmail } from './src/lib/email.js';

async function debugEmail() {
  console.log('Debugging email sending...');
  
  // Check if required env vars are set
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'NOT SET');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('❌ ERROR: EMAIL_USER or EMAIL_PASS not set in .env file');
    return;
  }
  
  try {
    console.log('Attempting to send test verification email...');
    // Use a test token and your email for testing
    const testToken = 'test-token-12345';
    const testEmail = process.env.EMAIL_USER; // Send to yourself
    
    console.log('Sending verification email to:', testEmail);
    const result = await sendVerificationEmail(testEmail, testToken);
    console.log('✅ Verification email sent successfully!');
    console.log('Message ID:', result.messageId);
  } catch (error) {
    console.log('❌ Error sending verification email:');
    console.log('Message:', error.message);
    console.log('Code:', error.code);
    console.log('Command:', error.command);
    if (error.response) {
      console.log('Response:', error.response);
    }
  }
}

debugEmail();