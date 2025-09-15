import { useState, useEffect } from 'react';
import { Plus, Trash2, Search, RotateCcw } from 'lucide-react';
import { DrugTemplate, PrescriptionDrug } from '../../lib/supabase';
import { getSupabaseAdmin } from '../../lib/supabase-admin';
import { 
  COMMON_POTENCIES
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
  period: number | null;
  remarks: string;
  repeat_start: string;
  repeat_end: string;
  repeat_type: string;
}

export function MultiplePrescriptionDrugForm({ 
  consultationId,
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
        period: p.period,
        remarks: p.remarks || '',
        repeat_start: p.repetition_frequency?.toString() || '',
        repeat_end: p.repetition_interval?.toString() || '',
        repeat_type: p.repetition_unit || ''
      }));
      setPrescriptions(formattedPrescriptions);
      
      // Initialize search queries with existing drug names
      const initialSearchQueries: { [key: number]: string } = {};
      formattedPrescriptions.forEach((prescription, index) => {
        if (prescription.drug_name) {
          initialSearchQueries[index] = prescription.drug_name;
        }
      });
      setSearchQueries(initialSearchQueries);
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
        setError('Failed to load drug templates');
      } else {
        setDrugTemplates(data || []);
      }
    } catch (err) {
      setError('Failed to load drug templates');
    }
  };

  const addNewPrescription = () => {
    const newPrescription: PrescriptionDrugFormData = {
      drug_name: '',
      potency: '',
      period: 0,
      remarks: '',
      repeat_start: '',
      repeat_end: '',
      repeat_type: ''
    };
    const newIndex = prescriptions.length;
    setPrescriptions(prev => [...prev, newPrescription]);
    // Initialize empty search query for the new prescription
    setSearchQueries(prev => ({ ...prev, [newIndex]: '' }));
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
    onPrescriptionsUpdate(updatedPrescriptions as unknown as PrescriptionDrug[]);
  };

  const handleSearchChange = (index: number, query: string) => {
    setSearchQueries(prev => ({ ...prev, [index]: query }));
    // Also update the prescription drug_name as user types
    updatePrescription(index, 'drug_name', query);
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
    // Update the prescription with the selected drug
    updatePrescription(index, 'drug_name', drug.drug_name);
    // Update the search query to show the selected drug name
    setSearchQueries(prev => ({ ...prev, [index]: drug.drug_name }));
    // Close the dropdown
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
      period: 0,
      remarks: '',
      repeat_start: '',
      repeat_end: '',
      repeat_type: ''
    };
    updatePrescription(index, 'drug_name', resetPrescription.drug_name);
    updatePrescription(index, 'potency', resetPrescription.potency);
    updatePrescription(index, 'period', resetPrescription.period);
    updatePrescription(index, 'remarks', resetPrescription.remarks);
    updatePrescription(index, 'repeat_start', resetPrescription.repeat_start);
    updatePrescription(index, 'repeat_end', resetPrescription.repeat_end);
    updatePrescription(index, 'repeat_type', resetPrescription.repeat_type);
    // Reset search query and close dropdown
    setSearchQueries(prev => ({ ...prev, [index]: '' }));
    setIsInputFocused(prev => ({ ...prev, [index]: false }));
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
                    value={searchQueries[index] !== undefined ? searchQueries[index] : prescription.drug_name}
                    onChange={(e) => handleSearchChange(index, e.target.value)}
                    onFocus={() => handleInputFocus(index)}
                    onBlur={() => handleInputBlur(index)}
                    placeholder="Search for a drug..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {/* Dropdown */}
                {isInputFocused[index] && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {getFilteredDrugs(index).map((drug) => (
                      <div
                        key={drug.id}
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent input blur
                          selectDrug(index, drug);
                        }}
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
            </div>

            {/* Repetition Section */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Repetition
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Repeat Start */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Repeat Start
                  </label>
                  <select
                    value={prescription.repeat_start}
                    onChange={(e) => handleInputChange(index, 'repeat_start', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="LA">LA</option>
                  </select>
                </div>

                {/* Repeat End */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Repeat End
                  </label>
                  <select
                    value={prescription.repeat_end}
                    onChange={(e) => handleInputChange(index, 'repeat_end', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select</option>
                    {Array.from({ length: 39 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num.toString()}>{num}</option>
                    ))}
                  </select>
                </div>

                {/* Repeat Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Repeat Type
                  </label>
                  <select
                    value={prescription.repeat_type}
                    onChange={(e) => handleInputChange(index, 'repeat_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select</option>
                    <option value="Week">Week</option>
                    <option value="Days">Days</option>
                    <option value="Hrs">Hrs</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Drug Details Grid - Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

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
