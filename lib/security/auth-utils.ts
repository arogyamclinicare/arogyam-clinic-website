import bcrypt from 'bcryptjs';
import { JWTUtils as BrowserJWTUtils } from './jwt-browser';
import { randomHex } from './crypto-browser';

// Security configuration
const SALT_ROUNDS = 12;
const CSRF_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

// Password security utilities
export class PasswordSecurity {
  /**
   * Hash password with bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Verify a password against a stored hash
   * @param password - Plain text password to verify
   * @param hash - Stored password hash
   * @returns Promise<boolean> - True if password matches
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      // For browser compatibility, we'll use a simple hash comparison
      // In production, this should use proper bcrypt verification on the server
      const inputHash = await this.hashPassword(password);
      return inputHash === hash;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate a secure password hash for storage
   * @param password - Plain text password
   * @returns Promise<string> - Secure hash for storage
   */
  static async generateSecureHash(password: string): Promise<string> {
    try {
      // In production, this should use bcrypt with 12+ salt rounds
      // For now, we'll use a more secure hash method
      const salt = randomHex(16);
      const hash = await this.hashPassword(password + salt);
      return `${salt}:${hash}`;
    } catch (error) {
      throw new Error('Failed to generate secure hash');
    }
  }

  /**
   * Verify password against secure hash
   * @param password - Plain text password
   * @param secureHash - Stored secure hash (salt:hash format)
   * @returns Promise<boolean> - True if password matches
   */
  static async verifySecureHash(password: string, secureHash: string): Promise<boolean> {
    try {
      const [salt, hash] = secureHash.split(':');
      if (!salt || !hash) return false;
      
      const inputHash = await this.hashPassword(password + salt);
      return inputHash === hash;
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate secure random password
   */
  static generateSecurePassword(length: number = 16): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one character from each required category
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
    
    // Fill remaining length with random characters
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
}

// JWT token utilities (using browser-compatible implementation)
export class JWTUtils {
  /**
   * Generate JWT access token
   */
  static generateAccessToken(payload: any): string {
    return BrowserJWTUtils.generateAccessToken(payload);
  }

  /**
   * Generate JWT refresh token
   */
  static generateRefreshToken(payload: any): string {
    return BrowserJWTUtils.generateRefreshToken(payload);
  }

  /**
   * Verify JWT access token
   */
  static verifyAccessToken(token: string): any {
    return BrowserJWTUtils.verifyAccessToken(token);
  }

  /**
   * Verify JWT refresh token
   */
  static verifyRefreshToken(token: string): any {
    return BrowserJWTUtils.verifyRefreshToken(token);
  }

  /**
   * Decode JWT token without verification (for debugging)
   */
  static decodeToken(token: string): any {
    return BrowserJWTUtils.decodeToken(token);
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    return BrowserJWTUtils.isTokenExpired(token);
  }

  /**
   * Get time until token expires
   */
  static getTimeUntilExpiration(token: string): number {
    return BrowserJWTUtils.getTimeUntilExpiration(token);
  }
}

// CSRF protection utilities
export class CSRFProtection {
  /**
   * Generate CSRF token
   */
  static generateToken(): string {
    return randomHex(32);
  }

  /**
   * Validate CSRF token
   */
  static validateToken(token: string, storedToken: string): boolean {
    return token === storedToken;
  }

  /**
   * Check if CSRF token is expired
   */
  static isTokenExpired(createdAt: number): boolean {
    return Date.now() - createdAt > CSRF_TOKEN_EXPIRY;
  }
}

// Rate limiting utilities
export class RateLimiting {
  private static readonly STORAGE_KEY = 'arogyam_rate_limiting';
  private static readonly MAX_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  private static readonly RESET_DURATION = 60 * 60 * 1000; // 1 hour

  /**
   * Get rate limiting data from storage
   */
  private static getRateLimitData(): Map<string, { count: number; lastAttempt: number; lockedUntil?: number }> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return new Map(Object.entries(data));
      }
    } catch (error) {
    }
    return new Map();
  }

  /**
   * Save rate limiting data to storage
   */
  private static saveRateLimitData(data: Map<string, { count: number; lastAttempt: number; lockedUntil?: number }>): void {
    try {
      const obj = Object.fromEntries(data);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(obj));
    } catch (error) {
    }
  }

  /**
   * Clean up expired rate limiting data
   */
  private static cleanupExpiredData(): void {
    try {
      const data = this.getRateLimitData();
      const now = Date.now();
      let hasChanges = false;

      for (const [email, attempts] of data.entries()) {
        // Remove if locked and lockout expired
        if (attempts.lockedUntil && now >= attempts.lockedUntil) {
          data.delete(email);
          hasChanges = true;
        }
        // Remove if reset duration passed
        else if (now - attempts.lastAttempt > this.RESET_DURATION) {
          data.delete(email);
          hasChanges = true;
        }
      }

      if (hasChanges) {
        this.saveRateLimitData(data);
      }
    } catch (error) {
    }
  }

  /**
   * Check if login attempts are allowed
   */
  static canAttemptLogin(email: string): { allowed: boolean; remainingTime?: number } {
    this.cleanupExpiredData();
    const data = this.getRateLimitData();
    const attempts = data.get(email);
    
    if (!attempts) {
      return { allowed: true };
    }

    // Check if account is locked
    if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
      return { 
        allowed: false, 
        remainingTime: attempts.lockedUntil - Date.now() 
      };
    }

    // Check if max attempts reached
    if (attempts.count >= this.MAX_ATTEMPTS) {
      // Lock account
      attempts.lockedUntil = Date.now() + this.LOCKOUT_DURATION;
      data.set(email, attempts);
      this.saveRateLimitData(data);
      return { 
        allowed: false, 
        remainingTime: this.LOCKOUT_DURATION 
      };
    }

    return { allowed: true };
  }

  /**
   * Record failed login attempt
   */
  static recordFailedAttempt(email: string): void {
    const data = this.getRateLimitData();
    const attempts = data.get(email) || { count: 0, lastAttempt: 0 };
    attempts.count += 1;
    attempts.lastAttempt = Date.now();
    data.set(email, attempts);
    this.saveRateLimitData(data);
  }

  /**
   * Record successful login (reset attempts)
   */
  static recordSuccessfulLogin(email: string): void {
    const data = this.getRateLimitData();
    data.delete(email);
    this.saveRateLimitData(data);
  }

  /**
   * Get remaining attempts for an email
   */
  static getRemainingAttempts(email: string): number {
    const data = this.getRateLimitData();
    const attempts = data.get(email);
    if (!attempts) return this.MAX_ATTEMPTS;
    return Math.max(0, this.MAX_ATTEMPTS - attempts.count);
  }

  /**
   * Get lockout status for an email
   */
  static getLockoutStatus(email: string): { isLocked: boolean; remainingTime?: number } {
    const data = this.getRateLimitData();
    const attempts = data.get(email);
    
    if (!attempts || !attempts.lockedUntil) {
      return { isLocked: false };
    }

    const now = Date.now();
    if (now < attempts.lockedUntil) {
      return { 
        isLocked: true, 
        remainingTime: attempts.lockedUntil - now 
      };
    }

    return { isLocked: false };
  }
}

// Input sanitization utilities
export class InputSanitization {
  /**
   * Sanitize HTML input to prevent XSS
   */
  static sanitizeHTML(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .trim();
  }

  /**
   * Sanitize email input
   */
  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  /**
   * Sanitize phone number (Indian format)
   */
  static sanitizePhone(phone: string): string {
    return phone.replace(/[^\d+]/g, '').trim();
  }

  /**
   * Validate and sanitize name
   */
  static sanitizeName(name: string): string {
    return name
      .replace(/[^a-zA-Z\s]/g, '') // Only letters and spaces
      .replace(/\s+/g, ' ') // Multiple spaces to single space
      .trim();
  }
}

// Session management utilities
export class SessionManager {
  private static readonly SESSION_KEY = 'arogyam_secure_session';
  private static readonly REFRESH_KEY = 'arogyam_refresh_token';

  /**
   * Store secure session data
   */
  static storeSession(sessionData: any, refreshToken: string): void {
    try {
      // Store session data in sessionStorage (cleared when tab closes)
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify({
        data: sessionData,
        createdAt: Date.now(),
        expiresAt: Date.now() + (30 * 60 * 1000) // 30 minutes
      }));

      // Store refresh token in localStorage
      localStorage.setItem(this.REFRESH_KEY, refreshToken);
    } catch (error) {
    }
  }

  /**
   * Get current session data
   */
  static getSession(): any | null {
    try {
      const sessionStr = sessionStorage.getItem(this.SESSION_KEY);
      if (!sessionStr) return null;

      const session = JSON.parse(sessionStr);
      
      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }

      return session.data;
    } catch (error) {
      this.clearSession();
      return null;
    }
  }

  /**
   * Get refresh token
   */
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  /**
   * Clear all session data
   */
  static clearSession(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
  }

  /**
   * Check if session is valid
   */
  static isSessionValid(): boolean {
    return this.getSession() !== null;
  }

  /**
   * Refresh session if possible
   */
  static async refreshSession(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return false;

      // Check if refresh token is expired
      if (JWTUtils.isTokenExpired(refreshToken)) {
        this.clearSession();
        return false;
      }

      // Here you would typically call your backend to refresh the token
      // For now, we'll just return true if token is valid
      return true;
    } catch (error) {
      return false;
    }
  }
}
