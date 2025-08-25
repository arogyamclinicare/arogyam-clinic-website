/**
 * Consultation booking related TypeScript interfaces
 * Following best practices: interfaces over types, descriptive naming
 */

export interface ConsultationBookingData {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly age: string;
  readonly gender: string;
  readonly condition: string;
  readonly preferredDate: string;
  readonly preferredTime: string;
  readonly consultationType: ConsultationType;
  readonly treatmentType: string;
}

export interface ConsultationBookingProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly treatmentType?: string;
}

export interface ConsultationContextState {
  readonly isBookingOpen: boolean;
  readonly treatmentType: string;
  readonly openBooking: (treatmentType?: string) => void;
  readonly closeBooking: () => void;
}

export interface ConsultationValidationErrors {
  readonly name?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly age?: string;
  readonly condition?: string;
  readonly preferredDate?: string;
  readonly preferredTime?: string;
}

// Using maps instead of enums as recommended
export const CONSULTATION_TYPES = {
  video: 'video',
  phone: 'phone',
} as const;

export type ConsultationType = typeof CONSULTATION_TYPES[keyof typeof CONSULTATION_TYPES];

export const CONSULTATION_STEPS = {
  booking: 'booking',
  confirmation: 'confirmation',
} as const;

export type ConsultationStep = typeof CONSULTATION_STEPS[keyof typeof CONSULTATION_STEPS];

// Time slots as a constant map
export const TIME_SLOTS = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
  '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM'
] as const;

export type TimeSlot = typeof TIME_SLOTS[number];
