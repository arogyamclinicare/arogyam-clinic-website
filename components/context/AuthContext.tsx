import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Get admin credentials from environment variables
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  // Simple session check (temporary for testing)
  useEffect(() => {
    // Check if user is already logged in from localStorage
    const savedUser = localStorage.getItem('arogyam_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // Check if session hasn't expired
        const sessionTimeout = import.meta.env.VITE_SESSION_TIMEOUT || 3600000; // 1 hour default
        const sessionTime = localStorage.getItem('arogyam_session_time');
        
        if (sessionTime && (Date.now() - parseInt(sessionTime)) < sessionTimeout) {
          setUser(userData);
          setSession({ user: userData });
        } else {
          // Session expired, clear storage
          localStorage.removeItem('arogyam_user');
          localStorage.removeItem('arogyam_session_time');
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('arogyam_user');
        localStorage.removeItem('arogyam_session_time');
      }
    }
    setLoading(false);
  }, []);

  // Secure login function with environment variables
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validate input
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      // Check against environment variables
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const userData: AuthUser = {
          id: '1',
          email: ADMIN_EMAIL,
          role: 'admin',
          name: 'Dr. Kajal Kumari'
        };
        
        setUser(userData);
        setSession({ user: userData });
        
        // Store user data with session timestamp
        localStorage.setItem('arogyam_user', JSON.stringify(userData));
        localStorage.setItem('arogyam_session_time', Date.now().toString());
        
        return { success: true };
      } else {
        return { 
          success: false, 
          error: 'Invalid email or password. Please check your credentials.' 
        };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setUser(null);
    setSession(null);
    localStorage.removeItem('arogyam_user');
    localStorage.removeItem('arogyam_session_time');
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    loading,
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