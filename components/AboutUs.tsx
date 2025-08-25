import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useOptimizedConsultation } from './context/OptimizedConsultationContext';
import { 
  Heart, 
  GraduationCap, 
  MapPin,
  Languages,
  Star,
  Target,
  Baby,
  Zap,
  ArrowRight,
  Award
} from 'lucide-react';

export function AboutUs() {
  const { openBooking } = useOptimizedConsultation();
  
  const specialties = [
    { name: 'Dermatology', icon: Target, description: 'Skin conditions, acne, eczema' },
    { name: 'Hair Specialist', icon: Zap, description: 'Hair loss, baldness treatment' },
    { name: 'Respiratory Care', icon: Heart, description: 'Asthma, allergic rhinitis' },
    { name: 'Women\'s Health', icon: Baby, description: 'PCOD, fertility, menstrual issues' }
  ];

  const successStories = [
    'Chronic Knee Pain Healed Naturally: A senior citizen recovered fully from severe knee pain without surgery.',
    'Restoring Mobility in a Child: A boy with swollen knees regained mobility after homeopathic treatment.',
    'Managing Stress & Infertility: A woman dealing with stress-related infertility conceived naturally with holistic care.',
    'Successfully Treated Psoriasis: A patient suffering from severe psoriasis found lasting relief through individualized homeopathic therapy.',
    'Overcoming Chronic Digestive Issues: A patient with persistent digestive problems found complete relief after treatment for gastritis and food intolerances.'
  ];

  const commitments = [
    'Provide safe, side-effect-free treatments for all ages',
    'Promote better health without dependency on conventional drugs',
    'Spread awareness about the effectiveness of homeopathy',
    'Enhance patient care through research & modern approaches',
    'Empower patients with knowledge and active participation in their healing journey'
  ];



  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-16 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-blue-50 rounded-full px-4 py-2 border border-blue-200">
            <Heart className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 font-medium text-sm">Meet Our Doctor</span>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-display leading-tight text-neutral-900 text-transition">
            Dr. Kajal Kumari
          </h2>
          
          <p className="text-body-large text-neutral-600 max-w-3xl mx-auto leading-relaxed text-transition">
            Highly experienced and qualified homeopathic practitioner with a passion for holistic healing, 
            dedicated to providing personalized treatment for each patient's unique needs.
          </p>
        </div>

        {/* Premium Doctor Profile Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16 lg:mb-24">
          {/* Executive Doctor Presentation */}
          <div className="text-center lg:text-left animate-fade-in-up order-2 lg:order-1">
            <div className="relative inline-block mb-8 lg:mb-12">
              {/* Premium circular doctor image with glass effect */}
              <div className="relative">
                <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto lg:mx-0 rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl lg:shadow-2xl border-2 lg:border-4 border-white/20 group card-premium">
                  <img
                    src="/images/dr-kajal-kumari.jpg"
                    alt="Dr. Kajal Kumari - BHMS"
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent"></div>
                </div>
                
                {/* Premium floating badges - Hidden on small mobile */}
                <div className="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6 glass rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-xl lg:shadow-2xl border border-white/20 animate-float hidden sm:block">
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg lg:rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">Certified</div>
                      <div className="text-sm font-bold text-neutral-900">BHMS</div>
                    </div>
                  </div>
                </div>
                
                {/* Premium experience badge - Hidden on small mobile */}
                <div className="absolute -top-4 -left-4 lg:-top-6 lg:-left-6 glass rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-xl lg:shadow-2xl border border-white/20 animate-float delay-500 hidden sm:block">
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg lg:rounded-xl flex items-center justify-center">
                      <Award className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Expert</div>
                      <div className="text-sm font-bold text-neutral-900">Practitioner</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Executive information card */}
              <div className="card-premium rounded-2xl lg:rounded-3xl p-6 lg:p-8 mt-6 lg:mt-8 space-y-4 lg:space-y-6">
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-neutral-900 mb-2">
                    Dr. Kajal Kumari
                  </h3>
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full px-3 py-2 mb-4 text-xs lg:text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-700 font-semibold">BHMS • Homeopathic Medicine & Surgery</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-transparent rounded-lg lg:rounded-xl">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg lg:rounded-xl flex items-center justify-center">
                      <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">Location</div>
                      <div className="text-sm font-semibold text-neutral-700">Manpur, Gaya</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-transparent rounded-lg lg:rounded-xl">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg lg:rounded-xl flex items-center justify-center">
                      <Languages className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Languages</div>
                      <div className="text-sm font-semibold text-neutral-700">English, Hindi</div>
                    </div>
                  </div>
                </div>
                
                {/* Premium statistics */}
                <div className="grid grid-cols-3 gap-3 lg:gap-4 pt-4 lg:pt-6 border-t border-neutral-100">
                  <div className="text-center">
                    <div className="text-xl lg:text-2xl font-bold text-blue-600">5+</div>
                    <div className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl lg:text-2xl font-bold text-emerald-600">15+</div>
                    <div className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Specializations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl lg:text-2xl font-bold text-purple-600">Holistic</div>
                    <div className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Healing Approach</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Profile Details */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {/* About Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-neutral-900">About Dr. Kajal</h3>
              <p className="text-neutral-600 leading-relaxed">
                I am a highly experienced and qualified homeopathic practitioner with a passion for holistic healing. 
                I have earned my BHMS degree and am a qualified homeopathic practitioner. 
                I take a comprehensive approach to healthcare, ensuring personalized treatment for each patient, 
                and firmly believe in natural healing through homeopathy, which focuses on stimulating the body's 
                own immune system to restore balance and promote self-healing.
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-sage-50 rounded-2xl p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-neutral-900 mb-3">🌿 My Philosophy</h4>
                <p className="text-neutral-700 italic leading-relaxed">
                  "Embrace the power of homeopathy and experience healing the natural way! I believe in providing 
                  safe, side-effect-free treatments for all ages while empowering patients with knowledge and 
                  active participation in their healing journey."
                </p>
              </div>
            </div>

            {/* Specialties */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-neutral-900">Specialties</h4>
              <div className="grid grid-cols-2 gap-4">
                {specialties.map((specialty, index) => (
                  <div key={index} className="bg-gradient-to-r from-white to-blue-50 rounded-2xl p-4 border border-blue-200 group hover:shadow-md transition-all duration-300">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <specialty.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-neutral-900 mb-1">{specialty.name}</h5>
                        <p className="text-xs text-neutral-600">{specialty.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
                onClick={() => {
                  try {
                    // Book Consultation clicked
                    openBooking('General Consultation');
                                          // Booking opened successfully
                  } catch (error) {
                    console.error('❌ AboutUs: Error opening consultation booking:', error);
                  }
                }}
              >
                <span className="flex items-center relative z-10">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-300">
                    <Heart className="w-3 h-3 text-blue-600" />
                  </div>
                  Book Consultation with Dr. Kajal
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-100/30 to-blue-50/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="space-y-6 mb-12 lg:mb-16 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-display text-neutral-900 mb-3 lg:mb-4">
              Inspiring Success Stories
            </h3>
            <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto px-4">
              Real healing journeys from Dr. Kajal's patients who found natural relief through homeopathy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 px-4">
            {successStories.map((story, index) => (
              <Card key={index} className="hover:scale-105 transition-all duration-300 border-0 shadow-soft hover:shadow-md rounded-xl lg:rounded-2xl overflow-hidden bg-white">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-sage-50 to-sage-100 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 lg:w-5 lg:h-5 text-sage-600" />
                    </div>
                    <div>
                      <p className="text-xs lg:text-sm text-neutral-700 leading-relaxed">{story}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Vision & Commitment */}
        <div className="bg-gradient-to-br from-blue-50 to-sage-50 rounded-2xl lg:rounded-3xl p-6 lg:p-8 animate-fade-in-up mx-4 lg:mx-0" style={{ animationDelay: '600ms' }}>
          <div className="text-center space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-display text-neutral-900 mb-3">
                Vision & Commitment to Healthcare
              </h3>
              <p className="text-sm lg:text-base text-neutral-600 max-w-3xl mx-auto leading-relaxed px-2">
                Dr. Kajal is committed to providing the highest quality homeopathic care, empowering patients 
                to achieve optimal health through natural healing methods.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {commitments.map((commitment, index) => (
                <div key={index} className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-soft border border-neutral-200 text-center group hover:shadow-md transition-all duration-300">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg lg:rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <p className="text-xs lg:text-sm text-neutral-700 leading-relaxed">{commitment}</p>
                </div>
              ))}
            </div>
            
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-neutral-200 max-w-sm mx-auto">
              <Heart className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-neutral-700 font-medium text-xs lg:text-sm text-center">🌿 Embrace the power of homeopathy and experience healing the natural way! 🌿</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}