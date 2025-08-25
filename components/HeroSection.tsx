import { ArrowRight, Star, Shield, CheckCircle, Heart } from 'lucide-react';
import { useOptimizedConsultation } from './context/OptimizedConsultationContext';

export function HeroSection() {
  const { openBooking } = useOptimizedConsultation();

  const handleConsultationClick = () => {
    openBooking('General Consultation');
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-cyan-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-indigo-900/20 to-cyan-900/20"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-400/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-indigo-400/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>

      {/* Animated Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-cyan-600/10 animate-blob"></div>

      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 lg:py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[80vh]">
          
          {/* Left Side - Main Content */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8 pt-12 sm:pt-16 md:pt-20 lg:pt-24">
            
            {/* Main Heading */}
            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent animate-slide-in-left hero-text-delay-1">
                  Holistic
                </span>
                <br />
                <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent animate-slide-in-right hero-text-delay-2">
                  Natural
                </span>
                <br />
                <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent animate-slide-in-bottom hero-text-delay-3">
                  Healing
                </span>
                <br />
                <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent animate-slide-in-top hero-text-delay-4">
                  Excellence
                </span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-neutral-200 leading-relaxed max-w-2xl animate-fade-in-up hero-subtitle-delay">
                Experience transformative healthcare with Dr. Kajal Kumari's expert homeopathic treatments for comprehensive wellness and natural healing.
              </p>
            </div>

            {/* Main CTA Button with Integrated Free Consultation Badge */}
            <div className="space-y-4 sm:space-y-5 animate-scale-in hero-cta-delay">
              
              <button
                onClick={handleConsultationClick}
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden w-full"
                aria-label="Book your free consultation now"
              >
                <span className="flex items-center justify-center relative z-10">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-300">
                    <Heart className="w-3 h-3 text-blue-600" />
                  </div>
                  Book FREE Consultation
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-100/30 to-blue-50/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
              
              {/* Free Consultation Badge - Optimized for mobile */}
              <div className="flex justify-center px-2">
                <div className="inline-flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 sm:py-2 border border-green-400/30 w-full max-w-xs sm:max-w-none justify-center">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-green-300 font-medium text-center leading-tight">FIRST VISIT FREE CONSULTATION</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Image Placeholder & Badges */}
          <div className="relative">
            {/* 100% NATURAL Badge - Top Right */}
            <div className="absolute top-0 right-0 z-20">
              <div className="bg-gradient-to-r from-green-700 to-green-800 text-white px-4 py-2 rounded-xl font-bold text-center shadow-2xl">
                <div className="text-lg">100%</div>
                <div className="text-sm">NATURAL</div>
              </div>
            </div>

            {/* Image Placeholder - Empty Box for Your Image */}
            <div className="relative w-full h-96 bg-gradient-to-br from-blue-800/30 via-indigo-800/30 to-cyan-800/30 rounded-3xl border-2 border-white/20 backdrop-blur-sm flex items-center justify-center">
              {/* Placeholder Text - Remove this when you add your image */}
              <div className="text-center text-white/60">
                <svg className="w-16 h-16 mx-auto mb-4 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <p className="text-lg font-medium">Your Image Here</p>
                <p className="text-sm opacity-75">Perfect space for clinic photos</p>
              </div>
              
              {/* Add your image here by replacing the div above with: */}
              {/* <img src="/path/to/your/image.jpg" alt="Arogyam Clinic" className="w-full h-full object-cover rounded-3xl" /> */}
            </div>

            {/* Trust Badges - Bottom */}
            <div className="absolute -bottom-4 left-0 right-0 flex justify-center space-x-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 text-center shadow-xl border border-white/30 animate-trust-badge trust-badge-delay-1">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17a1 1 0 00-.356.257l-4 1.714a1 1 0 11-.788-1.838l7-3a1 1 0 00.788 0z" />
                  </svg>
                </div>
                <div className="text-xs font-semibold text-neutral-900">BHMS</div>
                <div className="text-xs text-neutral-600">Qualified</div>
              </div>
              
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 text-center shadow-xl border border-white/30 animate-trust-badge trust-badge-delay-2">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="text-xs font-semibold text-neutral-900">Registered</div>
                <div className="text-xs text-neutral-600">Practitioner</div>
              </div>
              
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 text-center shadow-xl border border-white/30 animate-trust-badge trust-badge-delay-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="text-xs font-semibold text-neutral-900">Multiple</div>
                <div className="text-xs text-neutral-600">Specialties</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Sparkles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-300 rounded-full animate-twinkle"></div>
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-indigo-300 rounded-full animate-twinkle" style={{ animationDelay: '2s' }}></div>
    </section>
  );
}