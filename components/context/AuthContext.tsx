import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  JWTUtils, 
  CSRFProtection, 
  RateLimiting, 
  SessionManager,
  InputSanitization
} from '../../lib/security/auth-utils';
import { SECURITY_CONFIG } from '../../lib/security/config';
import { 
  SecurityAuditLogger, 
  SecurityEventType, 
  SecuritySeverity 
} from '../../lib/security/audit-logger';

interface AuthUser {
  id: string;
  email: string;
  role: string;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: any | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
  csrfToken: string;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState<string>('');

  // Get admin credentials from environment variables
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

  // Generate CSRF token on component mount
  useEffect(() => {
    const token = CSRFProtection.generateToken();
    setCsrfToken(token);
    
    // Store CSRF token with timestamp
    sessionStorage.setItem('arogyam_csrf_token', JSON.stringify({
      token,
      createdAt: Date.now()
    }));

    // Log CSRF token generation
    SecurityAuditLogger.logEvent(
      SecurityEventType.SECURITY_CONFIG_CHANGE,
      SecuritySeverity.LOW,
      { action: 'CSRF_TOKEN_GENERATED' }
    );
  }, []);

  // Check existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const sessionData = SessionManager.getSession();
        
        if (sessionData) {
          // Verify JWT token if it exists
          const refreshToken = SessionManager.getRefreshToken();
          
          if (refreshToken) {
            try {
              const decoded = JWTUtils.verifyRefreshToken(refreshToken);
              setUser(decoded.user);
              setSession({ user: decoded.user });

              // Log session restoration
              SecurityAuditLogger.logEvent(
                SecurityEventType.SESSION_REFRESH,
                SecuritySeverity.LOW,
                { method: 'JWT_REFRESH' },
                { userId: decoded.user.id, userEmail: decoded.user.email, userRole: decoded.user.role }
              );
            } catch (error: any) {
              // Token expired, clear session
              SessionManager.clearSession();
              
              // Log session expiry
              SecurityAuditLogger.logEvent(
                SecurityEventType.SESSION_EXPIRED,
                SecuritySeverity.MEDIUM,
                { reason: 'JWT_REFRESH_FAILED', error: error.message }
              );
            }
          } else {
            setUser(sessionData);
            setSession({ user: sessionData });

            // Log session restoration from storage
            SecurityAuditLogger.logEvent(
              SecurityEventType.SESSION_REFRESH,
              SecuritySeverity.LOW,
              { method: 'STORAGE_RESTORATION' },
              { userId: sessionData.id, userEmail: sessionData.email, userRole: sessionData.role }
            );
          }
        }
      } catch (error: any) {
        console.error('Error checking existing session:', error);
        SessionManager.clearSession();
        
        // Log session error
        SecurityAuditLogger.logEvent(
          SecurityEventType.SESSION_EXPIRED,
          SecuritySeverity.HIGH,
          { reason: 'SESSION_CHECK_ERROR', error: error.message }
        );
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  // Secure login function with enhanced security
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Sanitize inputs
      const sanitizedEmail = InputSanitization.sanitizeEmail(email);
      const sanitizedPassword = password; // Don't sanitize password

      // Validate inputs
      if (!sanitizedEmail || !sanitizedPassword) {
        // Log validation failure
        SecurityAuditLogger.logEvent(
          SecurityEventType.INPUT_VALIDATION_FAILED,
          SecuritySeverity.MEDIUM,
          { field: 'email_or_password', reason: 'MISSING_REQUIRED_FIELDS' },
          { userEmail: sanitizedEmail }
        );

        return { success: false, error: 'Email and password are required' };
      }

      // Check rate limiting
      const rateLimitCheck = RateLimiting.canAttemptLogin(sanitizedEmail);
      if (!rateLimitCheck.allowed) {
        const remainingMinutes = Math.ceil((rateLimitCheck.remainingTime || 0) / 60000);
        
        // Log rate limit exceeded
        SecurityAuditLogger.logEvent(
          SecurityEventType.RATE_LIMIT_EXCEEDED,
          SecuritySeverity.HIGH,
          { 
            email: sanitizedEmail, 
            remainingTime: remainingMinutes,
            reason: 'ACCOUNT_LOCKED' 
          },
          { userEmail: sanitizedEmail }
        );

        return { 
          success: false, 
          error: `Account temporarily locked. Please try again in ${remainingMinutes} minutes.` 
        };
      }

      // Check against stored admin credentials
      if (sanitizedEmail === ADMIN_EMAIL) {
        // In production, you would compare against hashed password from database
        // For now, we'll use environment variable comparison
        if (sanitizedPassword === import.meta.env.VITE_ADMIN_PASSWORD) {
          // Generate JWT tokens
          const userData: AuthUser = {
            id: '1',
            email: ADMIN_EMAIL,
            role: 'admin',
            name: 'Dr. Kajal Kumari'
          };

          const refreshToken = JWTUtils.generateRefreshToken({ user: userData });

          // Store secure session
          SessionManager.storeSession(userData, refreshToken);

          setUser(userData);
          setSession({ user: userData });

          // Record successful login (reset rate limiting)
          RateLimiting.recordSuccessfulLogin(sanitizedEmail);

          // Log successful login
          SecurityAuditLogger.logLoginAttempt(sanitizedEmail, true, {
            method: 'PASSWORD_AUTH',
            role: userData.role
          });

          return { success: true };
        } else {
          // Record failed attempt
          RateLimiting.recordFailedAttempt(sanitizedEmail);
          
          const remainingAttempts = RateLimiting.getRemainingAttempts(sanitizedEmail);
          
          // Log failed login attempt
          SecurityAuditLogger.logLoginAttempt(sanitizedEmail, false, {
            method: 'PASSWORD_AUTH',
            reason: 'INVALID_PASSWORD',
            remainingAttempts
          });

          // Check if account should be locked
          if (remainingAttempts === 0) {
            SecurityAuditLogger.logEvent(
              SecurityEventType.ACCOUNT_LOCKED,
              SecuritySeverity.HIGH,
              { 
                email: sanitizedEmail, 
                reason: 'MAX_LOGIN_ATTEMPTS_EXCEEDED',
                lockoutDuration: SECURITY_CONFIG.RATE_LIMITING.ACCOUNT_LOCKOUT_DURATION
              },
              { userEmail: sanitizedEmail }
            );
          }

          return { 
            success: false, 
            error: `Invalid password. ${remainingAttempts} attempts remaining.` 
          };
        }
      } else {
        // Record failed attempt for unknown email
        RateLimiting.recordFailedAttempt(sanitizedEmail);
        
        const remainingAttempts = RateLimiting.getRemainingAttempts(sanitizedEmail);
        
        // Log failed login attempt for unknown email
        SecurityAuditLogger.logLoginAttempt(sanitizedEmail, false, {
          method: 'PASSWORD_AUTH',
          reason: 'UNKNOWN_EMAIL',
          remainingAttempts
        });

        // Log suspicious activity for unknown email attempts
        SecurityAuditLogger.logEvent(
          SecurityEventType.SUSPICIOUS_ACTIVITY,
          SecuritySeverity.MEDIUM,
          { 
            activity: 'LOGIN_ATTEMPT_UNKNOWN_EMAIL',
            email: sanitizedEmail,
            remainingAttempts
          },
          { userEmail: sanitizedEmail }
        );

        return { 
          success: false, 
          error: `Invalid email or password. ${remainingAttempts} attempts remaining.` 
        };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Log login error
      SecurityAuditLogger.logEvent(
        SecurityEventType.LOGIN_FAILURE,
        SecuritySeverity.HIGH,
        { 
          reason: 'SYSTEM_ERROR',
          error: error.message 
        },
        { userEmail: email }
      );

      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  // Enhanced logout function
  const logout = async (): Promise<void> => {
    try {
      // Log logout event
      if (user) {
        SecurityAuditLogger.logEvent(
          SecurityEventType.LOGOUT,
          SecuritySeverity.LOW,
          { method: 'USER_INITIATED' },
          { userId: user.id, userEmail: user.email, userRole: user.role }
        );
      }

      // Clear all session data
      SessionManager.clearSession();
      
      // Clear CSRF token
      sessionStorage.removeItem('arogyam_csrf_token');
      
      // Reset state
      setUser(null);
      setSession(null);
      
      // Generate new CSRF token for next session
      const newToken = CSRFProtection.generateToken();
      setCsrfToken(newToken);
      
      sessionStorage.setItem('arogyam_csrf_token', JSON.stringify({
        token: newToken,
        createdAt: Date.now()
      }));

      // Log CSRF token refresh
      SecurityAuditLogger.logEvent(
        SecurityEventType.SECURITY_CONFIG_CHANGE,
        SecuritySeverity.LOW,
        { action: 'CSRF_TOKEN_REFRESHED' }
      );
    } catch (error: any) {
      console.error('Logout error:', error);
      
      // Log logout error
      SecurityAuditLogger.logEvent(
        SecurityEventType.LOGOUT,
        SecuritySeverity.MEDIUM,
        { 
          reason: 'LOGOUT_ERROR',
          error: error.message 
        },
        user ? { userId: user.id, userEmail: user.email, userRole: user.role } : undefined
      );
    }
  };

  // Session refresh function
  const refreshSession = async (): Promise<boolean> => {
    try {
      const success = await SessionManager.refreshSession();
      if (!success) {
        // Session refresh failed, logout user
        await logout();
        return false;
      }

      // Log successful session refresh
      if (user) {
        SecurityAuditLogger.logEvent(
          SecurityEventType.SESSION_REFRESH,
          SecuritySeverity.LOW,
          { method: 'AUTO_REFRESH' },
          { userId: user.id, userEmail: user.email, userRole: user.role }
        );
      }

      return true;
    } catch (error: any) {
      console.error('Session refresh error:', error);
      
      // Log session refresh error
      SecurityAuditLogger.logEvent(
        SecurityEventType.SESSION_EXPIRED,
        SecuritySeverity.MEDIUM,
        { 
          reason: 'REFRESH_ERROR',
          error: error.message 
        },
        user ? { userId: user.id, userEmail: user.email, userRole: user.role } : undefined
      );

      await logout();
      return false;
    }
  };

  // Auto-refresh session before expiry
  useEffect(() => {
    if (!user) return;

    const checkSessionExpiry = () => {
      const sessionData = SessionManager.getSession();
      if (!sessionData) {
        // Session expired, logout
        logout();
        return;
      }

      // Check if we need to refresh soon
      const sessionStr = sessionStorage.getItem(SECURITY_CONFIG.SESSION.STORAGE_KEY);
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr);
          const timeUntilExpiry = session.expiresAt - Date.now();
          
          if (timeUntilExpiry <= SECURITY_CONFIG.SESSION.REFRESH_THRESHOLD) {
            // Refresh session
            refreshSession();
          }
        } catch (error: any) {
          console.error('Error checking session expiry:', error);
          
          // Log session check error
          SecurityAuditLogger.logEvent(
            SecurityEventType.SESSION_EXPIRED,
            SecuritySeverity.MEDIUM,
            { 
              reason: 'SESSION_CHECK_ERROR',
              error: error.message 
            },
            { userId: user.id, userEmail: user.email, userRole: user.role }
          );
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkSessionExpiry, 60000);
    
    return () => clearInterval(interval);
  }, [user]);

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    loading,
    csrfToken,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}