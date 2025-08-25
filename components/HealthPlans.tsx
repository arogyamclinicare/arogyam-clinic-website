import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

import { Check, Star, Heart, Crown, ArrowRight } from 'lucide-react';

export function HealthPlans() {
  const plans = [
    {
      name: 'Basic',
      price: '₹2,999',
      period: '/month',
      description: 'Perfect for individual health needs',
      popular: false,
      color: 'sage',
      icon: Heart,
      features: [
        'Monthly Consultation',
        'Basic Health Assessment',
        'Email Support',
        'Treatment Guidelines',
        'Diet Recommendations'
      ]
    },
    {
      name: 'Standard',
      price: '₹4,999',
      period: '/month',
      description: 'Most comprehensive care package',
      popular: true,
      color: 'blue',
      icon: Star,
      features: [
        '2 Monthly Consultations',
        'Detailed Health Analysis',
        'Priority Phone Support',
        'Custom Treatment Plans',
        'Nutrition Guidance',
        'Follow-up Care',
        'Emergency Support Available'
      ]
    },
    {
      name: 'Premium',
      price: '₹7,999',
      period: '/month',
      description: 'Complete family health solution',
      popular: false,
      color: 'sage',
      icon: Crown,
      features: [
        'Unlimited Consultations',
        'Family Health Plans',
        'Dedicated Health Manager',
        'Advanced Diagnostics',
        'Home Visits Available',
        'Lifestyle Coaching',
        'Preventive Care Programs',
        'Health Monitoring'
      ]
    }
  ];

  return (
    <section id="health-plans" className="py-12 lg:py-24 bg-gradient-to-br from-neutral-50 to-blue-50/30 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 lg:space-y-6 mb-10 lg:mb-16 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-2 lg:px-4 lg:py-2 shadow-soft border border-neutral-200">
            <Star className="w-4 h-4 text-blue-600" />
            <span className="text-neutral-700 font-medium text-xs lg:text-sm">Health Plans</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-display leading-tight text-neutral-900 max-w-3xl mx-auto px-2">
            Choose Your{' '}
            <span className="text-blue-600">Perfect Plan</span>
          </h2>
          
          <p className="text-sm lg:text-body-large text-neutral-600 max-w-2xl mx-auto leading-relaxed px-4">
            Select the perfect plan for your health journey. All plans include
            personalized homeopathic treatment and ongoing compassionate support.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto px-2">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative transition-all duration-300 hover:scale-105 animate-fade-in-up ${
                plan.popular
                  ? 'border-2 border-blue-300 shadow-xl bg-white md:scale-110'
                  : 'border border-neutral-200 shadow-md hover:shadow-lg bg-white/90 backdrop-blur-sm'
              } rounded-2xl lg:rounded-3xl overflow-hidden`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 lg:-top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 lg:px-6 py-2 rounded-full shadow-soft font-medium text-xs lg:text-sm">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Background decoration */}
              <div className={`absolute top-0 right-0 w-32 h-32 opacity-20 transform translate-x-16 -translate-y-8 ${
                plan.color === 'blue' ? 'bg-gradient-to-br from-blue-200 to-blue-300' :
                'bg-gradient-to-br from-sage-200 to-sage-300'
              } rounded-full`}></div>

              <CardHeader className="text-center pb-6 relative z-10">
                {/* Plan icon */}
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl shadow-soft flex items-center justify-center ${
                  plan.color === 'blue' ? 'bg-gradient-to-br from-blue-50 to-blue-100' :
                  'bg-gradient-to-br from-sage-50 to-sage-100'
                }`}>
                  <plan.icon className={`w-8 h-8 ${
                    plan.color === 'blue' ? 'text-blue-600' : 'text-sage-600'
                  }`} />
                </div>
                
                <CardTitle className="text-2xl font-semibold text-neutral-900 mb-2">
                  {plan.name}
                </CardTitle>
                
                <div className="mb-4">
                  <span className="text-4xl font-display font-bold text-neutral-900">
                    {plan.price}
                  </span>
                  <span className="text-neutral-600">{plan.period}</span>
                </div>
                
                <p className="text-neutral-600 text-sm leading-relaxed">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-4 relative z-10">
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex} 
                      className="flex items-center space-x-3 group"
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-soft ${
                        plan.color === 'blue' ? 'bg-gradient-to-br from-blue-50 to-blue-100' :
                        'bg-gradient-to-br from-sage-50 to-sage-100'
                      }`}>
                        <Check className={`w-3 h-3 ${
                          plan.color === 'blue' ? 'text-blue-600' : 'text-sage-600'
                        }`} />
                      </div>
                      <span className="text-neutral-700 text-sm font-medium group-hover:text-neutral-900 transition-colors duration-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="relative z-10">
                <Button
                  className={`w-full rounded-2xl shadow-soft hover:shadow-md transition-all duration-300 group ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : `bg-white border-2 ${
                          plan.color === 'blue' 
                            ? 'border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300' :
                            'border-sage-200 text-sage-700 hover:bg-sage-50 hover:border-sage-300'
                        }`
                  } font-medium py-3`}
                >
                  <span className="flex items-center justify-center">
                    Choose {plan.name}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: '450ms' }}>
          <div className="inline-flex items-center space-x-6 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-neutral-200">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center shadow-soft">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="text-neutral-700 font-medium text-lg mb-1">
                All plans include free initial consultation • Cancel anytime • No hidden fees
              </p>
              <p className="text-neutral-600 text-sm">
                30-day money-back guarantee • Compassionate care always
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}