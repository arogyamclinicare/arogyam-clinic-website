import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  User, 
  Calendar, 
  LogOut,
  Home,
  Plus,
  Pill,
  Download
} from 'lucide-react';
import { usePatientAuth } from './context/PatientAuthContext';
import { useEffect, useState } from 'react';
import { getSupabaseAdmin } from '../lib/supabase-admin';
import { pdfGenerator } from '../lib/pdf-generator';
import type { Consultation, DrugTemplate } from '../lib/supabase';

interface PatientDashboardProps {
  onBookAppointment: (type?: string) => void;
}

// Utility function to format time from 24-hour to 12-hour format
const formatTimeToIndianFormat = (timeString: string): string => {
  if (!timeString) return '';
  
  try {
    // Handle different time formats
    let time: string;
    
    if (timeString.includes(':')) {
      // If it's already in HH:MM format
      if (timeString.length === 5) {
        time = timeString;
      } else if (timeString.length === 8) {
        // If it's in HH:MM:SS format, extract HH:MM
        time = timeString.substring(0, 5);
      } else {
        return timeString; // Return as is if format is unexpected
      }
    } else {
      return timeString; // Return as is if no colon found
    }
    
    const [hours, minutes] = time.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) {
      return timeString; // Return original if parsing fails
    }
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const displayMinutes = minutes.toString().padStart(2, '0');
    
    return `${displayHours}:${displayMinutes} ${period}`;
  } catch (error) {

    return timeString; // Return original if any error occurs
  }
};

export function PatientDashboard({ onBookAppointment }: PatientDashboardProps) {
  const { user, logout } = usePatientAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [drugTemplates, setDrugTemplates] = useState<DrugTemplate[]>([]);
  const [prescriptionDrugs, setPrescriptionDrugs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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
        const { data: patientCheck, error: patientError } = await (getSupabaseAdmin() as any)
          .from('patients')
          .select('*')
          .eq('patient_id', user.patient_id);
        
        if (patientError) {

          setLoading(false);
          return;
        }
        
        // Try to find consultations by patient_id first
        let { data, error } = await (getSupabaseAdmin() as any)
          .from('consultations')
          .select('*')
          .eq('patient_id', user.patient_id)
          .order('created_at', { ascending: false });

        // If no consultations found by patient_id, try to find by email (fallback)
        if (!data || data.length === 0) {
          if (patientCheck && patientCheck[0]?.email) {
            
            const { data: emailData } = await (getSupabaseAdmin() as any)
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
                  
                  const { error: linkError } = await (getSupabaseAdmin() as any)
                    .from('consultations')
                    .update({ patient_id: user.patient_id })
                    .eq('id', consultation.id);
                  
                  if (linkError) {
    // Empty block
  } else {
                    // Successfully linked consultation
                  }
                }
              }
              
              // Also check if consultations already have the right patient_id but different format
              const consultationsWithRightEmail = emailData.filter((c: any) => c.email === patientCheck[0].email);
              // Consultations with matching email
              
              if (consultationsWithRightEmail.length > 0) {
                // Using consultations with matching email directly
                data = consultationsWithRightEmail;
                error = null;
              }
              
              // Now fetch the linked consultations
              const { data: linkedData, error: linkedError } = await (getSupabaseAdmin() as any)
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

          // Don't show sensitive error details to patients
          setConsultations([]);
        } else {
          // Fetched consultations
          setConsultations(data || []);
        }
        
        // Fetch drug templates for common name lookup
        try {
          const { data: templates, error: templateError } = await (getSupabaseAdmin() as any)
            .from('drug_templates')
            .select('*')
            .order('drug_name', { ascending: true });

          if (templateError) {
    // Empty block
  } else {
            setDrugTemplates(templates || []);
          }
        } catch (templateError) {
    // Empty block
  }

        // Fetch prescription drugs from the new prescription_drugs table
        try {
          const consultationIds = (data || []).map((c: any) => c.id);

          if (consultationIds.length > 0) {
            const { data: prescriptionData, error: prescriptionError } = await (getSupabaseAdmin() as any)
              .from('prescription_drugs')
              .select('*')
              .in('consultation_id', consultationIds)
              .order('created_at', { ascending: true });

            if (prescriptionError) {
    // Empty block
  } else {
              setPrescriptionDrugs(prescriptionData || []);


            }
          } else {
    // Empty block
  }
        } catch (prescriptionError) {
    // Empty block
  }
        
        // If still no data, try to show consultations by email as a last resort
        if ((!data || data.length === 0) && patientCheck && patientCheck[0]?.email) {
          // Last resort: trying to show consultations by email
          const { data: lastResortData } = await (getSupabaseAdmin() as any)
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
    window.history.pushState({
    // Empty block
  }, '', '/');
    window.location.reload();
  };

  const openBookingModal = () => {
    onBookAppointment();
  };

  const handleDownloadPrescriptionPDF = async (consultation: Consultation) => {
    setIsGeneratingPDF(true);
    try {
      console.log('Starting PDF generation for consultation:', consultation.id);
      console.log('Consultation data:', consultation);
      const pdfBlob = await pdfGenerator.generatePatientPrescriptionPDF(consultation);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${consultation.name}_prescription_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log('PDF generated and downloaded successfully');
    } catch (error) {
      console.error('PDF Generation Error in Patient Portal:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        consultation: consultation
      });
      alert(`Error generating PDF: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Filter consultations by status - more inclusive
  const upcomingAppointments = consultations.filter(c => 
    c.status === 'Confirmed' || c.status === 'Scheduled' || c.status === 'pending' || c.status === 'confirmed'
  );
  
  // Show prescriptions from prescription_drugs table or fallback to consultations table
  const activePrescriptions = consultations.filter(c => {
    // Check if consultation has prescription drugs in the new table
    const hasPrescriptionDrugs = prescriptionDrugs.some(pd => pd.consultation_id === c.id);
    // Fallback to old prescription fields in consultations table
    const hasOldPrescription = (c.drug_name && c.drug_name.trim() !== '') || 
                              (c.medicines_prescribed && c.medicines_prescribed.trim() !== '');
    
    console.log(`🔍 PatientDashboard: Checking consultation ${c.id} (${c.name}):`, {
      hasPrescriptionDrugs,
      hasOldPrescription,
      prescriptionDrugsCount: prescriptionDrugs.filter(pd => pd.consultation_id === c.id).length
    });
    
    return hasPrescriptionDrugs || hasOldPrescription;
  });



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
                       <div className="flex justify-between items-start mb-2">
                         <div>
                           <p className="font-medium text-blue-900">{appointment.preferred_date}</p>
                           <p className="text-sm text-blue-700">{formatTimeToIndianFormat(appointment.preferred_time)}</p>
                         </div>
                         <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                           {appointment.status}
                         </span>
                       </div>
                       
                       {/* Service Information */}
                       {(appointment.segment || appointment.sub_segment) && (
                         <div className="mt-2 pt-2 border-t border-blue-200">
                           <div className="flex flex-wrap gap-2">
                             {appointment.segment && (
                               <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md font-medium">
                                 📋 {appointment.segment}
                               </span>
                             )}
                             {appointment.sub_segment && (
                               <span className="inline-flex items-center px-2 py-1 bg-blue-200 text-blue-900 text-xs rounded-md font-medium">
                                 🔍 {appointment.sub_segment}
                               </span>
                             )}
                           </div>
                         </div>
                       )}
                       
                       {/* Treatment Information */}
                       {appointment.treatment_type && (
                         <div className="mt-2">
                           <p className="text-xs text-blue-600">
                             <span className="font-medium">Treatment:</span> {appointment.treatment_type}
                           </p>
                         </div>
                       )}
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Pill className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Prescriptions</h3>
                </div>
                {activePrescriptions.length > 0 && (
                  <Button
                    onClick={() => handleDownloadPrescriptionPDF(activePrescriptions[0])}
                    disabled={isGeneratingPDF}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</span>
                  </Button>
                )}
              </div>

              {activePrescriptions.length > 0 ? (
                <div className="space-y-3">
                  {activePrescriptions.slice(0, 3).map((consultation) => {
                    // Get prescription drugs for this consultation
                    const consultationPrescriptions = prescriptionDrugs.filter(pd => pd.consultation_id === consultation.id);
                    
                    return (
                      <div key={consultation.id} className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-green-900">Prescription Details</p>
                            <span className="text-xs text-green-600">{consultation.preferred_date}</span>
                          </div>
                          
                          {/* Show prescription drugs from prescription_drugs table */}
                          {consultationPrescriptions.length > 0 ? (
                            <div className="space-y-3">
                              {consultationPrescriptions.map((prescription, index) => {
                                const template = drugTemplates.find(t => t.drug_name === prescription.drug_name);
                                
                                // Skip empty prescriptions (drug_name is empty)
                                if (!prescription.drug_name || prescription.drug_name.trim() === '') {
                                  return null;
                                }
                                
                                return (
                                  <div key={prescription.id} className="bg-white rounded-md p-4 border border-green-100">
                                    <div className="space-y-2">
                                      <h5 className="font-semibold text-green-900 text-lg mb-3">
                                        {consultationPrescriptions.length > 1 ? `Drug #${index + 1}` : 'Prescription Drugs'}
                                      </h5>
                                      
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="font-medium text-green-700">Drug Name:</span>
                                          <span className="text-green-600">{template?.common_name || prescription.drug_name}</span>
                                        </div>
                                        
                                        {prescription.potency && (
                                          <div className="flex justify-between">
                                            <span className="font-medium text-green-700">Potency:</span>
                                            <span className="text-green-600">{prescription.potency}</span>
                                          </div>
                                        )}
                                        
                                        {prescription.dosage && (
                                          <div className="flex justify-between">
                                            <span className="font-medium text-green-700">Dosage:</span>
                                            <span className="text-green-600">{prescription.dosage}</span>
                                          </div>
                                        )}
                                        
                                        {prescription.repetition_frequency && prescription.repetition_interval && (
                                          <div className="flex justify-between">
                                            <span className="font-medium text-green-700">Repetition:</span>
                                            <span className="text-green-600">
                                              {prescription.repetition_frequency} x {prescription.repetition_interval} {prescription.repetition_unit}
                                            </span>
                                          </div>
                                        )}
                                        
                                        {prescription.quantity && (
                                          <div className="flex justify-between">
                                            <span className="font-medium text-green-700">Quantity:</span>
                                            <span className="text-green-600">{prescription.quantity}</span>
                                          </div>
                                        )}
                                        
                                        {prescription.period && (
                                          <div className="flex justify-between">
                                            <span className="font-medium text-green-700">Period:</span>
                                            <span className="text-green-600">{prescription.period} days</span>
                                          </div>
                                        )}
                                        
                                        {prescription.remarks && (
                                          <div className="flex justify-between">
                                            <span className="font-medium text-green-700">Remarks:</span>
                                            <span className="text-green-600">{prescription.remarks}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                              
                              {/* Show legacy medicines_prescribed and dosage_instructions if they exist */}
                              {(consultation.medicines_prescribed && consultation.medicines_prescribed.trim() !== '') && (
                                <div className="bg-white rounded-md p-4 border border-green-100">
                                  <div className="space-y-2">
                                    <h5 className="font-semibold text-green-900 text-lg mb-3">Medicines Prescribed</h5>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="font-medium text-green-700">Medicines:</span>
                                        <span className="text-green-600">{consultation.medicines_prescribed}</span>
                                      </div>
                                      
                                      {consultation.dosage_instructions && (
                                        <div className="flex justify-between">
                                          <span className="font-medium text-green-700">Dosage Instructions:</span>
                                          <span className="text-green-600">{consultation.dosage_instructions}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            /* Fallback to old prescription fields in consultations table */
                            consultation.drug_name && consultation.drug_name.trim() !== '' ? (
                              <div className="bg-white rounded-md p-4 border border-green-100">
                                <div className="space-y-2">
                                  <h5 className="font-semibold text-green-900 text-lg mb-3">
                                    Prescription Drugs
                                  </h5>
                                  
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="font-medium text-green-700">Drug Name:</span>
                                      <span className="text-green-600">{consultation.drug_name}</span>
                                    </div>
                                    
                                    {consultation.potency && (
                                      <div className="flex justify-between">
                                        <span className="font-medium text-green-700">Potency:</span>
                                        <span className="text-green-600">{consultation.potency}</span>
                                      </div>
                                    )}
                                    
                                    {consultation.dosage && (
                                      <div className="flex justify-between">
                                        <span className="font-medium text-green-700">Dosage:</span>
                                        <span className="text-green-600">{consultation.dosage}</span>
                                      </div>
                                    )}
                                    
                                    {consultation.repetition_frequency && consultation.repetition_interval && (
                                      <div className="flex justify-between">
                                        <span className="font-medium text-green-700">Repetition:</span>
                                        <span className="text-green-600">
                                          {consultation.repetition_frequency} x {consultation.repetition_interval} {consultation.repetition_unit}
                                        </span>
                                      </div>
                                    )}
                                    
                                    {consultation.quantity && (
                                      <div className="flex justify-between">
                                        <span className="font-medium text-green-700">Quantity:</span>
                                        <span className="text-green-600">{consultation.quantity}</span>
                                      </div>
                                    )}
                                    
                                    {consultation.period && (
                                      <div className="flex justify-between">
                                        <span className="font-medium text-green-700">Period:</span>
                                        <span className="text-green-600">{consultation.period} days</span>
                                      </div>
                                    )}
                                    
                                    {consultation.prescription_remarks && (
                                      <div className="flex justify-between">
                                        <span className="font-medium text-green-700">Remarks:</span>
                                        <span className="text-green-600">{consultation.prescription_remarks}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              /* Fallback to old medicines_prescribed field */
                              <div>
                                <p className="text-sm text-green-700">{consultation.medicines_prescribed}</p>
                                {consultation.dosage_instructions && (
                                  <p className="text-xs text-green-600">Dosage: {consultation.dosage_instructions}</p>
                                )}
                              </div>
                            )
                          )}
                          
                          {/* Services Information for Prescriptions */}
                          {(consultation.segment || consultation.sub_segment) && (
                            <div className="mt-3 pt-3 border-t border-green-200">
                              <h6 className="font-semibold text-green-900 text-sm mb-2">Services</h6>
                              <div className="flex flex-wrap gap-2">
                                {consultation.segment && (
                                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md font-medium">
                                    📋 {consultation.segment}
                                  </span>
                                )}
                                {consultation.sub_segment && (
                                  <span className="inline-flex items-center px-2 py-1 bg-green-200 text-green-900 text-xs rounded-md font-medium">
                                    🔍 {consultation.sub_segment}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
