import { useState } from 'react';
import { usePatientAuth } from './context/PatientAuthContext';
import { PatientLogin } from './PatientLogin';
import { PatientDashboard } from './PatientDashboard';
import { ConsultationBooking } from './modals/ConsultationBooking';

export function PatientPortal() {
  const { isAuthenticated, loading } = usePatientAuth();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [treatmentType, setTreatmentType] = useState('General Consultation');

  const openBookingModal = (type = 'General Consultation') => {
    setTreatmentType(type);
    setIsBookingOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sage-50 pt-28 lg:pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <PatientDashboard onBookAppointment={openBookingModal} />
      ) : (
        <PatientLogin />
      )}
      
      {/* Consultation Booking Modal */}
      <ConsultationBooking
        isOpen={isBookingOpen}
        onClose={closeBookingModal}
        treatmentType={treatmentType}
      />
    </>
  );
}
