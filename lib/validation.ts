import { z } from 'zod';

// Common validation patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[a-zA-Z\s]{2,50}$/; // Letters and spaces only, 2-50 chars

// Base consultation schema
export const consultationBaseSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(nameRegex, 'Name can only contain letters and spaces'),
  
  email: z.string()
    .min(0, 'Email cannot be negative')
    .transform(val => val.toLowerCase().trim())
    .refine(val => val === '' || emailRegex.test(val), 'Please enter a valid email address or leave empty'),
  
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number too long')
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, 'Please enter a valid phone number')
    .transform(val => val.replace(/\s/g, '')),
  
  age: z.coerce.number()
    .int('Age must be a whole number')
    .min(1, 'Age must be at least 1')
    .max(120, 'Age must be less than 120'),
  
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Please select a valid gender' })
  }),
  
  condition: z.string()
    .max(500, 'Condition description too long (max 500 characters)')
    .optional()
    .nullable(),
  
  preferred_date: z.string()
    .min(1, 'Please select a preferred date')
    .refine(date => {
      try {
        const selectedDate = new Date(date + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Allow today and future dates
        return selectedDate >= today;
      } catch (error) {
        return false;
      }
    }, 'Preferred date must be today or in the future'),
  
  preferred_time: z.string()
    .min(1, 'Please select a preferred time'),
  
  consultation_type: z.enum(['video', 'phone'], {
    errorMap: () => ({ message: 'Please select consultation type' })
  }),
  
  treatment_type: z.string()
    .min(2, 'Treatment type must be at least 2 characters')
    .max(100, 'Treatment type too long')
});

// Consultation booking schema
export const consultationBookingSchema = consultationBaseSchema;

// Consultation update schema (for admin editing)
export const consultationUpdateSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(nameRegex, 'Name can only contain letters and spaces')
    .optional(),
  
  email: z.string()
    .email('Please enter a valid email address')
    .regex(emailRegex, 'Invalid email format')
    .optional()
    .transform(val => val?.toLowerCase().trim()),
  
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number too long')
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, 'Please enter a valid phone number')
    .optional()
    .transform(val => val?.replace(/\s/g, '')),
  
  age: z.coerce.number()
    .int('Age must be a whole number')
    .min(1, 'Age must be at least 1')
    .max(120, 'Age must be less than 120')
    .optional(),
  
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Please select a valid gender' })
  }).optional(),
  
  status: z.enum(['pending', 'in_progress', 'confirmed', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Please select a valid status' })
  }).optional(),
  
  condition: z.string()
    .max(500, 'Condition description too long (max 500 characters)')
    .optional()
    .nullable(),
  
  preferred_date: z.string()
    .min(1, 'Please select a preferred date')
    .optional()
    .transform(val => val?.trim() || null),
  
  preferred_time: z.string()
    .min(1, 'Please select a preferred time')
    .optional()
    .transform(val => val?.trim() || null),
  
  consultation_type: z.enum(['video', 'phone'], {
    errorMap: () => ({ message: 'Please select consultation type' })
  }).optional(),
  
  treatment_type: z.string()
    .min(2, 'Treatment type must be at least 2 characters')
    .max(100, 'Treatment type too long')
    .optional(),
  
  prescription: z.string()
    .max(1000, 'Prescription too long (max 1000 characters)')
    .optional()
    .nullable()
    .transform(val => val?.trim() || null),
  
  notes: z.string()
    .max(1000, 'Notes too long (max 1000 characters)')
    .optional()
    .nullable()
    .transform(val => val?.trim() || null),
  
  follow_up_date: z.string()
    .min(1, 'Please select a follow-up date')
    .optional()
    .nullable()
    .transform(val => val?.trim() || null),
  
  follow_up_notes: z.string()
    .max(1000, 'Follow-up notes too long (max 1000 characters)')
    .optional()
    .nullable()
    .transform(val => val?.trim() || null),
  
  treatment_plan: z.string()
    .max(1000, 'Treatment plan too long (max 1000 characters)')
    .optional()
    .nullable()
    .transform(val => val?.trim() || null),
  
  symptoms: z.string()
    .max(1000, 'Symptoms description too long (max 1000 characters)')
    .optional()
    .nullable()
    .transform(val => val?.trim() || null),
  
  diagnosis: z.string()
    .max(1000, 'Diagnosis too long (max 1000 characters)')
    .optional()
    .nullable()
    .transform(val => val?.trim() || null),
  
  medicines_prescribed: z.string()
    .max(1000, 'Medicines description too long (max 1000 characters)')
    .optional()
    .nullable()
    .transform(val => val?.trim() || null),
  
  dosage_instructions: z.string()
    .max(1000, 'Dosage instructions too long (max 1000 characters)')
    .optional()
    .nullable()
    .transform(val => val?.trim() || null),
  
  next_appointment_date: z.string()
    .min(1, 'Please select next appointment date')
    .optional()
    .nullable()
    .transform(val => val?.trim() || null),
  
  patient_concerns: z.string()
    .max(1000, 'Patient concerns too long (max 1000 characters)')
    .optional()
    .nullable()
    .transform(val => val?.trim() || null),
  
  doctor_observations: z.string()
    .max(1000, 'Doctor observations too long (max 1000 characters)')
    .optional()
    .nullable()
    .transform(val => val?.trim() || null)
});

// Patient login schema
export const patientLoginSchema = z.object({
  patientId: z.string()
    .min(1, 'Patient ID is required')
    .max(50, 'Patient ID too long')
    .transform(val => val.trim()),
  
  password: z.string()
    .min(1, 'Password is required')
    .max(100, 'Password too long')
});

// Admin login schema
export const adminLoginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .transform(val => val.toLowerCase().trim()),
  
  password: z.string()
    .min(1, 'Password is required')
});

// Input sanitization function - preserves spaces
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
};



// Validation error formatter
export const formatValidationErrors = (errors: z.ZodError): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};
  
  errors.errors.forEach(error => {
    const field = error.path.join('.');
    formattedErrors[field] = error.message;
  });
  
  return formattedErrors;
};
