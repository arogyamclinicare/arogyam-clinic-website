import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { clearAdminSession } from '../lib/secure-auth';
// Removed SupabaseContext to avoid multiple client instances
import { ConsultationEditModal } from './modals/ConsultationEditModal';
// Admin client will be imported dynamically to avoid conflicts
import { generateSecurePassword } from '../lib/auth';
import { getSupabaseAdmin } from '../lib/supabase-admin';
import type { Consultation, ConsultationUpdate } from '../lib/supabase';
import { 
  Users, 
  Calendar, 
  BarChart3, 
  LogOut,
  Plus,
  Search,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  Home,
  Pill,
  Bell,
  Trash2,
  RotateCcw,
  X,
  Key,
  Copy,
  Mail
} from 'lucide-react';

// Import the types from our Supabase lib
import { 
  CONSULTATION_STATUS, 
  STATUS_LABELS, 
  STATUS_COLORS, 
  STATUS_ICONS,
  APPOINTMENT_OPTIONS,
  APPOINTMENT_OPTION_LABELS,
  type AppointmentOption,
  isValidStatusTransition
} from '../lib/constants';

// Function to format time in Indian format (12-hour with AM/PM)
const formatTimeToIndian = (timeString: string) => {
  if (!timeString) return '';
  
  try {
    // Parse time string (e.g., "20:00:00" or "20:00")
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    
    // Convert to 12-hour format
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    
    // Add period indicator
    let timeDisplay = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
    
    // Add time context for better understanding
    if (hour >= 5 && hour < 12) {
      timeDisplay += ' (Morning)';
    } else if (hour >= 12 && hour < 17) {
      timeDisplay += ' (Afternoon)';
    } else if (hour >= 17 && hour < 21) {
      timeDisplay += ' (Evening)';
    } else {
      timeDisplay += ' (Night)';
    }
    
    return timeDisplay;
  } catch (error) {
    return timeString; // Return original if parsing fails
  }
};

// Helper function for simple appointment status display
const getAppointmentStatusLabel = (status: string): string => {
  return APPOINTMENT_OPTION_LABELS[status as keyof typeof APPOINTMENT_OPTION_LABELS] || status;
};

export function AdminDashboard() {
  const { user, logout: authLogout } = useAuth();

  // Custom logout function that handles both auth systems
  const logout = async () => {
    try {
      // Use secure logout
      clearAdminSession();
      
      // Also call the complex auth logout if available
      if (authLogout) {
        await authLogout();
      }
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {

      // Force redirect even if logout fails
      clearAdminSession();
      window.location.href = '/';
    }
  };
    // State for consultation management (using admin client only)
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'connected' | 'error' | 'disconnected' | 'failed' | 'manual'>('disconnected');
  
  // Consultation management functions using admin client
  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const { data, error } = await (getSupabaseAdmin() as any)
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false }); // Newest first
      
      if (error) {
        setError(error.message);
      } else {
        setConsultations(data || []);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch consultations');
    } finally {
      setLoading(false);
    }
  };


  const updateConsultationStatus = async (id: string, status: string) => {
    try {
      const { error } = await (getSupabaseAdmin() as any)
        .from('consultations')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      // Refresh consultations
      await fetchConsultations();
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to update consultation status' };
    }
  };

  const updateConsultation = async (id: string, updates: Partial<ConsultationUpdate>) => {
    try {
      const { error } = await (getSupabaseAdmin() as any)
        .from('consultations')
        .update(updates)
        .eq('id', id);
      
      if (error) {
        return { success: false, error: error.message };
      }

      // DON'T refresh consultations automatically - let manual updates handle the UI
      // This prevents cross-contamination between workflows
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to update consultation' };
    }
  };

  const deleteConsultation = async (id: string) => {
    try {
      const { error } = await (getSupabaseAdmin() as any)
        .from('consultations')
        .delete()
        .eq('id', id);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      // Refresh consultations
      await fetchConsultations();
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to delete consultation' };
    }
  };

  const refreshConsultations = fetchConsultations;

  // Don't fetch consultations immediately - only when user interacts
  // This prevents the admin client from being created at component mount
  
  const [activeTab, setActiveTab] = useState<'new_entry' | 'interacting' | 'live_patients' | 'todays_appointments' | 'completed_appointments' | 'staff_management'>('new_entry');
  
  // Load consultations when user switches to a tab that needs them
  useEffect(() => {
    if (activeTab !== 'new_entry' || consultations.length === 0) {
      fetchConsultations();
    }
  }, [activeTab]);

  // DISABLED REAL-TIME SUBSCRIPTION TO PREVENT CROSS-CONTAMINATION
  // Real-time updates were causing leads to move between sections incorrectly
  // Manual updates will handle all state changes properly
  useEffect(() => {
    // Set status to indicate manual mode
    setRealtimeStatus('manual');
  }, []);
  const [editingConsultation, setEditingConsultation] = useState<Consultation | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [recycleBinConsultations, setRecycleBinConsultations] = useState<Consultation[]>([]);
  const [recycleBinSearchTerm, setRecycleBinSearchTerm] = useState('');
  const [quickSearchTerm, setQuickSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Consultation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [selectedPatientCredentials, setSelectedPatientCredentials] = useState<any>(null);
  const [generatingCredentials, setGeneratingCredentials] = useState<string | null>(null);


  // Listen for real-time updates and show notifications
  useEffect(() => {
    if (consultations.length > 0) {
      // Show notification for new consultations
      const latestConsultation = consultations[0];
      if (latestConsultation && new Date(latestConsultation.created_at).getTime() > Date.now() - 10000) {
        setNotificationMessage(`New consultation added: ${latestConsultation.name}`);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    }
  }, [consultations]);

  // Search effect - trigger search when search term changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchConsultations(quickSearchTerm);
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(timeoutId);
  }, [quickSearchTerm]);

  // Show helpful notification when real-time fails
  useEffect(() => {
    if (realtimeStatus === 'failed') {
      setNotificationMessage('⚠️ Real-time connection failed. Data will refresh every 15 seconds automatically. Use the Refresh button for immediate updates.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 8000); // Show longer for important info
    } else if (realtimeStatus === 'error') {
      setNotificationMessage('⚠️ Real-time connection issue. Attempting to reconnect...');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } else if (realtimeStatus === 'connected') {
      // Show brief success message only when reconnecting from an error state
      if (showNotification && notificationMessage.includes('connection issue')) {
        setNotificationMessage('✅ Real-time connection restored!');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    }
  }, [realtimeStatus]);

  // Navigation function to go home
  const goHome = () => {
    // Navigate to home and scroll to top
    window.location.href = '/';
    // Ensure scroll to top happens after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };







  const getStatusColor = (status: string) => {
    if (status === 'reachinglead') {
      return 'text-orange-600 bg-orange-100';
    }
    // Handle appointment statuses (separate from lead management workflow)
    switch (status) {
      case APPOINTMENT_OPTIONS.PENDING:
        return 'text-yellow-600 bg-yellow-100';
      case APPOINTMENT_OPTIONS.FOLLOWUP:
        return 'text-blue-600 bg-blue-100';
      case APPOINTMENT_OPTIONS.INPROGRESS:
        return 'text-orange-600 bg-orange-100';
      case APPOINTMENT_OPTIONS.NOT_INTERESTED:
        return 'text-red-600 bg-red-100';
      case APPOINTMENT_OPTIONS.SALE_MADE:
        return 'text-green-600 bg-green-100';
      case 'follow_up':
        return 'text-yellow-600 bg-yellow-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'reachinglead') {
      return <Users className="w-4 h-4" />;
    }
    // Handle appointment statuses (separate from lead management workflow)
    switch (status) {
      case APPOINTMENT_OPTIONS.PENDING:
        return <Clock className="w-4 h-4" />;
      case APPOINTMENT_OPTIONS.FOLLOWUP:
        return <Bell className="w-4 h-4" />;
      case APPOINTMENT_OPTIONS.INPROGRESS:
        return <Users className="w-4 h-4" />;
      case APPOINTMENT_OPTIONS.NOT_INTERESTED:
        return <X className="w-4 h-4" />;
      case APPOINTMENT_OPTIONS.SALE_MADE:
        return <CheckCircle className="w-4 h-4" />;
      case 'follow_up':
        return <Bell className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        const IconName = STATUS_ICONS[status as keyof typeof STATUS_ICONS];
        switch (IconName) {
          case 'CheckCircle': return <CheckCircle className="w-4 h-4" />;
          case 'Clock': return <Clock className="w-4 h-4" />;
          case 'AlertCircle': return <AlertCircle className="w-4 h-4" />;
          default: return <Clock className="w-4 h-4" />;
        }
    }
  };

  const handleEditConsultation = (consultation: Consultation) => {
    setEditingConsultation(consultation);
    setIsEditModalOpen(true);
  };

  const handleSaveConsultation = async (updates: Partial<any>) => {
    if (!editingConsultation) return { success: false, error: 'No consultation selected' };
    
    const result = await updateConsultation(editingConsultation.id, updates);
    if (result.success) {
      // Update the consultations list with the new data
      setConsultations(prev => 
        prev.map(consultation => 
          consultation.id === editingConsultation.id 
            ? { ...consultation, ...updates }
            : consultation
        )
      );
      setIsEditModalOpen(false);
      setEditingConsultation(null);
    }
    return result;
  };

  // New function specifically for updating consultation status from dropdown (LEAD MANAGEMENT WORKFLOW)
  const handleUpdateConsultationStatus = async (consultationId: string, newStatus: string) => {
    try {
      const result = await updateConsultation(consultationId, { status: newStatus });
      if (result.success) {
        // Update the consultations list with the new status ONLY
        // This ensures the 'appointment_status' field is NOT affected
        setConsultations(prev => 
          prev.map(consultation => 
            consultation.id === consultationId 
              ? { ...consultation, status: newStatus }
              : consultation
          )
        );
        return { success: true };
      } else {

        return { success: false, error: result.error };
      }
    } catch (error) {

      return { success: false, error: 'Failed to update status' };
    }
  };


  // UPDATE APPOINTMENT STATUS - Updates consultation's appointment_status field only
  const handleUpdateAppointmentStatus = async (consultationId: string, newStatus: string) => {
    try {
      const { error } = await (getSupabaseAdmin() as any)
        .from('consultations')
        .update({ appointment_status: newStatus })
        .eq('id', consultationId);
      
      if (error) {
        console.error('Error updating appointment status:', error);
        return { success: false, error: error.message };
      }

      // Update consultations state - ONLY appointment_status field
      setConsultations(prev => 
        prev.map(consultation => 
          consultation.id === consultationId 
            ? { ...consultation, appointment_status: newStatus }
            : consultation
        )
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error updating appointment status:', error);
      return { success: false, error: 'Failed to update appointment status' };
    }
  };

  // APPOINTMENT FILTERING - Shows consultations with next_appointment_date (NOT copies)
  const getTodaysAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return consultations.filter(consultation => {
      // Only show consultations with appointment dates for today/tomorrow
      if (!consultation.next_appointment_date) return false;
      if (consultation.appointment_status === 'appt_sale_made') return false; // Sale made - move to completed
      
      const isTodayOrTomorrow = consultation.next_appointment_date === today || 
                               consultation.next_appointment_date === tomorrow;
      return isTodayOrTomorrow;
    });
  };

  // COMPLETED APPOINTMENTS - Shows consultations with confirmed or done appointment status
  const getCompletedAppointments = () => {
    return consultations.filter(consultation => {
      return consultation.appointment_status === 'appt_sale_made';
    });
  };

  // DELETE APPOINTMENT - Removes appointment date from consultation
  const handleDeleteAppointment = async (consultationId: string) => {
    try {
      const { error } = await (getSupabaseAdmin() as any)
        .from('consultations')
        .update({ 
          next_appointment_date: null,
          appointment_status: null
        })
        .eq('id', consultationId);
      
      if (error) {
        console.error('Error deleting appointment:', error);
        return { success: false, error: error.message };
      }

      // Update consultations state - remove appointment data
      setConsultations(prev => 
        prev.map(consultation => 
          consultation.id === consultationId 
            ? { ...consultation, next_appointment_date: null, appointment_status: null }
            : consultation
        )
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting appointment:', error);
      return { success: false, error: 'Failed to delete appointment' };
    }
  };

  // Database search function
  const searchConsultations = async (searchTerm: string) => {
    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const supabase = getSupabaseAdmin();
      
      // Use a simpler approach with multiple queries and combine results
      const [nameResults, emailResults, treatmentResults] = await Promise.all([
        supabase
          .from('consultations')
          .select('*')
          .ilike('name', `%${trimmedTerm}%`)
          .order('created_at', { ascending: false }),
        supabase
          .from('consultations')
          .select('*')
          .ilike('email', `%${trimmedTerm}%`)
          .order('created_at', { ascending: false }),
        supabase
          .from('consultations')
          .select('*')
          .ilike('treatment_type', `%${trimmedTerm}%`)
          .order('created_at', { ascending: false })
      ]);

      // Combine and deduplicate results
      const allResults = [
        ...(nameResults.data || []),
        ...(emailResults.data || []),
        ...(treatmentResults.data || [])
      ];

      // Remove duplicates based on ID
      const uniqueResults = allResults.filter((consultation: any, index: number, self: any[]) => 
        index === self.findIndex((c: any) => c.id === consultation.id)
      );

      // Sort by created_at
      uniqueResults.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setSearchResults(uniqueResults);




    } catch (error) {

      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDeleteConsultation = async () => {
    if (!editingConsultation) return { success: false, error: 'No consultation selected' };
    
    const result = await deleteConsultation(editingConsultation.id);
    if (result.success) {
      setIsEditModalOpen(false);
      setEditingConsultation(null);
    }
    return result;
  };

  // New function for deleting consultation directly by ID (for cancelled appointments)
  const handleDeleteConsultationById = async (consultationId: string) => {
    try {
      const result = await deleteConsultation(consultationId);
      if (result.success) {
        // Remove from consultations list
        setConsultations(prev => prev.filter(c => c.id !== consultationId));
        return { success: true };
      } else {

        return { success: false, error: result.error };
      }
    } catch (error) {

      return { success: false, error: 'Failed to delete consultation' };
    }
  };

  // Function to handle patient contact (for follow-up actions)
  const handleContactPatient = (consultation: Consultation) => {
    // Create contact options
    const contactOptions = [];
    
    if (consultation.phone) {
      contactOptions.push(`📞 Call: ${consultation.phone}`);
    }
    
    if (consultation.email) {
      contactOptions.push(`📧 Email: ${consultation.email}`);
    }
    
    if (contactOptions.length === 0) {
      setNotificationMessage(`No contact information available for ${consultation.name}`);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }
    
    // Show contact information
    const contactInfo = contactOptions.join('\n');
    setNotificationMessage(`Contact ${consultation.name}:\n${contactInfo}`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  // Function to confirm a patient (move from New Entries to Interacting)
  const handleConfirmPatient = async (consultation: Consultation) => {
    try {
      // Validate status transition
      if (!isValidStatusTransition(consultation.status as any, CONSULTATION_STATUS.CONFIRMED)) {
        return { 
          success: false, 
          error: `Cannot change status from ${consultation.status} to ${CONSULTATION_STATUS.CONFIRMED}` 
        };
      }

      const result = await updateConsultationStatus(consultation.id, CONSULTATION_STATUS.CONFIRMED);
      if (result.success) {
        // Show success notification
        setNotificationMessage(`Patient ${consultation.name} confirmed and moved to Interacting!`);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
      return result;
    } catch (error) {

      return { success: false, error: 'Failed to confirm patient' };
    }
  };

  // Function to start consultation (move to Interacting)
  const handleStartConsultation = async (consultation: Consultation) => {
    try {
      // Validate status transition
      if (!isValidStatusTransition(consultation.status as any, CONSULTATION_STATUS.IN_PROGRESS)) {
        return { 
          success: false, 
          error: `Cannot change status from ${consultation.status} to ${CONSULTATION_STATUS.IN_PROGRESS}` 
        };
      }

      const result = await updateConsultationStatus(consultation.id, CONSULTATION_STATUS.IN_PROGRESS);
      if (result.success) {
        setNotificationMessage(`Consultation started for ${consultation.name}`);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
      return result;
    } catch (error) {

      return { success: false, error: 'Failed to start consultation' };
    }
  };

  // Function to open recycle bin (last 50 entries)
  const handleOpenRecycleBin = () => {
    // Get last 50 consultations (including all statuses)
    const last50 = consultations
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 50);
    
    setRecycleBinConsultations(last50);
    setShowRecycleBin(true);
  };

  // Function to restore consultation from recycle bin
  const handleRestoreConsultation = async (consultation: Consultation) => {
    try {
      // Reset status to pending to move it back to New Entries
      const result = await updateConsultationStatus(consultation.id, CONSULTATION_STATUS.PENDING);
      if (result.success) {
        setNotificationMessage(`Restored ${consultation.name} to New Entries`);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        
        // Refresh the recycle bin
        const updatedRecycleBin = recycleBinConsultations.filter(c => c.id !== consultation.id);
        setRecycleBinConsultations(updatedRecycleBin);
      }
      return result;
    } catch (error) {

      return { success: false, error: 'Failed to restore consultation' };
    }
  };

  // Generate patient portal credentials
  const generatePatientCredentials = async (consultation: Consultation) => {
    try {
      setGeneratingCredentials(consultation.id);
              // Generating credentials for consultation
      
      // Check if consultation already has a patient_id
      if (consultation.patient_id) {
        // Consultation already has patient_id
        setNotificationMessage('⚠️ Credentials already generated for this consultation. Check existing patient record.');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
        return;
      }
      
      // ALWAYS generate new unique credentials for each consultation
      // This prevents multiple people with same email from sharing credentials
              // Generating new unique credentials for this consultation
      
      let patientId: string;
      let password: string;
        // Generate simple but unique credentials
        let attempts = 0;
        const maxAttempts = 10;
        
        do {
          attempts++;
          const timestamp = Date.now() + attempts; // Add attempts to ensure uniqueness
          const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
          patientId = `PAT-${new Date().getFullYear()}-${timestamp.toString().slice(-4)}-${randomSuffix}`;
          password = generateSecurePassword(12); // Use secure password generation
          
          // Generated credentials attempt
          
          // Check if this ID already exists
          const { data: duplicateCheck, error: checkError } = await getSupabaseAdmin()
            .from('patients')
            .select('patient_id')
            .eq('patient_id', patientId)
            .maybeSingle();
          
          if (checkError) {

            break; // Continue with this ID if check fails
          }
          
          if (!duplicateCheck) {
            // Generated unique patient ID
            break; // Found unique ID
          }
          
                      // Duplicate detected, retrying
          
        } while (attempts < maxAttempts);
        
        if (attempts >= maxAttempts) {
          // Last resort: use timestamp + extra randomness
          const finalTimestamp = Date.now();
          const finalRandom = Math.random().toString(36).substring(2, 8).toUpperCase();
          patientId = `PAT-${new Date().getFullYear()}-${finalTimestamp}-${finalRandom}`;
          password = generateSecurePassword(14); // Use longer secure password
          // Using final fallback credentials
        }

        // Create new patient record for this consultation
        // This ensures each consultation gets unique credentials
        const { error: insertError } = await getSupabaseAdmin()
          .from('patients')
          .insert({
            user_id: null, // No auth user for now
            email: consultation.email,
            name: consultation.name,
            phone: consultation.phone,
            patient_id: patientId,
            password: password, // Store plain text password temporarily
            credentials_generated_at: new Date().toISOString(),
            email_sent: false,
            consultation_id: consultation.id // Link to specific consultation
          } as any);
        
        if (insertError) throw insertError;
        // Created new patient with unique credentials

      // CRITICAL: Link the consultation to the patient by updating patient_id
              // Linking consultation to patient
      const { error: linkError } = await (getSupabaseAdmin() as any)
        .from('consultations')
        .update({ patient_id: patientId })
        .eq('id', consultation.id);
      
      if (linkError) {

        throw new Error('Failed to link consultation to patient');
      }
      
              // Successfully linked consultation to patient

      // For now, mark email as pending (manual sending)
      await (getSupabaseAdmin() as any)
        .from('patients')
        .update({ email_sent: false })
        .eq('email', consultation.email);

      // Show success message with instructions
      setNotificationMessage(`✅ Credentials generated: ${patientId} | Click "View" to copy and send to patient`);
      
      // Also copy credentials to clipboard for easy sharing
      const credentialsText = `
Arogyam Clinic - Patient Portal Access

Dear ${consultation.name},

Your patient portal login credentials:

Patient ID: ${patientId}
Password: ${password}
Portal Link: ${window.location.origin}/patient-portal

Keep these credentials safe.

Best regards,
Arogyam Clinic Team
      `.trim();
      
      try {
        await navigator.clipboard.writeText(credentialsText);
        // Credentials copied to clipboard
      } catch (clipboardError) {
                  // Could not copy to clipboard
      }
      
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);

      // Refresh consultations to show updated status
      await refreshConsultations();

    } catch (error) {

      setNotificationMessage('Error generating credentials');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } finally {
      setGeneratingCredentials(null);
    }
  };

  // View patient credentials
  const viewPatientCredentials = async (consultation: Consultation) => {
    try {
              // Looking for patient for consultation
      
      // Find patient by consultation_id (new approach) - using admin client
      let { data: patient, error } = await getSupabaseAdmin()
        .from('patients')
        .select('*')
        .eq('consultation_id', consultation.id)
        .single();

      // If not found by consultation_id, try to find by patient_id (fallback for old records)
      if (error || !patient) {
        // Not found by consultation_id, trying by patient_id
        if (consultation.patient_id) {
          const { data: patientById } = await getSupabaseAdmin()
            .from('patients')
            .select('*')
            .eq('patient_id', consultation.patient_id)
            .single();
          
          if (patientById) {
            patient = patientById;
            error = null;
          }
        }
      }

      if (error || !patient) {
        // Patient not found in database
        setNotificationMessage('Patient credentials not found. Please generate credentials first.');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        return;
      }

              // Found patient

      setSelectedPatientCredentials({
        name: (patient as any).name,
        email: (patient as any).email,
        patientId: (patient as any).patient_id,
        password: (patient as any).password,
        generatedAt: (patient as any).credentials_generated_at,
        emailSent: (patient as any).email_sent
      });

      setShowCredentialsModal(true);
    } catch (error) {

      setNotificationMessage('Error fetching credentials');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  // Copy credentials to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setNotificationMessage('Copied to clipboard!');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  // Copy complete welcome message with all credentials
  const copyCompleteWelcomeMessage = () => {
    if (!selectedPatientCredentials) return;
    
    const welcomeMessage = `
🏥 Welcome to Arogyam Homeopathic Clinic

Dear ${selectedPatientCredentials.name},

Your patient portal access has been successfully created!

🔐 Login Credentials:
Patient ID: ${selectedPatientCredentials.patientId}
Password: ${selectedPatientCredentials.password}

🌐 Access Your Portal:
${window.location.origin}/patient-portal

📱 What You Can Do:
• View your consultation history
• Access your prescriptions
• Schedule follow-up appointments
• Message the clinic team

🔒 Keep your credentials safe and secure.

Best regards,
Dr. Kajal Kumari & Team
Arogyam Homeopathic Clinic
📞 +91 94300 30564
📧 arogyambihar@gmail.com
    `.trim();

    navigator.clipboard.writeText(welcomeMessage);
    setNotificationMessage('✅ Complete welcome message copied to clipboard!');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Copy quick credentials for easy sharing
  const copyQuickCredentials = () => {
    if (!selectedPatientCredentials) return;
    
    const quickCredentials = `
🔐 Arogyam Clinic - Patient Portal Access

Patient ID: ${selectedPatientCredentials.patientId}
Password: ${selectedPatientCredentials.password}
Portal: ${window.location.origin}/patient-portal

Keep these credentials safe!
    `.trim();

    navigator.clipboard.writeText(quickCredentials);
    setNotificationMessage('⚡ Quick credentials copied to clipboard!');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Medical Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 shadow-lg border-b border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Arogyam Clinic</h1>
                <p className="text-blue-100 text-xs">Administrative Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Recycle Bin Button */}
              <button
                onClick={handleOpenRecycleBin}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 hover:bg-white/20 transition-all duration-300"
                title="View Last 50 Entries (Recycle Bin)"
              >
                <Trash2 className="w-4 h-4 text-white" />
                <span className="text-white text-xs font-medium">Recycle Bin</span>
              </button>

              {/* Real-time Status Indicator */}
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                <div className={`w-2 h-2 rounded-full ${
                  realtimeStatus === 'connected' ? 'bg-green-400 animate-pulse shadow-lg shadow-green-400/50' :
                  realtimeStatus === 'connecting' ? 'bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50' :
                  realtimeStatus === 'error' ? 'bg-red-400 shadow-lg shadow-red-400/50' :
                  realtimeStatus === 'failed' ? 'bg-red-500 shadow-lg shadow-red-500/50' :
                  'bg-gray-400'
                }`}></div>
                <span className={`text-xs font-medium ${
                  realtimeStatus === 'connected' ? 'text-green-100' :
                  realtimeStatus === 'connecting' ? 'text-yellow-100' :
                  realtimeStatus === 'error' ? 'text-red-100' :
                  realtimeStatus === 'failed' ? 'text-red-200' :
                  'text-gray-100'
                }`}>
                  {realtimeStatus === 'connected' ? 'Live' :
                   realtimeStatus === 'connecting' ? 'Connecting...' :
                   realtimeStatus === 'error' ? 'Error' :
                   realtimeStatus === 'failed' ? 'Offline' :
                   'Unknown'}
                </span>
              </div>

              {/* Manual Refresh Button */}
              <button
                onClick={refreshConsultations}
                disabled={loading}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Manual Refresh Data"
              >
                <RotateCcw className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
                <span className="text-white text-xs font-medium">Refresh</span>
              </button>
              
              {/* User Info & Actions */}
              <div className="flex items-center space-x-3">
                <span className="text-blue-100 text-xs">
                  {user?.name || (() => {
                    const adminSession = localStorage.getItem('admin_session');
                    if (adminSession) {
                      const session = JSON.parse(adminSession);
                      return session.name || 'Admin';
                    }
                    return 'Admin';
                  })()}
                </span>
                <button
                  onClick={goHome}
                  className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10 border border-white/20 text-xs"
                >
                  <Home className="w-3 h-3" />
                  <span>Site</span>
                </button>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-red-200 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-red-500/20 border border-red-300/30 text-xs"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Professional Real-time Notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-xl transform transition-all duration-500 ease-out translate-x-0 opacity-100 border border-green-400/30 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-base">{notificationMessage}</p>
              <p className="text-green-100 text-xs">Real-time update received</p>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Professional Medical Navigation Tabs */}
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {[
              { 
                id: 'new_entry', 
                name: 'New Entries', 
                icon: Plus, 
                description: 'Fresh consultations',
                color: 'blue'
              },
              { 
                id: 'interacting', 
                name: 'Interacting', 
                icon: Calendar, 
                description: 'Active consultations',
                color: 'green'
              },
              { 
                id: 'live_patients', 
                name: 'Live Patients', 
                icon: Users, 
                description: 'Confirmed patients',
                color: 'purple'
              },
              { 
                id: 'todays_appointments', 
                name: "Today's Appointments", 
                icon: Calendar, 
                description: 'Appointments for today & tomorrow',
                color: 'emerald'
              },
              { 
                id: 'completed_appointments', 
                name: 'Completed Appointments', 
                icon: CheckCircle, 
                description: 'Past due appointments',
                color: 'red'
              },
              { 
                id: 'staff_management', 
                name: 'Staff Management', 
                icon: Users, 
                description: 'Manage staff access',
                color: 'orange'
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              // Define static classes for each tab
              const getActiveClasses = (tabId: string) => {
                switch (tabId) {
                  case 'new_entry':
                    return 'bg-gradient-to-b from-blue-50 to-blue-100 border-b-4 border-blue-500 text-blue-700';
                  case 'interacting':
                    return 'bg-gradient-to-b from-green-50 to-green-100 border-b-4 border-green-500 text-green-700';
                  case 'live_patients':
                    return 'bg-gradient-to-b from-purple-50 to-purple-100 border-b-4 border-purple-500 text-purple-700';
                  case 'todays_appointments':
                    return 'bg-gradient-to-b from-emerald-50 to-emerald-100 border-b-4 border-emerald-500 text-emerald-700';
                  case 'completed_appointments':
                    return 'bg-gradient-to-b from-red-50 to-red-100 border-b-4 border-red-500 text-red-700';
                  case 'staff_management':
                    return 'bg-gradient-to-b from-orange-50 to-orange-100 border-b-4 border-orange-500 text-orange-700';
                  default:
                    return 'bg-gradient-to-b from-gray-50 to-gray-100 border-b-4 border-gray-500 text-gray-700';
                }
              };
              
              const getIconClasses = (tabId: string) => {
                switch (tabId) {
                  case 'new_entry':
                    return 'bg-blue-100 text-blue-600';
                  case 'interacting':
                    return 'bg-green-100 text-green-600';
                  case 'live_patients':
                    return 'bg-purple-100 text-purple-600';
                  case 'todays_appointments':
                    return 'bg-emerald-100 text-emerald-600';
                  case 'completed_appointments':
                    return 'bg-red-100 text-red-600';
                  case 'staff_management':
                    return 'bg-orange-100 text-orange-600';
                  default:
                    return 'bg-gray-100 text-gray-600';
                }
              };
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex flex-col items-center py-4 px-3 transition-all duration-300 ${
                    isActive
                      ? getActiveClasses(tab.id)
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-b-4 border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded-lg mb-2 ${
                    isActive 
                      ? getIconClasses(tab.id)
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-base mb-1">{tab.name}</span>
                  <span className="text-xs opacity-75">{tab.description}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* New Entries Tab - Fresh consultations that need attention */}
        {activeTab === 'new_entry' && (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <h2 className="text-lg font-bold text-blue-900">🆕 New Entries</h2>
              <p className="text-blue-700 text-sm">Fresh consultation requests awaiting review</p>
            </div>
            
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Database Error</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                  <button
                    onClick={refreshConsultations}
                    className="ml-auto px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600">Loading consultations...</span>
                </div>
              </div>
            ) : (
              <>
                {/* Stats Cards for New Entries */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Plus className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs font-medium text-gray-600">New Requests</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {consultations.filter(c => c.status === CONSULTATION_STATUS.PENDING && (!c.appointment_status || c.appointment_status === null)).length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Clock className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs font-medium text-gray-600">In Progress</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {consultations.filter(c => 
                            c.status === CONSULTATION_STATUS.IN_PROGRESS
                          ).length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs font-medium text-gray-600">Ready to Confirm</p>
                        <p className="text-2xl font-bold text-green-600">
                          {consultations.filter(c => c.status === CONSULTATION_STATUS.PENDING && (!c.appointment_status || c.appointment_status === null)).length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Pending Consultations Table */}
            {!loading && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                  <h3 className="text-lg font-semibold text-blue-900">Pending Consultations</h3>
                  <p className="text-blue-700 text-xs">Review and confirm new patient requests</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Treatment</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(quickSearchTerm ? searchResults : consultations)
                        .filter(c => {
                          // If searching, show all search results (already filtered by database)
                          if (quickSearchTerm) {
                            return true; // searchResults are already filtered
                          }
                          
                        // If not searching, show only pending entries
                        // MAIN ADMIN WORKFLOW - completely separate from appointment workflow
                        // EXCLUDE consultations with ANY appointment status to prevent cross-contamination
                        if (c.appointment_status && c.appointment_status !== null) {
                          return false; // Don't show in New Entries if consultation has ANY appointment status
                        }
                        
                        return c.status === CONSULTATION_STATUS.PENDING;
                        })
                        .slice(0, 10)
                        .map((consultation) => (
                        <tr 
                          key={consultation.id} 
                          className="hover:bg-blue-50 transition-colors cursor-pointer"
                          onClick={() => {
                            setEditingConsultation(consultation);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-xs">
                                  {consultation.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{consultation.name}</div>
                                <div className="text-xs text-gray-500">{consultation.email}</div>
                                <div className="text-xs text-gray-400">Age: {consultation.age} | {consultation.gender}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{consultation.treatment_type}</div>
                            <div className="text-xs text-gray-500">{consultation.consultation_type}</div>
                            {consultation.condition && (
                              <div className="text-xs text-gray-400 max-w-xs truncate">{consultation.condition}</div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{consultation.preferred_date}</div>
                            <div className="text-xs text-gray-500">{formatTimeToIndian(consultation.preferred_time)}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleConfirmPatient(consultation);
                                }}
                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Confirm
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartConsultation(consultation);
                                }}
                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                              >
                                <Calendar className="w-3 h-3 mr-1" />
                                Start
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditConsultation(consultation);
                                }}
                                className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {consultations.filter(c => c.status === CONSULTATION_STATUS.PENDING && (!c.appointment_status || c.appointment_status === null)).length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center">
                            <div className="text-gray-500">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle className="w-6 h-6 text-blue-600" />
                              </div>
                              <p className="text-base font-medium text-gray-900 mb-2">All caught up!</p>
                              <p className="text-sm text-gray-500">No pending consultations at the moment.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}



        {/* Interacting Tab - Consultations in progress */}
        {activeTab === 'interacting' && (
          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-bold text-green-900">🔄 Interacting</h2>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600">Live</span>
                </div>
                <button 
                  onClick={refreshConsultations}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Database Error</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                  <button
                    onClick={refreshConsultations}
                    className="ml-auto px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Compact Search */}
            <div className="bg-white rounded-lg shadow p-3 mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="relative">
                    {isSearching ? (
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    )}
                    <input
                      type="text"
                      placeholder="Search all consultations..."
                      value={quickSearchTerm}
                      onChange={(e) => setQuickSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
                {quickSearchTerm && (
                  <button
                    onClick={() => setQuickSearchTerm('')}
                    className="px-2 py-1 rounded text-gray-500 hover:text-gray-700 text-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* Search Results Indicator */}
              {quickSearchTerm && (
                <div className="mt-2 text-xs text-gray-600">
                  {isSearching ? (
                    <span>Searching database...</span>
                  ) : (
                    <span>
                      Found {searchResults.length} patient{searchResults.length !== 1 ? 's' : ''} matching "{quickSearchTerm}"
                    </span>
                  )}
                </div>
              )}
            </div>


            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600">Loading consultations...</span>
                </div>
              </div>
            ) : (
              /* Consultations Table */
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Treatment</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(quickSearchTerm ? searchResults : consultations)
                      .filter(consultation => {
                        // If searching, show all search results (already filtered by database)
                        if (quickSearchTerm) {
                          return true; // searchResults are already filtered
                        }
                        
                        // If not searching, show confirmed, reachinglead, in_progress, and follow_up entries in Interacting section
                        // MAIN ADMIN WORKFLOW - completely separate from appointment workflow
                        // EXCLUDE consultations with ANY appointment status to prevent cross-contamination
                        if (consultation.appointment_status && consultation.appointment_status !== null) {
                          return false; // Don't show in Interacting if consultation has ANY appointment status
                        }
                        
                        return (consultation.status === 'confirmed' || 
                                consultation.status === 'reachinglead' ||
                                consultation.status === 'in_progress' ||
                                consultation.status === 'follow_up');
                      })
                      .map((consultation) => (
                      <tr 
                        key={consultation.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setEditingConsultation(consultation);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {consultation.name}
                          </div>
                          <div className="text-xs text-gray-500">{consultation.email}</div>
                          <div className="text-xs text-gray-400">{consultation.phone}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">{consultation.consultation_type}</div>
                          <div className="text-xs text-gray-500">Age: {consultation.age}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{consultation.treatment_type}</div>
                          {consultation.condition && (
                            <div className="text-xs text-gray-500 max-w-xs truncate">{consultation.condition}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{consultation.preferred_date}</div>
                          <div className="text-xs text-gray-500">{formatTimeToIndian(consultation.preferred_time)}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                            {getStatusIcon(consultation.status)}
                            <span className="ml-1">
                              {consultation.status === 'reachinglead' ? 'LEAD' : consultation.status}
                            </span>
                            {/* Lead indicator icon - show 📞 for LEAD status */}
                            {consultation.status === 'reachinglead' && (
                              <span className="ml-1 text-orange-500">📞</span>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditConsultation(consultation);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50" 
                              title="Edit Consultation"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditConsultation(consultation);
                              }}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50" 
                              title="Add Prescription"
                            >
                              <Pill className="w-4 h-4" />
                            </button>
                            <select
                              value={consultation.status}
                              onChange={async (e) => {
                                e.stopPropagation();
                                const newStatus = e.target.value;
                                const result = await updateConsultationStatus(consultation.id, newStatus);
                                if (result.success) {
                                  setNotificationMessage(`Status updated to ${STATUS_LABELS[newStatus as keyof typeof STATUS_LABELS] || newStatus} for ${consultation.name}`);
                                  setShowNotification(true);
                                  setTimeout(() => setShowNotification(false), 3000);
                                } else {
                                  setNotificationMessage(`Failed to update status: ${result.error}`);
                                  setShowNotification(true);
                                  setTimeout(() => setShowNotification(false), 3000);
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value={CONSULTATION_STATUS.PENDING}>{STATUS_LABELS[CONSULTATION_STATUS.PENDING]}</option>
                              <option value={CONSULTATION_STATUS.CONFIRMED}>{STATUS_LABELS[CONSULTATION_STATUS.CONFIRMED]}</option>
                              <option value="reachinglead">LEAD/REACHED</option>
                              <option value={CONSULTATION_STATUS.IN_PROGRESS}>{STATUS_LABELS[CONSULTATION_STATUS.IN_PROGRESS]}</option>
                              <option value={CONSULTATION_STATUS.COMPLETED}>{STATUS_LABELS[CONSULTATION_STATUS.COMPLETED]}</option>
                              <option value={CONSULTATION_STATUS.CANCELLED}>{STATUS_LABELS[CONSULTATION_STATUS.CANCELLED]}</option>
                              <option value={CONSULTATION_STATUS.FOLLOW_UP}>{STATUS_LABELS[CONSULTATION_STATUS.FOLLOW_UP]}</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {consultations.filter(c => 
                      c.status === 'confirmed' || 
                      c.status === 'reachinglead'
                    ).length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          <div className="flex flex-col items-center space-y-3">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                              <Clock className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                              <p className="text-lg font-medium text-gray-700">No Active Consultations</p>
                              <p className="text-sm text-gray-500">
                                Consultations will appear here once you confirm patients or start consultations
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Live Patients Tab - Completed consultations and patient history */}
        {activeTab === 'live_patients' && (
          <div className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-purple-900">👥 Live Patients</h2>
                  <p className="text-purple-700 text-sm">Confirmed patients and completed consultations</p>
                </div>
                <button 
                  onClick={refreshConsultations}
                  className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* Live Patient Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-600">Confirmed Patients</p>
                                            <p className="text-2xl font-bold text-green-600">
                          {consultations.filter(c => c.status === CONSULTATION_STATUS.CONFIRMED).length}
                        </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-600">In Progress</p>
                                            <p className="text-2xl font-bold text-blue-600">
                          {consultations.filter(c => c.status === CONSULTATION_STATUS.IN_PROGRESS).length}
                        </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-600">Total Live Patients</p>
                                            <p className="text-2xl font-bold text-purple-600">
                          {consultations.filter(c => c.status === CONSULTATION_STATUS.COMPLETED && (!c.appointment_status || c.appointment_status === null)).length}
                        </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Patients Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
                <h3 className="text-lg font-semibold text-purple-900">Live Patient Records</h3>
                <p className="text-purple-700 text-xs">Confirmed, completed, and follow-up patients</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Treatment</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Portal Access</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(quickSearchTerm ? searchResults : consultations)
                      .filter(c => {
                        // If searching, show all search results (already filtered by database)
                        if (quickSearchTerm) {
                          return true; // searchResults are already filtered
                        }
                        
                        // If not searching, show only completed entries (moved from Interacting after doctor consultation)
                        // MAIN ADMIN WORKFLOW - completely separate from appointment workflow
                        // EXCLUDE consultations with ANY appointment status to prevent cross-contamination
                        if (c.appointment_status && c.appointment_status !== null) {
                          return false; // Don't show in Live Patients if consultation has ANY appointment status
                        }
                        
                        return c.status === CONSULTATION_STATUS.COMPLETED;
                      })
                      .slice(0, 15)
                      .map((consultation) => (
                      <tr 
                        key={consultation.id} 
                        className="hover:bg-purple-50 transition-colors cursor-pointer"
                        onClick={() => {
                          setEditingConsultation(consultation);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 font-semibold text-xs">
                                {consultation.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{consultation.name}</div>
                              <div className="text-xs text-gray-500">{consultation.email}</div>
                              <div className="text-xs text-gray-400">Age: {consultation.age} | {consultation.gender}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                            {getStatusIcon(consultation.status)}
                            <span className="ml-1 capitalize">{consultation.status.replace('_', ' ')}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{consultation.treatment_type}</div>
                          <div className="text-xs text-gray-500">{consultation.consultation_type}</div>
                          {consultation.diagnosis && (
                            <div className="text-xs text-gray-400">Dx: {consultation.diagnosis}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{consultation.preferred_date}</div>
                          <div className="text-xs text-gray-500">{formatTimeToIndian(consultation.preferred_time)}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            {/* Generate Login Button */}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                generatePatientCredentials(consultation);
                              }}
                              disabled={generatingCredentials === consultation.id}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Generate Patient Portal Login"
                            >
                              {generatingCredentials === consultation.id ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Key className="w-3 h-3 mr-1" />
                                  Generate
                                </>
                              )}
                            </button>
                            
                            {/* View Credentials Button (shown after generation) */}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                viewPatientCredentials(consultation);
                              }}
                              className="inline-flex items-center px-2 py-1 border border-blue-300 text-xs leading-4 font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                              title="View Patient Credentials"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditConsultation(consultation);
                              }}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditConsultation(consultation);
                              }}
                              className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {consultations.filter(c => c.status === CONSULTATION_STATUS.COMPLETED && (!c.appointment_status || c.appointment_status === null)).length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Users className="w-8 h-8 text-purple-600" />
                            </div>
                            <p className="text-lg font-medium text-gray-900 mb-2">No Live Patients Yet</p>
                            <p className="text-gray-500">Confirm patients from the "New Entries" tab to see them here.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Today's Appointments Tab */}
        {activeTab === 'todays_appointments' && (
          <div className="space-y-4">
            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-emerald-900">📅 Today's Appointments</h2>
                  <p className="text-emerald-700 text-sm">Appointments scheduled for today & tomorrow</p>
                </div>
                <div className="text-sm text-emerald-600 font-medium">
                {getTodaysAppointments().length} appointments today & tomorrow
                </div>
              </div>
            </div>

            {/* Today's Appointments Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-emerald-100">
                <h3 className="text-lg font-semibold text-emerald-900">Today's & Tomorrow's Schedule</h3>
                <p className="text-emerald-700 text-xs">All appointments scheduled for today and tomorrow</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getTodaysAppointments()
                      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                      .map((consultation) => (
                        <tr key={consultation.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-emerald-600">
                                    {consultation.name?.charAt(0)?.toUpperCase() || '?'}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{consultation.name || 'Unknown'}</div>
                                <div className="text-sm text-gray-500">
                                  Lead Status: {consultation.status || 'Unknown'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{consultation.phone || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{consultation.email || 'no email provided'}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(consultation.appointment_status || APPOINTMENT_OPTIONS.PENDING)}`}>
                              {getStatusIcon(consultation.appointment_status || APPOINTMENT_OPTIONS.PENDING)}
                              <span className="ml-1">{getAppointmentStatusLabel(consultation.appointment_status || APPOINTMENT_OPTIONS.PENDING)}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {consultation.next_appointment_date ? (
                              <div className="flex items-center space-x-2">
                                <span>{new Date(consultation.next_appointment_date).toLocaleDateString()}</span>
                                {consultation.next_appointment_date === new Date().toISOString().split('T')[0] ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                    Today
                                  </span>
                                ) : consultation.next_appointment_date === new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Tomorrow
                                  </span>
                                ) : null}
                              </div>
                            ) : 'Not scheduled'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                            <select
                              value={consultation.appointment_status || APPOINTMENT_OPTIONS.PENDING}
                              onChange={async (e) => {
                                const newStatus = e.target.value;

                                if (newStatus === APPOINTMENT_OPTIONS.SALE_MADE) {
                                  // Move to Completed Appointments when sale is made
                                  const result = await handleUpdateAppointmentStatus(consultation.id, newStatus);
                                  if (result.success) {
                                    setNotificationMessage(`Sale made for ${consultation.name} - moved to Completed Appointments!`);
                                  } else {
                                    setNotificationMessage(`Failed to update status: ${result.error}`);
                                  }
                                } else {
                                  // Stay in Today's Appointments (all other statuses)
                                  const result = await handleUpdateAppointmentStatus(consultation.id, newStatus);
                                  if (result.success) {
                                    setNotificationMessage(`Appointment status updated to ${APPOINTMENT_OPTION_LABELS[newStatus as AppointmentOption]}!`);
                                  } else {
                                    setNotificationMessage(`Failed to update status: ${result.error}`);
                                  }
                                }
                                setShowNotification(true);
                                setTimeout(() => setShowNotification(false), 3000);
                              }}
                              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                              <option value={APPOINTMENT_OPTIONS.PENDING}>{APPOINTMENT_OPTION_LABELS[APPOINTMENT_OPTIONS.PENDING]}</option>
                              <option value={APPOINTMENT_OPTIONS.FOLLOWUP}>{APPOINTMENT_OPTION_LABELS[APPOINTMENT_OPTIONS.FOLLOWUP]}</option>
                              <option value={APPOINTMENT_OPTIONS.INPROGRESS}>{APPOINTMENT_OPTION_LABELS[APPOINTMENT_OPTIONS.INPROGRESS]}</option>
                              <option value={APPOINTMENT_OPTIONS.NOT_INTERESTED}>{APPOINTMENT_OPTION_LABELS[APPOINTMENT_OPTIONS.NOT_INTERESTED]}</option>
                              <option value={APPOINTMENT_OPTIONS.SALE_MADE}>{APPOINTMENT_OPTION_LABELS[APPOINTMENT_OPTIONS.SALE_MADE]}</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                
                {getTodaysAppointments().length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">No Appointments Today or Tomorrow</p>
                    <p className="text-gray-500">All clear for today and tomorrow! Check other tabs for upcoming appointments.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Completed Appointments Tab */}
        {activeTab === 'completed_appointments' && (
          <div className="space-y-4">
            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-red-900">✅ Completed Appointments</h2>
                  <p className="text-red-700 text-sm">Sales that have been made</p>
                </div>
                <div className="text-sm text-red-600 font-medium">
                  {getCompletedAppointments().length} sales made
                </div>
              </div>
            </div>

            {/* Completed Appointments Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-red-50 to-red-100">
                <h3 className="text-lg font-semibold text-red-900">Sales Made</h3>
                <p className="text-red-700 text-xs">Appointments where sales have been completed</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Overdue</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getCompletedAppointments()
                      .sort((a, b) => new Date(a.next_appointment_date || '').getTime() - new Date(b.next_appointment_date || '').getTime())
                      .map((consultation) => {
                        const daysOverdue = consultation.next_appointment_date 
                          ? Math.floor((new Date().getTime() - new Date(consultation.next_appointment_date).getTime()) / (1000 * 60 * 60 * 24))
                          : 0;
                        
                        return (
                          <tr key={consultation.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8">
                                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                    <span className="text-sm font-medium text-red-600">
                                      {consultation.name?.charAt(0)?.toUpperCase() || '?'}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{consultation.name || 'Unknown'}</div>
                                  <div className="text-sm text-gray-500">ID: {consultation.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{consultation.phone || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{consultation.email || 'N/A'}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(consultation.appointment_status || APPOINTMENT_OPTIONS.PENDING)}`}>
                                {getStatusIcon(consultation.appointment_status || APPOINTMENT_OPTIONS.PENDING)}
                                <span className="ml-1">{getAppointmentStatusLabel(consultation.appointment_status || APPOINTMENT_OPTIONS.PENDING)}</span>
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {consultation.next_appointment_date ? new Date(consultation.next_appointment_date).toLocaleDateString() : 'Not scheduled'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {consultation.appointment_status === APPOINTMENT_OPTIONS.SALE_MADE ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  ✅ Sale Made
                                </span>
                              ) : (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  daysOverdue > 7 ? 'bg-red-100 text-red-800' : 
                                  daysOverdue > 3 ? 'bg-orange-100 text-orange-800' : 
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {daysOverdue} day{daysOverdue !== 1 ? 's' : ''} overdue
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => handleEditConsultation(consultation)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Reschedule Appointment"
                              >
                                <Calendar className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleContactPatient(consultation)}
                                className="text-green-600 hover:text-green-900"
                                title="Contact Patient"
                              >
                                <Mail className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  // Delete from completed appointments - separate from main admin flow
                                  handleDeleteAppointment(consultation.id);
                                }}
                                className="text-red-600 hover:text-red-900"
                                title="Remove from Completed Appointments"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                
                {consultations.filter(c => {
                  // Show completed appointments OR overdue appointments
                  if (c.status === 'completed') return true;
                  if (!c.next_appointment_date) return false;
                  const today = new Date().toISOString().split('T')[0];
                  return c.next_appointment_date < today;
                }).length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">No Completed or Overdue Appointments</p>
                    <p className="text-gray-500">Great! All appointments are up to date.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Staff Management Tab */}
        {activeTab === 'staff_management' && (
          <div className="space-y-4">
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-orange-900">👥 Staff Management</h2>
                  <p className="text-orange-700 text-sm">Manage staff accounts and permissions</p>
                </div>
                <button 
                  onClick={() => {
                    // Add new staff functionality
                    setNotificationMessage('Add new staff feature coming soon!');
                    setShowNotification(true);
                    setTimeout(() => setShowNotification(false), 3000);
                  }}
                  className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700"
                >
                  Add Staff
                </button>
              </div>
            </div>

            {/* Staff Management Content */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
                <h3 className="text-lg font-semibold text-orange-900">Staff Accounts</h3>
                <p className="text-orange-700 text-xs">Manage staff login credentials and permissions</p>
              </div>
              
              <div className="p-6">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Staff Management</h3>
                  <p className="text-gray-500 mb-4">
                    Add and manage staff members who can access the staff portal with limited permissions.
                  </p>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-orange-900 mb-2">Staff Permissions Include:</h4>
                    <ul className="text-sm text-orange-700 space-y-1 text-left">
                      <li>✅ View all patients and consultations</li>
                      <li>✅ Edit basic patient information (name, contact, appointment times)</li>
                      <li>✅ Add new consultations</li>
                      <li>✅ Change consultation status (pending → confirmed → completed)</li>
                      <li>✅ Generate patient portal credentials</li>
                      <li>✅ Download basic PDFs</li>
                      <li>❌ Cannot edit prescriptions or medical details</li>
                      <li>❌ Cannot delete consultations</li>
                      <li>❌ Cannot access Live Patients section</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setNotificationMessage('Add staff feature will be implemented in the next update!');
                        setShowNotification(true);
                        setTimeout(() => setShowNotification(false), 3000);
                      }}
                      className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                    >
                      <Users className="w-5 h-5 inline mr-2" />
                      Add New Staff Member
                    </button>
                    
                    <p className="text-sm text-gray-500">
                      Staff members will be able to login at <code className="bg-gray-100 px-2 py-1 rounded">/admin</code> using the Staff toggle
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        <ConsultationEditModal
          consultation={editingConsultation}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingConsultation(null);
          }}
          onSave={handleSaveConsultation}
          onDelete={handleDeleteConsultation}
        />

        {/* Recycle Bin Modal */}
        {showRecycleBin && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 border-b border-orange-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Trash2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Recycle Bin</h2>
                      <p className="text-orange-100">Last 50 entries - Click restore to bring back to New Entries</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRecycleBin(false)}
                    className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Search Bar for Recycle Bin */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search in recycle bin by name, email, or treatment..."
                        value={recycleBinSearchTerm}
                        onChange={(e) => setRecycleBinSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setRecycleBinSearchTerm('')}
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recycleBinConsultations
                    .filter(consultation => 
                      !recycleBinSearchTerm || 
                      consultation.name.toLowerCase().includes(recycleBinSearchTerm.toLowerCase()) ||
                      consultation.email.toLowerCase().includes(recycleBinSearchTerm.toLowerCase()) ||
                      consultation.treatment_type.toLowerCase().includes(recycleBinSearchTerm.toLowerCase())
                    )
                    .map((consultation) => (
                    <div 
                      key={consultation.id} 
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-orange-300 transition-colors cursor-pointer"
                      onClick={() => {
                        setEditingConsultation(consultation);
                        setIsEditModalOpen(true);
                        setShowRecycleBin(false);
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-orange-600 font-semibold text-sm">
                              {consultation.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{consultation.name}</h3>
                            <p className="text-xs text-gray-500">{consultation.email}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                          {getStatusIcon(consultation.status)}
                          <span className="ml-1">{consultation.status}</span>
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <p className="text-sm text-gray-700"><strong>Treatment:</strong> {consultation.treatment_type}</p>
                        <p className="text-sm text-gray-600"><strong>Date:</strong> {consultation.preferred_date}</p>
                        <p className="text-xs text-gray-500"><strong>Created:</strong> {new Date(consultation.created_at).toLocaleDateString()}</p>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestoreConsultation(consultation);
                          }}
                          className="flex-1 flex items-center justify-center space-x-2 bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Restore</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditConsultation(consultation);
                          }}
                          className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {recycleBinConsultations.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trash2 className="w-8 h-8 text-orange-600" />
                    </div>
                    <p className="text-lg font-medium text-gray-900 mb-2">Recycle Bin Empty</p>
                    <p className="text-gray-500">No entries to restore at the moment.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Credentials Modal */}
        {showCredentialsModal && selectedPatientCredentials && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-blue-900">Patient Portal Credentials</h3>
                  <button
                    onClick={() => setShowCredentialsModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-blue-700 text-sm mt-1">Login details for patient portal access</p>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Patient Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Patient Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium text-gray-900">{selectedPatientCredentials.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-900">{selectedPatientCredentials.email}</span>
                    </div>
                  </div>
                </div>

                {/* Credentials */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3">🔐 Login Credentials</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-blue-700 mb-1">Patient ID</label>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 bg-white px-3 py-2 rounded border border-blue-300 text-blue-900 font-mono text-sm">
                          {selectedPatientCredentials.patientId}
                        </code>
                        <button
                          onClick={() => copyToClipboard(selectedPatientCredentials.patientId)}
                          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          title="Copy Patient ID"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-blue-700 mb-1">Password</label>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 bg-white px-3 py-2 rounded border border-blue-300 text-blue-900 font-mono text-sm">
                          {selectedPatientCredentials.password}
                        </code>
                        <button
                          onClick={() => copyToClipboard(selectedPatientCredentials.password)}
                          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          title="Copy Password"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>



                {/* Status Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Status Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Generated:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(selectedPatientCredentials.generatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email Sent:</span>
                      <span className={`font-medium ${selectedPatientCredentials.emailSent ? 'text-green-600' : 'text-orange-600'}`}>
                        {selectedPatientCredentials.emailSent ? '✅ Yes' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Copy All Credentials */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-3">⚡ Quick Copy All Credentials</h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    Copy just the essential login details for quick sharing
                  </p>
                  
                  {/* Preview of quick credentials */}
                  <div className="bg-white border border-yellow-200 rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-700 whitespace-pre-line">
                      🔐 Arogyam Clinic - Patient Portal Access{'\n\n'}
                      Patient ID: {selectedPatientCredentials.patientId}{'\n'}
                      Password: {selectedPatientCredentials.password}{'\n'}
                      Portal: {window.location.origin}/patient-portal{'\n\n'}
                      Keep these credentials safe!
                    </p>
                  </div>
                  
                  <button
                    onClick={() => copyQuickCredentials()}
                    className="w-full flex items-center justify-center space-x-2 bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <Copy className="w-5 h-5" />
                    <span className="font-medium">Copy Quick Credentials</span>
                  </button>
                </div>

                {/* Copy All Button */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3">📋 Copy Complete Welcome Message</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Copy the complete welcome message with all credentials to send to the patient
                  </p>
                  
                  {/* Preview of the welcome message */}
                  <div className="bg-white border border-blue-200 rounded-lg p-3 mb-3 max-h-32 overflow-y-auto">
                    <p className="text-xs text-gray-700 whitespace-pre-line">
                      🏥 Welcome to Arogyam Homeopathic Clinic{'\n\n'}
                      Dear {selectedPatientCredentials.name},{'\n\n'}
                      Your patient portal access has been successfully created!{'\n\n'}
                      🔐 Login Credentials:{'\n'}
                      Patient ID: {selectedPatientCredentials.patientId}{'\n'}
                      Password: {selectedPatientCredentials.password}{'\n\n'}
                      🌐 Access Your Portal:{'\n'}
                      {window.location.origin}/patient-portal{'\n\n'}
                      📱 What You Can Do:{'\n'}
                      • View your consultation history{'\n'}
                      • Access your prescriptions{'\n'}
                      • Schedule follow-up appointments{'\n'}
                      • Message the clinic team{'\n\n'}
                      🔒 Keep your credentials safe and secure.{'\n\n'}
                      Best regards,{'\n'}
                      Dr. Kajal Kumari & Team{'\n'}
                      Arogyam Homeopathic Clinic{'\n'}
                      📞 +91 94300 30564{'\n'}
                      📧 arogyambihar@gmail.com
                    </p>
                  </div>
                  
                  <button
                    onClick={() => copyCompleteWelcomeMessage()}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <Copy className="w-5 h-5" />
                    <span className="font-medium">Copy Complete Welcome Message</span>
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      // Resend email functionality will be implemented in future updates
                      setNotificationMessage('Email resend feature coming soon!');
                      setShowNotification(true);
                      setTimeout(() => setShowNotification(false), 3000);
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Resend Email</span>
                  </button>
                  <button
                    onClick={() => setShowCredentialsModal(false)}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
