import { useEffect, useState } from 'react';
import { AdminPanel } from './AdminPanel';
import { PatientPortal } from './PatientPortal';
import { HomePage } from './HomePage';
import { ContactPage } from './ContactPage';

export function SimpleRouter() {
  const [currentRoute, setCurrentRoute] = useState<string>(window.location.pathname);

  useEffect(() => {
    // Get the current pathname
    const path = window.location.pathname;
    // SimpleRouter - Initial path
    setCurrentRoute(path);

    // Listen for navigation changes
    const handleRouteChange = () => {
      const newPath = window.location.pathname;
              // SimpleRouter - Route changed to
      setCurrentRoute(newPath);
    };

    // Listen for popstate (browser back/forward)
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Route rendering logic
  if (currentRoute === '/admin') {
    // SimpleRouter - Rendering Admin Panel
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminPanel />
      </div>
    );
  }

  if (currentRoute === '/patient-portal') {
    // SimpleRouter - Rendering Patient Portal
    return (
      <div className="min-h-screen bg-gray-50">
        <PatientPortal />
      </div>
    );
  }

  if (currentRoute === '/contact') {
    // SimpleRouter - Rendering Contact Page
    return <ContactPage />;
  }

  // Default to home page
      // SimpleRouter - Rendering Home Page
  return <HomePage />;
}
