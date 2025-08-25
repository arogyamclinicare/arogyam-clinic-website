'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from './ui/button';
import { Logo } from './ui/Logo';
import { Menu, X } from 'lucide-react';
import { useOptimizedConsultation } from './context/OptimizedConsultationContext';
import { Heart, ArrowRight } from 'lucide-react';
import { useMobileNavigation, useMobileAccessibility, useTouchOptimization } from './hooks/use-mobile-navigation';


interface HeaderProps {
  onContact: () => void;
  onPatientPortal: () => void;
  onHome: () => void;
}

export function Header({
  onContact,
  onPatientPortal,
  onHome
}: HeaderProps) {
  const { openBooking } = useOptimizedConsultation();

  const [isScrolled, setIsScrolled] = useState(false);
  
  // Use optimized mobile navigation hook
  const [mobileState, mobileActions] = useMobileNavigation();
  
  // Use accessibility and touch optimization hooks
  useMobileAccessibility(mobileState.isOpen);
  const touchHandlers = useTouchOptimization();

  // Memoize navigation items to prevent unnecessary re-renders
  const navItems = useMemo(() => [
    { name: 'Home', action: onHome, isPage: true },
    { name: 'About Us', href: '#about-us', isSection: true },
    { name: 'Treatments', href: '#treatments', isSection: true },
    { name: 'Patient Portal', action: onPatientPortal, isPage: true },
    { name: 'FAQs', href: '#faqs', isSection: true },
    { name: 'Contact', action: onContact, isPage: true },
  ], [onHome, onPatientPortal, onContact]);

  // Optimized scroll handler with throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Optimized navigation handler
  const handleNavClick = useCallback((item: any) => {
    console.log('🔍 Header: Navigation item clicked:', item.name);
    
    // Close mobile menu first
    if (mobileState.isOpen) {
      mobileActions.close();
    }

    if (item.isPage && item.action) {
      // Handle page navigation
      console.log('🔵 Header: Calling page action for:', item.name);
      item.action();
    } else if (item.isSection && item.href) {
      // Handle section navigation (scroll to section)
      console.log('🔵 Header: Scrolling to section:', item.href);
      
      // Check if we're on the home page
      const isOnHomePage = window.location.pathname === '/' || window.location.pathname === '/home';
      
      if (!isOnHomePage) {
        // If not on home page, navigate back to home first
        console.log('🔄 Not on home page, navigating to home first...');
        onHome();
        // After navigating to home, scroll to section
        setTimeout(() => {
          const element = document.querySelector(item.href);
          if (element) {
            const headerHeight = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
            window.scrollTo({ 
              top: offsetPosition, 
              behavior: 'smooth' 
            });
            console.log('✅ Scrolled to section after navigation:', item.href);
          }
        }, 100);
        return;
      }
      
      // If on home page, scroll to section
      const element = document.querySelector(item.href);
      if (element) {
        const headerHeight = 80; // Height of fixed header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
        
        window.scrollTo({ 
          top: offsetPosition, 
          behavior: 'smooth' 
        });
        
        console.log('✅ Scrolled to section:', item.href);
      } else {
        console.error('❌ Section not found:', item.href);
      }
    }
  }, [mobileState.isOpen, mobileActions, onHome]);

  // Optimized consultation booking handler
  const handleBookConsultation = useCallback(() => {
    try {
      openBooking('General Consultation');
    } catch (error) {
      console.error('Error opening consultation booking:', error);
    }
  }, [openBooking]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[9997] transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-blue-100' 
          : 'bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 border-b border-white/20'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 lg:h-22">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo 
              size="lg" 
              variant="full" 
              theme={isScrolled ? 'light' : 'dark'}
              onClick={onHome}
              className="cursor-pointer"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              onClick={handleBookConsultation}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Heart className="w-4 h-4 mr-2" />
              Book Consultation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={mobileActions.toggle}
            className="lg:hidden p-2 rounded-lg transition-colors duration-200"
            aria-label="Toggle mobile menu"
            {...touchHandlers}
          >
            {mobileState.isOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileState.isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-xl">
          <div className="container mx-auto px-6 py-4">
            <nav className="space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className="w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-100"
                >
                  {item.name}
                </button>
              ))}
            </nav>
            
            {/* Mobile CTA */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button
                onClick={handleBookConsultation}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-medium transition-all duration-200"
              >
                <Heart className="w-4 h-4 mr-2" />
                Book Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}