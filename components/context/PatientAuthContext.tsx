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
      
      // Input validation
      if (!patientId || !password) {
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
          return { success: false, error: 'Invalid Patient ID or Password' };
        }
        return { success: false, error: 'Login failed. Please try again.' };
      }

      if (!patientData) {
        return { success: false, error: 'Invalid Patient ID or Password' };
      }

      // Verify password securely
      const isPasswordValid = verifySimplePassword(password, patientData.password);
      
      if (!isPasswordValid) {
        return { success: false, error: 'Invalid Patient ID or Password' };
      }

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
      return { success: true };
    } catch (error: any) {
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
