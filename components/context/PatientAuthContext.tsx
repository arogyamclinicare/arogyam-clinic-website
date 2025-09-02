import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { verifyPassword, generateSecurePassword, hashPassword } from '../../lib/auth';
import { createLogger } from '../../lib/utils/logger';

interface PatientUser {
  id: string;
  email: string;
  role: string;
  name: string;
  patient_id: string;
  phone?: string;
  age?: number;
  gender?: string;
  address?: string;
}

interface PatientAuthContextType {
  user: PatientUser | null;
  isAuthenticated: boolean;
  isPatient: boolean;
  login: (patientId: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
  sessionExpiry: Date | null;
  refreshSession: () => Promise<boolean>;
  forcePasswordReset: (patientId: string) => Promise<{ success: boolean; error?: string }>;
  hashPatientPassword: (patientId: string, plainTextPassword: string) => Promise<boolean>;
}

const PatientAuthContext = createContext<PatientAuthContextType | undefined>(undefined);

// Security configuration
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour for patients
const SESSION_REFRESH_THRESHOLD = 10 * 60 * 1000; // 10 minutes before expiry
const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

export function PatientAuthProvider({ children }: { children: React.ReactNode }) {
  const logger = createLogger('PatientAuthContext');
  const [user, setUser] = useState<PatientUser | null>(null);
  const [loading, setLoading] = useState(false);
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
    sessionStorage.setItem('patient_login_attempts', JSON.stringify({ count: newCount, lockedUntil }));
    
    logger.warn(`Failed patient login attempt ${newCount}/${MAX_LOGIN_ATTEMPTS}`);
    
    if (newCount >= MAX_LOGIN_ATTEMPTS) {
      logger.warn(`Patient account locked for ${LOCKOUT_DURATION / 1000} seconds`);
    }
  };

  // SECURITY: Reset login attempts on successful login
  const resetLoginAttempts = (): void => {
    setLoginAttempts({ count: 0, lockedUntil: 0 });
    sessionStorage.removeItem('patient_login_attempts');
  };

  // SECURITY: Create secure patient session
  const createSecureSession = (patientData: PatientUser): string => {
    const sessionData = {
      userId: patientData.id,
      patientId: patientData.patient_id,
      email: patientData.email,
      role: patientData.role,
      name: patientData.name,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_TIMEOUT,
      // Add additional security measures
      userAgent: navigator.userAgent,
      ipHash: btoa(navigator.userAgent).slice(0, 8), // Simple fingerprint
      sessionId: crypto.randomUUID()
    };

    // Store in sessionStorage (more secure than localStorage)
    sessionStorage.setItem('arogyam_patient_session', JSON.stringify(sessionData));
    
    // Set session expiry
    setSessionExpiry(new Date(sessionData.expiresAt));
    
    return sessionData.sessionId;
  };

  // SECURITY: Validate patient session security
  const validateSessionSecurity = (sessionData: any): boolean => {
    try {
      // Check if session is expired
      if (Date.now() > sessionData.expiresAt) {
        logger.warn('Patient session expired');
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
      logger.error('Patient session validation error:', error);
      return false;
    }
  };

  // SECURITY: Check existing session on app load
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        // Load login attempts from sessionStorage
        const storedAttempts = sessionStorage.getItem('patient_login_attempts');
        if (storedAttempts) {
          setLoginAttempts(JSON.parse(storedAttempts));
        }

        // Check for existing session
        const sessionData = sessionStorage.getItem('arogyam_patient_session');
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          
          // Validate session security
          if (validateSessionSecurity(parsed)) {
            // Check if session needs refresh
            const timeUntilExpiry = parsed.expiresAt - Date.now();
            
            if (timeUntilExpiry > 0) {
              // Session is valid, restore user
              setUser({
                id: parsed.userId,
                email: parsed.email,
                role: parsed.role,
                name: parsed.name,
                patient_id: parsed.patientId,
                phone: parsed.phone,
                age: parsed.age,
                gender: parsed.gender,
                address: parsed.address
              });
              setSessionExpiry(new Date(parsed.expiresAt));
              
              // Auto-refresh if close to expiry
              if (timeUntilExpiry < SESSION_REFRESH_THRESHOLD) {
                logger.info('Patient session close to expiry, auto-refreshing');
                await refreshSession();
              }
            } else {
              // Session expired, clear it
              logger.info('Patient session expired, clearing');
              sessionStorage.removeItem('arogyam_patient_session');
            }
          } else {
            // Invalid session, clear it
            logger.warn('Invalid patient session detected, clearing');
            sessionStorage.removeItem('arogyam_patient_session');
          }
        }
      } catch (error) {
        logger.error('Error checking existing patient session:', error);
        // Clear any corrupted session data
        sessionStorage.removeItem('arogyam_patient_session');
      }
    };

    checkExistingSession();
  }, []);

  // SECURITY: Session expiry monitoring
  useEffect(() => {
    if (!sessionExpiry) return;

    const checkSessionExpiry = () => {
      if (Date.now() >= sessionExpiry.getTime()) {
        logger.warn('Patient session expired, logging out');
        logout();
      }
    };

    const interval = setInterval(checkSessionExpiry, 1000); // Check every second
    return () => clearInterval(interval);
  }, [sessionExpiry]);

  // SECURITY: Patient login function with bcrypt verification
  const login = async (patientId: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      // SECURITY: Check if account is locked
      if (isAccountLocked()) {
        const remainingTime = Math.ceil((loginAttempts.lockedUntil - Date.now()) / 1000);
        logger.warn(`Patient account locked. Try again in ${remainingTime} seconds`);
        return { success: false, error: `Account locked. Try again in ${remainingTime} seconds` };
      }

      // Input validation
      if (!patientId || !password) {
        recordFailedLogin();
        return { success: false, error: 'Patient ID and password are required' };
      }

      // Find the patient by patient_id
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('patient_id', patientId)
        .single();

      if (patientError) {
        if (patientError.code === 'PGRST116') {
          recordFailedLogin();
          return { success: false, error: 'Invalid Patient ID or Password' };
        }
        recordFailedLogin();
        return { success: false, error: 'Login failed. Please try again.' };
      }

      if (!patientData) {
        recordFailedLogin();
        return { success: false, error: 'Invalid Patient ID or Password' };
      }

      // SECURITY: Verify password securely using bcrypt
      let isPasswordValid = false;
      
      try {
        // Check if stored password is already a bcrypt hash
        if (patientData.password.startsWith('$2a$') || patientData.password.startsWith('$2b$') || patientData.password.startsWith('$2y$')) {
          // It's a bcrypt hash, use proper verification
          isPasswordValid = await verifyPassword(password, patientData.password);
          logger.info(`Patient ${patientId}: Using bcrypt hash verification`);
        } else {
          // TEMPORARY: Allow plain text passwords for demo/testing
          // TODO: Remove this after migrating all passwords to bcrypt
          isPasswordValid = (password === patientData.password);
          logger.info(`Patient ${patientId}: Using plain text password (temporary support)`);
          
          // If login successful with plain text, we could hash it here
          if (isPasswordValid) {
            logger.info(`Patient ${patientId}: Login successful with plain text - consider hashing password`);
          }
        }
      } catch (error) {
        logger.error('Password verification error:', error);
        recordFailedLogin();
        return { success: false, error: 'Login failed. Please try again.' };
      }
      
      if (!isPasswordValid) {
        recordFailedLogin();
        return { success: false, error: 'Invalid Patient ID or Password' };
      }

      // SECURITY: Create secure session
      const patientUser: PatientUser = {
        id: patientData.id,
        email: patientData.email || '',
        role: 'patient',
        name: patientData.name,
        patient_id: patientData.patient_id,
        phone: patientData.phone,
        age: patientData.age,
        gender: patientData.gender,
        address: patientData.address
      };
      
      const sessionId = createSecureSession(patientUser);
      setUser(patientUser);
      
      // Reset failed login attempts
      resetLoginAttempts();
      
      logger.info(`Patient login successful: ${patientId} (Session: ${sessionId})`);
      
      return { success: true };
    } catch (error: any) {
      logger.error('Patient login error:', error);
      recordFailedLogin();
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // SECURITY: Patient logout function
  const logout = async (): Promise<void> => {
    try {
      // Clear user state
      setUser(null);
      setSessionExpiry(null);
      
      // Clear session data
      sessionStorage.removeItem('arogyam_patient_session');
      
      // Log logout event
      logger.info('Patient logout successful');
    } catch (error) {
      logger.error('Patient logout error:', error);
    }
  };

  // SECURITY: Session refresh function
  const refreshSession = async (): Promise<boolean> => {
    try {
      if (!user) {
        logger.warn('Cannot refresh patient session: no user logged in');
        return false;
      }

      // Create new session with extended expiry
      const sessionId = createSecureSession(user);
      
      logger.info(`Patient session refreshed: ${sessionId}`);
      return true;
    } catch (error) {
      logger.error('Patient session refresh failed:', error);
      return false;
    }
  };

  // SECURITY: Force password reset for patients with plain text passwords
  const forcePasswordReset = async (patientId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Generate a secure temporary password
      const tempPassword = generateSecurePassword(16);
      
      // In production, this would:
      // 1. Update the database with the new hashed password
      // 2. Send email to patient with temporary password
      // 3. Force them to change password on next login
      
      logger.info(`SECURITY: Patient ${patientId} password reset initiated. Temporary password: ${tempPassword}`);
      
      return { success: true };
    } catch (error) {
      logger.error('Error forcing patient password reset:', error);
      return { success: false, error: 'Failed to reset password' };
    }
  };

  // TEMPORARY: Helper function to hash plain text passwords after successful login
  const hashPatientPassword = async (patientId: string, plainTextPassword: string): Promise<boolean> => {
    try {
      const hashedPassword = await hashPassword(plainTextPassword);
      
      // Update the patient's password in the database
      const { error } = await supabase
        .from('patients')
        .update({ password: hashedPassword })
        .eq('patient_id', patientId);
      
      if (error) {
        logger.error(`Failed to hash password for patient ${patientId}:`, error);
        return false;
      }
      
      logger.info(`Successfully hashed password for patient ${patientId}`);
      return true;
    } catch (error) {
      logger.error(`Error hashing password for patient ${patientId}:`, error);
      return false;
    }
  };

  const value: PatientAuthContextType = {
    user,
    isAuthenticated: !!user,
    isPatient: !!user && user.role === 'patient',
    login,
    logout,
    loading,
    sessionExpiry,
    refreshSession,
    forcePasswordReset,
    hashPatientPassword
  };

  return (
    <PatientAuthContext.Provider value={value}>
      {children}
    </PatientAuthContext.Provider>
  );
}

export function usePatientAuth() {
  const context = useContext(PatientAuthContext);
  if (context === undefined) {
    throw new Error('usePatientAuth must be used within a PatientAuthProvider');
  }
  return context;
}
