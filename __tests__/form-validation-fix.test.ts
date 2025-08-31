import { consultationBookingSchema } from '../lib/validation';

describe('Form Validation Fix - Real User Data', () => {
  it('should accept the exact data the user mentioned', () => {
    // Get tomorrow's date for the test
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      age: '33',
      gender: 'male',
      condition: 'General consultation',
      preferred_date: tomorrowStr,
      preferred_time: '10:00 AM',
      consultation_type: 'video',
      treatment_type: 'General Consultation'
    };

    const result = consultationBookingSchema.safeParse(userData);
    
    if (!result.success) {
      console.log('Validation failed with errors:', result.error.issues);
    }
    
    expect(result.success).toBe(true);
  });

  it('should accept name with spaces', () => {
    const data = {
      name: 'John Doe Smith',
      email: 'john@example.com',
      phone: '1234567890',
      age: '33',
      gender: 'male',
      condition: 'General consultation',
      preferred_date: '2025-12-31',
      preferred_time: '10:00 AM',
      consultation_type: 'video',
      treatment_type: 'General Consultation'
    };

    const result = consultationBookingSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should accept age as string', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      age: '33',
      gender: 'male',
      condition: 'General consultation',
      preferred_date: '2025-12-31',
      preferred_time: '10:00 AM',
      consultation_type: 'video',
      treatment_type: 'General Consultation'
    };

    const result = consultationBookingSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should accept various phone formats', () => {
    const phoneNumbers = ['1234567890', '+91 1234567890', '(123) 456-7890'];
    
    phoneNumbers.forEach(phone => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: phone,
        age: '33',
        gender: 'male',
        condition: 'General consultation',
        preferred_date: '2025-12-31',
        preferred_time: '10:00 AM',
        consultation_type: 'video',
        treatment_type: 'General Consultation'
      };

      const result = consultationBookingSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
