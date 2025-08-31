import { useState } from 'react';
import { consultationBookingSchema } from '../../lib/validation';

export function FormDebugTest() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    condition: '',
    preferredDate: '',
    preferredTime: '',
    consultationType: 'video' as const,
    treatmentType: 'General Consultation'
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [validationResult, setValidationResult] = useState<string>('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    try {
      // Prepare data for validation
      const dataToValidate = {
        name: formData.name.trim(),
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        gender: formData.gender as 'male' | 'female' | 'other',
        condition: formData.condition,
        preferred_date: formData.preferredDate,
        preferred_time: formData.preferredTime,
        consultation_type: formData.consultationType,
        treatment_type: formData.treatmentType
      };

      console.log('🔍 VALIDATION DATA:', dataToValidate);

      // Validate using Zod schema
      const validatedData = consultationBookingSchema.parse(dataToValidate);
      console.log('✅ VALIDATION SUCCESS:', validatedData);
      
      setValidationErrors({});
      setValidationResult('✅ Validation passed!');
      return true;
    } catch (error: any) {
      console.error('❌ VALIDATION ERROR:', error);
      if (error.errors) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          const field = err.path.join('.');
          formattedErrors[field] = err.message;
        });
        setValidationErrors(formattedErrors);
        setValidationResult(`❌ Validation failed: ${error.errors.length} error(s)`);
      }
      return false;
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Form Validation Debug Test</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter name"
          />
          {validationErrors.name && (
            <div className="text-red-600 text-sm mt-1">{validationErrors.name}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter email"
          />
          {validationErrors.email && (
            <div className="text-red-600 text-sm mt-1">{validationErrors.email}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter phone"
          />
          {validationErrors.phone && (
            <div className="text-red-600 text-sm mt-1">{validationErrors.phone}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Age</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter age"
          />
          {validationErrors.age && (
            <div className="text-red-600 text-sm mt-1">{validationErrors.age}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {validationErrors.gender && (
            <div className="text-red-600 text-sm mt-1">{validationErrors.gender}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Preferred Date *</label>
          <input
            type="date"
            value={formData.preferredDate}
            onChange={(e) => handleInputChange('preferredDate', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
          />
          {validationErrors.preferred_date && (
            <div className="text-red-600 text-sm mt-1">{validationErrors.preferred_date}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Preferred Time *</label>
          <select
            value={formData.preferredTime}
            onChange={(e) => handleInputChange('preferredTime', e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Time</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="10:30 AM">10:30 AM</option>
            <option value="11:00 AM">11:00 AM</option>
            <option value="11:30 AM">11:30 AM</option>
            <option value="12:00 PM">12:00 PM</option>
            <option value="12:30 PM">12:30 PM</option>
            <option value="02:00 PM">02:00 PM</option>
            <option value="02:30 PM">02:30 PM</option>
            <option value="06:00 PM">06:00 PM</option>
            <option value="06:30 PM">06:30 PM</option>
            <option value="07:00 PM">07:00 PM</option>
            <option value="07:30 PM">07:30 PM</option>
            <option value="08:00 PM">08:00 PM</option>
            <option value="08:30 PM">08:30 PM</option>
            <option value="09:00 PM">09:00 PM</option>
            <option value="09:30 PM">09:30 PM</option>
          </select>
          {validationErrors.preferred_time && (
            <div className="text-red-600 text-sm mt-1">{validationErrors.preferred_time}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Consultation Type</label>
          <select
            value={formData.consultationType}
            onChange={(e) => handleInputChange('consultationType', e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="video">Video Call</option>
            <option value="phone">Phone Call</option>
          </select>
          {validationErrors.consultation_type && (
            <div className="text-red-600 text-sm mt-1">{validationErrors.consultation_type}</div>
          )}
        </div>

        <button
          onClick={validateForm}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Validate Form
        </button>

        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Validation Result:</h3>
          <div className="text-sm">{validationResult}</div>
          
          <h4 className="font-semibold mt-3 mb-2">Current Form Data:</h4>
          <pre className="text-xs bg-white p-2 rounded overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
          
          <h4 className="font-semibold mt-3 mb-2">Validation Errors:</h4>
          <pre className="text-xs bg-white p-2 rounded overflow-auto">
            {JSON.stringify(validationErrors, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
