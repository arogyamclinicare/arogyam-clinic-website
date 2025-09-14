import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Users, 
  Calendar, 
  Download, 
  Search, 
  CheckCircle, 
  Clock, 
  UserPlus,
  LogOut,
  Eye,
  Plus
} from 'lucide-react';
import { validateStaffSession, clearStaffSession } from '../lib/secure-auth';
import { getSupabaseAdmin } from '../lib/supabase-admin';

interface StaffSession {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: any;
  loginTime: string;
  expiresAt: string;
  sessionId: string;
}

interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  condition: string;
  preferred_date: string;
  preferred_time: string;
  consultation_type: string;
  status: string;
  created_at: string;
  patient_id: string;
  is_lead?: boolean;
  lead_marked_at?: string;
}

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  patient_id: string;
  created_at: string;
}

const StaffDashboard: React.FC = () => {
  const [staff, setStaff] = useState<StaffSession | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'new_entries' | 'interacting'>('new_entries');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Helper function to format time in Indian 12-hour format
  const formatTimeToIndian = (timeString: string) => {
    if (!timeString) return timeString;
    
    // Handle both "19:30:00" and "19:30" formats
    const time = timeString.includes(':') ? timeString.split(':') : [timeString];
    const hours = parseInt(time[0]);
    const minutes = time[1] || '00';
    
    if (isNaN(hours)) return timeString;
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    
    return `${displayHours}:${minutes} ${period}`;
  };

  // Check staff session on mount
  useEffect(() => {
    const session = validateStaffSession();
    if (session) {
      setStaff(session);
      loadData();
    } else {
      // Redirect to login if no valid session
      window.location.href = '/admin';
    }
  }, []);

  // Set up real-time subscription for live updates
  useEffect(() => {
    let channel: any = null;
    
    const setupRealtime = async () => {
      try {
        const client = getSupabaseAdmin();
        channel = client
          .channel('staff-consultations-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'consultations'
            },
            (payload) => {
              // Handle different types of changes
              if (payload.eventType === 'INSERT') {
                // Add new consultation to the list
                const newConsultation = payload.new as Consultation;
                setConsultations(prev => [newConsultation, ...prev]);
              } else if (payload.eventType === 'UPDATE') {
                // Update existing consultation
                const updatedConsultation = payload.new as Consultation;
                setConsultations(prev => 
                  prev.map(consultation => 
                    consultation.id === updatedConsultation.id ? updatedConsultation : consultation
                  )
                );
              } else if (payload.eventType === 'DELETE') {
                // Remove deleted consultation
                const deletedId = payload.old.id;
                setConsultations(prev => prev.filter(consultation => consultation.id !== deletedId));
              }
            }
          )
          .subscribe((status) => {
    // Empty block
  });
      } catch (error) {
    // Empty block
  }
    };

    // Delay real-time setup to avoid immediate client creation
    const timer = setTimeout(() => {
      setupRealtime();
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timer);
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const supabase = getSupabaseAdmin();

      // Load consultations
      const { data: consultationsData, error: consultationsError } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (consultationsError) {
    // Empty block
  } else {
        setConsultations(consultationsData || []);
      }

      // Load patients
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (patientsError) {
    // Empty block
  } else {
        setPatients(patientsData || []);
      }
    } catch (error) {
    // Empty block
  } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearStaffSession();
    window.location.href = '/admin';
  };

  const updateConsultationStatus = async (id: string, newStatus: string) => {
    // Check staff permissions
    if (!staff?.permissions?.canChangeStatus) {
      return;
    }

    // Only allow specific status transitions for staff
    const allowedTransitions = ['confirmed'];
    if (!allowedTransitions.includes(newStatus)) {
      return;
    }

    try {
      const supabase = getSupabaseAdmin();
      const { error } = await (supabase as any)
        .from('consultations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
    // Empty block
  }
      // No alert, no reload - real-time will handle the update
    } catch (error) {
    // Empty block
  }
  };

  // Removed generatePatientCredentials function as it's no longer used

  const downloadBasicPDF = (consultation: Consultation) => {
    // Check staff permissions
    if (!staff?.permissions?.canDownloadPDFs) {
      return;
    }

    // Simple PDF generation for basic info
    const content = `
      Arogyam Healthcare - Consultation Report
      
      Patient: ${consultation.name}
      Email: ${consultation.email}
      Phone: ${consultation.phone}
      Age: ${consultation.age}
      Gender: ${consultation.gender}
      Condition: ${consultation.condition}
      Date: ${consultation.preferred_date}
      Time: ${consultation.preferred_time}
      Status: ${consultation.status}
      
      Generated on: ${new Date().toLocaleDateString()}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultation-${consultation.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addNewConsultation = () => {
    // Check staff permissions
    if (!staff?.permissions?.canAddConsultations) {
      return;
    }

    // For now, redirect to the main website consultation form
    // In the future, this could open a modal or dedicated form
    window.open('/', '_blank');
  };

  const markAsLead = async (consultationId: string) => {
    // Check staff permissions
    if (!staff?.permissions?.canChangeStatus) {
      return;
    }

    try {
      const supabase = getSupabaseAdmin();
      const { error } = await (supabase as any)
        .from('consultations')
        .update({ 
          status: 'reachinglead',
          is_lead: true,
          lead_marked_at: new Date().toISOString()
        })
        .eq('id', consultationId);

      if (error) {
    // Empty block
  }
      // No alert, no reload - real-time will handle the update
    } catch (error) {
    // Empty block
  }
  };

  // Filter consultations based on selected tab
  const newEntries = consultations.filter(consultation => 
    consultation.status === 'pending' &&
    (consultation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     consultation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     consultation.phone.includes(searchTerm))
  );

  const interactingConsultations = consultations.filter(consultation => 
    (consultation.status === 'confirmed' || consultation.status === 'reachinglead') &&
    (consultation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     consultation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     consultation.phone.includes(searchTerm))
  );

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!staff) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Staff Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {staff.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {staff.role.replace('_', ' ').toUpperCase()}
              </span>
              <Button onClick={handleLogout} variant="outline" size="sm" className="text-gray-600 border-gray-300 hover:bg-gray-50">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Consultations</CardTitle>
              <Calendar className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{consultations.length}</div>
              <p className="text-gray-500 text-xs mt-1">All time consultations</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Patients</CardTitle>
              <Users className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{patients.length}</div>
              <p className="text-gray-500 text-xs mt-1">Registered patients</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Consultations</CardTitle>
              <Clock className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {consultations.filter(c => c.status === 'pending').length}
              </div>
              <p className="text-gray-500 text-xs mt-1">Awaiting confirmation</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Tabs */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search consultations or patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md"
              />
            </div>
            <div className="flex space-x-3">
              {/* Add New Consultation Button - Only if staff has permission */}
              {staff?.permissions?.canAddConsultations && (
                <Button
                  onClick={addNewConsultation}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-4 rounded-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Consultation
                </Button>
              )}
              <Button
                variant={selectedTab === 'new_entries' ? 'default' : 'outline'}
                onClick={() => setSelectedTab('new_entries')}
                className={`h-10 px-4 rounded-md ${
                  selectedTab === 'new_entries' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Clock className="w-4 h-4 mr-2" />
                New Entries ({newEntries.length})
              </Button>
              <Button
                variant={selectedTab === 'interacting' ? 'default' : 'outline'}
                onClick={() => setSelectedTab('interacting')}
                className={`h-10 px-4 rounded-md ${
                  selectedTab === 'interacting' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Interacting ({interactingConsultations.length})
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading data...</p>
          </div>
        ) : selectedTab === 'new_entries' ? (
          <div className="space-y-6">
            {newEntries.map((consultation) => (
              <Card key={consultation.id} className="bg-white shadow-sm border border-gray-200">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm mr-3">
                          {consultation.name.charAt(0).toUpperCase()}
                        </div>
                        {consultation.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-sm mt-1">
                        {consultation.email} • {consultation.phone} • Age: {consultation.age}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          consultation.status === 'completed' 
                            ? 'bg-green-100 text-green-800' :
                          consultation.status === 'confirmed' 
                            ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {consultation.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <Label className="text-sm font-medium text-gray-700">Condition</Label>
                      <p className="text-sm text-gray-900 mt-1">{consultation.condition}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <Label className="text-sm font-medium text-gray-700">Appointment</Label>
                      <p className="text-sm text-gray-900 mt-1">
                        {consultation.preferred_date} at {formatTimeToIndian(consultation.preferred_time)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {/* View Details Button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedConsultation(consultation);
                        setShowDetailsModal(true);
                      }}
                      className="text-gray-700 border-gray-300 hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    
                    {/* Status Update Buttons - Only if staff has permission */}
                    {staff?.permissions?.canChangeStatus && (
                      <>
                        {consultation.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => updateConsultationStatus(consultation.id, 'confirmed')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirm
                          </Button>
                        )}
                        {consultation.status === 'confirmed' && (
                          <Button
                            size="sm"
                            onClick={() => updateConsultationStatus(consultation.id, 'completed')}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Complete
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : selectedTab === 'interacting' ? (
          <div className="space-y-6">
            {interactingConsultations.map((consultation) => (
              <Card key={consultation.id} className="bg-white shadow-sm border border-gray-200">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm mr-3">
                          {consultation.name.charAt(0).toUpperCase()}
                        </div>
                        {consultation.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-sm mt-1">
                        {consultation.email} • {consultation.phone} • Age: {consultation.age}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          consultation.status === 'reachinglead' && consultation.is_lead
                            ? 'bg-green-100 text-green-800' :
                          consultation.status === 'reachinglead' && !consultation.is_lead
                            ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {consultation.status === 'reachinglead' && consultation.is_lead ? 'LEAD' : 
                         consultation.status === 'reachinglead' && !consultation.is_lead ? 'REACHING' :
                         consultation.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <Label className="text-sm font-medium text-gray-700">Condition</Label>
                      <p className="text-sm text-gray-900 mt-1">{consultation.condition}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <Label className="text-sm font-medium text-gray-700">Appointment</Label>
                      <p className="text-sm text-gray-900 mt-1">
                        {consultation.preferred_date} at {formatTimeToIndian(consultation.preferred_time)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {/* View Details Button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedConsultation(consultation);
                        setShowDetailsModal(true);
                      }}
                      className="text-gray-700 border-gray-300 hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    
                    {/* Mark as Lead Button - Only if staff has permission and not already marked */}
                    {staff?.permissions?.canChangeStatus && consultation.status === 'confirmed' && !consultation.is_lead && (
                      <Button
                        size="sm"
                        onClick={() => markAsLead(consultation.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Mark as Lead
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="bg-white shadow-sm border border-gray-200">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm mr-3">
                          {patient.name.charAt(0).toUpperCase()}
                        </div>
                        {patient.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-sm mt-1">
                        {patient.email} • {patient.phone} • Age: {patient.age}
                      </CardDescription>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                      Patient ID: {patient.patient_id}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <Label className="text-sm font-medium text-gray-700">Gender</Label>
                      <p className="text-sm text-gray-900 mt-1">{patient.gender}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <Label className="text-sm font-medium text-gray-700">Created</Label>
                      <p className="text-sm text-gray-900 mt-1">
                        {new Date(patient.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {newEntries.length === 0 && selectedTab === 'new_entries' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No new entries found</h3>
            <p className="text-gray-500">All consultations have been processed or try adjusting your search terms</p>
          </div>
        )}

        {interactingConsultations.length === 0 && selectedTab === 'interacting' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No interacting consultations found</h3>
            <p className="text-gray-500">No confirmed consultations to interact with or try adjusting your search terms</p>
          </div>
        )}

        {false && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No patients found</h3>
            <p className="text-gray-500">Try adjusting your search terms or generate patient credentials</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="bg-gray-50 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Consultation Details</h2>
                    <p className="text-gray-600 text-sm">Complete information for {selectedConsultation.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Patient Information */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Patient Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                    <p className="text-gray-900 font-medium">{selectedConsultation.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                    <p className="text-gray-900 font-medium">{selectedConsultation.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Phone</Label>
                    <p className="text-gray-900 font-medium">{selectedConsultation.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Age & Gender</Label>
                    <p className="text-gray-900 font-medium">{selectedConsultation.age} years, {selectedConsultation.gender}</p>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Medical Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Condition/Complaint</Label>
                    <p className="text-gray-900 font-medium">{selectedConsultation.condition}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Consultation Type</Label>
                      <p className="text-gray-900 font-medium">{selectedConsultation.consultation_type}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Status</Label>
                      <Badge className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedConsultation.status === 'reachinglead' && selectedConsultation.is_lead
                          ? 'bg-green-100 text-green-800' :
                        selectedConsultation.status === 'reachinglead' && !selectedConsultation.is_lead
                          ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedConsultation.status === 'reachinglead' && selectedConsultation.is_lead ? 'LEAD' : 
                         selectedConsultation.status === 'reachinglead' && !selectedConsultation.is_lead ? 'REACHING' :
                         selectedConsultation.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Information */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Appointment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Preferred Date</Label>
                    <p className="text-gray-900 font-medium">{selectedConsultation.preferred_date}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Preferred Time</Label>
                    <p className="text-gray-900 font-medium">{formatTimeToIndian(selectedConsultation.preferred_time)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Created At</Label>
                    <p className="text-gray-900 font-medium">{new Date(selectedConsultation.created_at).toLocaleString()}</p>
                  </div>
                  {selectedConsultation.lead_marked_at && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Lead Marked At</Label>
                      <p className="text-gray-900 font-medium">{new Date(selectedConsultation.lead_marked_at).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Additional Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-sm font-medium text-gray-700">Patient ID</Label>
                    <p className="text-gray-900 font-medium">{selectedConsultation.patient_id || 'Not generated yet'}</p>
                  </div>
                  <div className="flex justify-between">
                    <Label className="text-sm font-medium text-gray-700">Lead Status</Label>
                    <p className="text-gray-900 font-medium">
                      {selectedConsultation.is_lead ? 'Marked as Lead' : 'Not marked as Lead'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </Button>
                {staff?.permissions?.canDownloadPDFs && (
                  <Button
                    onClick={() => {
                      downloadBasicPDF(selectedConsultation);
                      setShowDetailsModal(false);
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
