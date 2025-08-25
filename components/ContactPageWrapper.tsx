import { ContactPage } from './ContactPage';
import { ArrowLeft } from 'lucide-react';

interface ContactPageWrapperProps {
  onBack: () => void;
}

export function ContactPageWrapper({ onBack }: ContactPageWrapperProps) {
  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="absolute top-20 left-4 z-10">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
      </div>

      <ContactPage />
    </div>
  );
}
