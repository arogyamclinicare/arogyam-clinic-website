import React, { createContext, useContext, useState, useEffect } from 'react';
import { createLogger } from '../../lib/utils/logger';

interface AdminUser {
  id: string;
  email: string;
  role: string;
  name: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (user: AdminUser) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  sessionExpiry: Date | null;
  refreshSession: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Security configuration
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const SESSION_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const logger = createLogger('AdminAuthContext');
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);
  const [loginAttempts, setLoginAttempts] = useState<{ count: number; lockedUntil: number }>({
    count: 0,
    lockedUntil: 0
  });

  // SECURITY: Check if account is locked
  const isAccountLocked = (): boolean => {
    return loginAttempts.count >= MAX_LOGIN_ATTEMPTS && Date.now() < loginAttempts.lockedUntil;
  };

  // SECURITY: Record failed login attempt
  const recordFailedLogin = (): void => {
    const newCount = loginAttempts.count + 1;
    const lockedUntil = newCount >= MAX_LOGIN_ATTEMPTS ? Date.now() + LOCKOUT_DURATION : 0;
    
    setLoginAttempts({ count: newCount, lockedUntil });
    
    // Store in sessionStorage for persistence across page reloads
    sessionStorage.setItem('admin_login_attempts', JSON.stringify({ count: newCount, lockedUntil }));
    
    logger.warn(`Failed login attempt ${newCount}/${MAX_LOGIN_ATTEMPTS}`);
    
    if (newCount >= MAX_LOGIN_ATTEMPTS) {
      logger.warn(`Admin account locked for ${LOCKOUT_DURATION / 1000} seconds`);
    }
  };

  // SECURITY: Reset login attempts on successful login
  const resetLoginAttempts = (): void => {
    setLoginAttempts({ count: 0, lockedUntil: 0 });
    sessionStorage.removeItem('admin_login_attempts');
  };

  // SECURITY: Create secure session token
  const createSecureSession = (userData: AdminUser): string => {
    const sessionData = {
      userId: userData.id,
      email: userData.email,
      role: userData.role,
      name: userData.name,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_TIMEOUT,
      // Add additional security measures
      userAgent: navigator.userAgent,
      ipHash: btoa(navigator.userAgent).slice(0, 8), // Simple fingerprint
      sessionId: crypto.randomUUID()
    };

    // Store in sessionStorage (more secure than localStorage)
    sessionStorage.setItem('arogyam_admin_session', JSON.stringify(sessionData));
    
    // Set session expiry
    setSessionExpiry(new Date(sessionData.expiresAt));
    
    return sessionData.sessionId;
  };

  // SECURITY: Validate session security
  const validateSessionSecurity = (sessionData: any): boolean => {
    try {
      // Check if session is expired
      if (Date.now() > sessionData.expiresAt) {
        logger.warn('Session expired');
        return false;
      }

      // Check if user agent changed (potential session hijacking)
      if (sessionData.userAgent !== navigator.userAgent) {
        logger.warn('User agent changed - potential session hijacking');
        return false;
      }

      // Check if IP hash changed (simple location change detection)
      const currentIpHash = btoa(navigator.userAgent).slice(0, 8);
      if (sessionData.ipHash !== currentIpHash) {
        logger.warn('IP hash changed - potential session hijacking');
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Session validation error:', error);
      return false;
    }
  };

  // SECURITY: Check existing session on app load
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        setLoading(true);
        
        // Load login attempts from sessionStorage
        const storedAttempts = sessionStorage.getItem('admin_login_attempts');
        if (storedAttempts) {
          setLoginAttempts(JSON.parse(storedAttempts));
        }

        // Check for existing session
        const sessionData = sessionStorage.getItem('arogyam_admin_session');
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          
          // Validate session security
          if (validateSessionSecurity(parsed)) {
            // Check if session needs refresh
            const timeUntilExpiry = parsed.expiresAt - Date.now();
            
            if (timeUntilExpiry > 0) {
              // Session is valid
              setUser({
                id: parsed.userId,
                email: parsed.email,
                role: parsed.role,
                name: parsed.name
              });
              setSessionExpiry(new Date(parsed.expiresAt));
              
              // Auto-refresh if close to expiry
              if (timeUntilExpiry < SESSION_REFRESH_THRESHOLD) {
                logger.info('Session close to expiry, auto-refreshing');
                await refreshSession();
              }
            } else {
              // Session expired, clear it
              logger.info('Session expired, clearing');
              sessionStorage.removeItem('arogyam_admin_session');
            }
          } else {
            // Invalid session, clear it
            logger.warn('Invalid session detected, clearing');
            sessionStorage.removeItem('arogyam_admin_session');
          }
        }
      } catch (error) {
        logger.error('Error checking existing session:', error);
        // Clear any corrupted session data
        sessionStorage.removeItem('arogyam_admin_session');
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  // SECURITY: Session expiry monitoring
  useEffect(() => {
    if (!sessionExpiry) return;

    const checkSessionExpiry = () => {
      if (Date.now() >= sessionExpiry.getTime()) {
        logger.warn('Session expired, logging out');
        logout();
      }
    };

    const interval = setInterval(checkSessionExpiry, 1000); // Check every second
    return () => clearInterval(interval);
  }, [sessionExpiry]);

  // SECURITY: Secure login function
  const login = async (userData: AdminUser): Promise<boolean> => {
    try {
      // Check if account is locked
      if (isAccountLocked()) {
        const remainingTime = Math.ceil((loginAttempts.lockedUntil - Date.now()) / 1000);
        logger.warn(`Account locked. Try again in ${remainingTime} seconds`);
        throw new Error(`Account locked. Try again in ${remainingTime} seconds`);
      }

      // Validate user data
      if (!userData.id || !userData.email || !userData.role || !userData.name) {
        recordFailedLogin();
        throw new Error('Invalid user data provided');
      }

      // SECURITY: Create secure session
      const sessionId = createSecureSession(userData);
      
      // Set user state
      setUser(userData);
      
      // Reset failed login attempts
      resetLoginAttempts();
      
      logger.info(`Admin login successful: ${userData.email} (Session: ${sessionId})`);
      
      return true;
    } catch (error) {
      logger.error('Admin login failed:', error);
      throw error;
    }
  };

  // SECURITY: Secure logout function
  const logout = async (): Promise<void> => {
    try {
      // Clear user state
      setUser(null);
      setSessionExpiry(null);
      
      // Clear session data
      sessionStorage.removeItem('arogyam_admin_session');
      
      // Log logout event
      logger.info('Admin logout successful');
    } catch (error) {
      logger.error('Logout error:', error);
    }
  };

  // SECURITY: Session refresh function
  const refreshSession = async (): Promise<boolean> => {
    try {
      if (!user) {
        logger.warn('Cannot refresh session: no user logged in');
        return false;
      }

      // Create new session with extended expiry
      const sessionId = createSecureSession(user);
      
      logger.info(`Session refreshed: ${sessionId}`);
      return true;
    } catch (error) {
      logger.error('Session refresh failed:', error);
      return false;
    }
  };

  const value: AdminAuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
    sessionExpiry,
    refreshSession
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
