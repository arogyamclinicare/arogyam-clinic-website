import { useState, useEffect } from 'react';
import { Plus, Trash2, Search, RotateCcw } from 'lucide-react';
import { DrugTemplate, PrescriptionDrug } from '../../lib/supabase';
import { getSupabaseAdmin } from '../../lib/supabase-admin';
import { 
  COMMON_POTENCIES, 
  COMMON_DOSAGES, 
  REPETITION_FREQUENCY_OPTIONS,
  REPETITION_INTERVAL_OPTIONS,
  REPETITION_UNITS,
  QUANTITY_OPTIONS
} from '../../lib/prescription-drug-service';

interface MultiplePrescriptionDrugFormProps {
  consultationId: string;
  initialPrescriptions?: PrescriptionDrug[];
  onPrescriptionsUpdate: (prescriptions: PrescriptionDrug[]) => void;
}

interface PrescriptionDrugFormData {
  id?: string;
  drug_name: string;
  potency: string;
  dosage: string;
  repetition_frequency: number | null;
  repetition_interval: number | null;
  repetition_unit: string;
  quantity: number | null;
  period: number | null;
  remarks: string;
}

export function MultiplePrescriptionDrugForm({ 
  initialPrescriptions = [], 
  onPrescriptionsUpdate 
}: MultiplePrescriptionDrugFormProps) {
  const [drugTemplates, setDrugTemplates] = useState<DrugTemplate[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionDrugFormData[]>([]);
  const [searchQueries, setSearchQueries] = useState<{ [key: number]: string }>({});
  const [isInputFocused, setIsInputFocused] = useState<{ [key: number]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  // Initialize prescriptions from props
  useEffect(() => {
    if (initialPrescriptions.length > 0) {
      const formattedPrescriptions = initialPrescriptions.map(p => ({
        id: p.id,
        drug_name: p.drug_name,
        potency: p.potency || '',
        dosage: p.dosage || '',
        repetition_frequency: p.repetition_frequency,
        repetition_interval: p.repetition_interval,
        repetition_unit: p.repetition_unit || 'Days',
        quantity: p.quantity,
        period: p.period,
        remarks: p.remarks || ''
      }));
      setPrescriptions(formattedPrescriptions);
    } else {
      // Start with one empty prescription
      addNewPrescription();
    }
  }, [initialPrescriptions]);

  // Load drug templates
  useEffect(() => {
    loadDrugTemplates();
  }, []);

  const loadDrugTemplates = async () => {
    try {
      const { data, error } = await (getSupabaseAdmin() as any)
        .from('drug_templates')
        .select('*')
        .order('drug_name', { ascending: true });

      if (error) {
        console.error('❌ Error fetching drug templates:', error);
        setError('Failed to load drug templates');
      } else {
        setDrugTemplates(data || []);
      }
    } catch (err) {
      console.error('❌ Failed to fetch drug templates:', err);
      setError('Failed to load drug templates');
    }
  };

  const addNewPrescription = () => {
    const newPrescription: PrescriptionDrugFormData = {
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
    setPrescriptions(prev => [...prev, newPrescription]);
  };

  const removePrescription = (index: number) => {
    setPrescriptions(prev => prev.filter((_, i) => i !== index));
    // Clean up search queries and focus states
    setSearchQueries(prev => {
      const newQueries = { ...prev };
      delete newQueries[index];
      return newQueries;
    });
    setIsInputFocused(prev => {
      const newFocus = { ...prev };
      delete newFocus[index];
      return newFocus;
    });
  };

  const updatePrescription = (index: number, field: keyof PrescriptionDrugFormData, value: any) => {
    setPrescriptions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleInputChange = (index: number, field: keyof PrescriptionDrugFormData, value: any) => {
    updatePrescription(index, field, value);
    
    // Notify parent component of changes
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index] = { ...updatedPrescriptions[index], [field]: value };
    onPrescriptionsUpdate(updatedPrescriptions as PrescriptionDrug[]);
  };

  const handleSearchChange = (index: number, query: string) => {
    setSearchQueries(prev => ({ ...prev, [index]: query }));
  };

  const handleInputFocus = (index: number) => {
    setIsInputFocused(prev => ({ ...prev, [index]: true }));
  };

  const handleInputBlur = (index: number) => {
    // Delay to allow click on dropdown item
    setTimeout(() => {
      setIsInputFocused(prev => ({ ...prev, [index]: false }));
    }, 200);
  };

  const selectDrug = (index: number, drug: DrugTemplate) => {
    updatePrescription(index, 'drug_name', drug.drug_name);
    setSearchQueries(prev => ({ ...prev, [index]: drug.drug_name }));
    setIsInputFocused(prev => ({ ...prev, [index]: false }));
  };

  const getFilteredDrugs = (index: number) => {
    const query = searchQueries[index] || '';
    if (!query.trim()) {
      return drugTemplates.slice(0, 50); // Show first 50 when no search
    }
    
    return drugTemplates.filter(drug => 
      drug.drug_name.toLowerCase().includes(query.toLowerCase()) ||
      (drug.common_name && drug.common_name.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 50);
  };

  const resetPrescription = (index: number) => {
    const resetPrescription: PrescriptionDrugFormData = {
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
    updatePrescription(index, 'drug_name', resetPrescription.drug_name);
    updatePrescription(index, 'potency', resetPrescription.potency);
    updatePrescription(index, 'dosage', resetPrescription.dosage);
    updatePrescription(index, 'repetition_frequency', resetPrescription.repetition_frequency);
    updatePrescription(index, 'repetition_interval', resetPrescription.repetition_interval);
    updatePrescription(index, 'repetition_unit', resetPrescription.repetition_unit);
    updatePrescription(index, 'quantity', resetPrescription.quantity);
    updatePrescription(index, 'period', resetPrescription.period);
    updatePrescription(index, 'remarks', resetPrescription.remarks);
    setSearchQueries(prev => ({ ...prev, [index]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Prescription Drugs</h3>
        <button
          type="button"
          onClick={addNewPrescription}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Drug
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Prescription Forms */}
      <div className="space-y-4">
        {prescriptions.map((prescription, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            {/* Drug Header */}
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Drug #{index + 1}</h4>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => resetPrescription(index)}
                  className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Reset form"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                {prescriptions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePrescription(index)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    title="Remove drug"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Drug Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Drug Name *
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQueries[index] || prescription.drug_name}
                    onChange={(e) => handleSearchChange(index, e.target.value)}
                    onFocus={() => handleInputFocus(index)}
                    onBlur={() => handleInputBlur(index)}
                    placeholder="Search for a drug..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {/* Dropdown */}
                {isInputFocused[index] && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {getFilteredDrugs(index).map((drug) => (
                      <div
                        key={drug.id}
                        onClick={() => selectDrug(index, drug)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{drug.drug_name}</div>
                        {drug.common_name && (
                          <div className="text-sm text-gray-600">{drug.common_name}</div>
                        )}
                      </div>
                    ))}
                    {getFilteredDrugs(index).length === 0 && (
                      <div className="px-4 py-2 text-gray-500 text-sm">No drugs found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Drug Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Potency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Potency
                </label>
                <select
                  value={prescription.potency}
                  onChange={(e) => handleInputChange(index, 'potency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select potency</option>
                  {COMMON_POTENCIES.map(potency => (
                    <option key={potency} value={potency}>{potency}</option>
                  ))}
                </select>
              </div>

              {/* Dosage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dosage
                </label>
                <select
                  value={prescription.dosage}
                  onChange={(e) => handleInputChange(index, 'dosage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select dosage</option>
                  {COMMON_DOSAGES.map(dosage => (
                    <option key={dosage} value={dosage}>{dosage}</option>
                  ))}
                </select>
              </div>

              {/* Repetition Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Repetition Frequency
                </label>
                <select
                  value={prescription.repetition_frequency || ''}
                  onChange={(e) => handleInputChange(index, 'repetition_frequency', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select frequency</option>
                  {REPETITION_FREQUENCY_OPTIONS.map(freq => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>

              {/* Repetition Interval */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Repetition Interval
                </label>
                <select
                  value={prescription.repetition_interval || ''}
                  onChange={(e) => handleInputChange(index, 'repetition_interval', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select interval</option>
                  {REPETITION_INTERVAL_OPTIONS.map(interval => (
                    <option key={interval} value={interval}>{interval}</option>
                  ))}
                </select>
              </div>

              {/* Repetition Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Repetition Unit
                </label>
                <select
                  value={prescription.repetition_unit}
                  onChange={(e) => handleInputChange(index, 'repetition_unit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {REPETITION_UNITS.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <select
                  value={prescription.quantity || ''}
                  onChange={(e) => handleInputChange(index, 'quantity', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select quantity</option>
                  {QUANTITY_OPTIONS.map(qty => (
                    <option key={qty} value={qty}>{qty}</option>
                  ))}
                </select>
              </div>

              {/* Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Period (days)
                </label>
                <input
                  type="number"
                  value={prescription.period || ''}
                  onChange={(e) => handleInputChange(index, 'period', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="Enter period in days"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Remarks */}
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  value={prescription.remarks}
                  onChange={(e) => handleInputChange(index, 'remarks', e.target.value)}
                  placeholder="Enter any special instructions or remarks..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Prescription Summary</h4>
        <p className="text-sm text-blue-700">
          Total drugs: {prescriptions.length} | 
          Filled drugs: {prescriptions.filter(p => p.drug_name.trim() !== '').length}
        </p>
      </div>
    </div>
  );
}
