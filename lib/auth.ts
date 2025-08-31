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
 * SECURITY FIX: Replace insecure plain text password verification
 * @param password - Plain text password to verify
 * @param storedPassword - Stored password (should be bcrypt hash)
 * @returns True if password matches, false otherwise
 */
export const verifySimplePassword = async (password: string, storedPassword: string): Promise<boolean> => {
  try {
    // Check if stored password is already a bcrypt hash
    if (storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2y$')) {
      // It's a bcrypt hash, use proper verification
      return await verifyPassword(password, storedPassword);
    } else {
      // CRITICAL: This is a plain text password - needs to be migrated
      console.warn('SECURITY WARNING: Plain text password detected. User needs password reset.');
      // For now, return false to force password reset
      return false;
    }
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
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

/**
 * SECURITY: Force password reset for users with plain text passwords
 * @param userId - User ID to force password reset
 * @returns Success status
 */
export const forcePasswordReset = async (userId: string): Promise<boolean> => {
  try {
    // Generate a secure temporary password
    const tempPassword = generateSecurePassword(16);
    
    // In production, this would update the database and send email
    console.log(`SECURITY: User ${userId} needs password reset. Temporary password: ${tempPassword}`);
    
    return true;
  } catch (error) {
    console.error('Error forcing password reset:', error);
    return false;
  }
};
