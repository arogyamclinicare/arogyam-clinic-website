/**
 * Zod validation schemas for consultation booking
 * Following best practices: runtime validation, early error handling
 * UPDATED: More user-friendly validation for basic clinic website
 */

import { z } from 'zod';
import { CONSULTATION_TYPES, TIME_SLOTS } from '../types/consultation';

// Phone number validation - more flexible for basic clinic
const phoneSchema = z.string()
  .min(1, 'Phone number is required')
  .refine(
    (val) => val.replace(/\D/g, '').length >= 10,
    'Please enter a valid phone number (at least 10 digits)'
  );

// Email validation schema - optional for basic clinic
const emailSchema = z.string()
  .optional()
  .refine(
    (val) => !val || /\S+@\S+.\S+/.test(val),
    'Please enter a valid email address'
  );

// Age validation schema - optional for basic clinic
const ageSchema = z.string()
  .optional()
  .refine(
    (val) => {
      if (!val || val.trim() === '') return true; // Allow empty
      const age = parseInt(val, 10);
      return !isNaN(age) && age >= 1 && age <= 120;
    },
    'Please enter a valid age between 1 and 120'
  );

// Date validation schema - must be future date
const dateSchema = z.string()
  .min(1, 'Date is required')
  .refine(
    (val) => {
      const selectedDate = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    },
    'Preferred date must be today or in the future'
  );

// Main consultation booking validation schema - UPDATED for basic clinic
export const consultationBookingSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .refine(
      (val) => /^[a-zA-Z\s\-'.]+$/.test(val),
      'Name can only contain letters, spaces, hyphens, apostrophes, and periods'
    ),
  
  email: emailSchema,
  
  phone: phoneSchema,
  
  age: ageSchema,
  
  gender: z.string()
    .optional()
    .refine(
      (val) => !val || ['male', 'female', 'other'].includes(val.toLowerCase()),
      'Please select a valid gender option'
    ),
  
  condition: z.string()
    .optional()
    .refine(
      (val) => !val || val.length >= 10,
      'Please provide more details about your condition (at least 10 characters)'
    )
    .refine(
      (val) => !val || val.length <= 1000,
      'Description is too long'
    ),
  
  preferred_date: dateSchema,
  
  preferred_time: z.enum(TIME_SLOTS as readonly [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a preferred time' })
  }),
  
  consultation_type: z.enum([CONSULTATION_TYPES.video, CONSULTATION_TYPES.phone] as const, {
    errorMap: () => ({ message: 'Please select a consultation type' })
  }),
  
  treatment_type: z.string().min(1, 'Treatment type is required')
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
      const errors: Record<string, string> = {
    // Empty block
  };
      
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
