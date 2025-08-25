import { Clock, Calendar } from 'lucide-react';
import { CONTACT_INFO } from './constants/contactInfo';

export function ClinicHours() {
  return (
    <section className="py-6 lg:py-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
          {/* Hours Info */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-xl lg:rounded-2xl flex items-center justify-center">
                <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base lg:text-lg">Clinic Hours</h3>
                <p className="text-blue-100 text-sm lg:text-base">
                  Morning: {CONTACT_INFO.clinicHours.morning} | Evening: {CONTACT_INFO.clinicHours.evening}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-xl lg:rounded-2xl flex items-center justify-center">
                <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base lg:text-lg">Open Daily</h3>
                <p className="text-blue-100 text-sm lg:text-base">{CONTACT_INFO.clinicHours.days}</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 text-center">
            <div>
              <p className="text-blue-100 text-xs lg:text-sm">Need immediate consultation?</p>
              <p className="font-semibold text-sm lg:text-base">WhatsApp Us Now!</p>
            </div>
            <button
              onClick={() => {
                const phoneNumber = '+919430030564';
                const message = 'Hello! I need immediate consultation. Can you help me?';
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
              className="bg-green-500 text-white hover:bg-green-600 px-4 lg:px-6 py-3 rounded-xl lg:rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 touch-manipulation min-h-[44px] text-sm lg:text-base"
            >
              <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span>WhatsApp Now</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
