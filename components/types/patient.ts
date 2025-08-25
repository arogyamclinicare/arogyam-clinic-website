/**
 * Patient portal related TypeScript interfaces
 */

export interface PatientUser {
  readonly id: number;
  readonly email: string;
  readonly password: string;
  readonly name: string;
  readonly phone: string;
  readonly age: number;
  readonly gender: string;
  readonly address: string;
  readonly joinDate: string;
}

export interface PatientFormData {
  readonly email: string;
  readonly password: string;
  readonly name: string;
  readonly phone: string;
  readonly age: string;
  readonly gender: string;
  readonly address: string;
}

export interface PatientConsultation {
  readonly id: number;
  readonly date: string;
  readonly time: string;
  readonly type: string;
  readonly doctor: string;
  readonly status: PatientConsultationStatus;
  readonly symptoms: string;
  readonly prescription?: string;
  readonly followUpDate?: string;
}

// Using maps instead of enums
export const PATIENT_CONSULTATION_STATUS = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
} as const;

export type PatientConsultationStatus = typeof PATIENT_CONSULTATION_STATUS[keyof typeof PATIENT_CONSULTATION_STATUS];

export const PATIENT_PORTAL_TABS = {
  dashboard: 'dashboard',
  consultations: 'consultations',
  profile: 'profile',
} as const;

export type PatientPortalTab = typeof PATIENT_PORTAL_TABS[keyof typeof PATIENT_PORTAL_TABS];
