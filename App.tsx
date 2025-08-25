import { useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingCTA } from './components/FloatingCTA';
import { OptimizedConsultationProvider, useOptimizedConsultation } from './components/context/OptimizedConsultationContext';
import { AuthProvider } from './components/context/AuthContext';
import { PatientAuthProvider } from './components/context/PatientAuthContext';
import { SupabaseProvider } from './components/context/SupabaseContext';
import { ConsultationBooking } from './components/modals/ConsultationBooking';

import { SimpleRouter } from './components/SimpleRouter';
import { ErrorBoundary } from './components/error-handling/ErrorBoundary';

/**
 * Main App component with simple admin authentication
 * Features:
 * - Simple admin login system
 * - Semantic HTML5 structure
 * - Proper ARIA landmarks
 * - Skip navigation support
 * - Optimized component loading with memoization
 * - Enhanced consultation booking system
 * - Error boundary protection
 * - Performance optimizations
 * - Patient portal (coming soon with Supabase)
 */
function AppContent() {
  const { isBookingOpen, closeBooking, treatmentType } = useOptimizedConsultation();

  // Navigation functions
  const openContact = useCallback(() => {
    window.history.pushState({}, '', '/contact');
    // Force a re-render by dispatching a custom event
    window.dispatchEvent(new PopStateEvent('popstate'));
    // Scroll to top after route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openPatientPortal = useCallback(() => {
    window.history.pushState({}, '', '/patient-portal');
    // Force a re-render by dispatching a custom event
    window.dispatchEvent(new PopStateEvent('popstate'));
    // Scroll to top after route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goHome = useCallback(() => {
    window.history.pushState({}, '', '/');
    // Force a re-render by dispatching a custom event
    window.dispatchEvent(new PopStateEvent('popstate'));
    // Scroll to top after route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Check current route to conditionally render header/footer
  const currentPath = window.location.pathname;
  const isSpecialRoute = currentPath === '/admin' || currentPath === '/patient-portal';

  // Always render the SimpleRouter - it will handle all routing internally
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900 transition-all duration-300">
      {/* Skip Navigation for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>

      {/* Header - Only show on main website routes */}
      {!isSpecialRoute && (
        <Header
          onContact={openContact}
          onPatientPortal={openPatientPortal}
          onHome={goHome}
        />
      )}

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        <ErrorBoundary>
          <SimpleRouter />
        </ErrorBoundary>
      </main>

      {/* Footer - Only show on main website routes */}
      {!isSpecialRoute && (
        <Footer 
          onOpenContact={openContact}
          onOpenPatientPortal={openPatientPortal}
        />
      )}

      {/* Floating CTA - Only show on main website routes */}
      {!isSpecialRoute && <FloatingCTA />}

      {/* Consultation Booking Modal */}
      <ConsultationBooking
        isOpen={isBookingOpen}
        onClose={closeBooking}
        treatmentType={treatmentType}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PatientAuthProvider>
        <SupabaseProvider>
          <OptimizedConsultationProvider>
            <AppContent />
          </OptimizedConsultationProvider>
        </SupabaseProvider>
      </PatientAuthProvider>
    </AuthProvider>
  );
}