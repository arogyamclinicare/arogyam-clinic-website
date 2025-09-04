import { consultationBookingSchema } from '../lib/validation';

describe('Consultation Form Validation Debug', () => {
  test('should validate complete form data correctly', () => {
    // Use a future date (tomorrow + 1 day)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const futureDate = tomorrow.toISOString().split('T')[0];

    const validFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      age: '25',
      gender: 'male' as const,
      condition: 'Headache',
      preferred_date: futureDate,
      preferred_time: '10:00 AM',
      consultation_type: 'video' as const,
      treatment_type: 'General Consultation'
    };

    const result = consultationBookingSchema.safeParse(validFormData);
    
    if (!result.success) {
      console.error('Validation failed:', result.error.errors);
    }
    
    expect(result.success).toBe(true);
  });

  test('should validate time selection correctly', () => {
    // Use a future date (tomorrow + 1 day)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const futureDate = tomorrow.toISOString().split('T')[0];

    const formDataWithTime = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+1234567890',
      age: '30',
      gender: 'female' as const,
      condition: 'Back pain',
      preferred_date: futureDate,
      preferred_time: '02:00 PM', // This should be valid
      consultation_type: 'phone' as const,
      treatment_type: 'General Consultation'
    };

    const result = consultationBookingSchema.safeParse(formDataWithTime);
    
    if (!result.success) {
      console.error('Time validation failed:', result.error.errors);
    }
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.preferred_time).toBe('02:00 PM');
    }
  });

  test('should reject empty time selection', () => {
    // Use a future date (tomorrow + 1 day)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const futureDate = tomorrow.toISOString().split('T')[0];

    const formDataWithoutTime = {
      name: 'Bob Smith',
      email: 'bob@example.com',
      phone: '+1234567890',
      age: '35',
      gender: 'male' as const,
      condition: 'Fever',
      preferred_date: futureDate,
      preferred_time: '', // Empty time should fail validation
      consultation_type: 'video' as const,
      treatment_type: 'General Consultation'
    };

    const result = consultationBookingSchema.safeParse(formDataWithoutTime);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      const timeError = result.error.errors.find(err => 
        err.path.includes('preferred_time')
      );
      expect(timeError).toBeDefined();
      expect(timeError?.message).toContain('Please select a preferred time');
    }
  });

  test('should validate date format correctly', () => {
    // Use a future date (tomorrow + 1 day)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const futureDate = tomorrow.toISOString().split('T')[0];

    const formDataWithDate = {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1234567890',
      age: '28',
      gender: 'female' as const,
      condition: 'Insomnia',
      preferred_date: futureDate, // Valid date format
      preferred_time: '06:00 PM',
      consultation_type: 'video' as const,
      treatment_type: 'General Consultation'
    };

    const result = consultationBookingSchema.safeParse(formDataWithDate);
    
    if (!result.success) {
      console.error('Date validation failed:', result.error.errors);
    }
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.preferred_date).toBe(futureDate);
    }
  });

  test('should reject past dates', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const pastDate = yesterday.toISOString().split('T')[0];

    const formDataWithPastDate = {
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      phone: '+1234567890',
      age: '40',
      gender: 'male' as const,
      condition: 'Cough',
      preferred_date: pastDate, // Past date should fail validation
      preferred_time: '10:00 AM',
      consultation_type: 'phone' as const,
      treatment_type: 'General Consultation'
    };

    const result = consultationBookingSchema.safeParse(formDataWithPastDate);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      const dateError = result.error.errors.find(err => 
        err.path.includes('preferred_date')
      );
      expect(dateError).toBeDefined();
              expect(dateError?.message).toContain('Preferred date must be today or in the future');
    }
  });
});
