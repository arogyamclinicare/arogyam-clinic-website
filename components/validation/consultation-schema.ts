/**
 * SUPER SIMPLE validation schema for basic clinic website
 * No fancy validation - just basic requirements
 */

import { z } from 'zod';
import { CONSULTATION_TYPES } from '../types/consultation';

// SUPER SIMPLE validation schema for basic clinic
export const consultationBookingSchema = z.object({
  name: z.string()
    .min(1, 'Name is required'),
  
  email: z.string().optional(), // Completely optional
  
  phone: z.string()
    .min(1, 'Phone number is required'),
  
  age: z.string().optional(), // Completely optional
  
  gender: z.string().optional(), // Completely optional
  
  condition: z.string().optional(), // Completely optional
  
  preferred_date: z.string()
    .min(1, 'Date is required'),
  
  preferred_time: z.string()
    .min(1, 'Time is required'),
  
  consultation_type: z.enum([CONSULTATION_TYPES.video, CONSULTATION_TYPES.phone] as const, {
    errorMap: () => ({ message: 'Please select consultation type' })
  }),
  
  treatment_type: z.string()
    .min(1, 'Treatment type is required')
});

export type ConsultationBookingFormData = z.infer<typeof consultationBookingSchema>;

// Helper function for form validation
export function validateConsultationBooking(data: unknown): {
  success: boolean;
  data?: ConsultationBookingFormData;
  errors?: Record<string, string>;
} {
  try {
    const result = consultationBookingSchema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      
      return { success: false, errors };
    }
    
    return { 
      success: false, 
      errors: { general: 'Validation failed. Please check your input.' }
    };
  }
}

// Utility function to get tomorrow's date in YYYY-MM-DD format
export function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}
