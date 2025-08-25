import { Shield, Lock, Eye, Users, FileText, Phone, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';


interface PrivacyPolicyProps {
  onBack?: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  const sections = [
    {
      title: "Information We Collect",
      icon: FileText,
      content: [
        "Personal Information: Name, age, gender, contact details (phone, email, address)",
        "Health Information: Medical history, symptoms, current medications, previous treatments",
        "Communication Records: Consultation notes, appointment records, treatment progress",
        "Technical Information: IP address, browser type, device information for website functionality"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: Users,
      content: [
        "Providing homeopathic consultation and treatment services",
        "Maintaining accurate medical records for continuity of care",
        "Scheduling and managing appointments",
        "Communicating treatment plans and follow-up instructions",
        "Improving our services and patient experience",
        "Legal compliance and regulatory requirements"
      ]
    },
    {
      title: "Information Sharing and Disclosure",
      icon: Shield,
      content: [
        "We do NOT sell, trade, or rent your personal information to third parties",
        "Information may be shared with healthcare professionals only for treatment purposes",
        "Legal disclosure may occur if required by law or court order",
        "Emergency situations where patient safety is at risk",
        "With your explicit written consent for specific purposes"
      ]
    },
    {
      title: "Data Security",
      icon: Lock,
      content: [
        "All personal and health information is encrypted and stored securely",
        "Access to patient data is restricted to authorized healthcare personnel only",
        "Regular security audits and updates to protect against data breaches",
        "Secure communication channels for all patient interactions",
        "HIPAA-compliant data handling practices"
      ]
    },
    {
      title: "Patient Rights",
      icon: Eye,
      content: [
        "Right to access your personal and health information",
        "Right to request corrections to inaccurate information",
        "Right to request deletion of personal data (subject to legal requirements)",
        "Right to restrict processing of your information",
        "Right to data portability",
        "Right to withdraw consent at any time"
      ]
    }
  ];

  const handleContactClick = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleBackClick = () => {
    console.log('Back button clicked in PrivacyPolicy component');
    if (onBack) {
      console.log('Calling onBack function');
      onBack();
    } else {
      console.log('No onBack function, using browser history');
      // Fallback: go back in browser history
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-blue-50">
      {/* Header with Back Button */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 lg:py-16 relative">
        {/* Back Button - Mobile & Desktop */}
        {onBack && (
          <div className="absolute top-4 left-4 lg:top-4 lg:left-4">
            <button
              onClick={handleBackClick}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg transition-all duration-200 backdrop-blur-sm touch-manipulation min-h-[44px] text-sm lg:text-base"
            >
              <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="font-medium">← Back</span>
            </button>
          </div>
        )}
        
        {/* Back Button - Mobile Only (if no onBack) */}
        {!onBack && (
          <div className="absolute top-4 left-4 lg:hidden">
            <button
              onClick={handleBackClick}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm touch-manipulation min-h-[44px] text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">← Back</span>
            </button>
          </div>
        )}
        
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="text-center space-y-4 lg:space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 lg:px-4 lg:py-2 border border-white/20">
              <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              <span className="text-white/90 font-medium text-xs lg:text-sm">Privacy & Security</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-display leading-tight text-white px-2">
              Privacy Policy & Data Protection
            </h1>
            
            <p className="text-sm lg:text-lg text-blue-100 leading-relaxed max-w-2xl mx-auto px-4">
              Your privacy and data security are our top priorities. Learn how we protect your personal and health information.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        {/* Policy Sections */}
        <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12">
          {sections.map((section, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-soft hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-start space-x-4 lg:space-x-6">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="text-xl lg:text-2xl font-display font-bold text-neutral-900">
                      {section.title}
                    </h3>
                    <ul className="space-y-2 lg:space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm lg:text-base text-neutral-700 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 lg:mt-20 text-center">
          <Card className="border-0 shadow-soft bg-gradient-to-br from-blue-50 to-sage-50 rounded-2xl lg:rounded-3xl overflow-hidden max-w-2xl mx-auto">
            <CardContent className="p-6 lg:p-8">
              <div className="space-y-4 lg:space-y-6">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto">
                  <Phone className="w-8 h-8 lg:w-10 lg:h-10 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-display font-bold text-neutral-900 mb-2">
                    Questions About Privacy?
                  </h3>
                  <p className="text-sm lg:text-base text-neutral-600 leading-relaxed">
                    If you have any questions about our privacy policy or data handling practices, 
                    please don't hesitate to contact us.
                  </p>
                </div>
                <Button 
                  onClick={handleContactClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-xl lg:rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 min-h-[44px] lg:min-h-[52px] text-sm lg:text-base"
                >
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
