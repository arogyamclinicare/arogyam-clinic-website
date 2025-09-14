/**
 * Production Security Hardening Module
 * Implements enterprise-grade security for healthcare applications
 */

import CryptoJS from 'crypto-js';

export interface SecurityConfig {
  enableCSP: boolean;
  enableHSTS: boolean;
  enableXFrameOptions: boolean;
  enableContentTypeNoSniff: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  passwordMinLength: number;
  requireMFA: boolean;
}

export interface SessionInfo {
  userId: string;
  email: string;
  role: string;
  lastActivity: number;
  loginTime: number;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
}

class SecurityHardening {
  private static instance: SecurityHardening;
  private activeSessions: Map<string, SessionInfo> = new Map();
  private loginAttempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private config: SecurityConfig;

  private constructor() {
    this.config = {
      enableCSP: true,
      enableHSTS: true,
      enableXFrameOptions: true,
      enableContentTypeNoSniff: true,
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      maxLoginAttempts: 5,
      lockoutDuration: 15 * 60 * 1000, // 15 minutes
      passwordMinLength: 12,
      requireMFA: true
    };
  }

  public static getInstance(): SecurityHardening {
    if (!SecurityHardening.instance) {
      SecurityHardening.instance = new SecurityHardening();
    }
    return SecurityHardening.instance;
  }

  /**
   * Initialize security headers for the application
   */
  public initializeSecurityHeaders(): void {
    if (typeof document !== 'undefined') {
      // Content Security Policy
      if (this.config.enableCSP) {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = this.generateCSPHeader();
        document.head.appendChild(meta);
      }

      // X-Frame-Options
      if (this.config.enableXFrameOptions) {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'X-Frame-Options';
        meta.content = 'DENY';
        document.head.appendChild(meta);
      }

      // X-Content-Type-Options
      if (this.config.enableContentTypeNoSniff) {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'X-Content-Type-Options';
        meta.content = 'nosniff';
        document.head.appendChild(meta);
      }
    }
  }

  /**
   * Generate Content Security Policy header
   */
  private generateCSPHeader(): string {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https: wss: ws:",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ];
    return csp.join('; ');
  }

  /**
   * Validate session security
   */
  public validateSession(sessionId: string): boolean {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return false;
    }

    const now = Date.now();
    const timeSinceLastActivity = now - session.lastActivity;

    // Check session timeout
    if (timeSinceLastActivity > this.config.sessionTimeout) {
      this.invalidateSession(sessionId);
      return false;
    }

    // Update last activity
    session.lastActivity = now;
    this.activeSessions.set(sessionId, session);
    return true;
  }

  /**
   * Create secure session
   */
  public createSession(userInfo: Omit<SessionInfo, 'sessionId' | 'loginTime' | 'lastActivity'>): string {
    const sessionId = this.generateSecureSessionId();
    const now = Date.now();

    const session: SessionInfo = {
      ...userInfo,
      sessionId,
      loginTime: now,
      lastActivity: now
    };

    this.activeSessions.set(sessionId, session);
    return sessionId;
  }

  /**
   * Invalidate session
   */
  public invalidateSession(sessionId: string): void {
    this.activeSessions.delete(sessionId);
  }

  /**
   * Check login attempts and implement rate limiting
   */
  public checkLoginAttempts(identifier: string): boolean {
    const attempts = this.loginAttempts.get(identifier);
    const now = Date.now();

    if (!attempts) {
      return true; // First attempt
    }

    // Check if lockout period has expired
    if (now - attempts.lastAttempt > this.config.lockoutDuration) {
      this.loginAttempts.delete(identifier);
      return true;
    }

    // Check if max attempts exceeded
    return attempts.count < this.config.maxLoginAttempts;
  }

  /**
   * Record failed login attempt
   */
  public recordFailedAttempt(identifier: string): void {
    const now = Date.now();
    const attempts = this.loginAttempts.get(identifier);

    if (!attempts) {
      this.loginAttempts.set(identifier, { count: 1, lastAttempt: now });
    } else {
      attempts.count++;
      attempts.lastAttempt = now;
      this.loginAttempts.set(identifier, attempts);
    }
  }

  /**
   * Clear login attempts on successful login
   */
  public clearLoginAttempts(identifier: string): void {
    this.loginAttempts.delete(identifier);
  }

  /**
   * Encrypt sensitive data
   */
  public encryptSensitiveData(data: string, key?: string): string {
    const encryptionKey = key || this.getEncryptionKey();
    return CryptoJS.AES.encrypt(data, encryptionKey).toString();
  }

  /**
   * Decrypt sensitive data
   */
  public decryptSensitiveData(encryptedData: string, key?: string): string {
    const decryptionKey = key || this.getEncryptionKey();
      const bytes = CryptoJS.AES.decrypt(encryptedData, decryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Generate secure hash for passwords
   */
  public hashPassword(password: string, salt?: string): { hash: string; salt: string } {
    const passwordSalt = salt || CryptoJS.lib.WordArray.random(256/8).toString();
    const hash = CryptoJS.PBKDF2(password, passwordSalt, {
      keySize: 256/32,
      iterations: 10000
    }).toString();
    
    return { hash, salt: passwordSalt };
  }

  /**
   * Verify password hash
   */
  public verifyPassword(password: string, hash: string, salt: string): boolean {
    const computedHash = CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations: 10000
    }).toString();
    
    return computedHash === hash;
  }

  /**
   * Sanitize user input
   */
  public sanitizeInput(input: string): string {
    return input
      .replace(/[<>']/g, '') // Remove potential XSS characters
      .replace(/[;&|`]/g, '') // Remove command injection characters
      .trim();
  }

  /**
   * Validate file upload security
   */
  public validateFileUpload(file: File): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push('Invalid file type. Only images and PDFs are allowed.');
    }

    // Check file size
    if (file.size > maxSize) {
      errors.push('File size too large. Maximum size is 10MB.');
    }

    // Check file name
    const dangerousPatterns = /[<>:/\\|?*]/;
    if (dangerousPatterns.test(file.name)) {
      errors.push('Invalid file name characters.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate secure session ID
   */
  private generateSecureSessionId(): string {
    const timestamp = Date.now().toString();
    const random = CryptoJS.lib.WordArray.random(32).toString();
    return CryptoJS.SHA256(timestamp + random).toString();
  }

  /**
   * Get encryption key from environment or generate one
   */
  private getEncryptionKey(): string {
    // In production, this should come from secure environment variables
    return process.env.VITE_ENCRYPTION_KEY || 'default-encryption-key-change-in-production';
  }

  /**
   * Monitor for suspicious activity
   */
  public detectSuspiciousActivity(sessionId: string, activity: string): boolean {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return true; // Suspicious if no session
    }

    // Check for unusual patterns
    const suspiciousPatterns = [
      /script/i,
      /javascript/i,
      /<.*>/,
      /union.*select/i,
      /drop.*table/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(activity));
  }

  /**
   * Get security metrics for monitoring
   */
  public getSecurityMetrics(): {
    activeSessions: number;
    blockedIPs: number;
    failedAttempts: number;
    lastSecurityEvent: number;
  } {
    return {
      activeSessions: this.activeSessions.size,
      blockedIPs: this.loginAttempts.size,
      failedAttempts: Array.from(this.loginAttempts.values()).reduce((sum, attempts) => sum + attempts.count, 0),
      lastSecurityEvent: Date.now()
    };
  }

  /**
   * Clean up expired sessions and attempts
   */
  public cleanup(): void {
    const now = Date.now();

    // Clean expired sessions
    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (now - session.lastActivity > this.config.sessionTimeout) {
        this.invalidateSession(sessionId);
      }
    }

    // Clean expired login attempts
    for (const [identifier, attempts] of this.loginAttempts.entries()) {
      if (now - attempts.lastAttempt > this.config.lockoutDuration) {
        this.loginAttempts.delete(identifier);
      }
    }
  }
}

// Export singleton instance
export const securityHardening = SecurityHardening.getInstance();

// Initialize security on module load
if (typeof window !== 'undefined') {
  securityHardening.initializeSecurityHeaders();
  
  // Run cleanup every 5 minutes
  setInterval(() => {
    securityHardening.cleanup();
  }, 5 * 60 * 1000);
}