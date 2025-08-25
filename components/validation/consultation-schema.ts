/**
 * Zod validation schemas for consultation booking
 * Following best practices: runtime validation, early error handling
 */

import { z } from 'zod';
import { CONSULTATION_TYPES, TIME_SLOTS } from '../types/consultation';

// Phone number validation (Indian format)
const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

// Email validation schema
const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(254, 'Email is too long');

// Phone validation schema
const phoneSchema = z.string()
  .min(1, 'Phone number is required')
  .regex(phoneRegex, 'Please enter a valid phone number')
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number is too long');

// Age validation schema
const ageSchema = z.string()
  .min(1, 'Age is required')
  .refine(
    (val) => {
      const age = parseInt(val, 10);
      return !isNaN(age) && age >= 1 && age <= 120;
    },
    'Please enter a valid age between 1 and 120'
  );

// Date validation schema (must be future date)
const dateSchema = z.string()
  .min(1, 'Date is required')
  .refine(
    (val) => {
      const selectedDate = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    },
    'Please select a future date'
  );

// Main consultation booking validation schema
export const consultationBookingSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  
  email: emailSchema,
  
  phone: phoneSchema,
  
  age: ageSchema,
  
  gender: z.string()
    .min(1, 'Please select your gender'),
  
  condition: z.string()
    .min(1, 'Please describe your condition')
    .min(10, 'Please provide more details about your condition')
    .max(1000, 'Description is too long'),
  
  preferredDate: dateSchema,
  
  preferredTime: z.enum(TIME_SLOTS as readonly [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a valid time slot' })
  }),
  
  consultationType: z.enum([CONSULTATION_TYPES.video, CONSULTATION_TYPES.phone] as const, {
    errorMap: () => ({ message: 'Please select a consultation type' })
  }),
  
  treatmentType: z.string().min(1, 'Treatment type is required')
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
