import { useState, useEffect } from 'react';
import { Phone, X, Heart, ArrowRight } from 'lucide-react';

import { useOptimizedConsultation } from './context/OptimizedConsultationContext';

export function FloatingCTA() {
  const { openBooking } = useOptimizedConsultation();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 5000); // Show after 5 seconds

    return () => clearTimeout(timer);
  }, [isDismissed]);

  const handleCall = () => {
            window.open('/contact', '_self');
  };

  const handleBookConsultation = () => {
    try {
      // handleBookConsultation called
      openBooking('Quick Consultation');
              // Booking opened successfully
    } catch (error) {
      console.error('❌ FloatingCTA: Error opening consultation booking:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl lg:rounded-2xl shadow-2xl p-4 lg:p-4 max-w-xs lg:max-w-sm mx-auto border border-blue-500/20">
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600 transition-colors touch-manipulation min-h-[44px]"
          aria-label="Close floating CTA"
        >
          <X className="w-3 h-3" />
        </button>
        
        <div className="text-center mb-4">
                     <h3 className="font-semibold text-base lg:text-lg mb-1 text-transition">Book FREE Consultation</h3>
                     <p className="text-blue-100 text-xs lg:text-sm text-transition">Expert homeopathic care available now</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
          <button
            onClick={handleCall}
                         className="flex-1 bg-white text-blue-600 hover:bg-blue-50 px-3 lg:px-4 py-3 rounded-lg lg:rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg touch-manipulation min-h-[44px] text-sm lg:text-base btn-text-transition"
          >
            <Phone className="w-4 h-4" />
            <span>Contact</span>
          </button>
          
          <button
            onClick={handleBookConsultation}
                         className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 group transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden text-sm lg:text-base min-h-[44px] btn-text-transition"
          >
            <span className="flex items-center justify-center relative z-10">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 group-hover:bg-blue-200 transition-colors duration-300">
                <Heart className="w-2.5 h-2.5 text-blue-600" />
              </div>
              Book FREE
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-100/30 to-blue-50/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
