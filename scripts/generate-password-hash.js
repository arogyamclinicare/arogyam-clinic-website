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
    return hash;
  } catch (error) {
    process.exit(1);
  }
}

// Get password from command line argument or prompt
const password = process.argv[2];

if (!password) {
  process.exit(1);
}

// Validate password strength
if (password.length < 8) {
  process.exit(1);
}

if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
  process.exit(1);
}

generatePasswordHash(password);
