import { getSupabaseAdmin } from './supabase-admin';
import { PrescriptionDrug, PrescriptionDrugInsert, PrescriptionDrugUpdate } from './supabase';

export class MultiplePrescriptionService {
  /**
   * Get all prescription drugs for a consultation
   */
  static async getPrescriptionDrugs(consultationId: string): Promise<PrescriptionDrug[]> {
    try {
      const { data, error } = await (getSupabaseAdmin() as any)
        .from('prescription_drugs')
        .select('*')
        .eq('consultation_id', consultationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Error fetching prescription drugs:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('❌ Failed to fetch prescription drugs:', error);
      throw error;
    }
  }

  /**
   * Save multiple prescription drugs for a consultation
   */
  static async savePrescriptionDrugs(
    consultationId: string, 
    prescriptions: Omit<PrescriptionDrugInsert, 'consultation_id'>[]
  ): Promise<PrescriptionDrug[]> {
    try {
      // First, delete existing prescription drugs for this consultation
      await this.deletePrescriptionDrugs(consultationId);

      // Then insert new prescription drugs
      if (prescriptions.length === 0) {
        return [];
      }

      const prescriptionsWithConsultationId = prescriptions.map(prescription => ({
        ...prescription,
        consultation_id: consultationId
      }));

      const { data, error } = await (getSupabaseAdmin() as any)
        .from('prescription_drugs')
        .insert(prescriptionsWithConsultationId)
        .select();

      if (error) {
        console.error('❌ Error saving prescription drugs:', error);
        throw error;
      }

      console.log('✅ Prescription drugs saved successfully:', data);
      return data || [];
    } catch (error) {
      console.error('❌ Failed to save prescription drugs:', error);
      throw error;
    }
  }

  /**
   * Delete all prescription drugs for a consultation
   */
  static async deletePrescriptionDrugs(consultationId: string): Promise<void> {
    try {
      const { error } = await (getSupabaseAdmin() as any)
        .from('prescription_drugs')
        .delete()
        .eq('consultation_id', consultationId);

      if (error) {
        console.error('❌ Error deleting prescription drugs:', error);
        throw error;
      }

      console.log('✅ Prescription drugs deleted successfully');
    } catch (error) {
      console.error('❌ Failed to delete prescription drugs:', error);
      throw error;
    }
  }

  /**
   * Update a single prescription drug
   */
  static async updatePrescriptionDrug(
    prescriptionId: string, 
    updates: PrescriptionDrugUpdate
  ): Promise<PrescriptionDrug> {
    try {
      const { data, error } = await (getSupabaseAdmin() as any)
        .from('prescription_drugs')
        .update(updates)
        .eq('id', prescriptionId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating prescription drug:', error);
        throw error;
      }

      console.log('✅ Prescription drug updated successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to update prescription drug:', error);
      throw error;
    }
  }

  /**
   * Get prescription history for a patient
   */
  static async getPatientPrescriptionHistory(patientId: string): Promise<PrescriptionDrug[]> {
    try {
      const { data, error } = await (getSupabaseAdmin() as any)
        .from('prescription_drugs')
        .select(`
          *,
          consultations!inner(
            id,
            patient_id,
            name,
            email,
            preferred_date,
            created_at
          )
        `)
        .eq('consultations.patient_id', patientId)
        .order('consultations.created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching patient prescription history:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('❌ Failed to fetch patient prescription history:', error);
      throw error;
    }
  }

  /**
   * Get prescription history by email (fallback)
   */
  static async getPrescriptionHistoryByEmail(email: string): Promise<PrescriptionDrug[]> {
    try {
      const { data, error } = await (getSupabaseAdmin() as any)
        .from('prescription_drugs')
        .select(`
          *,
          consultations!inner(
            id,
            patient_id,
            name,
            email,
            preferred_date,
            created_at
          )
        `)
        .eq('consultations.email', email)
        .order('consultations.created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching prescription history by email:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('❌ Failed to fetch prescription history by email:', error);
      throw error;
    }
  }

  /**
   * Get all prescription drugs with consultation details for admin view
   */
  static async getAllPrescriptionDrugs(): Promise<any[]> {
    try {
      const { data, error } = await (getSupabaseAdmin() as any)
        .from('prescription_drugs')
        .select(`
          *,
          consultations!inner(
            id,
            patient_id,
            name,
            email,
            phone,
            preferred_date,
            created_at
          )
        `)
        .order('consultations.created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching all prescription drugs:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('❌ Failed to fetch all prescription drugs:', error);
      throw error;
    }
  }
}
