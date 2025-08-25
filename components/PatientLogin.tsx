import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { usePatientAuth } from './context/PatientAuthContext';
import { patientLoginSchema, sanitizeInput, formatValidationErrors } from '../lib/validation';
import { Shield, User, Lock, Eye, EyeOff } from 'lucide-react';

export function PatientLogin() {
  const { login, loading } = usePatientAuth();
  const [patientId, setPatientId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    // Form submission started
    // Form data logged

    try {
      // Validate input data
      const dataToValidate = { patientId, password };
      // Validating data
      patientLoginSchema.parse(dataToValidate);
              // Validation passed

      // Sanitize inputs
      const sanitizedPatientId = sanitizeInput(patientId);
      const sanitizedPassword = sanitizeInput(password);
      // Sanitized data logged

      // Calling login function
      const result = await login(sanitizedPatientId, sanitizedPassword);
      // Login result received
      
      if (!result.success) {
        setError(result.error || 'Login failed');
        // Login failed
      } else {
        // Login successful
      }
    } catch (error: any) {
      // Error in handleSubmit
      if (error.errors) {
        // Zod validation error
        const formattedErrors = formatValidationErrors(error);
        setValidationErrors(formattedErrors);
        // Validation errors
      } else {
        setError('An unexpected error occurred');
        // Unexpected error
      }
    }
  };

  const handleInputChange = (field: 'patientId' | 'password', value: string) => {
    if (field === 'patientId') {
      setPatientId(value);
    } else {
      setPassword(value);
    }
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear general error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const goHome = () => {
    window.history.pushState({}, '', '/');
    window.location.reload();
  };

  const bookAppointment = () => {
    window.history.pushState({}, '', '/');
    window.location.reload();
    // Scroll to booking section after navigation
    setTimeout(() => {
      const bookingSection = document.getElementById('treatments');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-24 sm:top-28 left-6 sm:left-10 text-blue-300/20 animate-float">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div className="absolute top-36 sm:top-44 right-12 sm:right-20 text-purple-300/20 animate-float animation-delay-1000">
          <User className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="absolute bottom-32 sm:bottom-40 left-12 sm:left-20 text-indigo-300/20 animate-float animation-delay-2000">
          <Lock className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <div className="absolute bottom-16 sm:bottom-20 right-6 sm:right-10 text-blue-300/20 animate-float animation-delay-3000">
          <Eye className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 pt-20 sm:pt-24">
        
        {/* Mobile: Stacked Layout, Desktop: Side by Side */}
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          
          {/* Left Side - Login/Signup Form */}
          <div className="w-full max-w-sm lg:max-w-md order-2 lg:order-1">
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center pb-3 sm:pb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <CardTitle className="text-base sm:text-lg font-bold">Patient Portal Login</CardTitle>
                <p className="text-blue-100 font-medium text-xs">
                  Use the credentials provided after your appointment
                </p>
              </CardHeader>
              
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  {/* Info Message */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 text-sm">🏥 Patient Portal Access</h4>
                    <p className="text-blue-700 text-sm mb-3">
                      Login credentials are provided by our clinic after your appointment booking and consultation.
                    </p>
                    <Button
                      type="button"
                      onClick={bookAppointment}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 rounded-lg font-medium transition-all duration-300 text-sm"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Book Your First Appointment
                    </Button>
                  </div>

                  {/* Patient ID Field */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="patientId" className="block text-sm font-medium text-neutral-700">
                      Patient ID
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <Input
                        id="patientId"
                        type="text"
                        value={patientId}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('patientId', e.target.value)}
                        placeholder="Enter your Patient ID"
                        className="!px-0 !pl-12 !pr-3 h-9 sm:h-10 border-neutral-200 focus:border-blue-500 focus:ring-blue-500/20 text-sm sm:text-base placeholder:text-neutral-400 placeholder:font-normal"
                        required
                      />
                      {validationErrors.patientId && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.patientId}</p>
                      )}
                      {error && validationErrors.patientId && (
                        <p className="text-red-500 text-xs mt-1">{error}</p>
                      )}
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
                        placeholder="Enter your password"
                        className="!px-0 !pl-12 !pr-14 h-9 sm:h-10 border-neutral-200 focus:border-blue-500 focus:ring-blue-500/20 text-sm sm:text-base placeholder:text-neutral-400 placeholder:font-normal"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      {validationErrors.password && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                      )}
                      {error && validationErrors.password && (
                        <p className="text-red-500 text-xs mt-1">{error}</p>
                      )}
                    </div>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 sm:py-2.5 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Signing In...
                      </div>
                    ) : (
                      'Access Patient Portal'
                    )}
                  </Button>

                  {/* Help Section */}
                  <div className="text-center text-sm text-neutral-600">
                    <p className="mb-1.5 sm:mb-2">Don't have login credentials?</p>
                    <p className="text-xs text-neutral-500">
                      Contact our clinic or book an appointment to receive your portal access.
                    </p>
                  </div>

                  {/* Back to Home */}
                  <div className="text-center pt-1.5 sm:pt-2">
                    <Button
                      onClick={goHome}
                      variant="outline"
                      size="sm"
                      className="border-neutral-300 text-neutral-600 hover:bg-neutral-50 text-xs sm:text-sm"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Back to Home
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Additional Info - Mobile Compact */}
            <div className="mt-3 text-center text-blue-100 text-xs lg:hidden">
              <p>Need help? Contact our support team</p>
              <p className="text-blue-200 mt-0.5">Your health data is protected with bank-level security</p>
            </div>
          </div>

          {/* Right Side - Welcome Content */}
          <div className="w-full max-w-sm lg:max-w-md order-1 lg:order-2 text-center lg:text-left">
            {/* Header */}
            <div className="mb-3 sm:mb-4 lg:mb-6 mt-2 sm:mt-4">
              <div className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-400/30 text-blue-100 text-xs font-medium mb-2 sm:mb-3 lg:mb-4">
                <User className="w-3 h-3 mr-1" />
                Patient Portal
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-2 lg:mb-3 leading-tight">
                Patient Portal Access 🏥
              </h1>
              <p className="text-xs sm:text-sm lg:text-lg text-blue-100 mb-2 sm:mb-3 lg:mb-4 leading-relaxed">
                Secure access to your health records and appointment management after consultation
              </p>
            </div>

            {/* Features Grid - Mobile Optimized */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:gap-3 mb-3 sm:mb-4 lg:mb-6">
              <div className="flex flex-col items-center p-2 sm:p-2.5 lg:p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-1 sm:mb-1.5 lg:mb-2">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-300" />
                </div>
                <h3 className="font-semibold text-white text-xs lg:text-sm text-center">Appointments</h3>
                <p className="text-blue-200 text-xs text-center">Easy booking</p>
              </div>

              <div className="flex flex-col items-center p-2 sm:p-2.5 lg:p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-1 sm:mb-1.5 lg:mb-2">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-300" />
                </div>
                <h3 className="font-semibold text-white text-xs lg:text-sm text-center">Health Records</h3>
                <p className="text-blue-200 text-xs text-center">Medical history</p>
              </div>

              <div className="flex flex-col items-center p-2 sm:p-2.5 lg:p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-1 sm:mb-1.5 lg:mb-2">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-purple-300" />
                </div>
                <h3 className="font-semibold text-white text-xs lg:text-sm text-center">Secure Chat</h3>
                <p className="text-blue-200 text-xs text-center">Message doctor</p>
              </div>

              <div className="flex flex-col items-center p-2 sm:p-2.5 lg:p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-orange-500/20 rounded-lg flex items-center justify-center mb-1 sm:mb-1.5 lg:mb-2">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-orange-300" />
                </div>
                <h3 className="font-semibold text-white text-xs lg:text-sm text-center">Video Calls</h3>
                <p className="text-blue-200 text-xs text-center">Remote care</p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 lg:gap-3 text-blue-200 text-xs mb-3 sm:mb-4">
              <div className="flex items-center">
                <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-green-400" />
                HIPAA Compliant
              </div>
              <div className="flex items-center">
                <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-green-400" />
                24/7 Access
              </div>
            </div>

            {/* Additional Info - Desktop Only */}
            <div className="hidden lg:block mt-4 text-center text-blue-100 text-sm">
              <p>Need help? Contact our support team</p>
              <p className="text-blue-200 mt-1">Your health data is protected with bank-level security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
