import { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { 
  X, 
  Pill, 
  Stethoscope,
  Save,
  Trash2,
  FileText,
  AlertCircle,
  Settings,
  Download,
  Plus
} from 'lucide-react';
// Service options and related functions (inline for now)
const serviceOptions = [
  { value: 'consultation', label: 'Consultation' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'emergency', label: 'Emergency' }
];

const caseTypeOptions = [
  { value: 'routine', label: 'Routine' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'emergency', label: 'Emergency' }
];

const associatedSegmentOptions = [
  { value: 'general', label: 'General' },
  { value: 'specialist', label: 'Specialist' }
];

const getSegmentsForService = (serviceType: string) => {
  if (serviceType === 'consultation') {
    return [
      { value: 'general', label: 'General' },
      { value: 'specialist', label: 'Specialist' }
    ];
  }
  return [];
};

const getSubSegmentsForSegment = (serviceType: string, segment: string) => {
  if (serviceType === 'consultation' && segment === 'specialist') {
    return [
      { value: 'cardiology', label: 'Cardiology' },
      { value: 'neurology', label: 'Neurology' }
    ];
  }
  return [];
};

const resetDependentFields = (formData: any, field: string) => {
  const updates: any = {};
  if (field === 'service_type') {
    updates.segment = '';
    updates.sub_segment = '';
  } else if (field === 'segment') {
    updates.sub_segment = '';
  }
  return { ...formData, ...updates };
};
import { pdfGenerator } from '../../lib/pdf-generator';
import { MultiplePrescriptionDrugForm } from './MultiplePrescriptionDrugForm';
import { MultiplePrescriptionService } from '../../lib/multiple-prescription-service';
import type { Consultation, ConsultationUpdate, PrescriptionDrug } from '../../lib/supabase';
import { CONSULTATION_STATUS, STATUS_LABELS } from '../../lib/constants';

interface ConsultationEditModalProps {
  consultation: Consultation | null;
  isOpen?: boolean;
  onClose: () => void;
  onSave?: (updates: Partial<ConsultationUpdate>) => Promise<{ success: boolean; error?: string }>;
  onDelete?: () => Promise<{ success: boolean; error?: string }>;
  isReadOnly?: boolean;
}

export function ConsultationEditModal({ 
  consultation, 
  isOpen = true, 
  onClose, 
  onSave, 
  onDelete,
  isReadOnly = false
}: ConsultationEditModalProps) {
  const [formData, setFormData] = useState<Partial<ConsultationUpdate>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'prescription' | 'notes' | 'services' | 'drugs'>('details');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState<Partial<ConsultationUpdate>>({});
  const [multiplePrescriptions, setMultiplePrescriptions] = useState<PrescriptionDrug[]>([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);


  // Memoized callback for multiple prescription updates
  const handleMultiplePrescriptionsUpdate = useCallback((prescriptions: PrescriptionDrug[]) => {
    console.log('🔍 ConsultationEditModal: Multiple prescriptions updated:', prescriptions);
    setMultiplePrescriptions(prescriptions);
  }, []);

  // Load multiple prescriptions when consultation changes
  useEffect(() => {
    const loadPrescriptions = async () => {
      if (!consultation?.id) {
        setMultiplePrescriptions([]);
        return;
      }

      setLoadingPrescriptions(true);
      try {
        const prescriptions = await MultiplePrescriptionService.getPrescriptionDrugs(consultation.id);
        setMultiplePrescriptions(prescriptions);
        console.log('✅ Loaded prescriptions:', prescriptions);
      } catch (error) {
        console.error('❌ Failed to load prescriptions:', error);
        setError('Failed to load prescription data');
      } finally {
        setLoadingPrescriptions(false);
      }
    };

    loadPrescriptions();
  }, [consultation?.id]);

  // Initialize form data when consultation changes
  useEffect(() => {
    if (consultation) {
      console.log('🔍 ConsultationEditModal: Initializing with consultation data:', consultation);
      setFormData({
        status: consultation.status,
        prescription: consultation.prescription || '',
        notes: consultation.notes || '',
        follow_up_date: consultation.follow_up_date || '',
        follow_up_notes: consultation.follow_up_notes || '',
        treatment_plan: consultation.treatment_plan || '',
        describe_it: consultation.describe_it || '',
        symptoms: consultation.symptoms || '',
        diagnosis: consultation.diagnosis || '',
        medicines_prescribed: consultation.medicines_prescribed || null,
        dosage_instructions: consultation.dosage_instructions || '',
        next_appointment_date: consultation.next_appointment_date || '',
        patient_concerns: consultation.patient_concerns || '',
        doctor_observations: consultation.doctor_observations || '',
        service_type: consultation.service_type || '',
        segment: consultation.segment || '',
        sub_segment: consultation.sub_segment || '',
        sub_sub_segment_text: consultation.sub_sub_segment_text || '',
        case_type: consultation.case_type || '',
        remarks: consultation.remarks || '',
        manual_case_type: consultation.manual_case_type || '',
        associated_segments: consultation.associated_segments || []
      });
      
      // Initialize prescription data
      const prescriptionData = {
        drug_name: consultation.drug_name || null,
        potency: consultation.potency || null,
        dosage: consultation.dosage || null,
        repetition_frequency: consultation.repetition_frequency || null,
        repetition_interval: consultation.repetition_interval || null,
        repetition_unit: consultation.repetition_unit || null,
        quantity: consultation.quantity || null,
        period: consultation.period || null,
        prescription_remarks: consultation.prescription_remarks || null
      };
      console.log('🔍 ConsultationEditModal: Setting prescription data:', prescriptionData);
      setPrescriptionData(prescriptionData);
    }
  }, [consultation]);

  const handleInputChange = (field: keyof ConsultationUpdate, value: any) => {
    // Handle service field dependencies
    if (field === 'service_type' || field === 'segment') {
      const updatedData = resetDependentFields(formData, field);
      updatedData[field] = value;
      setFormData(updatedData);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAssociatedSegmentChange = (segment: string, isSelected: boolean) => {
    setFormData(prev => {
      const currentSegments = prev.associated_segments || [];
      if (isSelected) {
        return { ...prev, associated_segments: [...currentSegments, segment] };
      } else {
        return { ...prev, associated_segments: currentSegments.filter(s => s !== segment) };
      }
    });
  };

  const handleSave = async () => {
    if (!consultation) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Save multiple prescriptions first
      if (multiplePrescriptions.length > 0) {
        const prescriptionInserts = multiplePrescriptions.map(p => ({
          drug_name: p.drug_name,
          potency: p.potency,
          dosage: p.dosage,
          repetition_frequency: p.repetition_frequency,
          repetition_interval: p.repetition_interval,
          repetition_unit: p.repetition_unit,
          quantity: p.quantity,
          period: p.period,
          remarks: p.remarks
        }));
        
        await MultiplePrescriptionService.savePrescriptionDrugs(consultation.id, prescriptionInserts);
        console.log('✅ Multiple prescriptions saved successfully');
      }

      // Merge form data with prescription data
      const mergedData = { ...formData, ...prescriptionData };
      
      // Clean up empty date fields to prevent database errors
      const cleanedFormData = { ...mergedData };
      
      // Convert empty strings to null for date fields
      if (cleanedFormData.follow_up_date === '') {
        cleanedFormData.follow_up_date = null;
      }
      if (cleanedFormData.next_appointment_date === '') {
        cleanedFormData.next_appointment_date = null;
      }
      
      // Convert empty strings to null for text fields
      if (cleanedFormData.patient_concerns === '') {
        cleanedFormData.patient_concerns = null;
      }
      if (cleanedFormData.doctor_observations === '') {
        cleanedFormData.doctor_observations = null;
      }
      if (cleanedFormData.diagnosis === '') {
        cleanedFormData.diagnosis = null;
      }
      if (cleanedFormData.symptoms === '') {
        cleanedFormData.symptoms = null;
      }
      if (cleanedFormData.treatment_plan === '') {
        cleanedFormData.treatment_plan = null;
      }
      if (cleanedFormData.describe_it === '') {
        cleanedFormData.describe_it = null;
      }
      if (cleanedFormData.notes === '') {
        cleanedFormData.notes = null;
      }
      if (cleanedFormData.follow_up_notes === '') {
        cleanedFormData.follow_up_notes = null;
      }
      if (cleanedFormData.dosage_instructions === '') {
        cleanedFormData.dosage_instructions = null;
      }
      
      // Clean up service fields
      if (cleanedFormData.service_type === '') {
        cleanedFormData.service_type = null;
      }
      if (cleanedFormData.segment === '') {
        cleanedFormData.segment = null;
      }
      if (cleanedFormData.sub_segment === '') {
        cleanedFormData.sub_segment = null;
      }
      if (cleanedFormData.sub_sub_segment_text === '') {
        cleanedFormData.sub_sub_segment_text = null;
      }
      if (cleanedFormData.case_type === '') {
        cleanedFormData.case_type = null;
      }
      if (cleanedFormData.remarks === '') {
        cleanedFormData.remarks = null;
      }
      if (cleanedFormData.manual_case_type === '') {
        cleanedFormData.manual_case_type = null;
      }
      if (!cleanedFormData.associated_segments || cleanedFormData.associated_segments.length === 0) {
        cleanedFormData.associated_segments = null;
      }
      
      console.log('🔍 ConsultationEditModal: Saving with merged data:', cleanedFormData);
      if (onSave) {
        const result = await onSave(cleanedFormData);
        
        if (result.success) {
          onClose();
        } else {
          setError(result.error || 'Failed to save changes');
        }
      } else {
        setError('Save function not available');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!consultation || !confirm('Are you sure you want to delete this consultation? This action cannot be undone.')) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (onDelete) {
        const result = await onDelete();
        
        if (result.success) {
          onClose();
        } else {
          setError(result.error || 'Failed to delete consultation');
        }
      } else {
        setError('Delete function not available');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadUserPDF = async () => {
    if (!consultation) return;
    
    setIsGeneratingPDF(true);
    try {
      const pdfBlob = await pdfGenerator.generatePatientPrescriptionPDF(consultation);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${consultation.name}_user_info_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadAdminPDF = async () => {
    if (!consultation) return;
    
    setIsGeneratingPDF(true);
    try {
      const pdfBlob = await pdfGenerator.generateAdminPrescriptionPDF(consultation);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${consultation.name}_admin_complete_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!isOpen || !consultation) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xl">
      <div className="card-premium rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[98vh] sm:max-h-[95vh] overflow-hidden shadow-2xl animate-scale-in border-0 relative flex flex-col">
        {/* Header */}
        <div className="glass-dark rounded-t-2xl sm:rounded-t-3xl border-b border-white/10 p-3 sm:p-6 lg:p-8 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Edit Consultation
                </h2>
                <p className="text-blue-100 text-sm">
                  {consultation.name} - {consultation.treatment_type}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 glass rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-4">
            {[
              { id: 'details', name: 'Details', icon: FileText },
              { id: 'prescription', name: 'Prescription', icon: Pill },
              { id: 'notes', name: 'Notes', icon: Stethoscope },
              { id: 'services', name: 'Services', icon: Settings },
              { id: 'drugs', name: 'Prescription Drugs', icon: Plus }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-100 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 lg:p-6 overflow-y-auto flex-1">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                     <select
                     value={formData.status || ''}
                     onChange={(e) => handleInputChange('status', e.target.value)}
                     disabled={isReadOnly}
                     className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                   >
                     <option value={CONSULTATION_STATUS.PENDING}>{STATUS_LABELS[CONSULTATION_STATUS.PENDING]}</option>
                     <option value={CONSULTATION_STATUS.CONFIRMED}>{STATUS_LABELS[CONSULTATION_STATUS.CONFIRMED]}</option>
                     <option value={CONSULTATION_STATUS.IN_PROGRESS}>{STATUS_LABELS[CONSULTATION_STATUS.IN_PROGRESS]}</option>
                     <option value={CONSULTATION_STATUS.COMPLETED}>{STATUS_LABELS[CONSULTATION_STATUS.COMPLETED]}</option>
                     <option value={CONSULTATION_STATUS.CANCELLED}>{STATUS_LABELS[CONSULTATION_STATUS.CANCELLED]}</option>
                     <option value={CONSULTATION_STATUS.FOLLOW_UP}>{STATUS_LABELS[CONSULTATION_STATUS.FOLLOW_UP]}</option>
                   </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next Appointment Date</label>
                  <input
                    type="date"
                    value={formData.next_appointment_date || ''}
                    onChange={(e) => handleInputChange('next_appointment_date', e.target.value)}
                    readOnly={isReadOnly}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient Concerns</label>
                <textarea
                  rows={3}
                  value={formData.patient_concerns || ''}
                  onChange={(e) => handleInputChange('patient_concerns', e.target.value)}
                  readOnly={isReadOnly}
                  placeholder="Document patient's main concerns..."
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doctor's Observations</label>
                <textarea
                  rows={3}
                  value={formData.doctor_observations || ''}
                  onChange={(e) => handleInputChange('doctor_observations', e.target.value)}
                  placeholder="Document your clinical observations..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {activeTab === 'prescription' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescription & Treatment</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                <input
                  type="text"
                  value={formData.diagnosis || ''}
                  onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                  placeholder="Enter diagnosis..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                <textarea
                  rows={2}
                  value={formData.symptoms || ''}
                  onChange={(e) => handleInputChange('symptoms', e.target.value)}
                  placeholder="Document symptoms..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medicines Prescribed</label>
                <textarea
                  rows={4}
                  value={formData.medicines_prescribed || ''}
                  onChange={(e) => handleInputChange('medicines_prescribed', e.target.value)}
                  placeholder="Enter medicines with details, one per line or as needed..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dosage Instructions</label>
                <textarea
                  rows={3}
                  value={formData.dosage_instructions || ''}
                  onChange={(e) => handleInputChange('dosage_instructions', e.target.value)}
                  placeholder="Enter detailed dosage instructions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What are you suffering from?</label>
                <textarea
                  rows={3}
                  value={formData.treatment_plan || ''}
                  onChange={(e) => handleInputChange('treatment_plan', e.target.value)}
                  placeholder="Enter what the patient is suffering from..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Describe it (Admin Only)</label>
                <textarea
                  rows={3}
                  value={formData.describe_it || ''}
                  onChange={(e) => handleInputChange('describe_it', e.target.value)}
                  placeholder="Enter detailed description of the condition (admin only)..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes & Follow-up</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">General Notes</label>
                <textarea
                  rows={4}
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Enter general consultation notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Notes</label>
                <textarea
                  rows={3}
                  value={formData.follow_up_notes || ''}
                  onChange={(e) => handleInputChange('follow_up_notes', e.target.value)}
                  placeholder="Enter follow-up instructions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>
                <input
                  type="date"
                  value={formData.follow_up_date || ''}
                  onChange={(e) => handleInputChange('follow_up_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Services Classification</h3>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleDownloadUserPDF}
                    disabled={isGeneratingPDF}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>{isGeneratingPDF ? 'Generating...' : 'User PDF'}</span>
                  </Button>
                  <Button
                    onClick={handleDownloadAdminPDF}
                    disabled={isGeneratingPDF}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>{isGeneratingPDF ? 'Generating...' : 'Admin PDF'}</span>
                  </Button>
                </div>
              </div>
              
              {/* Service Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
                <select
                  value={formData.service_type || ''}
                  onChange={(e) => handleInputChange('service_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Service Type</option>
                  {serviceOptions.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Segment Selection */}
              {formData.service_type && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Segment *</label>
                  <select
                    value={formData.segment || ''}
                    onChange={(e) => handleInputChange('segment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Segment</option>
                    {getSegmentsForService(formData.service_type).map((segment) => (
                      <option key={segment.value} value={segment.value}>
                        {segment.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sub-Segment Selection */}
              {formData.segment && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Segment</label>
                  <select
                    value={formData.sub_segment || ''}
                    onChange={(e) => handleInputChange('sub_segment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Sub-Segment</option>
                    {getSubSegmentsForSegment(formData.service_type!, formData.segment).map((subSegment) => (
                      <option key={subSegment.value} value={subSegment.value}>
                        {subSegment.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sub-Sub-Segment Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Sub-Segment Details</label>
                <textarea
                  rows={3}
                  value={formData.sub_sub_segment_text || ''}
                  onChange={(e) => handleInputChange('sub_sub_segment_text', e.target.value)}
                  placeholder="Enter additional details or custom sub-segment information..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Case Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Case Type</label>
                <select
                  value={formData.case_type || ''}
                  onChange={(e) => handleInputChange('case_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {caseTypeOptions.map((caseType) => (
                    <option key={caseType.value} value={caseType.value}>
                      {caseType.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Manual Case Type Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manual Case Type</label>
                <textarea
                  rows={2}
                  value={formData.manual_case_type || ''}
                  onChange={(e) => handleInputChange('manual_case_type', e.target.value)}
                  placeholder="Enter custom case type if needed..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                <textarea
                  rows={4}
                  value={formData.remarks || ''}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  placeholder="Enter additional remarks, observations, or notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Associated Segments Multi-Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Associated Segments</label>
                <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {associatedSegmentOptions.map((segment) => {
                      const isSelected = formData.associated_segments?.includes(segment.value) || false;
                      return (
                        <label key={segment.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleAssociatedSegmentChange(segment.value, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{segment.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Select multiple segments that are relevant to this case
                </p>
              </div>
            </div>
          )}

          {activeTab === 'drugs' && consultation && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Prescription Drugs Management</h3>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleDownloadUserPDF}
                    disabled={isGeneratingPDF}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>{isGeneratingPDF ? 'Generating...' : 'User PDF'}</span>
                  </Button>
                  <Button
                    onClick={handleDownloadAdminPDF}
                    disabled={isGeneratingPDF}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>{isGeneratingPDF ? 'Generating...' : 'Admin PDF'}</span>
                  </Button>
                </div>
              </div>
              
              {loadingPrescriptions ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading prescriptions...</p>
                  </div>
                </div>
              ) : (
                <MultiplePrescriptionDrugForm
                  key={consultation.id}
                  consultationId={consultation.id}
                  initialPrescriptions={multiplePrescriptions}
                  onPrescriptionsUpdate={handleMultiplePrescriptionsUpdate}
                />
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 lg:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            {!isReadOnly && (
              <div className="flex gap-3">
                {onDelete && (
                  <Button
                    onClick={handleDelete}
                    disabled={isLoading}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                disabled={isLoading}
              >
                {isReadOnly ? 'Close' : 'Cancel'}
              </Button>
              {!isReadOnly && onSave && (
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
