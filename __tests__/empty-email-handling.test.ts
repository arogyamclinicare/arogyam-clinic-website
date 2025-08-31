import { consultationBookingSchema } from '../lib/validation';

describe('Empty Email Handling Tests', () => {
  describe('Frontend Validation', () => {
    it('should accept empty email string', () => {
      const data = {
        name: 'John Doe',
        email: '',
        phone: '1234567890',
        age: '25',
        gender: 'male',
        condition: 'General consultation',
        preferred_date: '2025-12-31',
        preferred_time: '10:00 AM',
        consultation_type: 'video',
        treatment_type: 'General Consultation'
      };

      const result = consultationBookingSchema.safeParse(data);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.email).toBe(''); // Should remain empty
      }
    });

    it('should accept valid email', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        age: '25',
        gender: 'male',
        condition: 'General consultation',
        preferred_date: '2025-12-31',
        preferred_time: '10:00 AM',
        consultation_type: 'video',
        treatment_type: 'General Consultation'
      };

      const result = consultationBookingSchema.safeParse(data);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.email).toBe('john@example.com');
      }
    });

    it('should reject invalid email format', () => {
      const data = {
        name: 'John Doe',
        email: 'invalid-email',
        phone: '1234567890',
        age: '25',
        gender: 'male',
        condition: 'General consultation',
        preferred_date: '2025-12-31',
        preferred_time: '10:00 AM',
        consultation_type: 'video',
        treatment_type: 'General Consultation'
      };

      const result = consultationBookingSchema.safeParse(data);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('email'))).toBe(true);
      }
    });
  });

  describe('Data Transformation', () => {
    it('should transform email to lowercase and trim', () => {
      const data = {
        name: 'John Doe',
        email: '  JOHN@EXAMPLE.COM  ',
        phone: '1234567890',
        age: '25',
        gender: 'male',
        condition: 'General consultation',
        preferred_date: '2025-12-31',
        preferred_time: '10:00 AM',
        consultation_type: 'video',
        treatment_type: 'General Consultation'
      };

      const result = consultationBookingSchema.safeParse(data);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.email).toBe('john@example.com');
      }
    });

    it('should handle empty email with whitespace', () => {
      const data = {
        name: 'John Doe',
        email: '   ',
        phone: '1234567890',
        age: '25',
        gender: 'male',
        condition: 'General consultation',
        preferred_date: '2025-12-31',
        preferred_time: '10:00 AM',
        consultation_type: 'video',
        treatment_type: 'General Consultation'
      };

      const result = consultationBookingSchema.safeParse(data);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.email).toBe('');
      }
    });
  });

  describe('Database Submission Preparation', () => {
    it('should prepare data correctly for empty email', () => {
      // Simulate the data preparation logic from ConsultationBooking.tsx
      const formData = {
        name: 'John Doe',
        email: '',
        phone: '1234567890',
        age: '25',
        gender: 'male',
        condition: 'General consultation',
        preferredDate: '2025-12-31',
        preferredTime: '10:00 AM',
        consultationType: 'video' as const,
        treatmentType: 'General Consultation'
      };

      // This simulates the actual logic in your component
      const consultationData = {
        name: formData.name.trim(),
        email: formData.email.trim() || 'no email provided',
        phone: formData.phone.replace(/\s/g, ''),
        age: parseInt(formData.age),
        gender: formData.gender,
        condition: formData.condition.trim() || null,
        preferred_date: formData.preferredDate,
        preferred_time: formData.preferredTime,
        consultation_type: formData.consultationType,
        treatment_type: formData.treatmentType.trim(),
        status: 'pending'
      };

      expect(consultationData.email).toBe('no email provided');
      expect(consultationData.name).toBe('John Doe');
      expect(consultationData.phone).toBe('1234567890');
    });

    it('should prepare data correctly for valid email', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        age: '25',
        gender: 'male',
        condition: 'General consultation',
        preferredDate: '2025-12-31',
        preferredTime: '10:00 AM',
        consultationType: 'video' as const,
        treatmentType: 'General Consultation'
      };

      const consultationData = {
        name: formData.name.trim(),
        email: formData.email.trim() || 'no email provided',
        phone: formData.phone.replace(/\s/g, ''),
        age: parseInt(formData.age),
        gender: formData.gender,
        condition: formData.condition.trim() || null,
        preferred_date: formData.preferredDate,
        preferred_time: formData.preferredTime,
        consultation_type: formData.consultationType,
        treatment_type: formData.treatmentType.trim(),
        status: 'pending'
      };

      expect(consultationData.email).toBe('john@example.com');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null email gracefully', () => {
      const data = {
        name: 'John Doe',
        email: null as any,
        phone: '1234567890',
        age: '25',
        gender: 'male',
        condition: 'General consultation',
        preferred_date: '2025-12-31',
        preferred_time: '10:00 AM',
        consultation_type: 'video',
        treatment_type: 'General Consultation'
      };

      const result = consultationBookingSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should handle undefined email gracefully', () => {
      const data = {
        name: 'John Doe',
        email: undefined as any,
        phone: '1234567890',
        age: '25',
        gender: 'male',
        condition: 'General consultation',
        preferred_date: '2025-12-31',
        preferred_time: '10:00 AM',
        consultation_type: 'video',
        treatment_type: 'General Consultation'
      };

      const result = consultationBookingSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
