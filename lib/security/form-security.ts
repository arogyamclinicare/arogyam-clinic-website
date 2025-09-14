import { CSRFProtection, InputSanitization } from './auth-utils';
import { SECURITY_CONFIG } from './config';

// Form security middleware
export class FormSecurity {
  /**
   * Validate CSRF token for form submission
   */
  static validateCSRFToken(token: string): boolean {
    try {
      const storedTokenData = sessionStorage.getItem('arogyam_csrf_token');
      if (!storedTokenData) return false;

      const { token: storedToken, createdAt } = JSON.parse(storedTokenData);
      
      // Check if token is expired
      if (CSRFProtection.isTokenExpired(createdAt)) {
        // Clear expired token
        sessionStorage.removeItem('arogyam_csrf_token');
        return false;
      }

      // Validate token
      return CSRFProtection.validateToken(token, storedToken);
    } catch (error) {
      return false;
    }
  }

  /**
   * Sanitize form data based on field type
   */
  static sanitizeFormData(data: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {
    // Empty block
  };

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        switch (key.toLowerCase()) {
          case 'email':
            sanitized[key] = InputSanitization.sanitizeEmail(value);
            break;
          case 'phone':
          case 'phonenumber':
            sanitized[key] = InputSanitization.sanitizePhone(value);
            break;
          case 'name':
          case 'firstname':
          case 'lastname':
            sanitized[key] = InputSanitization.sanitizeName(value);
            break;
          case 'description':
          case 'condition':
          case 'notes':
          case 'symptoms':
          case 'diagnosis':
          case 'treatment_plan':
          case 'prescription':
          case 'dosage_instructions':
          case 'patient_concerns':
          case 'doctor_observations':
          case 'sub_sub_segment_text':
          case 'remarks':
          case 'manual_case_type':
            sanitized[key] = InputSanitization.sanitizeHTML(value);
            break;
          default:
            sanitized[key] = InputSanitization.sanitizeHTML(value);
        }
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Validate form data length limits
   */
  static validateFormDataLength(data: Record<string, any>): {
    isValid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {
    // Empty block
  };

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        const maxLength = this.getMaxLengthForKey(key);
        if (value.length > maxLength) {
          errors[key] = `${this.getFieldDisplayName(key)} is too long. Maximum ${maxLength} characters allowed.`;
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Get maximum length for a field
   */
  private static getMaxLengthForKey(key: string): number {
    const keyLower = key.toLowerCase();
    
    if (keyLower.includes('name')) return SECURITY_CONFIG.VALIDATION.MAX_NAME_LENGTH;
    if (keyLower.includes('email')) return SECURITY_CONFIG.VALIDATION.MAX_EMAIL_LENGTH;
    if (keyLower.includes('phone')) return SECURITY_CONFIG.VALIDATION.MAX_PHONE_LENGTH;
    if (keyLower.includes('description') || keyLower.includes('condition') || 
        keyLower.includes('notes') || keyLower.includes('symptoms') || 
        keyLower.includes('diagnosis') || keyLower.includes('treatment_plan') ||
        keyLower.includes('prescription') || keyLower.includes('dosage_instructions') ||
        keyLower.includes('patient_concerns') || keyLower.includes('doctor_observations') ||
        keyLower.includes('sub_sub_segment_text') || keyLower.includes('remarks') ||
        keyLower.includes('manual_case_type')) {
      return SECURITY_CONFIG.VALIDATION.MAX_DESCRIPTION_LENGTH;
    }
    
    return 255; // Default max length
  }

  /**
   * Get display name for a field
   */
  private static getFieldDisplayName(key: string): string {
    const keyLower = key.toLowerCase();
    
    if (keyLower.includes('name')) return 'Name';
    if (keyLower.includes('email')) return 'Email';
    if (keyLower.includes('phone')) return 'Phone number';
    if (keyLower.includes('description')) return 'Description';
    if (keyLower.includes('condition')) return 'Condition';
    if (keyLower.includes('notes')) return 'Notes';
    if (keyLower.includes('symptoms')) return 'Symptoms';
    if (keyLower.includes('diagnosis')) return 'Diagnosis';
    if (keyLower.includes('treatment_plan')) return 'Treatment plan';
    if (keyLower.includes('describe_it')) return 'Describe it';
    if (keyLower.includes('prescription')) return 'Prescription';
    if (keyLower.includes('dosage_instructions')) return 'Dosage instructions';
    if (keyLower.includes('patient_concerns')) return 'Patient concerns';
    if (keyLower.includes('doctor_observations')) return 'Doctor observations';
    if (keyLower.includes('service_type')) return 'Service type';
    if (keyLower.includes('segment')) return 'Segment';
    if (keyLower.includes('sub_segment')) return 'Sub-segment';
    if (keyLower.includes('sub_sub_segment_text')) return 'Sub-sub-segment details';
    if (keyLower.includes('case_type')) return 'Case type';
    if (keyLower.includes('remarks')) return 'Remarks';
    if (keyLower.includes('manual_case_type')) return 'Manual case type';
    if (keyLower.includes('associated_segments')) return 'Associated segments';
    
    return key.charAt(0).toUpperCase() + key.slice(1);
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string): boolean {
    return SECURITY_CONFIG.VALIDATION.EMAIL_REGEX.test(email);
  }

  /**
   * Validate phone number format (Indian)
   */
  static validatePhone(phone: string): boolean {
    return SECURITY_CONFIG.VALIDATION.PHONE_REGEX.test(phone);
  }

  /**
   * Validate name format (letters and spaces only)
   */
  static validateName(name: string): boolean {
    return SECURITY_CONFIG.VALIDATION.ALLOWED_NAME_CHARS.test(name);
  }

  /**
   * Validate service type
   */
  static validateServiceType(serviceType: string): boolean {
    return ['homeopathy', 'aesthetics'].includes(serviceType);
  }

  /**
   * Validate case type
   */
  static validateCaseType(caseType: string): boolean {
    return ['', 'difficult_case', 'normal_case', 'rare_difficult_case', 'rare_case'].includes(caseType);
  }

  /**
   * Validate associated segments array
   */
  static validateAssociatedSegments(segments: any): boolean {
    if (!segments || !Array.isArray(segments)) return true; // Optional field
    
    if (segments.length > 20) return false;
    
    return segments.every((segment: any) => 
      typeof segment === 'string' && 
      segment.trim().length > 0 && 
      segment.length <= 100
    );
  }

  /**
   * Complete form security validation
   */
  static validateFormSubmission(
    formData: Record<string, any>,
    csrfToken: string
  ): {
    isValid: boolean;
    errors: Record<string, string>;
    sanitizedData?: Record<string, any>;
  } {
    // Validate CSRF token
    if (!this.validateCSRFToken(csrfToken)) {
      return {
        isValid: false,
        errors: { csrf: 'Invalid or expired security token. Please refresh the page and try again.' }
      };
    }

    // Sanitize form data
    const sanitizedData = this.sanitizeFormData(formData);

    // Validate data length
    const lengthValidation = this.validateFormDataLength(sanitizedData);
    if (!lengthValidation.isValid) {
      return {
        isValid: false,
        errors: lengthValidation.errors
      };
    }

    // Validate specific field formats
    const formatErrors: Record<string, string> = {
    // Empty block
  };

    if (sanitizedData.email && !this.validateEmail(sanitizedData.email)) {
      formatErrors.email = 'Please enter a valid email address.';
    }

    if (sanitizedData.phone && !this.validatePhone(sanitizedData.phone)) {
      formatErrors.phone = 'Please enter a valid phone number.';
    }

    if (sanitizedData.name && !this.validateName(sanitizedData.name)) {
      formatErrors.name = 'Name can only contain letters and spaces.';
    }

    // Validate service fields
    if (sanitizedData.service_type && !this.validateServiceType(sanitizedData.service_type)) {
      formatErrors.service_type = 'Please select a valid service type.';
    }

    if (sanitizedData.case_type && !this.validateCaseType(sanitizedData.case_type)) {
      formatErrors.case_type = 'Please select a valid case type.';
    }

    if (sanitizedData.associated_segments && !this.validateAssociatedSegments(sanitizedData.associated_segments)) {
      formatErrors.associated_segments = 'Associated segments contain invalid data.';
    }

    if (Object.keys(formatErrors).length > 0) {
      return {
        isValid: false,
        errors: formatErrors
      };
    }

    return {
      isValid: true,
      errors: {
    // Empty block
  },
      sanitizedData
    };
  }

  /**
   * Generate new CSRF token
   */
  static refreshCSRFToken(): string {
    const newToken = CSRFProtection.generateToken();
    
    sessionStorage.setItem('arogyam_csrf_token', JSON.stringify({
      token: newToken,
      createdAt: Date.now()
    }));

    return newToken;
  }

  /**
   * Check if CSRF token needs refresh
   */
  static shouldRefreshCSRFToken(): boolean {
    try {
      const storedTokenData = sessionStorage.getItem('arogyam_csrf_token');
      if (!storedTokenData) return true;

      const { createdAt } = JSON.parse(storedTokenData);
      const timeUntilExpiry = SECURITY_CONFIG.CSRF.TOKEN_EXPIRY - (Date.now() - createdAt);
      
      // Refresh if less than 5 minutes remaining
      return timeUntilExpiry < 5 * 60 * 1000;
    } catch (error) {
      return true;
    }
  }
}

// Hook for using form security in React components
export function useFormSecurity() {
  const validateForm = (formData: Record<string, any>, csrfToken: string) => {
    return FormSecurity.validateFormSubmission(formData, csrfToken);
  };

  const sanitizeFormData = (data: Record<string, any>) => {
    return FormSecurity.sanitizeFormData(data);
  };

  const refreshCSRFToken = () => {
    return FormSecurity.refreshCSRFToken();
  };

  const shouldRefreshCSRFToken = () => {
    return FormSecurity.shouldRefreshCSRFToken();
  };

  return {
    validateForm,
    sanitizeFormData,
    refreshCSRFToken,
    shouldRefreshCSRFToken
  };
}
