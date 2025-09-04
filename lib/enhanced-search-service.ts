import { getSupabaseAdmin } from './supabase-admin';
import { Consultation } from './supabase';

export interface SearchFilters {
  searchBy: 'all' | 'name' | 'email' | 'phone' | 'patient_id' | 'drug_name' | 'treatment_type';
  status: 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'in_progress' | 'follow_up';
  dateRange: {
    start: string;
    end: string;
  } | null;
  hasPrescription: 'all' | 'yes' | 'no';
}

export interface SearchResult extends Consultation {
  prescription_drugs?: any[];
  drug_names?: string[];
}

export class EnhancedSearchService {
  /**
   * Search consultations with advanced filtering
   */
  static async searchConsultations(query: string, filters: SearchFilters): Promise<SearchResult[]> {
    try {
      console.log('🔍 EnhancedSearchService: Searching with query:', query, 'filters:', filters);
      
      // Sanitize query to prevent SQL injection
      const sanitizedQuery = query.trim().replace(/[%_\\]/g, '\\$&');

      let supabaseQuery = (getSupabaseAdmin() as any)
        .from('consultations')
        .select(`
          *,
          prescription_drugs (
            id,
            drug_name,
            potency,
            dosage,
            quantity,
            period,
            remarks
          )
        `);

      // Apply search query
      if (sanitizedQuery) {
        switch (filters.searchBy) {
          case 'name':
            supabaseQuery = supabaseQuery.ilike('name', `%${sanitizedQuery}%`);
            break;
          case 'email':
            supabaseQuery = supabaseQuery.ilike('email', `%${sanitizedQuery}%`);
            break;
          case 'phone':
            supabaseQuery = supabaseQuery.ilike('phone', `%${sanitizedQuery}%`);
            break;
          case 'patient_id':
            supabaseQuery = supabaseQuery.ilike('patient_id', `%${sanitizedQuery}%`);
            break;
          case 'treatment_type':
            supabaseQuery = supabaseQuery.ilike('treatment_type', `%${sanitizedQuery}%`);
            break;
          case 'drug_name':
            // Search in prescription_drugs table
            supabaseQuery = supabaseQuery.or(`prescription_drugs.drug_name.ilike.%${sanitizedQuery}%,drug_name.ilike.%${sanitizedQuery}%`);
            break;
          case 'all':
          default:
            // Search across multiple fields
            supabaseQuery = supabaseQuery.or(`name.ilike.%${sanitizedQuery}%,email.ilike.%${sanitizedQuery}%,phone.ilike.%${sanitizedQuery}%,patient_id.ilike.%${sanitizedQuery}%,treatment_type.ilike.%${sanitizedQuery}%,drug_name.ilike.%${sanitizedQuery}%`);
            break;
        }
      }

      // Apply status filter
      if (filters.status !== 'all') {
        supabaseQuery = supabaseQuery.eq('status', filters.status);
      }

      // Apply date range filter
      if (filters.dateRange?.start) {
        supabaseQuery = supabaseQuery.gte('preferred_date', filters.dateRange.start);
      }
      if (filters.dateRange?.end) {
        supabaseQuery = supabaseQuery.lte('preferred_date', filters.dateRange.end);
      }

      // Apply prescription filter
      if (filters.hasPrescription === 'yes') {
        // Has prescription drugs or old prescription fields
        supabaseQuery = supabaseQuery.or(`prescription_drugs.id.is.not.null,drug_name.is.not.null,medicines_prescribed.is.not.null`);
      } else if (filters.hasPrescription === 'no') {
        // No prescription drugs and no old prescription fields
        supabaseQuery = supabaseQuery.and(`prescription_drugs.id.is.null,drug_name.is.null,medicines_prescribed.is.null`);
      }

      // Order by creation date (newest first)
      supabaseQuery = supabaseQuery.order('created_at', { ascending: false });

      const { data, error } = await supabaseQuery;

      if (error) {
        console.error('❌ Error searching consultations:', error);
        // Return empty results instead of throwing to prevent app crashes
        return [];
      }

      // Process results to add drug names array
      const processedResults: SearchResult[] = (data || []).map((consultation: any) => ({
        ...consultation,
        drug_names: [
          ...(consultation.prescription_drugs || []).map((pd: any) => pd.drug_name),
          ...(consultation.drug_name ? [consultation.drug_name] : [])
        ].filter(Boolean)
      }));

      console.log('✅ EnhancedSearchService: Found', processedResults.length, 'results');
      return processedResults;

    } catch (error) {
      console.error('❌ Failed to search consultations:', error);
      
      // Fallback to simple search if complex query fails
      try {
        console.log('🔄 Attempting fallback search...');
        const { data: fallbackData, error: fallbackError } = await (getSupabaseAdmin() as any)
          .from('consultations')
          .select('*')
          .ilike('name', `%${query}%`)
          .order('created_at', { ascending: false })
          .limit(50);

        if (fallbackError) {
          console.error('❌ Fallback search also failed:', fallbackError);
          return [];
        }

        console.log('✅ Fallback search successful:', fallbackData?.length || 0, 'results');
        return (fallbackData || []).map((consultation: any) => ({
          ...consultation,
          drug_names: [consultation.drug_name].filter(Boolean)
        }));
      } catch (fallbackError) {
        console.error('❌ Fallback search failed:', fallbackError);
        return [];
      }
    }
  }

  /**
   * Search patients by various criteria
   */
  static async searchPatients(query: string): Promise<any[]> {
    try {
      console.log('🔍 EnhancedSearchService: Searching patients with query:', query);

      const { data, error } = await (getSupabaseAdmin() as any)
        .from('patients')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%,patient_id.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error searching patients:', error);
        throw error;
      }

      console.log('✅ EnhancedSearchService: Found', data?.length || 0, 'patients');
      return data || [];

    } catch (error) {
      console.error('❌ Failed to search patients:', error);
      throw error;
    }
  }

  /**
   * Search prescription drugs
   */
  static async searchPrescriptionDrugs(query: string): Promise<any[]> {
    try {
      console.log('🔍 EnhancedSearchService: Searching prescription drugs with query:', query);

      const { data, error } = await (getSupabaseAdmin() as any)
        .from('prescription_drugs')
        .select(`
          *,
          consultations (
            id,
            name,
            email,
            phone,
            patient_id,
            preferred_date,
            status
          )
        `)
        .ilike('drug_name', `%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error searching prescription drugs:', error);
        throw error;
      }

      console.log('✅ EnhancedSearchService: Found', data?.length || 0, 'prescription drugs');
      return data || [];

    } catch (error) {
      console.error('❌ Failed to search prescription drugs:', error);
      throw error;
    }
  }

  /**
   * Get search suggestions based on query
   */
  static async getSearchSuggestions(query: string): Promise<{
    patients: string[];
    drugs: string[];
    treatments: string[];
  }> {
    try {
      if (!query.trim() || query.length < 2) {
        return { patients: [], drugs: [], treatments: [] };
      }

      const [patientsData, drugsData, treatmentsData] = await Promise.all([
        // Get patient suggestions
        (getSupabaseAdmin() as any)
          .from('consultations')
          .select('name, email')
          .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
          .limit(5),
        
        // Get drug suggestions
        (getSupabaseAdmin() as any)
          .from('drug_templates')
          .select('drug_name, common_name')
          .or(`drug_name.ilike.%${query}%,common_name.ilike.%${query}%`)
          .limit(5),
        
        // Get treatment suggestions
        (getSupabaseAdmin() as any)
          .from('consultations')
          .select('treatment_type')
          .ilike('treatment_type', `%${query}%`)
          .limit(5)
      ]);

      return {
        patients: [
          ...(patientsData.data || []).map((p: any) => p.name),
          ...(patientsData.data || []).map((p: any) => p.email)
        ].filter(Boolean),
        drugs: [
          ...(drugsData.data || []).map((d: any) => d.drug_name),
          ...(drugsData.data || []).map((d: any) => d.common_name)
        ].filter(Boolean),
        treatments: (treatmentsData.data || []).map((t: any) => t.treatment_type).filter(Boolean)
      };

    } catch (error) {
      console.error('❌ Failed to get search suggestions:', error);
      return { patients: [], drugs: [], treatments: [] };
    }
  }

  /**
   * Get search statistics
   */
  static async getSearchStats(): Promise<{
    totalConsultations: number;
    totalPatients: number;
    totalPrescriptions: number;
    recentConsultations: number;
  }> {
    try {
      const [consultationsData, patientsData, prescriptionsData, recentData] = await Promise.all([
        (getSupabaseAdmin() as any).from('consultations').select('id', { count: 'exact' }),
        (getSupabaseAdmin() as any).from('patients').select('id', { count: 'exact' }),
        (getSupabaseAdmin() as any).from('prescription_drugs').select('id', { count: 'exact' }),
        (getSupabaseAdmin() as any)
          .from('consultations')
          .select('id', { count: 'exact' })
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      return {
        totalConsultations: consultationsData.count || 0,
        totalPatients: patientsData.count || 0,
        totalPrescriptions: prescriptionsData.count || 0,
        recentConsultations: recentData.count || 0
      };

    } catch (error) {
      console.error('❌ Failed to get search stats:', error);
      return {
        totalConsultations: 0,
        totalPatients: 0,
        totalPrescriptions: 0,
        recentConsultations: 0
      };
    }
  }
}
