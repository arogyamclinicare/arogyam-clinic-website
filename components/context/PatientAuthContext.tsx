import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { verifySimplePassword } from '../../lib/auth';

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
}

const PatientAuthContext = createContext<PatientAuthContextType | undefined>(undefined);

export function PatientAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PatientUser | null>(null);
  const [loading, setLoading] = useState(false);

  // Patient login function - using patient_id and password
  const login = async (patientId: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      console.log('🚀 Login attempt started');
      console.log('📝 Login credentials:', { patientId, password: password.substring(0, 3) + '***' });
      
      // Input validation
      if (!patientId || !password) {
        console.log('❌ Missing credentials');
        return { success: false, error: 'Patient ID and password are required' };
      }

      // Find the patient by patient_id
      console.log('🔍 Searching for patient in database...');
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('patient_id', patientId)
        .single();

      console.log('📊 Database query result:', { 
        patientData: patientData ? { 
          ...patientData, 
          password: patientData.password ? `${patientData.password.substring(0, 10)}...` : 'null' 
        } : null, 
        patientError 
      });

      if (patientError) {
        console.error('❌ Database error:', patientError);
        if (patientError.code === 'PGRST116') {
          return { success: false, error: 'Invalid Patient ID or Password' };
        }
        return { success: false, error: 'Login failed. Please try again.' };
      }

      if (!patientData) {
        console.log('❌ No patient found with this ID');
        return { success: false, error: 'Invalid Patient ID or Password' };
      }

      console.log('✅ Patient found:', { 
        id: patientData.id, 
        name: patientData.name, 
        patient_id: patientData.patient_id,
        hasPassword: !!patientData.password,
        passwordLength: patientData.password?.length || 0
      });

      // Verify password securely
      console.log('🔐 Starting password verification...');
      const isPasswordValid = verifySimplePassword(password, patientData.password);
      console.log('🔐 Password verification result:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('❌ Password verification failed');
        return { success: false, error: 'Invalid Patient ID or Password' };
      }

      console.log('✅ Password verified successfully');

      // Set the user data
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
      
      setUser(patientUser);
      console.log('✅ User set successfully:', patientUser);
      return { success: true };
    } catch (error: any) {
      console.error('💥 Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // Patient logout function - simple logout
  const logout = async (): Promise<void> => {
    try {
      setUser(null); // Just clear the user state
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: PatientAuthContextType = {
    user,
    isAuthenticated: !!user,
    isPatient: user?.role === 'patient',
    login,
    logout,
    loading
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
