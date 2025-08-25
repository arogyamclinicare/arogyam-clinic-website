import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useSupabase } from './context/SupabaseContext';
import { ConsultationEditModal } from './modals/ConsultationEditModal';
import { supabase } from '../lib/supabase';
import { generateSecurePassword } from '../lib/auth';
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
import type { Consultation } from '../lib/supabase';
import { 
  CONSULTATION_STATUS, 
  STATUS_LABELS, 
  STATUS_COLORS, 
  STATUS_ICONS,
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

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const { 
    consultations, 
    loading,
    error,
    realtimeStatus,
    updateConsultationStatus,
    updateConsultation,
    deleteConsultation,
    refreshConsultations
  } = useSupabase();
  const [activeTab, setActiveTab] = useState<'new_entry' | 'interacting' | 'live_patients'>('new_entry');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingConsultation, setEditingConsultation] = useState<Consultation | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [recycleBinConsultations, setRecycleBinConsultations] = useState<Consultation[]>([]);
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
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'text-gray-600 bg-gray-100';
  };

  const getStatusIcon = (status: string) => {
    const IconName = STATUS_ICONS[status as keyof typeof STATUS_ICONS];
    switch (IconName) {
      case 'CheckCircle': return <CheckCircle className="w-4 h-4" />;
      case 'Clock': return <Clock className="w-4 h-4" />;
      case 'AlertCircle': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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
      setIsEditModalOpen(false);
      setEditingConsultation(null);
    }
    return result;
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

  // Function to confirm a patient (move from New Entries to Interacting)
  const handleConfirmPatient = async (consultation: Consultation) => {
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
        // Show success notification
        setNotificationMessage(`Patient ${consultation.name} confirmed and moved to Interacting!`);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
      return result;
    } catch (error) {
      console.error('Error confirming patient:', error);
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
      console.error('Error starting consultation:', error);
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
      console.error('Error restoring consultation:', error);
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
          const { data: duplicateCheck, error: checkError } = await supabase
            .from('patients')
            .select('patient_id')
            .eq('patient_id', patientId)
            .maybeSingle();
          
          if (checkError) {
            console.error('Error checking duplicate:', checkError);
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
        const { error: insertError } = await supabase
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
          });
        
        if (insertError) throw insertError;
        // Created new patient with unique credentials

      // CRITICAL: Link the consultation to the patient by updating patient_id
              // Linking consultation to patient
      const { error: linkError } = await supabase
        .from('consultations')
        .update({ patient_id: patientId })
        .eq('id', consultation.id);
      
      if (linkError) {
        console.error('Error linking consultation to patient:', linkError);
        throw new Error('Failed to link consultation to patient');
      }
      
              // Successfully linked consultation to patient

      // For now, mark email as pending (manual sending)
      await supabase
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
      console.error('Error generating credentials:', error);
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
      
      // Find patient by consultation_id (new approach)
      let { data: patient, error } = await supabase
        .from('patients')
        .select('*')
        .eq('consultation_id', consultation.id)
        .single();

      // If not found by consultation_id, try to find by patient_id (fallback for old records)
      if (error || !patient) {
        // Not found by consultation_id, trying by patient_id
        if (consultation.patient_id) {
          const { data: patientById } = await supabase
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
        name: patient.name,
        email: patient.email,
        patientId: patient.patient_id,
        password: patient.password,
        generatedAt: patient.credentials_generated_at,
        emailSent: patient.email_sent
      });

      setShowCredentialsModal(true);
    } catch (error) {
      console.error('Error fetching credentials:', error);
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
                <span className="text-blue-100 text-xs">Dr. {user?.name || 'Admin'}</span>
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
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex flex-col items-center py-4 px-3 transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-b from-${tab.color}-50 to-${tab.color}-100 border-b-4 border-${tab.color}-500 text-${tab.color}-700`
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-b-4 border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded-lg mb-2 ${
                    isActive 
                      ? `bg-${tab.color}-100 text-${tab.color}-600` 
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
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">🆕 New Entries</h2>
              <p className="text-blue-700 text-base">Fresh consultation requests awaiting your review and confirmation</p>
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
                          {consultations.filter(c => c.status === CONSULTATION_STATUS.PENDING).length}
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
                          {consultations.filter(c => c.status === CONSULTATION_STATUS.PENDING).length}
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
                      {consultations
                        .filter(c => c.status === CONSULTATION_STATUS.PENDING)
                        .slice(0, 10)
                        .map((consultation) => (
                        <tr key={consultation.id} className="hover:bg-blue-50 transition-colors">
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
                                onClick={() => handleConfirmPatient(consultation)}
                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Confirm
                              </button>
                              <button
                                onClick={() => handleStartConsultation(consultation)}
                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                              >
                                <Calendar className="w-3 h-3 mr-1" />
                                Start
                              </button>
                              <button
                                onClick={() => handleEditConsultation(consultation)}
                                className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {consultations.filter(c => c.status === CONSULTATION_STATUS.PENDING).length === 0 && (
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
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-green-900 mb-2">🔄 Interacting</h2>
                  <p className="text-green-700 text-base">Active consultations in progress & follow-up entries that need attention</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                    <span className="text-xs text-green-700 font-medium">Live Updates Active</span>
                    <span className="text-xs text-green-600">(Real-time synchronization)</span>
                  </div>
                </div>
                <button 
                  onClick={refreshConsultations}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Refresh</span>
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

            {/* Search */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search consultations by name, email, or treatment..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
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
                    {consultations
                      .filter(consultation => 
                        // Show in_progress AND follow_up entries in Interacting section
                        (consultation.status === CONSULTATION_STATUS.IN_PROGRESS || 
                         consultation.status === CONSULTATION_STATUS.FOLLOW_UP) &&
                        // Then filter by search term
                        (consultation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.treatment_type.toLowerCase().includes(searchTerm.toLowerCase()))
                      )
                      .map((consultation) => (
                      <tr key={consultation.id} className="hover:bg-gray-50">
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
                            <span className="ml-1">{consultation.status}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditConsultation(consultation)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50" 
                              title="Edit Consultation"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditConsultation(consultation)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50" 
                              title="Add Prescription"
                            >
                              <Pill className="w-4 h-4" />
                            </button>
                            <select
                              value={consultation.status}
                              onChange={(e) => updateConsultationStatus(consultation.id, e.target.value)}
                              className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value={CONSULTATION_STATUS.PENDING}>{STATUS_LABELS[CONSULTATION_STATUS.PENDING]}</option>
                              <option value={CONSULTATION_STATUS.CONFIRMED}>{STATUS_LABELS[CONSULTATION_STATUS.CONFIRMED]}</option>
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
                      c.status === CONSULTATION_STATUS.IN_PROGRESS || 
                      c.status === CONSULTATION_STATUS.FOLLOW_UP
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
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-purple-900 mb-2">👥 Live Patients</h2>
                  <p className="text-purple-700 text-base">Confirmed patients, completed consultations, and treatment history</p>
                </div>
                <button 
                  onClick={refreshConsultations}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg text-sm"
                >
                  <Users className="w-4 h-4" />
                  <span>Refresh</span>
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
                          {consultations.filter(c => [
                            CONSULTATION_STATUS.CONFIRMED, 
                            CONSULTATION_STATUS.COMPLETED
                            // Note: FOLLOW_UP entries now go to Interacting section
                          ].includes(c.status as any)).length}
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
                    {consultations
                      .filter(c => [
                        CONSULTATION_STATUS.CONFIRMED, 
                        CONSULTATION_STATUS.COMPLETED
                        // Note: FOLLOW_UP entries now go to Interacting section
                      ].includes(c.status as any))
                      .slice(0, 15)
                      .map((consultation) => (
                      <tr key={consultation.id} className="hover:bg-purple-50 transition-colors">
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
                              onClick={() => generatePatientCredentials(consultation)}
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
                              onClick={() => viewPatientCredentials(consultation)}
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
                              onClick={() => handleEditConsultation(consultation)}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </button>
                            <button 
                              onClick={() => handleEditConsultation(consultation)}
                              className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {consultations.filter(c => [
                      CONSULTATION_STATUS.CONFIRMED, 
                      CONSULTATION_STATUS.COMPLETED
                      // Note: FOLLOW_UP entries now go to Interacting section
                    ].includes(c.status as any)).length === 0 && (
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

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recycleBinConsultations.map((consultation) => (
                    <div key={consultation.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-orange-300 transition-colors">
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
                          onClick={() => handleRestoreConsultation(consultation)}
                          className="flex-1 flex items-center justify-center space-x-2 bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Restore</span>
                        </button>
                        <button
                          onClick={() => handleEditConsultation(consultation)}
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

                {/* Portal Link */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">🌐 Patient Portal Access</h4>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-white px-3 py-2 rounded border border-green-300 text-green-900 font-mono text-sm">
                      {window.location.origin}/patient-portal
                    </code>
                    <button
                      onClick={() => copyToClipboard(`${window.location.origin}/patient-portal`)}
                      className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      title="Copy Portal Link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
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
