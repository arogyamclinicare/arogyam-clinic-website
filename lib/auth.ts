import bcrypt from 'bcryptjs';

// Password hashing configuration
const SALT_ROUNDS = 12;

/**
 * Hash a password securely using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
};

/**
 * Verify a password against its hash
 * @param password - Plain text password to verify
 * @param hashedPassword - Stored hash to compare against
 * @returns True if password matches, false otherwise
 */
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};

/**
 * Simple password verification for plain text passwords
 * @param password - Plain text password to verify
 * @param storedPassword - Stored password (plain text for now)
 * @returns True if password matches, false otherwise
 */
export const verifySimplePassword = (password: string, storedPassword: string): boolean => {
  return password === storedPassword;
};

/**
 * Generate a secure random password
 * @param length - Length of password (default: 12)
 * @returns Secure random password
 */
export const generateSecurePassword = (length: number = 12): string => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one character from each category
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
  password += '0123456789'[Math.floor(Math.random() * 10)]; // Number
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Special char
  
  // Fill remaining length with random characters
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation results
 */
export const validatePasswordStrength = (password: string) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= minLength;
  
  const score = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, isLongEnough]
    .filter(Boolean).length;
  
  return {
    isValid: score >= 4 && isLongEnough,
    score: score,
    maxScore: 5,
    details: {
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isLongEnough
    }
  };
};
