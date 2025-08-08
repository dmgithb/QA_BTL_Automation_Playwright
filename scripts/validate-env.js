// Environment validation script
require('dotenv').config();

const requiredVars = [
  'TEST_USER_USERNAME',
  'TEST_USER_PASSWORD',
  'BASE_URL',
  'DEFAULT_EMAIL_DOMAIN'
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

console.log('=== Environment Configuration Validation ===');
console.log('Required variables:', requiredVars.length);
console.log('Missing variables:', missingVars.length);

if (missingVars.length === 0) {
  console.log('✅ PASSED: All required environment variables are set');
  
  // Show loaded configuration (without exposing sensitive data)
  console.log('\n=== Configuration Summary ===');
  console.log('Username:', process.env.TEST_USER_USERNAME);
  console.log('Password:', '***' + (process.env.TEST_USER_PASSWORD || '').slice(-3));
  console.log('Base URL:', process.env.BASE_URL);
  console.log('Email Domain:', process.env.DEFAULT_EMAIL_DOMAIN);
  console.log('Environment:', process.env.NODE_ENV || 'staging');
  
  process.exit(0);
} else {
  console.log('❌ FAILED: Missing environment variables');
  console.log('Missing variables:', missingVars);
  console.log('\nPlease ensure your .env file contains:');
  missingVars.forEach(varName => {
    console.log(`${varName}=your_value_here`);
  });
  console.log('\nCopy .env.template to .env and fill in your values');
  
  process.exit(1);
}
