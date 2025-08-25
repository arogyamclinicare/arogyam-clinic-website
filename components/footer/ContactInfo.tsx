import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { CONTACT_INFO } from '../constants/contactInfo';

export function ContactInfo() {
  return (
    <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      <h4 className="font-semibold text-white text-lg mb-6">Contact Info</h4>
      
      <div className="space-y-4">
        {/* Phone */}
        <button
          onClick={() => window.open('/contact', '_self')}
          className="w-full text-left p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-blue-300 text-xs font-medium mb-1">Contact</p>
              <p className="text-white font-semibold">{CONTACT_INFO.phone}</p>
            </div>
          </div>
        </button>

        {/* Email */}
        <button
          onClick={() => window.open(`mailto:${CONTACT_INFO.email}`)}
          className="w-full text-left p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-green-300 text-xs font-medium mb-1">Email</p>
              <p className="text-white font-semibold">{CONTACT_INFO.email}</p>
            </div>
          </div>
        </button>

        {/* Address */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-purple-300 text-xs font-medium mb-2">Address</p>
              <div className="text-white text-sm space-y-1">
                <p className="font-semibold">{CONTACT_INFO.address.line1}</p>
                <p className="text-neutral-300">{CONTACT_INFO.address.line2}</p>
                <p className="text-neutral-400 text-xs">{CONTACT_INFO.address.landmark}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Clinic Hours */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Clock className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <p className="text-orange-300 text-xs font-medium mb-2">Clinic Hours</p>
              <div className="space-y-1 text-sm">
                <p className="text-white">Morning: {CONTACT_INFO.clinicHours.morning}</p>
                <p className="text-white">Evening: {CONTACT_INFO.clinicHours.evening}</p>
                <p className="text-neutral-400 text-xs mt-2">{CONTACT_INFO.clinicHours.note}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}