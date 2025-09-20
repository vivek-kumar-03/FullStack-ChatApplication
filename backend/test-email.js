import dotenv from 'dotenv';
dotenv.config();

import { sendVerificationEmail } from './src/lib/email.js';

const testEmail = async () => {
  try {
    console.log('Testing email configuration...');
    console.log('Environment variables:');
    console.log('- EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('- EMAIL_PORT:', process.env.EMAIL_PORT);
    console.log('- EMAIL_USER:', process.env.EMAIL_USER);
    console.log('- EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
    console.log('- EMAIL_FROM:', process.env.EMAIL_FROM);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email configuration is incomplete. Please check your .env file.');
      return;
    }
    
    console.log('Sending test email...');
    const result = await sendVerificationEmail(process.env.EMAIL_USER, 'test-token');
    console.log('Email sent successfully!', result.messageId);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

testEmail();