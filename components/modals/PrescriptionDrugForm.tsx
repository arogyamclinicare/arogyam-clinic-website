import { useState, useEffect, useRef } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { DrugTemplate } from '../../lib/supabase';
import { getSupabaseAdmin } from '../../lib/supabase-admin';
import { 
  COMMON_POTENCIES, 
  COMMON_DOSAGES, 
  REPETITION_FREQUENCY_OPTIONS,
  REPETITION_INTERVAL_OPTIONS,
  REPETITION_UNITS,
  QUANTITY_OPTIONS
} from '../../lib/prescription-drug-service';

interface PrescriptionDrugFormProps {
  initialPrescription?: ConsultationPrescription;
  onPrescriptionUpdate: (prescription: ConsultationPrescription) => void;
}

interface ConsultationPrescription {
  drug_name: string;
  potency: string;
  dosage: string;
  repetition_frequency: number | null;
  repetition_interval: number | null;
  repetition_unit: string;
  quantity: number | null;
  period: number | null;
  prescription_remarks: string;
}



export function PrescriptionDrugForm({ initialPrescription, onPrescriptionUpdate }: PrescriptionDrugFormProps) {
  const [drugTemplates, setDrugTemplates] = useState<DrugTemplate[]>([]);
  const [currentPrescription, setCurrentPrescription] = useState<ConsultationPrescription>(() => {
    // Initialize with provided prescription data or defaults
    return initialPrescription || {
      drug_name: '',
      potency: '',
      dosage: '',
      repetition_frequency: null,
      repetition_interval: null,
      repetition_unit: 'Days',
      quantity: 1,
      period: 0,
      prescription_remarks: ''
    };
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const isInitializing = useRef(true);

  // Load drug templates on mount
  useEffect(() => {
    loadDrugTemplates();
    // Mark initialization as complete after a short delay
    setTimeout(() => {
      isInitializing.current = false;
    }, 100);
  }, []);



  const loadDrugTemplates = async () => {
    try {
      const { data, error } = await (getSupabaseAdmin() as any)
        .from('drug_templates')
        .select('*')
        .order('drug_name', { ascending: true });

      if (error) {
        console.error('❌ Error loading drug templates:', error);
        return;
      }

      setDrugTemplates(data || []);
    } catch (error) {
      console.error('❌ Failed to load drug templates:', error);
    }
  };


  const handleReset = () => {
    setCurrentPrescription({
      drug_name: '',
      potency: '',
      dosage: '',
      repetition_frequency: null,
      repetition_interval: null,
      repetition_unit: 'Days',
      quantity: 1,
      period: 0,
      prescription_remarks: ''
    });
    setSearchQuery('');
  };

  const handleInputChange = (field: keyof ConsultationPrescription, value: any) => {
    console.log('🔍 PrescriptionDrugForm: Input change:', { field, value });
    console.log('🔍 PrescriptionDrugForm: Previous state:', currentPrescription);
    setCurrentPrescription(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      console.log('🔍 PrescriptionDrugForm: Updated prescription state:', updated);
      return updated;
    });
  };

  // Update parent component when prescription data changes (but not during initialization)
  useEffect(() => {
    if (!isInitializing.current && currentPrescription.drug_name && currentPrescription.drug_name.trim()) {
      console.log('🔍 PrescriptionDrugForm: Updating parent with prescription data:', currentPrescription);
      onPrescriptionUpdate(currentPrescription);
    }
  }, [currentPrescription]);

  // Filter drug templates based on search - search both drug_name and common_name
  // Show all drugs when focused, filter when typing
  const filteredTemplates = drugTemplates.filter(template => {
    if (!searchQuery.trim()) return true; // Show all when no search query
    const searchLower = searchQuery.toLowerCase();
    const drugNameMatch = template.drug_name.toLowerCase().includes(searchLower);
    const commonNameMatch = template.common_name?.toLowerCase().includes(searchLower) || false;
    return drugNameMatch || commonNameMatch;
  });

  return (
    <div className="space-y-6">
      {/* Prescription Form - Vertical Layout */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Prescription Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Drug Name - Full Width */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Drug Name *</label>
            <div className="relative">
              <input
                type="text"
                value={currentPrescription.drug_name}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleInputChange('drug_name', e.target.value);
                }}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => {
                  // Delay hiding to allow clicking on dropdown items
                  setTimeout(() => setIsInputFocused(false), 200);
                }}
                placeholder="Enter drug name or click to see all options"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            
                         {/* Drug Suggestions Dropdown - Relative positioning */}
             {isInputFocused && filteredTemplates.length > 0 && (
               <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                 <div className="p-2 bg-gray-50 border-b border-gray-200 text-xs text-gray-600">
                   {searchQuery ? `Found ${filteredTemplates.length} results` : `Showing all ${filteredTemplates.length} drugs`}
                 </div>
                 {filteredTemplates.slice(0, 50).map((template) => (
                   <div
                     key={template.id}
                     onClick={() => {
                       handleInputChange('drug_name', template.drug_name);
                       setSearchQuery('');
                       setIsInputFocused(false);
                     }}
                     className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                   >
                     <div className="font-medium text-gray-900">{template.drug_name}</div>
                     {template.common_name && (
                       <div className="text-blue-600 text-xs mt-1">Common: {template.common_name}</div>
                     )}
                   </div>
                 ))}
               </div>
             )}
          </div>

          {/* Potency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Potency</label>
            <select
              value={currentPrescription.potency || ''}
              onChange={(e) => handleInputChange('potency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Potency</option>
              {COMMON_POTENCIES.map(potency => (
                <option key={potency} value={potency}>{potency}</option>
              ))}
            </select>
          </div>

          {/* Dosage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dosage</label>
            <select
              value={currentPrescription.dosage || ''}
              onChange={(e) => handleInputChange('dosage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Dosage</option>
              {COMMON_DOSAGES.map(dosage => (
                <option key={dosage} value={dosage}>{dosage}</option>
              ))}
            </select>
          </div>

          {/* Repetition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Repetition</label>
            <div className="flex gap-2">
              <select
                value={currentPrescription.repetition_frequency || ''}
                onChange={(e) => handleInputChange('repetition_frequency', parseInt(e.target.value) || null)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Frequency</option>
                {REPETITION_FREQUENCY_OPTIONS.map(freq => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
              <select
                value={currentPrescription.repetition_interval || ''}
                onChange={(e) => handleInputChange('repetition_interval', parseInt(e.target.value) || null)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Interval</option>
                {REPETITION_INTERVAL_OPTIONS.map(interval => (
                  <option key={interval} value={interval}>{interval}</option>
                ))}
              </select>
              <select
                value={currentPrescription.repetition_unit || 'Days'}
                onChange={(e) => handleInputChange('repetition_unit', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {REPETITION_UNITS.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <select
              value={currentPrescription.quantity || ''}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Quantity</option>
              {QUANTITY_OPTIONS.map(qty => (
                <option key={qty} value={qty}>{qty}</option>
              ))}
            </select>
          </div>

          {/* Period */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Period (Days)</label>
            <input
              type="number"
              value={currentPrescription.period || ''}
              onChange={(e) => handleInputChange('period', parseInt(e.target.value) || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              placeholder="Enter period in days"
            />
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
            <input
              type="text"
              value={currentPrescription.prescription_remarks || ''}
              onChange={(e) => handleInputChange('prescription_remarks', e.target.value)}
              placeholder="Enter remarks"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Reset Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleReset}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Form
          </button>
        </div>
      </div>

      {/* Current Prescription Display */}
      {currentPrescription.drug_name && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Current Prescription</h4>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                {(() => {
                  const template = drugTemplates.find(t => t.drug_name === currentPrescription.drug_name);
                  return (
                    <>
                      <h5 className="text-lg font-semibold text-gray-800">
                        {template?.common_name || currentPrescription.drug_name}
                      </h5>
                      {template?.common_name && (
                        <p className="text-sm text-gray-600 mt-1">Scientific: {currentPrescription.drug_name}</p>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Potency:</span>
                <p className="text-gray-900">{currentPrescription.potency || 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Dosage:</span>
                <p className="text-gray-900">{currentPrescription.dosage || 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Repetition:</span>
                <p className="text-gray-900">
                  {currentPrescription.repetition_frequency && currentPrescription.repetition_interval 
                    ? `${currentPrescription.repetition_frequency} x ${currentPrescription.repetition_interval} ${currentPrescription.repetition_unit}`
                    : 'Not specified'
                  }
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Quantity:</span>
                <p className="text-gray-900">{currentPrescription.quantity || 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Period:</span>
                <p className="text-gray-900">{currentPrescription.period ? `${currentPrescription.period} days` : 'Not specified'}</p>
              </div>
              <div className="md:col-span-3">
                <span className="font-medium text-gray-700">Remarks:</span>
                <p className="text-gray-900">{currentPrescription.prescription_remarks || 'No remarks'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
