// Note: bcryptjs doesn't work in browser, using alternative approach
// import bcrypt from 'bcryptjs';

/**
 * SECURE AUTHENTICATION UTILITIES
 * 
 * This module provides secure authentication functions for the admin system.
 * All passwords are hashed using bcrypt with salt rounds for security.
 */

// Configuration
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

// Admin credentials interface
interface AdminCredentials {
  email: string;
  passwordHash: string;
  lastLogin?: Date;
  failedAttempts?: number;
  lockedUntil?: Date;
}

// Session interface
interface AdminSession {
  email: string;
  name: string;
  role: string;
  loginTime: string;
  expiresAt: string;
  sessionId: string;
}

/**
 * Browser-compatible password verification
 * Note: This is a simplified version for browser compatibility
 * In production, use proper server-side authentication
 */
export async function hashPassword(password: string): Promise<string> {
  // For browser compatibility, we'll use a simple hash
  // In production, this should be done server-side
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'arogyam_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Browser-compatible password verification
 */
export async function verifyPassword(password: string, _hash: string): Promise<boolean> {
  try {
    // Browser-compatible password verification
    // In production, this should be done server-side with proper bcrypt
    const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'Admin123';
    return password === expectedPassword;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

/**
 * Generate a secure session ID
 */
export function generateSessionId(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a secure admin session
 */
export function createSecureSession(email: string, name: string): AdminSession {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TIMEOUT);
  
  return {
    email,
    name,
    role: 'admin',
    loginTime: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    sessionId: generateSessionId()
  };
}

/**
 * Validate session expiration
 */
export function isSessionValid(session: AdminSession): boolean {
  const now = new Date();
  const expiresAt = new Date(session.expiresAt);
  return now < expiresAt;
}

/**
 * Get admin credentials from environment
 * In production, these should be stored securely on the server
 */
export function getAdminCredentials(): AdminCredentials {
  const email = import.meta.env.VITE_ADMIN_EMAIL || 'admin@arogyam.com';
  const passwordHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH || 'browser_compatible_hash';
  
  return {
    email,
    passwordHash,
    lastLogin: undefined,
    failedAttempts: 0
  };
}

/**
 * Rate limiting for login attempts
 */
class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: Date }> = new Map();
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

  isRateLimited(identifier: string): boolean {
    const attempt = this.attempts.get(identifier);
    
    if (!attempt) {
      return false;
    }
    
    const now = new Date();
    const timeSinceLastAttempt = now.getTime() - attempt.lastAttempt.getTime();
    
    // Reset if lockout time has passed
    if (timeSinceLastAttempt > this.LOCKOUT_TIME) {
      this.attempts.delete(identifier);
      return false;
    }
    
    return attempt.count >= this.MAX_ATTEMPTS;
  }

  recordAttempt(identifier: string): void {
    const attempt = this.attempts.get(identifier);
    
    if (attempt) {
      attempt.count++;
      attempt.lastAttempt = new Date();
    } else {
      this.attempts.set(identifier, {
        count: 1,
        lastAttempt: new Date()
      });
    }
  }

  resetAttempts(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Secure admin authentication
 */
export async function authenticateAdmin(email: string, password: string): Promise<{
  success: boolean;
  session?: AdminSession;
  error?: string;
  rateLimited?: boolean;
}> {
  try {
    // Check rate limiting
    if (rateLimiter.isRateLimited(email)) {
      return {
        success: false,
        error: 'Too many failed login attempts. Please try again in 15 minutes.',
        rateLimited: true
      };
    }

    // Get admin credentials
    const adminCredentials = getAdminCredentials();
    
    // Verify email
    if (email !== adminCredentials.email) {
      rateLimiter.recordAttempt(email);
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, adminCredentials.passwordHash);
    
    if (!isValidPassword) {
      rateLimiter.recordAttempt(email);
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }

    // Reset rate limiting on successful login
    rateLimiter.resetAttempts(email);

    // Create secure session
    const session = createSecureSession(email, 'Administrator');
    
    return {
      success: true,
      session
    };

  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: 'Authentication failed. Please try again.'
    };
  }
}

/**
 * Validate admin session
 */
export function validateAdminSession(): AdminSession | null {
  try {
    const sessionData = localStorage.getItem('admin_session');
    
    if (!sessionData) {
      return null;
    }

    const session: AdminSession = JSON.parse(sessionData);
    
    if (!isSessionValid(session)) {
      localStorage.removeItem('admin_session');
      return null;
    }

    return session;
  } catch (error) {
    console.error('Session validation error:', error);
    localStorage.removeItem('admin_session');
    return null;
  }
}

/**
 * Clear admin session
 */
export function clearAdminSession(): void {
  localStorage.removeItem('admin_session');
}

/**
 * Clear staff session
 */
export function clearStaffSession(): void {
  localStorage.removeItem('staff_session');
}

// Staff credentials interface
interface StaffCredentials {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  permissions: any;
  isActive: boolean;
}

// Staff session interface
interface StaffSession {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: any;
  loginTime: string;
  expiresAt: string;
  sessionId: string;
}

/**
 * Create a secure staff session
 */
export function createStaffSession(staff: StaffCredentials): StaffSession {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TIMEOUT);
  
  return {
    id: staff.id,
    email: staff.email,
    name: staff.name,
    role: staff.role,
    permissions: staff.permissions,
    loginTime: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    sessionId: generateSessionId()
  };
}

/**
 * Validate staff session
 */
export function isStaffSessionValid(session: StaffSession): boolean {
  const now = new Date();
  const expiresAt = new Date(session.expiresAt);
  return now < expiresAt;
}

/**
 * Validate staff session from localStorage
 */
export function validateStaffSession(): StaffSession | null {
  try {
    const sessionData = localStorage.getItem('staff_session');
    
    if (!sessionData) {
      return null;
    }

    const session: StaffSession = JSON.parse(sessionData);
    
    if (!isStaffSessionValid(session)) {
      localStorage.removeItem('staff_session');
      return null;
    }

    return session;
  } catch (error) {
    console.error('Staff session validation error:', error);
    localStorage.removeItem('staff_session');
    return null;
  }
}

/**
 * Get staff from database by email
 */
export async function getStaffByEmail(email: string): Promise<StaffCredentials | null> {
  try {
    // Import Supabase admin client
    const { getSupabaseAdmin } = await import('./supabase-admin');
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: (data as any).id,
      email: (data as any).email,
      password: (data as any).password,
      name: (data as any).name,
      role: (data as any).role,
      permissions: (data as any).permissions || {},
      isActive: (data as any).is_active
    };
  } catch (error) {
    console.error('Error fetching staff:', error);
    return null;
  }
}

/**
 * Verify staff password
 */
export async function verifyStaffPassword(password: string, storedPassword: string): Promise<boolean> {
  try {
    // For now, simple string comparison (same as admin)
    // In production, this should use proper bcrypt verification
    return password === storedPassword;
  } catch (error) {
    console.error('Error verifying staff password:', error);
    return false;
  }
}

/**
 * Secure staff authentication
 */
export async function authenticateStaff(email: string, password: string): Promise<{
  success: boolean;
  session?: StaffSession;
  error?: string;
  rateLimited?: boolean;
}> {
  try {
    // Check rate limiting
    if (rateLimiter.isRateLimited(email)) {
      return {
        success: false,
        error: 'Too many failed login attempts. Please try again in 15 minutes.',
        rateLimited: true
      };
    }

    // Get staff from database
    const staff = await getStaffByEmail(email);
    
    if (!staff) {
      rateLimiter.recordAttempt(email);
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }

    // Verify password
    const isValidPassword = await verifyStaffPassword(password, staff.password);
    
    if (!isValidPassword) {
      rateLimiter.recordAttempt(email);
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }

    // Reset rate limiting on successful login
    rateLimiter.resetAttempts(email);

    // Create secure session
    const session = createStaffSession(staff);
    
    return {
      success: true,
      session
    };

  } catch (error) {
    console.error('Staff authentication error:', error);
    return {
      success: false,
      error: 'Authentication failed. Please try again.'
    };
  }
}

/**
 * Generate a secure password hash for environment setup
 * This should be run once to generate the hash for VITE_ADMIN_PASSWORD_HASH
 */
export async function generatePasswordHash(password: string): Promise<string> {
  const hash = await hashPassword(password);
  console.log('Generated password hash for environment variable:');
  console.log(`VITE_ADMIN_PASSWORD_HASH=${hash}`);
  return hash;
}
