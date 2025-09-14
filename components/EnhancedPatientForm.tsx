import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Mail, Eye, EyeOff, Loader2, CheckCircle, AlertCircle,
  Smartphone, MapPin, Calendar, Heart
} from 'lucide-react';

interface FormData {
  email: string;
  password: string;
  name: string;
  phone: string;
  age: string;
  gender: string;
  address: string;
}

interface SimplePatientFormProps {
  isLogin: boolean;
  onSubmit: (data: FormData) => Promise<void>;
  onToggleMode: () => void;
  isLoading?: boolean;
  error?: string;
  success?: string;
}

export function SimplePatientForm({
  isLogin,
  onSubmit,
  onToggleMode,
  isLoading = false,
  error,
  success
}: SimplePatientFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
    phone: '',
    age: '',
    gender: '',
    address: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [validationErrors, setValidationErrors] = useState<Partial<FormData>>({
    // Empty block
  });
  
  // Refs for form fields
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);

  // Simple input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    if (validationErrors[name as keyof FormData]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 6) strength += 1;
      if (/[a-z]/.test(value)) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[^A-Za-z0-9]/.test(value)) strength += 1;
      setPasswordStrength(strength);
    }
  };

  // Password visibility toggle
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // Simple, practical form validation for basic clinic website
  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {
    // Empty block
  };
    
    // Email validation - basic check
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation - simple requirements
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!isLogin && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    // Name validation - allow common characters
    if (!isLogin) {
      if (!formData.name) {
        errors.name = 'Name is required';
      } else if (formData.name.length < 2) {
        errors.name = 'Name must be at least 2 characters';
      }
      
      // Phone validation - simple check
      if (!formData.phone) {
        errors.phone = 'Phone number is required';
      } else if (formData.phone.replace(/\D/g, '').length < 10) {
        errors.phone = 'Please enter a valid phone number';
      }
      
      // Age validation - optional, but if provided must be valid
      if (formData.age && formData.age.trim() !== '') {
        const ageNum = parseInt(formData.age);
        if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
          errors.age = 'Please enter a valid age (1-120)';
        }
      }
      
      // Gender validation - optional
      if (formData.gender && formData.gender.trim() !== '' && !['Male', 'Female', 'Other'].includes(formData.gender)) {
        errors.gender = 'Please select a valid gender option';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Simple form submission for basic clinic website
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Simple form submission
      await onSubmit(formData);
      
    } catch (err) {
      // Error handling is done by parent component
    }
  };

  // Auto-focus first field on mount
  useEffect(() => {
    if (isLogin) {
      emailRef.current?.focus();
    } else {
      nameRef.current?.focus();
    }
  }, [isLogin]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-10 min-h-[600px] flex flex-col">
      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">{success}</span>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800 font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 flex-1">
        {!isLogin && (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="input-name" className="block text-sm font-semibold text-neutral-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={nameRef}
                    id="input-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    autoComplete="name"
                    className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-300 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 ${
                      validationErrors.name ? 'border-red-300' : 'border-neutral-200'
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400">
                    <User className="w-5 h-5" />
                  </div>
                </div>
                {validationErrors.name && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{validationErrors.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="input-phone" className="block text-sm font-semibold text-neutral-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={phoneRef}
                    id="input-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXX XXXXX"
                    required
                    autoComplete="tel"
                    className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-300 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 ${
                      validationErrors.phone ? 'border-red-300' : 'border-neutral-200'
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                </div>
                {validationErrors.phone && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{validationErrors.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="input-age" className="block text-sm font-semibold text-neutral-700">
                  Age
                </label>
                <div className="relative">
                  <input
                    ref={ageRef}
                    id="input-age"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="25"
                    autoComplete="bday-year"
                    min="1"
                    max="120"
                    className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-300 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 ${
                      validationErrors.age ? 'border-red-300' : 'border-neutral-200'
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                {validationErrors.age && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{validationErrors.age}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="input-gender" className="block text-sm font-semibold text-neutral-700">
                  Gender
                </label>
                <div className="relative">
                  <select
                    ref={genderRef}
                    id="input-gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 pr-12 border-2 rounded-xl transition-all duration-300 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 appearance-none ${
                      validationErrors.gender ? 'border-red-300' : 'border-neutral-200'
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 pointer-events-none text-neutral-400">
                    <Heart className="w-5 h-5" />
                  </div>
                </div>
                {validationErrors.gender && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{validationErrors.gender}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="input-address" className="block text-sm font-semibold text-neutral-700">
                Address
              </label>
              <div className="relative">
                <input
                  ref={addressRef}
                  id="input-address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="City, State"
                  autoComplete="address-level2"
                  className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-300 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 ${
                    validationErrors.address ? 'border-red-300' : 'border-neutral-200'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
              {validationErrors.address && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationErrors.address}</span>
                </div>
              )}
            </div>
          </>
        )}

        <div className="space-y-2">
          <label htmlFor="input-email" className="block text-sm font-semibold text-neutral-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              ref={emailRef}
              id="input-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              required
              autoComplete="email"
              className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-300 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 ${
                validationErrors.email ? 'border-red-300' : 'border-neutral-200'
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          {validationErrors.email && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{validationErrors.email}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="input-password" className="block text-sm font-semibold text-neutral-700">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              ref={passwordRef}
              id="input-password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a secure password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              className={`w-full px-4 py-4 pr-16 border-2 rounded-xl transition-all duration-300 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 ${
                validationErrors.password ? 'border-red-300' : 'border-neutral-200'
              }`}
            />
            
            {/* Password visibility toggle */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors touch-manipulation"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            
            {/* Password strength indicator */}
            {!isLogin && formData.password && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-200 rounded-b-xl overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    passwordStrength <= 2 ? 'bg-red-500' :
                    passwordStrength <= 3 ? 'bg-yellow-500' :
                    passwordStrength <= 4 ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
            )}
          </div>
          
          {/* Password strength text */}
          {!isLogin && formData.password && (
            <div className="flex items-center justify-between text-sm">
              <span className={`font-medium ${
                passwordStrength <= 2 ? 'text-red-600' :
                passwordStrength <= 3 ? 'text-yellow-600' :
                passwordStrength <= 4 ? 'text-blue-600' : 'text-green-600'
              }`}>
                {passwordStrength <= 2 ? 'Weak' :
                 passwordStrength <= 3 ? 'Fair' :
                 passwordStrength <= 4 ? 'Good' : 'Strong'}
              </span>
              <span className="text-neutral-500">
                {passwordStrength}/5 criteria met
              </span>
            </div>
          )}
          
          {validationErrors.password && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{validationErrors.password}</span>
            </div>
          )}
        </div>

        {/* Submit Button with Loading State */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
            isLoading
              ? 'bg-neutral-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-sage-600 to-blue-600 hover:from-sage-700 hover:to-blue-700 hover:scale-105 hover:shadow-xl'
          } text-white`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            isLogin ? 'Sign In to Portal' : 'Create Account'
          )}
        </button>
      </form>

      {/* Toggle Mode Button */}
      <div className="mt-8 text-center">
        <p className="text-sm text-neutral-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={onToggleMode}
            disabled={isLoading}
            className="text-sage-600 hover:text-sage-700 font-medium underline transition-colors disabled:opacity-50"
          >
            {isLogin ? "Sign up here" : "Sign in here"}
          </button>
        </p>
      </div>
    </div>
  );
}
