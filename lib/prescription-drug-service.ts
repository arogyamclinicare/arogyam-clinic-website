import { getSupabaseAdmin } from './supabase-admin';
import { PrescriptionDrug, PrescriptionDrugInsert, PrescriptionDrugUpdate, DrugTemplate } from './supabase';

/**
 * Service for managing prescription drugs
 */
export class PrescriptionDrugService {
  /**
   * Get prescription data for a consultation (from prescription_drugs table)
   */
  static async getPrescriptionDrugs(consultationId: string): Promise<any[]> {
    try {
      console.log('🔍 PrescriptionDrugService: Fetching prescription data for consultation:', consultationId);
      
      // First try to get from prescription_drugs table (new approach)
      const { data: prescriptionData, error: prescriptionError } = await getSupabaseAdmin()
        .from('prescription_drugs')
        .select('*')
        .eq('consultation_id', consultationId)
        .order('created_at', { ascending: true });

      if (!prescriptionError && prescriptionData && prescriptionData.length > 0) {
        console.log('📋 PrescriptionDrugService: Fetched prescription data from prescription_drugs table:', prescriptionData);
        return prescriptionData;
      }

      // Fallback: try to get from consultations table (legacy approach)
      console.log('🔄 PrescriptionDrugService: No data in prescription_drugs table, trying consultations table...');
      const { data: consultationData, error: consultationError } = await getSupabaseAdmin()
        .from('consultations')
        .select('drug_name, potency, dosage, repetition_frequency, repetition_interval, repetition_unit, quantity, period, prescription_remarks')
        .eq('id', consultationId)
        .single();

      if (consultationError) {
        console.error('❌ Error fetching prescription data:', consultationError);
        throw consultationError;
      }

      // Convert consultation data to prescription drug format for PDF compatibility
      const legacyPrescriptionData = [];
      if (consultationData && (consultationData as any).drug_name && (consultationData as any).drug_name.trim()) {
        legacyPrescriptionData.push({
          id: consultationId,
          consultation_id: consultationId,
          drug_name: (consultationData as any).drug_name,
          potency: (consultationData as any).potency,
          dosage: (consultationData as any).dosage,
          repetition_frequency: (consultationData as any).repetition_frequency,
          repetition_interval: (consultationData as any).repetition_interval,
          repetition_unit: (consultationData as any).repetition_unit,
          quantity: (consultationData as any).quantity,
          period: (consultationData as any).period,
          remarks: (consultationData as any).prescription_remarks,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }

      console.log('📋 PrescriptionDrugService: Fetched legacy prescription data:', legacyPrescriptionData);
      return legacyPrescriptionData;
    } catch (error) {
      console.error('❌ Failed to fetch prescription data:', error);
      throw error;
    }
  }

  /**
   * Add a new prescription drug
   */
  static async addPrescriptionDrug(drug: PrescriptionDrugInsert): Promise<PrescriptionDrug> {
    try {
      console.log('🔍 PrescriptionDrugService: Adding drug with data:', drug);
      
      const { data, error } = await (getSupabaseAdmin() as any)
        .from('prescription_drugs')
        .insert(drug)
        .select()
        .single();

      if (error) {
        console.error('❌ Error adding prescription drug:', error);
        throw error;
      }

      console.log('✅ PrescriptionDrugService: Successfully added drug:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to add prescription drug:', error);
      throw error;
    }
  }

  /**
   * Update a prescription drug
   */
  static async updatePrescriptionDrug(id: string, updates: PrescriptionDrugUpdate): Promise<PrescriptionDrug> {
    try {
      const { data, error } = await (getSupabaseAdmin() as any)
        .from('prescription_drugs')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating prescription drug:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to update prescription drug:', error);
      throw error;
    }
  }

  /**
   * Delete a prescription drug
   */
  static async deletePrescriptionDrug(id: string): Promise<void> {
    try {
      const { error } = await getSupabaseAdmin()
        .from('prescription_drugs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting prescription drug:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to delete prescription drug:', error);
      throw error;
    }
  }

  /**
   * Get all drug templates for autocomplete
   */
  static async getDrugTemplates(): Promise<DrugTemplate[]> {
    try {
      const { data, error } = await getSupabaseAdmin()
        .from('drug_templates')
        .select('*')
        .order('drug_name', { ascending: true });

      if (error) {
        console.error('Error fetching drug templates:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch drug templates:', error);
      throw error;
    }
  }

  /**
   * Search drug templates by name
   */
  static async searchDrugTemplates(query: string): Promise<DrugTemplate[]> {
    try {
      const { data, error } = await getSupabaseAdmin()
        .from('drug_templates')
        .select('*')
        .ilike('drug_name', `%${query}%`)
        .order('drug_name', { ascending: true })
        .limit(10);

      if (error) {
        console.error('Error searching drug templates:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to search drug templates:', error);
      throw error;
    }
  }

  /**
   * Get common potencies for a drug
   */
  static async getCommonPotencies(drugName: string): Promise<string[]> {
    try {
      const { data, error } = await getSupabaseAdmin()
        .from('drug_templates')
        .select('common_potencies')
        .eq('drug_name', drugName)
        .single();

      if (error) {
        console.error('Error fetching common potencies:', error);
        return [];
      }

      return (data as any)?.common_potencies || [];
    } catch (error) {
      console.error('Failed to fetch common potencies:', error);
      return [];
    }
  }

  /**
   * Get common dosages for a drug
   */
  static async getCommonDosages(drugName: string): Promise<string[]> {
    try {
      const { data, error } = await getSupabaseAdmin()
        .from('drug_templates')
        .select('common_dosages')
        .eq('drug_name', drugName)
        .single();

      if (error) {
        console.error('Error fetching common dosages:', error);
        return [];
      }

      return (data as any)?.common_dosages || [];
    } catch (error) {
      console.error('Failed to fetch common dosages:', error);
      return [];
    }
  }
}

// Common potency options
export const COMMON_POTENCIES = [
  '10M', '12X', '1M', '200C', '30C', '3X', '50M', '6C', '6X', 'CM', 'MT (Q)', 'NA'
];

// Common dosage options
export const COMMON_DOSAGES = [
  '1', '2', '3', 'LA'
];

// Repetition frequency options (repeat start)
export const REPETITION_FREQUENCY_OPTIONS = [
  '1', '2', '3', 'LA'
];

// Repetition interval options (repeat end)
export const REPETITION_INTERVAL_OPTIONS = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
  '31', '32', '33', '34', '35', '36', '37', '38', '39'
];

// Repetition unit options
export const REPETITION_UNITS = [
  'Days', 'Weeks', 'Hrs'
];

// Quantity options
export const QUANTITY_OPTIONS = [
  '1', '2', '3', '4', '5', '6', '7', 'NA'
];

// Default drug entry template
export const DEFAULT_DRUG_ENTRY: Omit<PrescriptionDrugInsert, 'consultation_id'> = {
  drug_name: '',
  potency: '',
  dosage: '',
  repetition_frequency: null,
  repetition_interval: null,
  repetition_unit: 'Days',
  quantity: 1,
  period: 0,
  remarks: ''
};
