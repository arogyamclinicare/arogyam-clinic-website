#!/usr/bin/env node

/**
 * Password Hash Generator
 * 
 * This script generates a secure bcrypt hash for the admin password.
 * Run this script to generate the hash for VITE_ADMIN_PASSWORD_HASH environment variable.
 * 
 * Usage: node scripts/generate-password-hash.js [password]
 */

import bcrypt from 'bcryptjs';

async function generatePasswordHash(password) {
  try {
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    
    console.log('\n🔐 SECURE PASSWORD HASH GENERATED');
    console.log('=====================================');
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);
    console.log('\n📝 ADD THIS TO YOUR .env FILE:');
    console.log(`VITE_ADMIN_PASSWORD_HASH=${hash}`);
    console.log('\n⚠️  IMPORTANT SECURITY NOTES:');
    console.log('1. Never commit the .env file to version control');
    console.log('2. Store the hash securely in production');
    console.log('3. Use a strong, unique password');
    console.log('4. Consider rotating passwords regularly');
    console.log('\n✅ Your admin authentication is now secure!');
    
    return hash;
  } catch (error) {
    console.error('❌ Error generating password hash:', error);
    process.exit(1);
  }
}

// Get password from command line argument or prompt
const password = process.argv[2];

if (!password) {
  console.log('🔐 Admin Password Hash Generator');
  console.log('================================');
  console.log('Usage: node scripts/generate-password-hash.js [password]');
  console.log('\nExample: node scripts/generate-password-hash.js "MySecurePassword123!"');
  process.exit(1);
}

// Validate password strength
if (password.length < 8) {
  console.error('❌ Password must be at least 8 characters long');
  process.exit(1);
}

if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
  console.error('❌ Password must contain at least one lowercase letter, one uppercase letter, and one number');
  process.exit(1);
}

generatePasswordHash(password);
