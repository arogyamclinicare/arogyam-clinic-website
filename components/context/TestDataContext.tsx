import React, { createContext, useContext, useState } from 'react';

// Test data interfaces
interface TestPatient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  address: string;
  created_at: string;
}

interface TestConsultation {
  id: string;
  patient_id: string;
  consultation_type: string;
  treatment_type: string;
  condition: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  notes: string;
  created_at: string;
  patient?: TestPatient;
}

interface TestDataContextType {
  patients: TestPatient[];
  consultations: TestConsultation[];
  addPatient: (patient: Omit<TestPatient, 'id' | 'created_at'>) => void;
  addConsultation: (consultation: Omit<TestConsultation, 'id' | 'created_at'>) => void;
  updateConsultationStatus: (id: string, status: string) => void;
  deletePatient: (id: string) => void;
  loading: boolean;
}

const TestDataContext = createContext<TestDataContextType | undefined>(undefined);

export function TestDataProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<TestPatient[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91 98765 43210',
      age: 35,
      gender: 'male',
      address: '123 Main Street, Delhi',
      created_at: '2025-01-20T10:00:00Z'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+91 98765 43211',
      age: 28,
      gender: 'female',
      address: '456 Park Avenue, Mumbai',
      created_at: '2025-01-21T11:00:00Z'
    }
  ]);

  const [consultations, setConsultations] = useState<TestConsultation[]>([
    {
      id: '1',
      patient_id: '1',
      consultation_type: 'video',
      treatment_type: 'General Consultation',
      condition: 'Fever and cold symptoms',
      preferred_date: '2025-01-25',
      preferred_time: '10:00:00',
      status: 'pending',
      notes: 'Patient experiencing fever for 2 days',
      created_at: '2025-01-22T09:00:00Z',
      patient: patients[0]
    },
    {
      id: '2',
      patient_id: '2',
      consultation_type: 'phone',
      treatment_type: 'Follow-up Consultation',
      condition: 'Diabetes management',
      preferred_date: '2025-01-26',
      preferred_time: '14:00:00',
      status: 'confirmed',
      notes: 'Regular diabetes checkup',
      created_at: '2025-01-22T10:00:00Z',
      patient: patients[1]
    }
  ]);

  const addPatient = (patientData: Omit<TestPatient, 'id' | 'created_at'>) => {
    const newPatient: TestPatient = {
      ...patientData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const addConsultation = (consultationData: Omit<TestConsultation, 'id' | 'created_at'>) => {
    const patient = patients.find(p => p.id === consultationData.patient_id);
    const newConsultation: TestConsultation = {
      ...consultationData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      patient
    };
    setConsultations(prev => [...prev, newConsultation]);
  };

  const updateConsultationStatus = (id: string, status: string) => {
    setConsultations(prev => 
      prev.map(c => c.id === id ? { ...c, status } : c)
    );
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    setConsultations(prev => prev.filter(c => c.patient_id !== id));
  };

  const value: TestDataContextType = {
    patients,
    consultations,
    addPatient,
    addConsultation,
    updateConsultationStatus,
    deletePatient,
    loading: false
  };

  return (
    <TestDataContext.Provider value={value}>
      {children}
    </TestDataContext.Provider>
  );
}

export function useTestData() {
  const context = useContext(TestDataContext);
  if (context === undefined) {
    throw new Error('useTestData must be used within a TestDataProvider');
  }
  return context;
}
