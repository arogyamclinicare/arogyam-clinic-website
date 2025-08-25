import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  User, 
  Calendar, 
  LogOut,
  Home,
  Plus,
  Pill
} from 'lucide-react';
import { usePatientAuth } from './context/PatientAuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Consultation } from '../lib/supabase';

interface PatientDashboardProps {
  onBookAppointment: (type?: string) => void;
}

export function PatientDashboard({ onBookAppointment }: PatientDashboardProps) {
  const { user, logout } = usePatientAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from Supabase
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!user?.patient_id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // First, let's check what's in the patients table
        const { data: patientCheck, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('patient_id', user.patient_id);
        
        if (patientError) {
          console.error('❌ Error checking patients table:', patientError);
          setLoading(false);
          return;
        }
        
        // Try to find consultations by patient_id first
        let { data, error } = await supabase
          .from('consultations')
          .select('*')
          .eq('patient_id', user.patient_id)
          .order('created_at', { ascending: false });

        // If no consultations found by patient_id, try to find by email (fallback)
        if (!data || data.length === 0) {
          if (patientCheck && patientCheck[0]?.email) {
            
            const { data: emailData } = await supabase
              .from('consultations')
              .select('*')
              .eq('email', patientCheck[0].email)
              .order('created_at', { ascending: false });
            
            // Query by email result
            
            if (emailData && emailData.length > 0) {
              // Found consultations by email, attempting to link them
              
              // Try to link these consultations to the patient
              for (const consultation of emailData) {
                if (!consultation.patient_id) {
                  // Linking consultation to patient_id
                  
                  const { error: linkError } = await supabase
                    .from('consultations')
                    .update({ patient_id: user.patient_id })
                    .eq('id', consultation.id);
                  
                  if (linkError) {
                    console.error('❌ Failed to link consultation:', linkError);
                  } else {
                    // Successfully linked consultation
                  }
                }
              }
              
              // Also check if consultations already have the right patient_id but different format
              const consultationsWithRightEmail = emailData.filter(c => c.email === patientCheck[0].email);
              // Consultations with matching email
              
              if (consultationsWithRightEmail.length > 0) {
                // Using consultations with matching email directly
                data = consultationsWithRightEmail;
                error = null;
              }
              
              // Now fetch the linked consultations
              const { data: linkedData, error: linkedError } = await supabase
                .from('consultations')
                .select('*')
                .eq('patient_id', user.patient_id)
                .order('created_at', { ascending: false });
              
              data = linkedData;
              error = linkedError;
              // After linking, found consultations
            }
          }
        }

        // Final consultations result

        if (error) {
          console.error('❌ Error fetching consultations:', error);
          // Don't show sensitive error details to patients
          setConsultations([]);
        } else {
          // Fetched consultations
          setConsultations(data || []);
        }
        
        // If still no data, try to show consultations by email as a last resort
        if ((!data || data.length === 0) && patientCheck && patientCheck[0]?.email) {
          // Last resort: trying to show consultations by email
          const { data: lastResortData } = await supabase
            .from('consultations')
            .select('*')
            .eq('email', patientCheck[0].email)
            .order('created_at', { ascending: false });
          
          if (lastResortData && lastResortData.length > 0) {
            // Last resort successful
            setConsultations(lastResortData);
          }
        }
      } catch (error) {
        console.error('💥 Error:', error);
        setConsultations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [user?.patient_id]);

  const handleLogout = async () => {
    await logout();
  };

  const goHome = () => {
    window.history.pushState({}, '', '/');
    window.location.reload();
  };

  const openBookingModal = () => {
    onBookAppointment();
  };

  // Filter consultations by status - more inclusive
  const upcomingAppointments = consultations.filter(c => 
    c.status === 'Confirmed' || c.status === 'Scheduled' || c.status === 'pending' || c.status === 'confirmed'
  );
  
  // Show prescriptions for ANY consultation with medicine info, regardless of status
  const activePrescriptions = consultations.filter(c => 
    c.medicines_prescribed && c.medicines_prescribed.trim() !== ''
  );
  
  // Also show next appointment date from any consultation that has it
  const nextAppointmentDate = consultations.find(c => 
    c.next_appointment_date && c.next_appointment_date.trim() !== ''
  )?.next_appointment_date;
  
  
  


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sage-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your patient data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sage-50">
      {/* Patient Dashboard Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            {/* Left Side - Logo and Patient Info */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Patient Portal</h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate">Welcome, {user?.name || 'Patient'}</p>
              </div>
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                onClick={goHome}
                variant="outline"
                size="sm"
                className="hidden sm:flex border-gray-300 text-gray-700 hover:bg-gray-50 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm"
              >
                <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span>Main Website</span>
              </Button>
              
              <Button
                onClick={goHome}
                variant="outline"
                size="sm"
                className="sm:hidden border-gray-300 text-gray-700 hover:bg-gray-50 p-2 rounded-lg"
                title="Back to Main Website"
              >
                <Home className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-50 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Welcome back, {user?.name || 'Patient'}! 👋
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-4">
            Manage your appointments and prescriptions below
          </p>
          
          
        </div>



        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Appointments Card */}
          <Card className="border-l-4 border-l-blue-500 shadow-lg">
            <CardContent className="p-6">
                             <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center space-x-3">
                   <Calendar className="w-6 h-6 text-blue-600" />
                   <h3 className="text-xl font-semibold text-gray-900">Appointments</h3>
                 </div>
                 <Button
                   onClick={openBookingModal}
                   size="sm"
                   className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center space-x-1"
                 >
                   <Plus className="w-3 h-3" />
                   <span>Book New</span>
                 </Button>
               </div>
               
               {/* Next Appointment Section - Show at top of Appointments card */}
               {nextAppointmentDate && (
                 <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-4">
                   <div className="flex items-center space-x-3 text-blue-900">
                     <Calendar className="w-5 h-5 text-blue-600" />
                     <div>
                       <p className="font-semibold text-sm">Next Appointment</p>
                       <p className="text-lg font-bold">
                         {new Date(nextAppointmentDate).toLocaleDateString('en-IN', { 
                           weekday: 'long', 
                           year: 'numeric', 
                           month: 'long', 
                           day: 'numeric' 
                         })}
                       </p>
                     </div>
                   </div>
                 </div>
               )}

                             {upcomingAppointments.length > 0 ? (
                 <div className="space-y-3">
                   {upcomingAppointments.slice(0, 3).map((appointment) => (
                     <div key={appointment.id} className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                       <div className="flex justify-between items-center">
                         <div>
                           <p className="font-medium text-blue-900">{appointment.preferred_date}</p>
                           <p className="text-sm text-blue-700">{appointment.preferred_time}</p>
                         </div>
                         <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                           {appointment.status}
                         </span>
                       </div>
                     </div>
                   ))}
                 </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Appointments</h4>
                  <p className="text-gray-600 mb-4">You'll get your next appointment details shortly</p>
                  <Button
                    onClick={openBookingModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Book Your First Appointment</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prescriptions Card */}
          <Card className="border-l-4 border-l-green-500 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Pill className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Prescriptions</h3>
              </div>

              {activePrescriptions.length > 0 ? (
                <div className="space-y-3">
                  {activePrescriptions.slice(0, 3).map((prescription) => (
                    <div key={prescription.id} className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="space-y-2">
                        <p className="font-medium text-green-900">Medicines Prescribed</p>
                        <p className="text-sm text-green-700">{prescription.medicines_prescribed}</p>
                        {prescription.dosage_instructions && (
                          <p className="text-xs text-green-600">Dosage: {prescription.dosage_instructions}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Pill className="w-16 h-16 text-green-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Active Prescriptions</h4>
                  <p className="text-gray-600">Your doctor will add prescriptions after your consultation</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
