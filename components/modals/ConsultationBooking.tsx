import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useSupabase } from '../context/SupabaseContext';
import { consultationBookingSchema, sanitizeInput, formatValidationErrors } from '../../lib/validation';
import { 
  X, 
  Calendar, 
  Phone, 
  CheckCircle,
  Video,
  FileText,
  Shield,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface ConsultationBookingProps {
  isOpen: boolean;
  onClose: () => void;
  treatmentType?: string;
}

type Step = 'booking' | 'confirmation';

interface BookingData {
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  condition: string;
  preferredDate: string;
  preferredTime: string;
  consultationType: 'video' | 'phone';
  treatmentType: string;
}

export function ConsultationBooking({ isOpen, onClose, treatmentType = 'General Consultation' }: ConsultationBookingProps) {
  const { addConsultation } = useSupabase();
  const [currentStep, setCurrentStep] = useState<Step>('booking');
  const [bookingData, setBookingData] = useState<BookingData>({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    condition: '',
    preferredDate: '',
    preferredTime: '',
    consultationType: 'video',
    treatmentType: treatmentType
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Debug logging
  useEffect(() => {
    if (isOpen) {
      // Modal opened - could add analytics here if needed
    } else {
      // Modal closed - cleanup
    }
  }, [isOpen, treatmentType]);

  // Auto-scroll to top when step changes
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const modalContent = document.querySelector('.modal-content-scrollable');
        if (modalContent) {
          modalContent.scrollTop = 0;
        }
      }, 100);
    }
  }, [currentStep, isOpen]);

  const timeSlots = [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM',
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
    '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM'
  ];

  const handleClose = () => {
    setCurrentStep('booking');
    setError(null);
    setBookingId(null);
    setValidationErrors({});
    setBookingData({
      name: '',
      email: '',
      phone: '',
      age: '',
      gender: '',
      condition: '',
      preferredDate: '',
      preferredTime: '',
      consultationType: 'video',
      treatmentType: treatmentType
    });
    onClose();
    document.body.style.overflow = 'unset';
  };

  // Validate booking data
  const validateBookingData = (): boolean => {
    try {
      // Prepare data for validation - use correct field names that match the schema
      const dataToValidate = {
        name: bookingData.name.trim(),
        email: bookingData.email,
        phone: bookingData.phone,
        age: bookingData.age, // Pass as string, let Zod handle conversion
        gender: bookingData.gender as 'male' | 'female' | 'other',
        condition: bookingData.condition,
        preferred_date: bookingData.preferredDate, // This matches the schema field name
        preferred_time: bookingData.preferredTime, // This matches the schema field name
        consultation_type: bookingData.consultationType,
        treatment_type: bookingData.treatmentType
      };

      console.log('🔍 VALIDATION DATA:', dataToValidate);

      // Validate using Zod schema
      const validatedData = consultationBookingSchema.parse(dataToValidate);
      console.log('✅ VALIDATION SUCCESS:', validatedData);
      
      setValidationErrors({});
      return true;
    } catch (error: any) {
      console.error('❌ VALIDATION ERROR:', error);
      if (error.errors) {
        const formattedErrors = formatValidationErrors(error);
        console.log('🔍 FORMATTED ERRORS:', formattedErrors);
        setValidationErrors(formattedErrors);
      }
      return false;
    }
  };

  // Handle input change with sanitization
  const handleInputChange = (field: keyof BookingData, value: string) => {
    console.log(`�� INPUT RECEIVED: ${field} = "${value}"`);
    console.log(`🔍 INPUT TYPE: ${typeof value}`);
    console.log(`🔍 INPUT LENGTH: ${value.length}`);
    
    // For time and date fields, don't sanitize - preserve the exact value
    let processedValue = value;
    if (field === 'preferredTime' || field === 'preferredDate') {
      processedValue = value; // No sanitization for time/date
    } else if (field === 'name' || field === 'condition') {
      // Only remove HTML tags and limit length, preserve spaces
      processedValue = value
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .substring(0, field === 'name' ? 50 : 500); // Limit length based on field
    } else {
      processedValue = sanitizeInput(value);
    }
    
    console.log(`🔍 FINAL VALUE SET: ${field} = "${processedValue}"`);
    console.log(`🔍 PROCESSED LENGTH: ${processedValue.length}`);
    
    setBookingData(prev => ({ ...prev, [field]: processedValue }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Also clear validation errors for the corresponding schema field names
    if (field === 'preferredDate' && validationErrors.preferred_date) {
      setValidationErrors(prev => ({ ...prev, preferred_date: '' }));
    }
    if (field === 'preferredTime' && validationErrors.preferred_time) {
      setValidationErrors(prev => ({ ...prev, preferred_time: '' }));
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    
    // Prevent multiple submissions
    if (isLoading) {
      return;
    }

    console.log('🎯 FORM SUBMIT TRIGGERED');
    console.log('📊 CURRENT FORM STATE:', bookingData);
    console.log('🔍 CURRENT VALIDATION ERRORS:', validationErrors);

    // Check if form has basic required data before even attempting validation
    const hasBasicData = bookingData.name.trim() && 
                        bookingData.phone.trim() && 
                        bookingData.preferredDate && 
                        bookingData.preferredTime;
    
    if (!hasBasicData) {
      console.log('❌ BASIC DATA MISSING - showing user what to fill');
      setError('Please fill in all required fields: Name, Phone, Date, and Time');
      
      // Run validation to show specific field errors
      validateBookingData();
      return;
    }

    // Run immediate validation to show errors right away
    const isValid = validateBookingData();
    if (!isValid) {
      console.log('❌ IMMEDIATE VALIDATION FAILED');
      setError('Please fix the validation errors below');
      return;
    }

    console.log('✅ IMMEDIATE VALIDATION PASSED - proceeding with direct submission');

    // Submit directly instead of using debounced submission
    try {
      setIsLoading(true);
      setError(null);

      // Prepare data for submission
      const consultationData = {
        name: bookingData.name.trim(),
        email: bookingData.email.trim() || 'no email provided',
        phone: bookingData.phone.replace(/\s/g, ''),
        age: parseInt(bookingData.age),
        gender: bookingData.gender,
        condition: bookingData.condition.trim() || null,
        preferred_date: bookingData.preferredDate,
        preferred_time: bookingData.preferredTime,
        consultation_type: bookingData.consultationType,
        treatment_type: bookingData.treatmentType.trim(),
        status: 'pending'
      };

      console.log('📤 SUBMITTING TO DATABASE:', consultationData);

      const result = await addConsultation(consultationData);

      console.log('📥 DATABASE RESPONSE:', result);

      if (result.success) {
        setBookingId(result.data?.id || 'success');
        setCurrentStep('confirmation');
      } else {
        setError(result.error || 'Failed to book consultation');
      }
    } catch (err: any) {
      console.error('💥 SUBMISSION ERROR:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'confirmation') {
      setCurrentStep('booking');
      
      // Scroll modal to top when going back
      setTimeout(() => {
        const modalContent = document.querySelector('.modal-content-scrollable');
        if (modalContent) {
          modalContent.scrollTop = 0;
        }
      }, 100);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'booking': return 'Book Your FREE Consultation';
      case 'confirmation': return 'Booking Confirmed!';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-1 sm:p-2 lg:p-4 bg-black/70 backdrop-blur-xl">
      <div className="card-premium rounded-xl sm:rounded-2xl lg:rounded-3xl max-w-3xl w-full max-h-[98vh] sm:max-h-[95vh] overflow-hidden shadow-2xl animate-scale-in border-0 relative flex flex-col">
        {/* Premium Header - Fixed positioning */}
        <div className="glass-dark rounded-t-2xl sm:rounded-t-3xl border-b border-white/10 p-3 sm:p-4 lg:p-6 flex-shrink-0 mt-2 sm:mt-1 lg:mt-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-3 lg:space-y-4 pt-2 sm:pt-2 lg:pt-0">
            <div className="space-y-2 sm:space-y-3 lg:space-y-4 flex-1 min-w-0">
              <div className="flex items-start justify-between space-x-2 sm:space-x-3 lg:space-x-4">
                <div className="flex items-start space-x-2 sm:space-x-3 lg:space-x-4 flex-1 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center animate-glow flex-shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 pt-3 sm:pt-2 lg:pt-0">
                    <h2 className="text-xs sm:text-base lg:text-xl xl:text-2xl font-display font-bold text-white leading-relaxed break-words max-w-full overflow-visible whitespace-normal">
                      {currentStep === 'booking' ? (
                        <span className="block w-full">
                          <span className="hidden sm:inline">Book Your FREE Consultation</span>
                          <span className="sm:hidden">Book Consultation</span>
                        </span>
                      ) : (
                        getStepTitle()
                      )}
                    </h2>
                     <p className="text-cyan-100 text-xs sm:text-sm lg:text-lg hidden sm:block">
                       {currentStep === 'booking' && 'Experience world-class homeopathic care'}
                       {currentStep === 'confirmation' && 'Your premium consultation is confirmed!'}
                     </p>
                   </div>
                 </div>
                
                {/* Close button - properly positioned for mobile */}
                <button
                  onClick={handleClose}
                  aria-label="Close consultation booking modal"
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 glass rounded-lg sm:rounded-xl lg:rounded-2xl hover:bg-white/20 transition-all duration-300 group flex items-center justify-center touch-manipulation flex-shrink-0"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
              
              {/* Compact Premium features for mobile */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 lg:gap-3">
                <div className="glass rounded-md sm:rounded-lg lg:rounded-full px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 text-xs sm:text-sm lg:text-base font-medium text-cyan-100 border border-white/20">
                  ✨ FREE
                </div>
                <div className="glass rounded-md sm:rounded-lg lg:rounded-full px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 text-xs sm:text-sm lg:text-base font-medium text-cyan-100 border border-white/20">
                  🏆 Expert
                </div>
                <div className="glass rounded-md sm:rounded-lg lg:rounded-full px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 text-xs sm:text-sm lg:text-base font-medium text-cyan-100 border border-white/20">
                  ⚡ Instant
                </div>
              </div>
            </div>
          </div>
          
          {/* Compact Progress Bar */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 lg:space-x-3 mt-3 sm:mt-4 lg:mt-6">
            {['booking', 'confirmation'].map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm lg:text-base font-semibold transition-all duration-300 ${
                  currentStep === step ? 'bg-green-600 text-white' :
                  ['booking', 'confirmation'].indexOf(currentStep) > index ? 'bg-green-600 text-white' :
                  'bg-neutral-200 text-neutral-600'
                }`}>
                  {['booking', 'confirmation'].indexOf(currentStep) > index ? (
                    <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 1 && (
                  <div className={`h-0.5 sm:h-1 lg:h-1.5 flex-1 mx-1.5 sm:mx-2 lg:mx-3 rounded transition-all duration-300 ${
                    ['booking', 'confirmation'].indexOf(currentStep) > index ? 'bg-green-600' : 'bg-neutral-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content - Scrollable area */}
        <div className="p-3 sm:p-4 lg:p-6 overflow-y-auto flex-1 modal-content-scrollable" style={{ scrollBehavior: 'smooth' }}>
          {currentStep === 'booking' && (
                         <form onSubmit={handleSubmit} className="pt-2 sm:pt-4 lg:pt-6 space-y-4 sm:space-y-6 animate-fade-in-up">

              {/* Selected Treatment - Optimized spacing */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 lg:p-5 flex items-center space-x-3 sm:space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-blue-900">Selected Treatment</div>
                  <div className="text-xs sm:text-sm text-blue-700">{treatmentType}</div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-4 text-base border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 touch-manipulation ${
                      validationErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300'
                    }`}
                                         placeholder="Enter your full name"
                    aria-describedby="name-help name-error"
                    autoComplete="name"
                    inputMode="text"
                  />
                  <div id="name-help" className="sr-only">Enter your full name as it appears on official documents</div>
                  {validationErrors.name && (
                    <div id="name-error" className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.name}
                    </div>
                  )}
                </div>
                                 <div>
                   <label className="block text-sm font-medium text-neutral-700 mb-2">Age <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={bookingData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className={`w-full px-4 py-4 text-base border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 touch-manipulation ${
                      validationErrors.age ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300'
                    }`}
                                         placeholder="Enter your age"
                    aria-describedby="age-help age-error"
                    autoComplete="bday-year"
                    inputMode="numeric"
                  />
                  <div id="age-help" className="sr-only">Enter your age in years for personalized consultation (optional)</div>
                  {validationErrors.age && (
                    <div id="age-error" className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.age}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-4 text-base border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 touch-manipulation ${
                      validationErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300'
                    }`}
                    placeholder="your.email@example.com (optional)"
                    aria-describedby="email-help email-error"
                    autoComplete="email"
                    inputMode="email"
                  />

                  {validationErrors.email && (
                    <div id="email-error" className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.email}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-4 text-base border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 touch-manipulation ${
                      validationErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300'
                    }`}
                                         placeholder="+91 XXXXX XXXXX"
                    aria-describedby="phone-help phone-error"
                    autoComplete="tel"
                    inputMode="tel"
                  />
                  <div id="phone-help" className="sr-only">Enter your phone number with country code for consultation contact</div>
                  {validationErrors.phone && (
                    <div id="phone-error" className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.phone}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Gender</label>
                <select
                  value={bookingData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.gender ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300'
                  }`}
                  aria-describedby="gender-error"
                >
                                     <option value="">Select Gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
                {validationErrors.gender && (
                  <div id="gender-error" className="text-red-600 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {validationErrors.gender}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Health Condition / Chief Complaint (Optional)</label>
                <textarea
                  rows={3}
                  value={bookingData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Briefly describe your main health concern or symptoms (you can skip this and discuss during consultation)..."
                />
              </div>

              {/* Consultation Type */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">Consultation Type *</label>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className={`cursor-pointer border-2 rounded-xl p-4 transition-all duration-200 ${
                    bookingData.consultationType === 'video' ? 'border-blue-500 bg-blue-50' : 'border-neutral-300 hover:border-neutral-400'
                  }`}>
                    <input
                      type="radio"
                      name="consultationType"
                      value="video"
                      checked={bookingData.consultationType === 'video'}
                      onChange={(e) => handleInputChange('consultationType', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <Video className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-semibold text-neutral-900">Video Call</p>
                        <p className="text-sm text-neutral-600">HD video consultation</p>
                      </div>
                    </div>
                  </label>
                  <label className={`cursor-pointer border-2 rounded-xl p-4 transition-all duration-200 ${
                    bookingData.consultationType === 'phone' ? 'border-blue-500 bg-blue-50' : 'border-neutral-300 hover:border-neutral-400'
                  }`}>
                    <input
                      type="radio"
                      name="consultationType"
                      value="phone"
                      checked={bookingData.consultationType === 'phone'}
                      onChange={(e) => handleInputChange('consultationType', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <Phone className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-semibold text-neutral-900">Phone Call</p>
                        <p className="text-sm text-neutral-600">Audio consultation</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Preferred Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={getTomorrowDate()}
                    value={bookingData.preferredDate}
                    onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                    className={`w-full px-4 py-4 text-base border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 touch-manipulation ${
                      validationErrors.preferred_date ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300'
                    }`}
                    aria-describedby="date-help date-error"
                  />
                  <div id="date-help" className="sr-only">Select your preferred consultation date (must be tomorrow or later)</div>
                  {validationErrors.preferred_date && (
                    <div id="date-error" className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.preferred_date}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Preferred Time <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={bookingData.preferredTime}
                    onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                    className={`w-full px-4 py-4 text-base border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 touch-manipulation ${
                      validationErrors.preferred_time ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300'
                    }`}
                    aria-describedby="time-error"
                  >
                    <option value="">Select Preferred Time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  {validationErrors.preferred_time && (
                    <div id="time-error" className="text-red-600 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.preferred_time}
                    </div>
                  )}
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Please check your information</p>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

                             {/* Satisfaction Guarantee */}
               <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                 <div className="flex items-start space-x-3">
                   <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                   <div>
                     <p className="text-sm font-medium text-green-800">100% Satisfaction Guarantee</p>
                   </div>
                 </div>
               </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white py-5 sm:py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 touch-manipulation min-h-[56px] relative overflow-hidden group"
                disabled={isLoading}
                aria-describedby="submit-help"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Booking Your FREE Consultation...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center relative z-10">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-white/30 transition-colors duration-300">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    Book FREE Consultation Now
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
              <div id="submit-help" className="sr-only">Click to submit your free consultation booking request</div>

              <div className="text-center">
                <p className="text-sm text-neutral-500">
                  ✅ No payment required • ✅ No hidden charges • ✅ 100% Free consultation
                </p>
              </div>
            </form>
          )}



          {currentStep === 'confirmation' && (
            <div className="text-center space-y-6 pt-2 animate-fade-in-up">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-neutral-900 mb-2">Thank You for Your Booking!</h3>
                <p className="text-neutral-600">
                  We have received your consultation request. You will get confirmation from us shortly.
                </p>
              </div>

              {/* Confirmation Details */}
              <Card className="border-2 border-green-200 bg-green-50 text-left">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-neutral-900">Appointment Details</h4>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Booking ID:</span>
                      <span className="font-mono font-medium">#{bookingId ? bookingId.slice(-8).toUpperCase() : 'AC' + Date.now().toString().slice(-6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Date & Time:</span>
                      <span className="font-medium">{bookingData.preferredDate} at {bookingData.preferredTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Consultation Type:</span>
                      <span className="font-medium capitalize">{bookingData.consultationType} Call</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Treatment Focus:</span>
                      <span className="font-medium">{bookingData.treatmentType}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h4 className="font-semibold text-neutral-900 mb-4">What Happens Next?</h4>
                <div className="space-y-3 text-sm text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">1</div>
                    <span className="text-neutral-700">We'll review your request and confirm availability</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">2</div>
                    <span className="text-neutral-700">You'll receive confirmation via email/SMS within 24 hours</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">3</div>
                    <span className="text-neutral-700">Dr. Kajal will call you at the confirmed time</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 border-2 border-neutral-300 text-neutral-600 hover:bg-neutral-50 py-3 rounded-xl"
                >
                  Book Another Consultation
                </Button>
                <Button
                  onClick={handleClose}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl"
                >
                  Done
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-xl"
                  onClick={() => window.open('/contact', '_self')}
                >
                                      Contact Form
                </Button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">100% Free Consultation Demo</p>
                    <p className="text-sm text-green-700">
                      This demonstrates the complete FREE consultation booking process. No payment required for consultations!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
