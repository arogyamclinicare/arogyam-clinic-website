import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useOptimizedConsultation } from './context/OptimizedConsultationContext';
import { 
  Heart, 
  Leaf, 
  Brain, 
  Baby, 
  Zap, 
  Shield, 
  Target,
  CheckCircle,
  X,
  ArrowRight,
  Star,
  Clock,
  Users
} from 'lucide-react';

interface Treatment {
  id: string;
  title: string;
  shortDescription: string;
  icon: React.ComponentType<any>;
  color: 'blue' | 'green' | 'purple' | 'orange';
  duration: string;
  successRate: string;
  detailedInfo: {
    overview: string;
    conditions: string[];
    approach: string;
    benefits: string[];
    process: string[];
    testimonial?: string;
  };
}

export function TreatmentsSection() {
  const { openBooking } = useOptimizedConsultation();
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const treatments: Treatment[] = [
    {
      id: 'skin-hair',
      title: 'Skin & Hair Disorders',
      shortDescription: 'Natural healing for skin conditions, hair loss, acne, eczema, and dermatitis',
      icon: Heart,
      color: 'blue',
      duration: '3-6 months',
      successRate: 'Natural Healing',
      detailedInfo: {
        overview: 'Dr. Kajal specializes in treating various skin and hair conditions using constitutional homeopathic remedies that address the root cause, not just symptoms.',
        conditions: [
          'Acne and pimples',
          'Hair loss and baldness',
          'Eczema and dermatitis',
          'Psoriasis',
          'Urticaria (hives)',
          'Warts and moles',
          'Premature graying',
          'Dandruff and scalp issues'
        ],
        approach: 'Constitutional treatment focusing on individual symptoms, triggers, and overall health patterns to restore natural balance.',
        benefits: [
          'No side effects or chemical dependency',
          'Addresses root cause of skin problems',
          'Improves overall skin health and glow',
          'Prevents recurrence of conditions',
          'Safe for all ages including children'
        ],
        process: [
          'Detailed case history and symptom analysis',
          'Constitutional remedy selection',
          'Regular follow-ups and monitoring',
          'Lifestyle and dietary guidance',
          'Gradual improvement over 3-6 months'
        ],
        testimonial: 'Chronic psoriasis completely healed in 6 months with Dr. Kajal\'s treatment - no more steroids needed!'
      }
    },
    {
      id: 'respiratory',
      title: 'Respiratory Conditions',
      shortDescription: 'Effective treatment for asthma, allergies, bronchitis, and breathing disorders',
      icon: Leaf,
      color: 'green',
      duration: '2-4 months',
      successRate: '88%',
      detailedInfo: {
        overview: 'Comprehensive respiratory care using homeopathic remedies that strengthen immunity and reduce allergic responses naturally.',
        conditions: [
          'Asthma and wheezing',
          'Allergic rhinitis',
          'Chronic cough',
          'Bronchitis',
          'Sinusitis',
          'Hay fever',
          'Chest congestion',
          'Recurrent cold and flu'
        ],
        approach: 'Individualized treatment based on specific triggers, weather sensitivity, and constitutional type to build lasting immunity.',
        benefits: [
          'Reduces dependency on inhalers',
          'Strengthens respiratory immunity',
          'Prevents seasonal allergies',
          'Improves lung capacity naturally',
          'Safe long-term management'
        ],
        process: [
          'Comprehensive respiratory assessment',
          'Trigger identification and avoidance',
          'Constitutional remedy prescription',
          'Breathing exercises guidance',
          'Progressive improvement monitoring'
        ]
      }
    },
    {
      id: 'womens-health',
      title: 'Women\'s Health & Fertility',
      shortDescription: 'Specialized care for PCOD, irregular periods, infertility, and hormonal imbalances',
      icon: Baby,
      color: 'purple',
      duration: '4-8 months',
      successRate: '85%',
      detailedInfo: {
        overview: 'Dr. Kajal provides compassionate care for women\'s health issues, focusing on hormonal balance and reproductive wellness.',
        conditions: [
          'PCOD/PCOS',
          'Irregular menstruation',
          'Infertility issues',
          'Menopausal symptoms',
          'PMS and mood swings',
          'Thyroid disorders',
          'Recurrent UTIs',
          'Pregnancy-related issues'
        ],
        approach: 'Holistic treatment addressing hormonal imbalances, emotional well-being, and constitutional health for lasting results.',
        benefits: [
          'Natural hormone regulation',
          'Improved fertility outcomes',
          'Reduced PMS symptoms',
          'Better menstrual cycle regulation',
          'Enhanced overall women\'s health'
        ],
        process: [
          'Detailed hormonal health assessment',
          'Lifestyle and stress evaluation',
          'Constitutional remedy selection',
          'Regular monitoring and adjustments',
          'Nutritional and lifestyle guidance'
        ],
        testimonial: 'After 3 years of trying, I conceived naturally within 8 months of Dr. Kajal\'s treatment!'
      }
    },
    {
      id: 'digestive',
      title: 'Digestive Disorders',
      shortDescription: 'Natural relief from gastritis, IBS, acidity, and digestive complaints',
      icon: Target,
      color: 'orange',
      duration: '2-5 months',
      successRate: '90%',
      detailedInfo: {
        overview: 'Comprehensive digestive care addressing root causes of gastrointestinal issues for long-term relief and improved gut health.',
        conditions: [
          'Chronic gastritis',
          'Acid reflux and heartburn',
          'IBS and colitis',
          'Constipation',
          'Bloating and gas',
          'Loss of appetite',
          'Nausea and vomiting',
          'Food intolerances'
        ],
        approach: 'Constitutional treatment combined with dietary guidance to restore digestive harmony and prevent recurrence.',
        benefits: [
          'Long-lasting relief from symptoms',
          'Improved digestion and absorption',
          'Reduced dependency on antacids',
          'Better gut health overall',
          'Prevention of complications'
        ],
        process: [
          'Complete digestive health evaluation',
          'Food trigger identification',
          'Personalized remedy prescription',
          'Dietary modification guidance',
          'Progress monitoring and adjustments'
        ]
      }
    },
    {
      id: 'mental-health',
      title: 'Mental Health & Stress',
      shortDescription: 'Gentle support for anxiety, depression, stress, and emotional well-being',
      icon: Brain,
      color: 'blue',
      duration: '3-6 months',
      successRate: '87%',
      detailedInfo: {
        overview: 'Compassionate mental health care using homeopathic remedies to restore emotional balance and improve psychological well-being.',
        conditions: [
          'Anxiety and panic attacks',
          'Depression and mood disorders',
          'Chronic stress',
          'Insomnia and sleep issues',
          'Irritability and anger',
          'Grief and emotional trauma',
          'Concentration problems',
          'Social anxiety'
        ],
        approach: 'Gentle, non-addictive treatment focusing on individual emotional patterns and constitutional type for lasting mental wellness.',
        benefits: [
          'No dependency or side effects',
          'Improved emotional stability',
          'Better stress management',
          'Enhanced sleep quality',
          'Increased mental clarity'
        ],
        process: [
          'Detailed psychological assessment',
          'Emotional pattern analysis',
          'Constitutional remedy selection',
          'Stress management guidance',
          'Regular emotional wellness monitoring'
        ]
      }
    },
    {
      id: 'chronic-diseases',
      title: 'Chronic Diseases',
      shortDescription: 'Supportive care for diabetes, hypertension, arthritis, and autoimmune conditions',
      icon: Shield,
      color: 'green',
      duration: '6-12 months',
      successRate: '82%',
      detailedInfo: {
        overview: 'Comprehensive management of chronic conditions to improve quality of life and reduce complications through natural healing.',
        conditions: [
          'Diabetes management',
          'Hypertension control',
          'Arthritis and joint pain',
          'Thyroid disorders',
          'Autoimmune conditions',
          'Chronic fatigue',
          'Migraine headaches',
          'Chronic pain management'
        ],
        approach: 'Supportive treatment alongside conventional care to enhance healing, reduce symptoms, and improve overall health outcomes.',
        benefits: [
          'Reduced symptom severity',
          'Better disease management',
          'Improved quality of life',
          'Fewer complications',
          'Enhanced overall wellness'
        ],
        process: [
          'Comprehensive health assessment',
          'Integration with existing treatments',
          'Constitutional remedy prescription',
          'Lifestyle modification support',
          'Long-term progress monitoring'
        ]
      }
    }
  ];

  const openModal = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTreatment(null);
    document.body.style.overflow = 'unset'; // Restore scrolling
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          accent: 'bg-blue-600'
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: 'text-green-600',
          accent: 'bg-green-600'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          icon: 'text-purple-600',
          accent: 'bg-purple-600'
        };
      case 'orange':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          icon: 'text-orange-600',
          accent: 'bg-orange-600'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          accent: 'bg-blue-600'
        };
    }
  };

  return (
    <>
      <section className="py-12 lg:py-24 bg-gradient-to-br from-neutral-50 to-blue-50/30 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-4 lg:space-y-6 mb-10 lg:mb-16 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-blue-50 rounded-full px-3 py-2 lg:px-4 lg:py-2 border border-blue-200">
              <Heart className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-medium text-xs lg:text-sm">Expert Care</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-display leading-tight text-neutral-900 max-w-4xl mx-auto px-2">
              Comprehensive{' '}
              <span className="text-blue-600">Homeopathic Treatments</span>
            </h2>
            
            <p className="text-sm lg:text-body-large text-neutral-600 max-w-3xl mx-auto leading-relaxed px-4">
              Dr. Kajal Kumari provides expert homeopathic care for a wide range of health conditions. 
              Each treatment is personalized to your unique symptoms and constitution for optimal healing.
            </p>
          </div>

          {/* Treatments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 mb-10 lg:mb-12 px-2">
            {treatments.map((treatment, index) => {
              const colors = getColorClasses(treatment.color);
              const IconComponent = treatment.icon;
              
              return (
                <Card 
                  key={treatment.id}
                  className="border border-neutral-200 rounded-2xl lg:rounded-3xl overflow-hidden group cursor-pointer animate-fade-in-up bg-white hover:shadow-xl lg:hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-rotate-1 card-premium"
                  onClick={() => openModal(treatment)}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    transformStyle: 'preserve-3d',
                  }}
                  onMouseEnter={(e) => {
                    const card = e.currentTarget;
                    card.style.transform = 'perspective(1000px) rotateX(10deg) rotateY(5deg) scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    const card = e.currentTarget;
                    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
                  }}
                >
                  <CardContent className="p-0">
                    {/* Light premium header */}
                    <div className={`p-4 lg:p-6 bg-gradient-to-br ${colors.bg} border-b ${colors.border}`}>
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 lg:w-16 lg:h-16 ${colors.accent} rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg animate-pulse-glow`}>
                          <IconComponent className="w-6 h-6 lg:w-8 lg:h-8 text-white group-hover:scale-125 transition-transform duration-300" />
                        </div>
                        <div className={`${colors.bg} border ${colors.border} rounded-full px-2 py-1 lg:px-3 lg:py-1 shadow-sm`}>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className={`text-xs font-bold ${colors.icon}`}>{treatment.successRate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content section */}
                    <div className="p-4 lg:p-6 space-y-3 lg:space-y-4">
                      <div>
                        <h3 className="text-lg lg:text-xl font-display font-bold text-neutral-900 group-hover:text-blue-600 transition-colors mb-2">
                          {treatment.title}
                        </h3>
                        <p className="text-neutral-600 leading-relaxed text-xs lg:text-sm font-body">
                          {treatment.shortDescription}
                        </p>
                      </div>

                      {/* Light stats bar */}
                      <div className={`flex items-center justify-between p-2 lg:p-3 ${colors.bg} rounded-lg lg:rounded-xl border ${colors.border}`}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-5 h-5 lg:w-6 lg:h-6 ${colors.accent} rounded-lg flex items-center justify-center`}>
                            <Clock className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs lg:text-sm font-medium text-neutral-700">{treatment.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-5 h-5 lg:w-6 lg:h-6 ${colors.accent} rounded-lg flex items-center justify-center`}>
                            <Users className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs lg:text-sm font-medium text-neutral-700">{treatment.successRate}</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full py-2 sm:py-2.5 text-xs sm:text-sm group-hover:bg-blue-50 group-hover:border-blue-200 transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(treatment);
                        }}
                      >
                        <span className="flex items-center">
                          <span className="hidden sm:inline">Learn More</span>
                          <span className="sm:hidden">Learn</span>
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>



          {/* CTA Section */}
          <div className="text-center mt-16">
            <Button 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
              onClick={() => {
                try {
                  console.log('🔵 TreatmentsSection: Book FREE Consultation Now clicked');
                  openBooking('General Consultation');
                  console.log('✅ TreatmentsSection: Booking opened successfully');
                } catch (error) {
                  console.error('❌ TreatmentsSection: Error opening consultation booking:', error);
                }
              }}
            >
              <span className="flex items-center relative z-10">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-300">
                  <Heart className="w-3 h-3 text-blue-600" />
                </div>
                Book FREE Consultation Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-100/30 to-blue-50/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Button>
          </div>
        </div>
      </section>
      {isModalOpen && selectedTreatment && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeModal}
          style={{ paddingTop: '20vh', paddingBottom: '5vh' }}
        >
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl transform animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
                         {/* Modal Header */}
             <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-neutral-200 p-4 sm:p-6 z-10">
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                   <div className={`w-10 h-10 sm:w-12 sm:h-12 ${getColorClasses(selectedTreatment.color).bg} rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0`}>
                     <selectedTreatment.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${getColorClasses(selectedTreatment.color).icon}`} />
                   </div>
                   <h2 className="text-lg sm:text-xl lg:text-2xl font-display font-semibold text-neutral-900">
                     {selectedTreatment.title}
                   </h2>
                 </div>
                 <button
                   onClick={closeModal}
                   className="w-8 h-8 sm:w-10 sm:h-10 bg-neutral-100 hover:bg-neutral-200 rounded-full flex items-center justify-center transition-colors duration-200 flex-shrink-0 ml-2"
                 >
                   <X className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600" />
                 </button>
               </div>
             </div>

                         {/* Modal Content */}
             <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                             {/* Overview */}
               <div>
                 <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-3">Treatment Overview</h3>
                 <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">{selectedTreatment.detailedInfo.overview}</p>
               </div>

                             {/* Stats */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                 <div className="bg-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                   <div className="flex items-center space-x-2 sm:space-x-3">
                     <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                     <div className="min-w-0">
                       <p className="font-semibold text-neutral-900 text-sm sm:text-base">Treatment Duration</p>
                       <p className="text-neutral-600 text-sm">{selectedTreatment.duration}</p>
                     </div>
                   </div>
                 </div>
                 <div className="bg-green-50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                   <div className="flex items-center space-x-2 sm:space-x-3">
                     <Star className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                     <div className="min-w-0">
                       <p className="font-semibold text-neutral-900 text-sm sm:text-base">Success Rate</p>
                       <p className="text-neutral-600 text-sm">{selectedTreatment.successRate} patient satisfaction</p>
                     </div>
                   </div>
                 </div>
               </div>

                             {/* Conditions */}
               <div>
                 <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-3 sm:mb-4">Conditions Treated</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                   {selectedTreatment.detailedInfo.conditions.map((condition, index) => (
                     <div key={index} className="flex items-center space-x-2 py-1">
                       <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                       <span className="text-neutral-700 text-sm sm:text-base">{condition}</span>
                     </div>
                   ))}
                 </div>
               </div>

               {/* Approach */}
               <div>
                 <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-3">Our Approach</h3>
                 <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">{selectedTreatment.detailedInfo.approach}</p>
               </div>

               {/* Benefits */}
               <div>
                 <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-3 sm:mb-4">Key Benefits</h3>
                 <div className="space-y-2">
                   {selectedTreatment.detailedInfo.benefits.map((benefit, index) => (
                     <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                       <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                       <span className="text-neutral-700 text-sm sm:text-base">{benefit}</span>
                     </div>
                   ))}
                 </div>
               </div>

               {/* Process */}
               <div>
                 <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-3 sm:mb-4">Treatment Process</h3>
                 <div className="space-y-3">
                   {selectedTreatment.detailedInfo.process.map((step, index) => (
                     <div key={index} className="flex items-start space-x-3 sm:space-x-4">
                       <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
                         {index + 1}
                       </div>
                       <span className="text-neutral-700 text-sm sm:text-base pt-0.5 sm:pt-1">{step}</span>
                     </div>
                   ))}
                 </div>
               </div>

               {/* Testimonial */}
               {selectedTreatment.detailedInfo.testimonial && (
                 <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
                   <div className="flex items-start space-x-3 sm:space-x-4">
                     <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                       <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                     </div>
                     <div className="min-w-0">
                       <h4 className="font-semibold text-neutral-900 mb-2 text-sm sm:text-base">Patient Success Story</h4>
                       <p className="text-neutral-700 italic leading-relaxed text-sm sm:text-base">"{selectedTreatment.detailedInfo.testimonial}"</p>
                     </div>
                   </div>
                 </div>
               )}

               {/* CTA */}
               <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center text-white">
                 <h3 className="text-lg sm:text-xl font-semibold mb-3">Ready to Start Your Healing Journey?</h3>
                 <p className="text-blue-100 mb-4 text-sm sm:text-base">Book a consultation with Dr. Kajal to discuss your specific needs</p>
                 <Button 
                   className="bg-white text-blue-600 hover:bg-blue-50 px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 group transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden w-full sm:w-auto"
                   onClick={() => {
                     try {
                       console.log('🔵 TreatmentsSection: Book FREE Consultation Now clicked');
                       closeModal();
                       setTimeout(() => {
                         openBooking(selectedTreatment?.title || 'General Consultation');
                       }, 300);
                       console.log('✅ TreatmentsSection: Booking opened successfully');
                     } catch (error) {
                       console.error('❌ TreatmentsSection: Error opening consultation booking:', error);
                     }
                   }}
                 >
                   <span className="flex items-center justify-center relative z-10">
                     <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 group-hover:bg-blue-200 transition-colors duration-300">
                       <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                     </div>
                     <span className="text-sm sm:text-base">Book FREE Consultation Now</span>
                     <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                   </span>
                   <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-100/30 to-blue-50/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                 </Button>
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
