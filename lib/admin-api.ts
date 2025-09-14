/**
 * ADMIN API CLIENT
 * 
 * This module provides a secure way to perform admin operations without exposing
 * the service role key to the client-side code.
 * 
 * In production, these API calls should be made to a secure backend server
 * that has access to the service role key.
 */

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Secure admin API client
 * In production, this should call your backend API endpoints
 */
class AdminApiClient {
  private baseUrl: string;

  constructor() {
    // In production, this should be your backend API URL
    this.baseUrl = '/api/admin';
  }

  /**
   * Make authenticated API request
   */
  private async makeRequest<T>(
    endpoint: string,
    _options: any = {}): Promise<ApiResponse<T>> {
    try {
      // Get admin session for authentication
      const sessionData = localStorage.getItem('admin_session');
      if (!sessionData) {
        return { success: false, error: 'No admin session found' };
      }

      const session = JSON.parse(sessionData);
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ..._options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.sessionId}`,
          ..._options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
    // Empty block
  }));
        return { 
          success: false, 
          error: errorData.message || `HTTP ${response.status}` 
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error or server unavailable' 
      };
    }
  }

  /**
   * Get all consultations
   */
  async getConsultations(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/consultations');
  }

  /**
   * Update consultation status
   */
  async updateConsultationStatus(
    consultationId: string, 
    status: string
  ): Promise<ApiResponse<any>> {
    return this.makeRequest(`/consultations/${consultationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  /**
   * Delete consultation
   */
  async deleteConsultation(consultationId: string): Promise<ApiResponse<void>> {
    return this.makeRequest(`/consultations/${consultationId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get consultation details
   */
  async getConsultation(consultationId: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/consultations/${consultationId}`);
  }

  /**
   * Update consultation
   */
  async updateConsultation(
    consultationId: string, 
    updates: any
  ): Promise<ApiResponse<any>> {
    return this.makeRequest(`/consultations/${consultationId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Get drug templates
   */
  async getDrugTemplates(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/drug-templates');
  }

  /**
   * Save prescription drugs
   */
  async savePrescriptionDrugs(
    consultationId: string,
    prescriptions: any[]
  ): Promise<ApiResponse<any>> {
    return this.makeRequest(`/consultations/${consultationId}/prescriptions`, {
      method: 'POST',
      body: JSON.stringify({ prescriptions }),
    });
  }

  /**
   * Get prescription drugs for consultation
   */
  async getPrescriptionDrugs(consultationId: string): Promise<ApiResponse<any[]>> {
    return this.makeRequest(`/consultations/${consultationId}/prescriptions`);
  }

  /**
   * Search consultations
   */
  async searchConsultations(query: string, _filters: any = {}): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams({
      q: query,
      ..._filters,
    });
    
    return this.makeRequest(`/consultations/search?${params}`);
  }

  /**
   * Generate PDF for consultation
   */
  async generateConsultationPDF(consultationId: string): Promise<ApiResponse<Blob>> {
    const response = await this.makeRequest(`/consultations/${consultationId}/pdf`);
    
    if (response.success && response.data) {
      // Convert base64 to blob if needed
      return { success: true, data: response.data as Blob };
    }
    
    return { success: false, error: response.error || 'Failed to generate PDF' };
  }

  /**
   * Get admin dashboard statistics
   */
  async getDashboardStats(): Promise<ApiResponse<any>> {
    return this.makeRequest('/dashboard/stats');
  }

  /**
   * Get security audit logs
   */
  async getSecurityLogs(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/security/logs');
  }
}

// Export singleton instance
export const adminApi = new AdminApiClient();

/**
 * DEVELOPMENT FALLBACK
 * 
 * In development, we'll fall back to direct Supabase calls
 * In production, this should be removed and all calls should go through the API
 */
export const isDevelopment = import.meta.env.DEV;

if (isDevelopment) {
    // Empty block
  }
