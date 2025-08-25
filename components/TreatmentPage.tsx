import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { 
  ArrowRight, 
  Phone, 
 
  Wind, 
  Flower2, 
  Home, 
  TreePine, 
  Droplets, 
  Thermometer,
  Clock,
  Shield,
  Heart,
  CheckCircle,

  Stethoscope,
  Lightbulb,
  AlertCircle,
  Star
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function TreatmentPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 lg:pt-28 pb-16 lg:pb-20 bg-gradient-to-br from-blue-50 via-white to-sage-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-soft border border-neutral-200">
                <Wind className="w-4 h-4 text-blue-600" />
                <span className="text-neutral-700 font-medium text-sm">Respiratory Health</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-display leading-tight text-neutral-900">
                  Allergic Rhinitis
                </h1>
                <p className="text-xl lg:text-2xl text-blue-600 font-medium">
                  Natural Relief Through Homeopathy
                </p>
                <p className="text-body-large text-neutral-600 leading-relaxed">
                  Find lasting relief from seasonal and perennial allergic rhinitis with our gentle, 
                  personalized homeopathic treatment approach that addresses root causes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
                >
                  <span className="flex items-center relative z-10">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-300">
                      <Heart className="w-3 h-3 text-blue-600" />
                    </div>
                    Book Online Consultation
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-100/30 to-blue-50/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 px-8 py-4 rounded-xl shadow-soft hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Talk to Doctor
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1584362917165-526a968579e8?w=600&h=500&fit=crop&crop=center"
                  alt="Person breathing fresh air outdoors"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/10 to-transparent"></div>
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-sage-500 to-sage-600 text-white rounded-2xl p-4 shadow-xl">
                <div className="text-center">
                  <div className="text-lg font-display font-bold">100%</div>
                  <div className="text-xs font-medium opacity-90 uppercase tracking-wide">Natural</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
            <h2 className="text-3xl lg:text-4xl font-display text-neutral-900">
              Understanding Allergic Rhinitis
            </h2>
            <div className="space-y-6 text-neutral-600 leading-relaxed">
              <p className="text-body-large">
                Allergic rhinitis, commonly known as hay fever, affects millions of people worldwide. 
                It occurs when your immune system overreacts to airborne allergens, causing inflammation 
                in the nasal passages and surrounding tissues.
              </p>
              <p>
                Homeopathy offers a gentle yet effective approach to treating allergic rhinitis by 
                strengthening your body's natural defense mechanisms and reducing hypersensitivity to allergens. 
                Our personalized treatment plans address not just the symptoms but the underlying constitutional 
                factors that make you susceptible to allergic reactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Causes + Triggers */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-neutral-50 to-blue-50/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center space-y-6 mb-12 animate-fade-in-up">
            <h2 className="text-3xl lg:text-4xl font-display text-neutral-900">
              Common Causes & Triggers
            </h2>
            <p className="text-body-large text-neutral-600 max-w-2xl mx-auto">
              Understanding what triggers your allergic rhinitis is key to effective treatment and prevention.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Environmental Triggers */}
            <div className="space-y-6 animate-fade-in-up">
              <h3 className="text-2xl font-semibold text-neutral-900 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center">
                  <Wind className="w-5 h-5 text-blue-600" />
                </div>
                <span>Environmental Triggers</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Flower2, label: 'Pollen (trees, grass, weeds)' },
                  { icon: Home, label: 'Dust mites' },
                  { icon: TreePine, label: 'Mold spores' },
                  { icon: Wind, label: 'Pet dander' }
                ].map((trigger, index) => (
                  <div key={index} className="bg-white rounded-2xl p-4 shadow-soft border border-neutral-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                        <trigger.icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-neutral-700">{trigger.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aggravating Factors */}
            <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <h3 className="text-2xl font-semibold text-neutral-900 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-sage-50 to-sage-100 rounded-2xl flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-sage-600" />
                </div>
                <span>Aggravating Factors</span>
              </h3>
              <div className="space-y-3">
                {[
                  'Strong odors and perfumes',
                  'Weather changes and humidity',
                  'Stress and emotional factors',
                  'Certain foods (dairy, processed foods)',
                  'Air pollution and smoke',
                  'Hormonal changes'
                ].map((factor, index) => (
                  <div key={index} className="bg-white rounded-xl p-3 shadow-soft border border-neutral-100 flex items-center space-x-3">
                    <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
                    <span className="text-sm text-neutral-700">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Severity Levels */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center space-y-6 mb-12 animate-fade-in-up">
            <h2 className="text-3xl lg:text-4xl font-display text-neutral-900">
              Severity Levels
            </h2>
            <p className="text-body-large text-neutral-600 max-w-2xl mx-auto">
              Allergic rhinitis severity can vary from person to person and season to season.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                level: 'Mild',
                color: 'sage',
                symptoms: [
                  'Occasional sneezing',
                  'Mild nasal congestion',
                  'Slight runny nose',
                  'Minor eye irritation'
                ]
              },
              {
                level: 'Moderate',
                color: 'blue',
                symptoms: [
                  'Frequent sneezing fits',
                  'Persistent nasal congestion',
                  'Continuous runny nose',
                  'Itchy, watery eyes',
                  'Mild fatigue'
                ]
              },
              {
                level: 'Severe',
                color: 'red',
                symptoms: [
                  'Intense sneezing episodes',
                  'Complete nasal blockage',
                  'Profuse nasal discharge',
                  'Severe eye symptoms',
                  'Significant fatigue',
                  'Sleep disturbance',
                  'Reduced concentration'
                ]
              }
            ].map((severity, index) => (
              <Card key={index} className={`hover:scale-105 transition-all duration-300 border-0 shadow-soft hover:shadow-lg rounded-3xl overflow-hidden animate-fade-in-up ${
                severity.level === 'Moderate' ? 'scale-105 shadow-lg' : ''
              }`} style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader className={`text-center pb-4 ${
                  severity.color === 'sage' ? 'bg-gradient-to-br from-sage-50 to-sage-100' :
                  severity.color === 'blue' ? 'bg-gradient-to-br from-blue-50 to-blue-100' :
                  'bg-gradient-to-br from-red-50 to-red-100'
                }`}>
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-3xl shadow-soft flex items-center justify-center ${
                    severity.color === 'sage' ? 'bg-white border-2 border-sage-200' :
                    severity.color === 'blue' ? 'bg-white border-2 border-blue-200' :
                    'bg-white border-2 border-red-200'
                  }`}>
                    <Thermometer className={`w-8 h-8 ${
                      severity.color === 'sage' ? 'text-sage-600' :
                      severity.color === 'blue' ? 'text-blue-600' :
                      'text-red-600'
                    }`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-neutral-900">
                    {severity.level}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {severity.symptoms.map((symptom, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        severity.color === 'sage' ? 'bg-sage-500' :
                        severity.color === 'blue' ? 'bg-blue-500' :
                        'bg-red-500'
                      }`}></div>
                      <span className="text-sm text-neutral-700">{symptom}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Symptoms Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-neutral-50 to-blue-50/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center space-y-6 mb-12 animate-fade-in-up">
            <h2 className="text-3xl lg:text-4xl font-display text-neutral-900">
              Common Symptoms
            </h2>
            <p className="text-body-large text-neutral-600 max-w-2xl mx-auto">
              Recognizing the symptoms helps in early intervention and better management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { symptom: 'Persistent Sneezing', description: 'Frequent, uncontrollable sneezing fits' },
              { symptom: 'Nasal Congestion', description: 'Blocked or stuffy nose making breathing difficult' },
              { symptom: 'Runny Nose', description: 'Clear, watery nasal discharge' },
              { symptom: 'Itchy Eyes', description: 'Red, watery, and irritated eyes' },
              { symptom: 'Postnasal Drip', description: 'Mucus dripping down the throat' },
              { symptom: 'Fatigue', description: 'Feeling tired due to poor sleep quality' },
              { symptom: 'Headaches', description: 'Sinus pressure causing head pain' },
              { symptom: 'Throat Irritation', description: 'Scratchy or sore throat sensation' }
            ].map((item, index) => (
              <Card key={index} className="hover:scale-105 transition-all duration-300 border-0 shadow-soft hover:shadow-md rounded-2xl bg-white animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft">
                    <Droplets className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-neutral-900 mb-2">{item.symptom}</h4>
                  <p className="text-sm text-neutral-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Homeopathy Treatment Plan */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center space-y-6 mb-12 animate-fade-in-up">
            <h2 className="text-3xl lg:text-4xl font-display text-neutral-900">
              Homeopathic Treatment Approach
            </h2>
            <p className="text-body-large text-neutral-600 max-w-2xl mx-auto">
              Our personalized treatment addresses the root cause, not just the symptoms.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-neutral-900">
                  Constitutional Treatment
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  We analyze your complete medical history, lifestyle, stress patterns, and constitutional type 
                  to prescribe remedies that strengthen your immune system and reduce allergic hypersensitivity 
                  from within. This approach provides long-lasting relief rather than temporary suppression.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-neutral-900">Key Homeopathic Remedies:</h4>
                <div className="grid gap-4">
                  {[
                    {
                      name: 'Allium Cepa',
                      use: 'For watery nasal discharge and burning eyes',
                      color: 'blue'
                    },
                    {
                      name: 'Natrum Muriaticum',
                      use: 'For chronic cases with emotional stress factors',
                      color: 'sage'
                    },
                    {
                      name: 'Arsenicum Album',
                      use: 'For burning sensations and restlessness',
                      color: 'blue'
                    }
                  ].map((remedy, index) => (
                    <div key={index} className="bg-gradient-to-r from-neutral-50 to-blue-50/50 rounded-2xl p-4 border border-neutral-200">
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-soft ${
                          remedy.color === 'blue' ? 'bg-gradient-to-br from-blue-50 to-blue-100' :
                          'bg-gradient-to-br from-sage-50 to-sage-100'
                        }`}>
                          <Droplets className={`w-5 h-5 ${
                            remedy.color === 'blue' ? 'text-blue-600' : 'text-sage-600'
                          }`} />
                        </div>
                        <div>
                          <h5 className="font-semibold text-neutral-900">{remedy.name}</h5>
                          <p className="text-sm text-neutral-600">{remedy.use}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-soft">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-2">
                      Personalized Treatment
                    </h4>
                    <p className="text-sm text-neutral-700">
                      Every treatment plan is customized based on your unique symptoms, triggers, 
                      and constitutional type. We don't believe in one-size-fits-all solutions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&h=600&fit=crop&crop=center"
                  alt="Natural homeopathic remedies"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-neutral-50 to-sage-50/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center space-y-6 mb-12 animate-fade-in-up">
            <h2 className="text-3xl lg:text-4xl font-display text-neutral-900">
              Why Choose Homeopathy?
            </h2>
            <p className="text-body-large text-neutral-600 max-w-2xl mx-auto">
              Experience the gentle power of natural healing with proven benefits.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Heart,
                title: 'No Side Effects',
                description: 'Gentle, natural remedies that work with your body\'s healing mechanisms',
                color: 'blue'
              },
              {
                icon: Shield,
                title: 'Long-term Relief',
                description: 'Addresses root causes for lasting results, not just symptom suppression',
                color: 'sage'
              },
              {
                icon: CheckCircle,
                title: 'Holistic Care',
                description: 'Treats the whole person - mind, body, and emotions',
                color: 'blue'
              },
              {
                icon: Clock,
                title: 'Safe for All Ages',
                description: 'Suitable for children, adults, pregnant women, and elderly patients',
                color: 'sage'
              },
              {
                icon: Star,
                title: 'Personalized Treatment',
                description: 'Customized remedies based on your unique constitutional pattern',
                color: 'blue'
              },
              {
                icon: Lightbulb,
                title: 'Immune Strengthening',
                description: 'Boosts natural immunity and reduces allergic hypersensitivity',
                color: 'sage'
              }
            ].map((benefit, index) => (
              <Card key={index} className="hover:scale-105 transition-all duration-300 border-0 shadow-soft hover:shadow-md rounded-3xl overflow-hidden bg-white animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-3xl shadow-soft flex items-center justify-center ${
                    benefit.color === 'blue' ? 'bg-gradient-to-br from-blue-50 to-blue-100' :
                    'bg-gradient-to-br from-sage-50 to-sage-100'
                  }`}>
                    <benefit.icon className={`w-8 h-8 ${
                      benefit.color === 'blue' ? 'text-blue-600' : 'text-sage-600'
                    }`} />
                  </div>
                  <h4 className="font-semibold text-neutral-900 mb-3">{benefit.title}</h4>
                  <p className="text-sm text-neutral-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor's Note */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-r from-blue-50 to-sage-50">
              <CardContent className="p-8 lg:p-12">
                <div className="grid lg:grid-cols-3 gap-8 items-center">
                  <div className="lg:col-span-1">
                    <div className="relative">
                      <div className="w-32 h-32 mx-auto lg:mx-0 rounded-3xl overflow-hidden shadow-lg">
                        <ImageWithFallback
                          src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=center"
                          alt="Dr. Priya Sharma"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-soft">
                        <Stethoscope className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2 text-center lg:text-left">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-display font-semibold text-neutral-900">
                          Dr. Priya Sharma
                        </h3>
                        <p className="text-blue-600 font-medium">Senior Homeopathic Physician</p>
                        <p className="text-sm text-neutral-600">BHMS, MD (Homeopathy) • 15+ Years Experience</p>
                      </div>
                      
                      <blockquote className="text-neutral-700 leading-relaxed italic">
                        "Allergic rhinitis can significantly impact quality of life, but with the right 
                        homeopathic approach, patients can achieve lasting relief. I've seen remarkable 
                        improvements in patients who previously relied on antihistamines for years. 
                        The key is understanding each person's unique pattern and treating the constitutional 
                        susceptibility rather than just managing symptoms."
                      </blockquote>
                      
                      <div className="flex items-center justify-center lg:justify-start space-x-4 pt-4">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm text-neutral-600">1000+ Successful Cases</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-neutral-50 to-blue-50/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center space-y-6 mb-12 animate-fade-in-up">
            <h2 className="text-3xl lg:text-4xl font-display text-neutral-900">
              Frequently Asked Questions
            </h2>
            <p className="text-body-large text-neutral-600 max-w-2xl mx-auto">
              Get answers to common questions about homeopathic treatment for allergic rhinitis.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  question: "How long does homeopathic treatment take to show results?",
                  answer: "Most patients notice initial improvement within 2-4 weeks of starting treatment. For chronic cases, significant improvement typically occurs within 3-6 months. The exact timeline depends on factors like severity, duration of the condition, and individual response to treatment."
                },
                {
                  question: "Can I take homeopathic medicines along with antihistamines?",
                  answer: "Yes, initially you can continue your current medications while starting homeopathic treatment. As your symptoms improve with homeopathic remedies, you can gradually reduce conventional medicines under medical supervision. Many patients eventually stop needing antihistamines altogether."
                },
                {
                  question: "Is homeopathic treatment safe for children with allergies?",
                  answer: "Absolutely! Homeopathic remedies are completely safe for children of all ages, including infants. The medicines are gentle, have no side effects, and often work faster in children due to their higher vitality. We have successfully treated thousands of children with allergic rhinitis."
                },
                {
                  question: "Will the allergies come back after stopping homeopathic treatment?",
                  answer: "Homeopathic treatment aims to cure the underlying susceptibility to allergies. When properly treated, most patients experience long-lasting relief that continues even after stopping the medicines. However, maintaining a healthy lifestyle and avoiding known triggers is important for sustained results."
                },
                {
                  question: "Do I need to follow any dietary restrictions during treatment?",
                  answer: "While there are no strict dietary restrictions with homeopathic treatment, we may recommend avoiding specific trigger foods and substances that worsen your symptoms. We'll provide personalized dietary guidelines based on your individual case and constitutional type."
                }
              ].map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white rounded-2xl border border-neutral-200 shadow-soft hover:shadow-md transition-all duration-300 overflow-hidden animate-fade-in-up"

                >
                  <AccordionTrigger className="px-6 py-6 hover:no-underline text-left">
                    <span className="font-semibold text-neutral-900">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 text-neutral-700 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <Star className="w-4 h-4 text-white" />
                <span className="text-white/90 font-medium text-sm">Free Health Evaluation</span>
              </div>
              
              <h2 className="text-3xl lg:text-5xl font-display text-white leading-tight">
                Ready to Breathe Freely Again?
              </h2>
              
              <p className="text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
                Start your journey towards natural relief from allergic rhinitis with our expert homeopathic care.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
              >
                <span className="flex items-center relative z-10">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-300">
                    <Heart className="w-3 h-3 text-blue-600" />
                  </div>
                  Book Online Consultation
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-100/30 to-blue-50/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-2xl backdrop-blur-sm"
              >
                <Phone className="w-5 h-5 mr-2" />
                Contact Form
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              {[
                { icon: Shield, text: 'Free Consultation' },
                { icon: CheckCircle, text: 'No Side Effects' },
                { icon: Heart, text: 'Personalized Care' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center justify-center space-x-2 text-white/90">
                  <feature.icon className="w-5 h-5" />
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Health Tips Footer */}
      <section className="py-16 bg-gradient-to-br from-sage-50 to-blue-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center space-y-6 mb-12 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-soft border border-neutral-200">
              <Lightbulb className="w-4 h-4 text-sage-600" />
              <span className="text-neutral-700 font-medium text-sm">Helpful Tips</span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-display text-neutral-900">
              Daily Health Tips
            </h2>
            <p className="text-body-large text-neutral-600 max-w-2xl mx-auto">
              Simple lifestyle changes that can help manage your allergic rhinitis naturally.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                tip: 'Stay Hydrated',
                description: 'Drink plenty of filtered water to help thin mucus and reduce nasal congestion.',
                icon: Droplets
              },
              {
                tip: 'Use Air Purifiers',
                description: 'Keep indoor air clean with HEPA filters to reduce allergen exposure.',
                icon: Wind
              },
              {
                tip: 'Manage Stress',
                description: 'Practice deep breathing, yoga, or meditation to reduce stress-related triggers.',
                icon: Heart
              },
              {
                tip: 'Avoid Dairy',
                description: 'Reduce dairy intake during flare-ups as it can increase mucus production.',
                icon: Droplets
              },
              {
                tip: 'Nasal Rinse',
                description: 'Use saline nasal rinses to flush out allergens and moisturize nasal passages.',
                icon: Wind
              },
              {
                tip: 'Monitor Triggers',
                description: 'Keep a symptom diary to identify and avoid your specific triggers.',
                icon: Lightbulb
              }
            ].map((tip, index) => (
              <Card key={index} className="hover:scale-105 transition-all duration-300 border-0 shadow-soft hover:shadow-md rounded-2xl bg-white animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-sage-50 to-sage-100 rounded-2xl flex items-center justify-center shadow-soft flex-shrink-0">
                      <tip.icon className="w-6 h-6 text-sage-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-2">{tip.tip}</h4>
                      <p className="text-sm text-neutral-600 leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Contact Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full w-16 h-16 bg-blue-500 hover:bg-blue-600 shadow-xl hover:shadow-2xl transition-all duration-300 group"
          onClick={() => window.open('/contact', '_self')}
        >
          <Phone className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
        </Button>
      </div>
    </div>
  );
}