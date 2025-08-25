import { Separator } from './ui/separator';
import { Logo } from './ui/Logo';
import { Heart, Award, CheckCircle } from 'lucide-react';
import { SocialIcons } from './footer/SocialIcons';
import { QUICK_LINKS, LEGAL_LINKS } from './constants/contactInfo';
import { handleNavClick } from './utils/navigation';

interface FooterProps {
  onOpenPrivacyPolicy?: () => void;
  onOpenPatientPortal?: () => void;
  onOpenContact?: () => void;
}

export function Footer({ onOpenPrivacyPolicy, onOpenPatientPortal, onOpenContact }: FooterProps) {
  return (
    <footer id="contact" className="relative bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-indigo-900/95 text-white overflow-hidden backdrop-blur-xl">
      {/* Modern geometric background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-cyan-600/5"></div>
      
      {/* Subtle floating elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      {/* Clean overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            {/* Logo & Description */}
            <div className="space-y-4 lg:space-y-6 animate-fade-in-up text-center md:text-left">
              <div className="text-center md:text-left">
                <div className="mb-4 flex justify-center md:justify-start">
                  <Logo 
                    size="lg" 
                    variant="full" 
                    className="[&>div:last-child]:text-white [&>div:last-child]:hover:text-blue-300"
                  />
                </div>
                <p className="text-neutral-300 leading-relaxed text-sm lg:text-base px-4 md:px-0">
                  Dr. Kajal Kumari provides expert homeopathic care with personalized 
                  treatment plans for optimal health and wellness through compassionate, 
                  gentle natural healing at our Manpur clinic.
                </p>
              </div>
              
              <SocialIcons />
            </div>

            {/* Why Choose Arogyam Section */}
            <div className="space-y-6 animate-fade-in-up text-center md:text-left" style={{ animationDelay: '100ms' }}>
              <div className="text-center md:text-left">
                <h3 className="text-xl lg:text-2xl font-display font-bold text-white mb-3 lg:mb-4">
                  Why Choose <span className="text-cyan-300">Arogyam</span>
                </h3>
                <p className="text-neutral-300 text-sm lg:text-base">
                  Your health and trust matter to us. Experience professional homeopathic care with complete confidence.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { 
                    icon: CheckCircle, 
                    title: 'Secure & Private', 
                    description: 'Your medical information is protected with industry-standard security',
                    color: 'from-blue-500 to-cyan-500'
                  },
                  { 
                    icon: Award, 
                    title: 'BHMS Certified', 
                    description: 'Qualified practitioner with verified credentials and expertise',
                    color: 'from-emerald-500 to-teal-500'
                  },
                  { 
                    icon: Heart, 
                    title: 'Patient Focused', 
                    description: 'Compassionate care tailored to your individual health needs',
                    color: 'from-purple-500 to-pink-500'
                  }
                ].map((item, index) => (
                  <div key={index} className="text-center space-y-3 group">
                    <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 animate-glow`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-neutral-300 text-xs leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Quick Links Section */}
          <div className="mt-12 lg:mt-16 pt-12 lg:pt-16 border-t border-white/20">
            <div className="max-w-4xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-8 lg:mb-12">
                <h3 className="text-2xl lg:text-3xl font-display font-bold text-white mb-3">
                  Quick <span className="text-cyan-300">Navigation</span>
                </h3>
                <p className="text-neutral-300 text-sm lg:text-base max-w-2xl mx-auto">
                  Find what you need quickly with our organized navigation links
                </p>
              </div>

              {/* Quick Links Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
                {QUICK_LINKS.map((link, index) => (
                  <div key={index} className="group">
                    <button
                      onClick={() => {
                        if (link.href === '/patient-portal' && onOpenPatientPortal) {
                          onOpenPatientPortal();
                        } else if (link.href === '/contact' && onOpenContact) {
                          onOpenContact();
                        } else {
                          handleNavClick(link.href, link.isPage);
                        }
                      }}
                      className="w-full bg-white/5 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all duration-300 group-hover:scale-105 text-center min-h-[120px] lg:min-h-[140px] flex flex-col items-center justify-center space-y-3"
                    >
                      {/* Icon based on link type */}
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        {link.name === 'Home' && (
                          <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        )}
                        {link.name === 'About Us' && (
                          <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {link.name === 'Patient Portal' && (
                          <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                        {link.name === 'Contact' && (
                          <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        )}
                        {link.name === 'FAQs' && (
                          <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      
                      {/* Link Text */}
                      <span className="text-white font-medium text-sm lg:text-base group-hover:text-cyan-300 transition-colors duration-300">
                        {link.name}
                      </span>
                      
                      {/* Hover Indicator */}
                      <div className="w-6 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left"></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/20" />

        {/* Bottom Footer */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-neutral-400 text-sm flex items-center space-x-2">
              <Heart className="w-4 h-4 text-blue-400" />
              <span>© 2024 Arogyam. All rights reserved.</span>
            </div>
            <div className="flex space-x-6 text-sm">
              {LEGAL_LINKS.map((link, index) => (
                <button 
                  key={index}
                  onClick={() => {
                    if (link.href === '/privacy-policy' && onOpenPrivacyPolicy) {
                      onOpenPrivacyPolicy();
                    } else {
                      handleNavClick(link.href, link.isPage);
                    }
                  }}
                  className="text-neutral-400 hover:text-white transition-colors duration-300 flex items-center space-x-1 group"
                >
                  <span>{link.name}</span>
                  <div className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}