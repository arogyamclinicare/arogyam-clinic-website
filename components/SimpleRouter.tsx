import { useEffect, useState } from 'react';
import { AdminPanel } from './AdminPanel';
import { PatientPortal } from './PatientPortal';
import { HomePage } from './HomePage';
import { ContactPage } from './ContactPage';
import AdminLoginPage from './AdminLoginPage';
import StaffDashboard from './StaffDashboard';

export function SimpleRouter() {
  const [currentRoute, setCurrentRoute] = useState<string>(window.location.pathname);

  useEffect(() => {
    // Get the current pathname
    const path = window.location.pathname;
    setCurrentRoute(path);

    // Listen for navigation changes
    const handleRouteChange = () => {
      const newPath = window.location.pathname;
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
    // Check if admin is logged in
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      return (
        <div className="min-h-screen bg-gray-50">
          <AdminPanel />
        </div>
      );
    } else {
      return <AdminLoginPage />;
    }
  }

  if (currentRoute === '/staff') {
    // Check if staff is logged in
    const staffSession = localStorage.getItem('staff_session');
    if (staffSession) {
      return (
        <div className="min-h-screen bg-gray-50">
          <StaffDashboard />
        </div>
      );
    } else {
      return <AdminLoginPage />;
    }
  }

  if (currentRoute === '/patient-portal') {
    return (
      <div className="min-h-screen bg-gray-50">
        <PatientPortal />
      </div>
    );
  }

  if (currentRoute === '/contact') {
    return <ContactPage />;
  }

  // Default to home page
  return <HomePage />;
}