import { 
  consultationUpdateSchema, 
  validateServiceCombination, 
  validateAssociatedSegments 
} from '../lib/validation';

describe('Services Section - Core Validation Tests', () => {
  
  describe('Zod Schema Validation', () => {
    
    describe('Service Type Validation', () => {
      it('should accept valid service types', () => {
        const validData = {
          service_type: 'homeopathy',
          segment: 'allergy',
          sub_segment: 'allergic_rhinitis'
        };
        
        const result = consultationUpdateSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should accept aesthetics service type', () => {
        const validData = {
          service_type: 'aesthetics',
          segment: 'ai_skin_pro',
          sub_segment: 'acne'
        };
        
        const result = consultationUpdateSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject invalid service type', () => {
        const invalidData = {
          service_type: 'invalid_service',
          segment: 'allergy'
        };
        
        const result = consultationUpdateSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toContain('valid service type');
        }
      });
    });

    describe('Segment Validation', () => {
      it('should accept valid segment names', () => {
        const validData = {
          service_type: 'homeopathy',
          segment: 'cardiovascular',
          sub_segment: 'hypertension'
        };
        
        const result = consultationUpdateSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject segment names longer than 100 characters', () => {
        const longSegment = 'a'.repeat(101);
        const invalidData = {
          service_type: 'homeopathy',
          segment: longSegment
        };
        
        const result = consultationUpdateSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toContain('too long');
        }
      });
    });

    describe('Sub-Segment Validation', () => {
      it('should accept valid sub-segment names', () => {
        const validData = {
          service_type: 'homeopathy',
          segment: 'hair',
          sub_segment: 'androgenetic_alopecia_female'
        };
        
        const result = consultationUpdateSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject sub-segment names longer than 100 characters', () => {
        const longSubSegment = 'b'.repeat(101);
        const invalidData = {
          service_type: 'homeopathy',
          segment: 'hair',
          sub_segment: longSubSegment
        };
        
        const result = consultationUpdateSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toContain('too long');
        }
      });
    });

    describe('Sub-Sub-Segment Text Validation', () => {
      it('should accept valid sub-sub-segment text', () => {
        const validData = {
          service_type: 'homeopathy',
          segment: 'skin',
          sub_segment: 'acne',
          sub_sub_segment_text: 'Detailed description of the skin condition'
        };
        
        const result = consultationUpdateSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject text longer than 500 characters', () => {
        const longText = 'c'.repeat(501);
        const invalidData = {
          service_type: 'homeopathy',
          segment: 'skin',
          sub_sub_segment_text: longText
        };
        
        const result = consultationUpdateSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toContain('too long');
        }
      });

      it('should accept empty string and convert to null', () => {
        const validData = {
          service_type: 'homeopathy',
          segment: 'skin',
          sub_sub_segment_text: ''
        };
        
        const result = consultationUpdateSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.sub_sub_segment_text).toBeNull();
        }
      });
    });

    describe('Case Type Validation', () => {
      it('should accept valid case types', () => {
        const validCaseTypes = ['difficult_case', 'normal_case', 'rare_difficult_case', 'rare_case'];
        
        validCaseTypes.forEach(caseType => {
          const validData = {
            service_type: 'homeopathy',
            case_type: caseType
          };
          
          const result = consultationUpdateSchema.safeParse(validData);
          expect(result.success).toBe(true);
        });
      });

      it('should accept empty string and convert to null', () => {
        const validData = {
          service_type: 'homeopathy',
          case_type: ''
        };
        
        const result = consultationUpdateSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.case_type).toBeNull();
        }
      });

      it('should reject invalid case type', () => {
        const invalidData = {
          service_type: 'homeopathy',
          case_type: 'invalid_case'
        };
        
        const result = consultationUpdateSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toContain('valid case type');
        }
      });
    });

    describe('Remarks Validation', () => {
      it('should accept valid remarks', () => {
        const validData = {
          service_type: 'homeopathy',
          remarks: 'Patient shows significant improvement after 2 weeks of treatment'
        };
        
        const result = consultationUpdateSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject remarks longer than 1000 characters', () => {
        const longRemarks = 'd'.repeat(1001);
        const invalidData = {
          service_type: 'homeopathy',
          remarks: longRemarks
        };
        
        const result = consultationUpdateSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toContain('too long');
        }
      });
    });

    describe('Manual Case Type Validation', () => {
      it('should accept valid manual case type', () => {
        const validData = {
          service_type: 'homeopathy',
          manual_case_type: 'Complex autoimmune condition with multiple symptoms'
        };
        
        const result = consultationUpdateSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject manual case type longer than 200 characters', () => {
        const longManualCaseType = 'e'.repeat(201);
        const invalidData = {
          service_type: 'homeopathy',
          manual_case_type: longManualCaseType
        };
        
        const result = consultationUpdateSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toContain('too long');
        }
      });
    });

    describe('Associated Segments Validation', () => {
      it('should accept valid associated segments array', () => {
        const validData = {
          service_type: 'homeopathy',
          associated_segments: ['allergy', 'respiratory', 'skin']
        };
        
        const result = consultationUpdateSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject array with more than 20 segments', () => {
        const manySegments = Array.from({ length: 21 }, (_, i) => `segment_${i}`);
        const invalidData = {
          service_type: 'homeopathy',
          associated_segments: manySegments
        };
        
        const result = consultationUpdateSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toContain('Too many associated segments');
        }
      });

      it('should accept empty array and convert to null', () => {
        const validData = {
          service_type: 'homeopathy',
          associated_segments: []
        };
        
        const result = consultationUpdateSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.associated_segments).toBeNull();
        }
      });

      it('should accept null associated segments', () => {
        const validData = {
          service_type: 'homeopathy',
          associated_segments: null
        };
        
        const result = consultationUpdateSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Service Combination Validation', () => {
    
    it('should validate when segment is selected without service type', () => {
      const invalidData = {
        segment: 'allergy',
        sub_segment: 'asthma'
      };
      
      const errors = validateServiceCombination(invalidData);
      expect(errors).toContain('Service type is required when segment is selected');
    });

    it('should validate when sub-segment is selected without service type', () => {
      const invalidData = {
        sub_segment: 'asthma'
      };
      
      const errors = validateServiceCombination(invalidData);
      expect(errors).toContain('Service type and segment are required when sub-segment is selected');
    });

    it('should validate when sub-segment is selected without segment', () => {
      const invalidData = {
        service_type: 'homeopathy',
        sub_segment: 'asthma'
      };
      
      const errors = validateServiceCombination(invalidData);
      expect(errors).toContain('Service type and segment are required when sub-segment is selected');
    });

    it('should pass validation with complete service hierarchy', () => {
      const validData = {
        service_type: 'homeopathy',
        segment: 'allergy',
        sub_segment: 'asthma'
      };
      
      const errors = validateServiceCombination(validData);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with only service type', () => {
      const validData = {
        service_type: 'homeopathy'
      };
      
      const errors = validateServiceCombination(validData);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Associated Segments Validation', () => {
    
    it('should validate array length limit', () => {
      const manySegments = Array.from({ length: 21 }, (_, i) => `segment_${i}`);
      const errors = validateAssociatedSegments(manySegments);
      expect(errors).toContain('Too many associated segments (maximum 20 allowed)');
    });

    it('should detect duplicate segments', () => {
      const duplicateSegments = ['allergy', 'respiratory', 'allergy'];
      const errors = validateAssociatedSegments(duplicateSegments);
      expect(errors).toContain('Duplicate associated segments are not allowed');
    });

    it('should validate individual segment length', () => {
      const longSegment = 'f'.repeat(101);
      const segments = ['allergy', longSegment, 'respiratory'];
      const errors = validateAssociatedSegments(segments);
      expect(errors).toContain('Associated segment at position 2 is too long (max 100 characters)');
    });

    it('should validate empty segment values', () => {
      const segments = ['allergy', '', 'respiratory'];
      const errors = validateAssociatedSegments(segments);
      expect(errors).toContain('Invalid associated segment at position 2');
    });

    it('should pass validation with valid segments', () => {
      const validSegments = ['allergy', 'respiratory', 'skin'];
      const errors = validateAssociatedSegments(validSegments);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with null input', () => {
      const errors = validateAssociatedSegments(null);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with undefined input', () => {
      const errors = validateAssociatedSegments(undefined);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with empty array', () => {
      const errors = validateAssociatedSegments([]);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Integration Tests', () => {
    
    it('should validate complete service data structure', () => {
      const completeServiceData = {
        service_type: 'homeopathy',
        segment: 'allergy',
        sub_segment: 'asthma',
        sub_sub_segment_text: 'Patient has severe asthma attacks triggered by pollen',
        case_type: 'difficult_case',
        remarks: 'Requires careful monitoring and gradual treatment approach',
        manual_case_type: 'Complex allergic asthma with multiple triggers',
        associated_segments: ['respiratory', 'immunological', 'environmental']
      };
      
      const result = consultationUpdateSchema.safeParse(completeServiceData);
      expect(result.success).toBe(true);
      
      if (result.success) {
        const data = result.data;
        expect(data.service_type).toBe('homeopathy');
        expect(data.segment).toBe('allergy');
        expect(data.sub_segment).toBe('asthma');
        expect(data.case_type).toBe('difficult_case');
        expect(data.associated_segments).toEqual(['respiratory', 'immunological', 'environmental']);
      }
    });

    it('should validate aesthetics service data structure', () => {
      const aestheticsData = {
        service_type: 'aesthetics',
        segment: 'ai_skin_pro',
        sub_segment: 'acne',
        sub_sub_segment_text: 'Moderate acne with post-inflammatory hyperpigmentation',
        case_type: 'normal_case',
        remarks: 'Standard treatment protocol with 6-week follow-up',
        manual_case_type: 'Acne vulgaris with PIH',
        associated_segments: ['skin_clearing', 'skin_brightening']
      };
      
      const result = consultationUpdateSchema.safeParse(aestheticsData);
      expect(result.success).toBe(true);
      
      if (result.success) {
        const data = result.data;
        expect(data.service_type).toBe('aesthetics');
        expect(data.segment).toBe('ai_skin_pro');
        expect(data.sub_segment).toBe('acne');
      }
    });

    it('should handle partial service data', () => {
      const partialData = {
        service_type: 'homeopathy',
        segment: 'hair'
        // Missing other fields - should be valid
      };
      
      const result = consultationUpdateSchema.safeParse(partialData);
      expect(result.success).toBe(true);
      
      if (result.success) {
        const data = result.data;
        expect(data.service_type).toBe('homeopathy');
        expect(data.segment).toBe('hair');
        expect(data.sub_segment).toBeNull(); // Field not provided, converted to null by schema
        expect(data.case_type).toBeUndefined(); // Field not provided, enum fields stay undefined
        expect(data.remarks).toBeNull(); // Field not provided, converted to null by schema
        expect(data.manual_case_type).toBeNull(); // Field not provided, converted to null by schema
        expect(data.associated_segments).toBeNull(); // Field not provided, converted to null by schema
      }
    });

    it('should validate service combination logic', () => {
      const data = {
        service_type: 'homeopathy',
        segment: 'cardiovascular',
        sub_segment: 'hypertension'
      };
      
      // Should pass validation
      const combinationErrors = validateServiceCombination(data);
      expect(combinationErrors).toHaveLength(0);
      
      // Should pass schema validation
      const result = consultationUpdateSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('Edge Cases & Error Handling', () => {
    
    it('should handle empty strings appropriately', () => {
      const dataWithEmptyStrings = {
        service_type: 'homeopathy',
        segment: '',
        sub_segment: '',
        sub_sub_segment_text: '',
        case_type: '',
        remarks: '',
        manual_case_type: '',
        associated_segments: []
      };
      
      const result = consultationUpdateSchema.safeParse(dataWithEmptyStrings);
      expect(result.success).toBe(true);
      
      if (result.success) {
        const data = result.data;
        expect(data.segment).toBeNull();
        expect(data.sub_segment).toBeNull();
        expect(data.sub_sub_segment_text).toBeNull();
        expect(data.case_type).toBeNull();
        expect(data.associated_segments).toBeNull();
      }
    });

    it('should handle whitespace-only strings', () => {
      const dataWithWhitespace = {
        service_type: 'homeopathy',
        sub_sub_segment_text: '   ',
        remarks: '  ',
        manual_case_type: ' '
      };
      
      const result = consultationUpdateSchema.safeParse(dataWithWhitespace);
      expect(result.success).toBe(true);
      
      if (result.success) {
        const data = result.data;
        expect(data.sub_sub_segment_text).toBeNull();
        expect(data.remarks).toBeNull();
        expect(data.manual_case_type).toBeNull();
      }
    });

    it('should handle null values appropriately', () => {
      const dataWithNulls = {
        service_type: 'homeopathy',
        segment: null,
        sub_segment: null,
        sub_sub_segment_text: null,
        case_type: null,
        remarks: null,
        manual_case_type: null,
        associated_segments: null
      };
      
      const result = consultationUpdateSchema.safeParse(dataWithNulls);
      expect(result.success).toBe(true);
    });

    it('should handle undefined values appropriately', () => {
      const dataWithUndefined = {
        service_type: 'homeopathy'
        // All other fields are undefined
      };
      
      const result = consultationUpdateSchema.safeParse(dataWithUndefined);
      expect(result.success).toBe(true);
    });
  });
});
