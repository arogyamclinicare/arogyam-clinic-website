import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle,
  Stethoscope,
  Calendar,
  Globe,
  Shield
} from 'lucide-react';

export function ContactPage() {

  const clinicFeatures = [
    { icon: Stethoscope, text: "Expert Homeopathic Care" },
    { icon: Calendar, text: "Flexible Appointment Slots" },
    { icon: Globe, text: "Online Consultations Available" },
    { icon: Shield, text: "Registered & Certified Practice" }
  ];

  const handleWhatsAppClick = () => {
    const phoneNumber = '+919876543210';
    const message = 'Hello Dr. Kajal! I have some questions about homeopathic treatment. Can you help me?';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-white pt-16 lg:pt-20">
      {/* Hero Section - Contact Dr. Kajal Kumari */}
      <section className="py-8 lg:py-12 bg-gradient-to-br from-blue-50 via-white to-sage-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="container mx-auto px-4 lg:px-6 relative">
          <div className="text-center space-y-4 lg:space-y-6 mb-8 lg:mb-12">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 lg:px-4 lg:py-2 shadow-soft border border-neutral-200">
              <MessageCircle className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600" />
              <span className="text-neutral-700 font-medium text-xs lg:text-sm">Get In Touch</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display leading-tight text-neutral-900 px-2 text-transition">
              Contact Dr. Kajal Kumari
            </h1>
            
            <p className="text-sm lg:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed px-4 text-transition">
              Reach out to schedule your consultation or ask any questions about 
              homeopathic treatment. We're here to support your healing journey.
            </p>

            {/* Compact CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center px-4">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 lg:px-6 lg:py-3 rounded-lg lg:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group text-sm lg:text-base min-h-[40px] lg:min-h-[44px] btn-text-transition"
                onClick={() => window.open('tel:+919876543210')}
              >
                <Phone className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Call Now
              </Button>
              <Button
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 lg:px-6 lg:py-3 rounded-lg lg:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm lg:text-base min-h-[40px] lg:min-h-[44px] btn-text-transition"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>

          {/* Contact Information - All Together */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 lg:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {/* Phone */}
                <div className="text-center group cursor-pointer" onClick={() => window.open('tel:+919876543210')}>
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-6 h-6 lg:w-7 lg:h-7 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 text-base lg:text-lg mb-1">
                    Phone Number
                  </h3>
                  <p className="text-neutral-700 text-sm lg:text-base font-medium mb-1">
                    +91 98765 43210
                  </p>
                  <p className="text-neutral-500 text-xs lg:text-sm">
                    Available during clinic hours
                  </p>
                </div>

                {/* Email */}
                <div className="text-center group cursor-pointer" onClick={() => window.open('mailto:arogyambihar@gmail.com')}>
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-sage-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-6 h-6 lg:w-7 lg:h-7 text-sage-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 text-base lg:text-lg mb-1">
                    Email Address
                  </h3>
                  <p className="text-neutral-700 text-sm lg:text-base font-medium mb-1">
                    arogyambihar@gmail.com
                  </p>
                  <p className="text-neutral-500 text-xs lg:text-sm">
                    We respond within 24 hours
                  </p>
                </div>

                {/* Address */}
                <div className="text-center group cursor-pointer" onClick={() => window.open('https://www.google.com/maps/place/24%C2%B047\'28.6%22N+85%C2%B001\'20.1%22E/@24.791276,85.022244,15z/data=!4m4!3m3!8m2!3d24.791276!4d85.022244?hl=en-US&entry=ttu&g_ep=EgoyMDI1MDgwNi4wIKXMDSoASAFQAw%3D%3D', '_blank')}>
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 lg:w-7 lg:h-7 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 text-base lg:text-lg mb-1">
                    Clinic Address
                  </h3>
                  <p className="text-neutral-700 text-sm lg:text-base font-medium mb-1">
                    Teacher Colony, Sri Narayan Nagar
                  </p>
                  <p className="text-neutral-500 text-xs lg:text-sm">
                    Manpur, Gaya - 823003 (Nearby ICICI Bank)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinic Hours - Simple Layout */}
      <section className="py-8 lg:py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-xl lg:text-2xl font-display font-semibold text-neutral-900 mb-2">
              Clinic Hours
            </h2>
            <p className="text-neutral-600 text-sm lg:text-base">
              Open 7 days a week for patient convenience
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <div className="bg-blue-50 rounded-lg p-4 lg:p-6 text-center">
                <Clock className="w-8 h-8 lg:w-10 lg:h-10 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-neutral-900 text-lg mb-2">Morning</h3>
                <p className="text-neutral-700 text-base lg:text-lg font-medium">10:00 AM - 2:00 PM</p>
              </div>
              
              <div className="bg-sage-50 rounded-lg p-4 lg:p-6 text-center">
                <Clock className="w-8 h-8 lg:w-10 lg:h-10 text-sage-600 mx-auto mb-3" />
                <h3 className="font-semibold text-neutral-900 text-lg mb-2">Evening</h3>
                <p className="text-neutral-700 text-base lg:text-lg font-medium">6:00 PM - 10:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Clinic - Simple Grid */}
      <section className="py-8 lg:py-12 bg-gradient-to-br from-blue-50 via-white to-sage-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-xl lg:text-2xl font-display font-semibold text-neutral-900 mb-2">
              Why Choose Our Clinic?
            </h2>
            <p className="text-neutral-600 text-sm lg:text-base max-w-2xl mx-auto">
              We provide comprehensive homeopathic care with a focus on patient comfort and natural healing.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-4xl mx-auto">
            {clinicFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white rounded-lg shadow-md flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 lg:w-7 lg:h-7 text-blue-600" />
                </div>
                <p className="text-neutral-700 text-sm lg:text-base font-medium leading-tight">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Maps - COMPLETELY UNTOUCHED */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-4xl font-display text-neutral-900 mb-4">
              Find Us
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Visit our clinic for in-person consultations. We're conveniently located in Teacher Colony, Manpur.
            </p>
          </div>
          
          {/* Coordinates Display */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-50 rounded-full px-4 py-2 border border-blue-200">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-medium text-sm">Exact Location</span>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-2xl border-0">
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-100">
                  <iframe 
                    src="https://maps.google.com/maps?q=24.791276,85.022244&z=13&output=embed" 
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    allowFullScreen={true}
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Arogyam Clinic Location - Manpur, Bihar"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
            
            {/* Additional Map Links */}
            <div className="text-center mt-6 space-y-3">
              <Button
                onClick={() => window.open('https://maps.app.goo.gl/TtWXNWCFBJWqcgRLA', '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Open in Google Maps
              </Button>
              <p className="text-sm text-neutral-500">
                Click to open the full interactive map
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clinic Hours - COMPLETELY UNTOUCHED */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-sage-50 via-white to-blue-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl lg:text-4xl font-display text-neutral-900 mb-8">
              Clinic Hours
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Morning</h3>
                <p className="text-lg text-neutral-700">10:00 AM - 2:00 PM</p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <Clock className="w-12 h-12 text-sage-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Evening</h3>
                <p className="text-lg text-neutral-700">6:00 PM - 10:00 PM</p>
              </div>
            </div>
            
            <p className="text-neutral-600 mt-8">
              <strong>Open 7 days a week</strong> for patient convenience
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}