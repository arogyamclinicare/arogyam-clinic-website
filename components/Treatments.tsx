import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ArrowRight, Brain, Flower2, Sparkles, Shield, Baby, Zap, Droplets } from 'lucide-react';

export function Treatments() {
  const treatments = [
    {
      title: 'Kidney Stones',
      description: 'Expert homeopathic treatment for kidney stones and urinary health.',
      icon: Droplets,
      color: 'blue'
    },
    {
      title: 'Migraine',
      description: 'Comprehensive natural treatment for chronic headaches and migraines.',
      icon: Brain,
      color: 'blue'
    },
    {
      title: 'PCOS',
      description: 'Holistic approach to managing PCOS and hormonal imbalances.',
      icon: Flower2,
      color: 'sage'
    },
    {
      title: 'Skin Allergy',
      description: 'Gentle remedies for various skin conditions and allergic reactions.',
      icon: Sparkles,
      color: 'blue'
    },
    {
      title: 'Thyroid',
      description: 'Natural thyroid regulation and metabolic balance restoration.',
      icon: Shield,
      color: 'sage'
    },
    {
      title: 'Child Immunity',
      description: 'Boost your child\'s natural immunity with safe homeopathic remedies.',
      icon: Baby,
      color: 'blue'
    },
    {
      title: 'Hairfall',
      description: 'Effective treatment for hair loss and scalp health restoration.',
      icon: Zap,
      color: 'sage'
    }
  ];

  return (
    <section id="treatments" className="py-16 lg:py-24 bg-gradient-to-br from-neutral-50 to-blue-50/30 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-12 lg:mb-16 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-soft border border-neutral-200">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-neutral-700 font-medium text-sm">Our Specializations</span>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-display leading-tight text-neutral-900 max-w-3xl mx-auto">
            Gentle Solutions for{' '}
            <span className="text-blue-600">Every Health Challenge</span>
          </h2>
          
          <p className="text-body-large text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            We offer comprehensive homeopathic solutions for a wide range of health conditions,
            each personalized to your unique needs with natural, gentle remedies.
          </p>
        </div>

        {/* Treatment Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {treatments.map((treatment, index) => (
            <Card
              key={index}
              className="group hover:scale-105 transition-all duration-300 border-0 shadow-soft hover:shadow-lg bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="text-center pb-4 relative">
                <div className="relative z-10">
                  {/* Icon container */}
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 mx-auto rounded-3xl shadow-soft group-hover:shadow-md transition-all duration-300 flex items-center justify-center border ${
                      treatment.color === 'blue' 
                        ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' :
                        'bg-gradient-to-br from-sage-50 to-sage-100 border-sage-200'
                    }`}>
                      <treatment.icon className={`w-8 h-8 group-hover:scale-110 transition-all duration-300 ${
                        treatment.color === 'blue' ? 'text-blue-600' : 'text-sage-600'
                      }`} />
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full shadow-soft opacity-80"></div>
                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-white rounded-full shadow-soft opacity-60"></div>
                  </div>
                  
                  <CardTitle className="text-xl font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors duration-300">
                    {treatment.title}
                  </CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="text-center pb-6 relative z-10">
                <p className="text-neutral-600 leading-relaxed">
                  {treatment.description}
                </p>
              </CardContent>
              
              <CardFooter className="pt-0 relative z-10">
                <Button
                  variant="outline"
                  className={`w-full group-hover:scale-105 transition-all duration-300 rounded-2xl border-2 ${
                    treatment.color === 'blue' 
                      ? 'border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-700' :
                      'border-sage-200 hover:border-sage-400 hover:bg-sage-50 text-sage-700'
                  } bg-white/80 backdrop-blur-sm shadow-soft hover:shadow-md`}
                >
                  <span className="font-medium">Learn More</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <div className="inline-flex items-center space-x-6 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-neutral-200">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center shadow-soft">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-neutral-900 text-lg mb-1">
                Not sure which treatment is right for you?
              </h4>
              <p className="text-neutral-600 text-sm">
                Get a free consultation to find your personalized healing path
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-soft hover:shadow-md transition-all duration-300 px-6">
              Get Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}