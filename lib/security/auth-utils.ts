import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Security configuration
const SALT_ROUNDS = 12;
const JWT_EXPIRY = '30m'; // 30 minutes
const JWT_REFRESH_EXPIRY = '7d'; // 7 days for refresh tokens
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
   * Verify password against hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
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

// JWT token utilities
export class JWTUtils {
  private static readonly JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'fallback-secret-change-in-production';
  private static readonly REFRESH_SECRET = import.meta.env.VITE_JWT_REFRESH_SECRET || 'fallback-refresh-secret-change-in-production';

  /**
   * Generate JWT access token
   */
  static generateAccessToken(payload: any): string {
    return jwt.sign(payload, this.JWT_SECRET, { 
      expiresIn: JWT_EXPIRY,
      issuer: 'arogyam-clinic',
      audience: 'arogyam-users'
    });
  }

  /**
   * Generate JWT refresh token
   */
  static generateRefreshToken(payload: any): string {
    return jwt.sign(payload, this.REFRESH_SECRET, { 
      expiresIn: JWT_REFRESH_EXPIRY,
      issuer: 'arogyam-clinic',
      audience: 'arogyam-users'
    });
  }

  /**
   * Verify JWT access token
   */
  static verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET, {
        issuer: 'arogyam-clinic',
        audience: 'arogyam-users'
      });
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  /**
   * Verify JWT refresh token
   */
  static verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, this.REFRESH_SECRET, {
        issuer: 'arogyam-clinic',
        audience: 'arogyam-users'
      });
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Decode JWT token without verification (for debugging)
   */
  static decodeToken(token: string): any {
    return jwt.decode(token);
  }
}

// CSRF protection utilities
export class CSRFProtection {
  /**
   * Generate CSRF token
   */
  static generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
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
  private static loginAttempts = new Map<string, { count: number; lastAttempt: number; lockedUntil?: number }>();
  private static readonly MAX_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  private static readonly RESET_DURATION = 60 * 60 * 1000; // 1 hour

  /**
   * Check if login attempts are allowed
   */
  static canAttemptLogin(email: string): { allowed: boolean; remainingTime?: number } {
    const attempts = this.loginAttempts.get(email);
    
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

    // Reset attempts if enough time has passed
    if (Date.now() - attempts.lastAttempt > this.RESET_DURATION) {
      this.loginAttempts.delete(email);
      return { allowed: true };
    }

    // Check if max attempts reached
    if (attempts.count >= this.MAX_ATTEMPTS) {
      // Lock account
      attempts.lockedUntil = Date.now() + this.LOCKOUT_DURATION;
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
    const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
    attempts.count += 1;
    attempts.lastAttempt = Date.now();
    this.loginAttempts.set(email, attempts);
  }

  /**
   * Record successful login (reset attempts)
   */
  static recordSuccessfulLogin(email: string): void {
    this.loginAttempts.delete(email);
  }

  /**
   * Get remaining attempts for an email
   */
  static getRemainingAttempts(email: string): number {
    const attempts = this.loginAttempts.get(email);
    if (!attempts) return this.MAX_ATTEMPTS;
    return Math.max(0, this.MAX_ATTEMPTS - attempts.count);
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
      console.error('Error storing session:', error);
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
      console.error('Error getting session:', error);
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

      // Here you would typically call your backend to refresh the token
      // For now, we'll just return false to indicate refresh is needed
      return false;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return false;
    }
  }
}
