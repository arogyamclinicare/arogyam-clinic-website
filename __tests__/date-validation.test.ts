import { consultationBookingSchema } from '../lib/validation';

describe('Date Validation Tests', () => {
  describe('Preferred Date Validation', () => {
    it('should accept today\'s date', () => {
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      const data = {
        name: 'John Doe',
        email: 'test@example.com',
        phone: '1234567890',
        age: '25',
        gender: 'male',
        condition: 'General consultation',
        preferred_date: today,
        preferred_time: '10:00 AM',
        consultation_type: 'video',
        treatment_type: 'General Consultation'
      };

      const result = consultationBookingSchema.safeParse(data);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.preferred_date).toBe(today);
      }
    });

    it('should accept tomorrow\'s date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      const data = {
        name: 'John Doe',
        email: 'test@example.com',
        phone: '1234567890',
        age: '25',
        gender: 'male',
        condition: 'General consultation',
        preferred_date: tomorrowStr,
        preferred_time: '10:00 AM',
        consultation_type: 'video',
        treatment_type: 'General Consultation'
      };

      const result = consultationBookingSchema.safeParse(data);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.preferred_date).toBe(tomorrowStr);
      }
    });

    it('should accept future date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7); // 1 week from now
      const futureDateStr = futureDate.toISOString().split('T')[0];
      
      const data = {
        name: 'John Doe',
        email: 'test@example.com',
        phone: '1234567890',
        age: '25',
        gender: 'male',
        condition: 'General consultation',
        preferred_date: futureDateStr,
        preferred_time: '10:00 AM',
        consultation_type: 'video',
        treatment_type: 'General Consultation'
      };

      const result = consultationBookingSchema.safeParse(data);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.preferred_date).toBe(futureDateStr);
      }
    });

    it('should reject yesterday\'s date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      const data = {
        name: 'John Doe',
        email: 'test@example.com',
        phone: '1234567890',
        age: '25',
        gender: 'male',
        condition: 'General consultation',
        preferred_date: yesterdayStr,
        preferred_time: '10:00 AM',
        consultation_type: 'video',
        treatment_type: 'General Consultation'
      };

      const result = consultationBookingSchema.safeParse(data);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const dateError = result.error.issues.find(issue => 
          issue.path.includes('preferred_date')
        );
        expect(dateError).toBeDefined();
        expect(dateError?.message).toBe('Preferred date must be today or in the future');
      }
    });

    it('should reject past date', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 30); // 1 month ago
      const pastDateStr = pastDate.toISOString().split('T')[0];
      
      const data = {
        name: 'John Doe',
        email: 'test@example.com',
        phone: '1234567890',
        age: '25',
        gender: 'male',
        condition: 'General consultation',
        preferred_date: pastDateStr,
        preferred_time: '10:00 AM',
        consultation_type: 'video',
        treatment_type: 'General Consultation'
      };

      const result = consultationBookingSchema.safeParse(data);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const dateError = result.error.issues.find(issue => 
          issue.path.includes('preferred_date')
        );
        expect(dateError).toBeDefined();
        expect(dateError?.message).toBe('Preferred date must be today or in the future');
      }
    });

    it('should handle edge case of midnight today', () => {
      const today = new Date().toISOString().split('T')[0];
      
      const data = {
        name: 'John Doe',
        email: 'test@example.com',
        phone: '1234567890',
        age: '25',
        gender: 'male',
        condition: 'General consultation',
        preferred_date: today,
        preferred_time: '12:00 AM',
        consultation_type: 'video',
        treatment_type: 'General Consultation'
      };

      const result = consultationBookingSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('Preferred Time Validation', () => {
    it('should accept valid time format', () => {
      const data = {
        name: 'John Doe',
        email: 'test@example.com',
        phone: '1234567890',
        age: '25',
        gender: 'male',
        condition: 'General consultation',
        preferred_date: new Date().toISOString().split('T')[0],
        preferred_time: '10:00 AM',
        consultation_type: 'video',
        treatment_type: 'General Consultation'
      };

      const result = consultationBookingSchema.safeParse(data);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.preferred_time).toBe('10:00 AM');
      }
    });

    it('should reject empty time', () => {
      const data = {
        name: 'John Doe',
        email: 'test@example.com',
        phone: '1234567890',
        age: '25',
        gender: 'male',
        condition: 'General consultation',
        preferred_date: new Date().toISOString().split('T')[0],
        preferred_time: '',
        consultation_type: 'video',
        treatment_type: 'General Consultation'
      };

      const result = consultationBookingSchema.safeParse(data);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const timeError = result.error.issues.find(issue => 
          issue.path.includes('preferred_time')
        );
        expect(timeError).toBeDefined();
        expect(timeError?.message).toBe('Please select a preferred time');
      }
    });
  });
});
