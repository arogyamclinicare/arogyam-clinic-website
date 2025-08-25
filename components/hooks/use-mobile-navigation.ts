import { useState, useEffect, useCallback, useRef } from 'react';

interface MobileNavigationState {
  isOpen: boolean;
  isAnimating: boolean;
  devicePerformance: 'low' | 'medium' | 'high';
  supportsTouch: boolean;
  supportsReducedMotion: boolean;
}

interface MobileNavigationActions {
  open: () => void;
  close: () => void;
  toggle: () => void;
  setPerformanceMode: (mode: 'low' | 'medium' | 'high') => void;
}

/**
 * Optimized mobile navigation hook with performance monitoring
 * Automatically detects device capabilities and adjusts animations accordingly
 */
export function useMobileNavigation(): [MobileNavigationState, MobileNavigationActions] {
  const [state, setState] = useState<MobileNavigationState>({
    isOpen: false,
    isAnimating: false,
    devicePerformance: 'medium',
    supportsTouch: false,
    supportsReducedMotion: false,
  });

  const animationTimeoutRef = useRef<NodeJS.Timeout>();
  const performanceTestRef = useRef<number>();

  // Detect device capabilities
  useEffect(() => {
    const detectCapabilities = () => {
      const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const supportsReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      setState(prev => ({
        ...prev,
        supportsTouch,
        supportsReducedMotion,
      }));
    };

    detectCapabilities();
    window.addEventListener('resize', detectCapabilities);
    return () => window.removeEventListener('resize', detectCapabilities);
  }, []);

  // Performance detection using frame rate monitoring - Only run when mobile menu is open
  useEffect(() => {
    const measurePerformance = () => {
      let frameCount = 0;
      let lastTime = performance.now();
      
      const countFrames = (currentTime: number) => {
        frameCount++;
        
        if (currentTime - lastTime >= 1000) {
          const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          
          let devicePerformance: 'low' | 'medium' | 'high';
          if (fps < 30) devicePerformance = 'low';
          else if (fps < 50) devicePerformance = 'medium';
          else devicePerformance = 'high';
          
          setState(prev => ({
            ...prev,
            devicePerformance,
          }));
          
          frameCount = 0;
          lastTime = currentTime;
        }
        
        performanceTestRef.current = requestAnimationFrame(countFrames);
      };
      
      performanceTestRef.current = requestAnimationFrame(countFrames);
      
      return () => {
        if (performanceTestRef.current) {
          cancelAnimationFrame(performanceTestRef.current);
        }
      };
    };

    // Only run performance test on mobile devices AND when menu is open
    if (window.innerWidth <= 768 && state.isOpen) {
      const cleanup = measurePerformance();
      return cleanup;
    }
  }, [state.isOpen]); // Only re-run when menu state changes

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (performanceTestRef.current) {
        cancelAnimationFrame(performanceTestRef.current);
      }
    };
  }, []);

  // Optimized open function with performance-based animation timing
  const open = useCallback(() => {
    if (state.isOpen || state.isAnimating) return;

    setState(prev => ({ ...prev, isAnimating: true }));
    
    // Adjust animation duration based on device performance
    const animationDuration = state.devicePerformance === 'low' ? 150 : 
                            state.devicePerformance === 'medium' ? 200 : 300;
    
    // Use requestAnimationFrame for smooth opening
    requestAnimationFrame(() => {
      setState(prev => ({ ...prev, isOpen: true }));
      
      animationTimeoutRef.current = setTimeout(() => {
        setState(prev => ({ ...prev, isAnimating: false }));
      }, animationDuration);
    });
  }, [state.isOpen, state.isAnimating, state.devicePerformance]);

  // Optimized close function
  const close = useCallback(() => {
    if (!state.isOpen) return;

    setState(prev => ({ ...prev, isAnimating: true }));
    
    const animationDuration = state.devicePerformance === 'low' ? 100 : 
                            state.devicePerformance === 'medium' ? 150 : 200;
    
    animationTimeoutRef.current = setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        isOpen: false, 
        isAnimating: false 
      }));
    }, animationDuration);
  }, [state.isOpen, state.devicePerformance]);

  // Toggle function
  const toggle = useCallback(() => {
    if (state.isOpen) {
      close();
    } else {
      open();
    }
  }, [state.isOpen, open, close]);

  // Manual performance mode setting
  const setPerformanceMode = useCallback((mode: 'low' | 'medium' | 'high') => {
    setState(prev => ({ ...prev, devicePerformance: mode }));
  }, []);

  return [
    state,
    { open, close, toggle, setPerformanceMode }
  ];
}

/**
 * Hook for managing mobile menu accessibility
 */
export function useMobileAccessibility(isOpen: boolean) {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus management
      const focusableElements = document.querySelectorAll(
        '.mobile-menu button, .mobile-menu a, .mobile-menu input, .mobile-menu select, .mobile-menu textarea'
      );
      
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
      
      // Trap focus within mobile menu
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
          
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };
      
      document.addEventListener('keydown', handleTabKey);
      
      return () => {
        document.removeEventListener('keydown', handleTabKey);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);
}

/**
 * Hook for optimizing touch interactions on mobile
 */
export function useTouchOptimization() {
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
    setTouchStartX(e.touches[0].clientX);
  }, []);
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartY || !touchStartX) return;
    
    const touchEndY = e.touches[0].clientY;
    const touchEndX = e.touches[0].clientX;
    
    const deltaY = touchStartY - touchEndY;
    const deltaX = touchStartX - touchEndX;
    
    // Prevent horizontal scrolling on mobile menu by using CSS instead of preventDefault
    // This avoids the passive event listener error
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      // Instead of preventDefault, we'll handle this with CSS overflow-x: hidden
      // or by using touch-action: pan-y on the mobile menu container
    }
  }, [touchStartY, touchStartX]);
  
  const handleTouchEnd = useCallback(() => {
    setTouchStartY(0);
    setTouchStartX(0);
  }, []);
  
  // Return proper event handler props that React recognizes
  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}
