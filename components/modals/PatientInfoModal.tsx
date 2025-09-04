import React from 'react';
import { X, Edit, Download, User, Phone, Mail, Calendar, FileText, Activity } from 'lucide-react';
import { Consultation } from '../../lib/supabase';

interface PatientInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDownloadPDF: () => void;
  consultation: Consultation;
}

export const PatientInfoModal: React.FC<PatientInfoModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  onDownloadPDF,
  consultation
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'Not specified';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Patient Information
              </h3>
              <p className="text-sm text-gray-600">
                Consultation ID: {consultation.id}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onDownloadPDF}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 hover:border-green-300 transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Personal Information
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Name</p>
                    <p className="text-sm text-gray-600">{consultation.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Age</p>
                    <p className="text-sm text-gray-600">{consultation.age} years</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Gender</p>
                    <p className="text-sm text-gray-600 capitalize">{consultation.gender}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">{consultation.phone}</p>
                  </div>
                </div>
                
                {consultation.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{consultation.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Consultation Details */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Consultation Details
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Preferred Date</p>
                    <p className="text-sm text-gray-600">{formatDate(consultation.preferred_date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Activity className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Preferred Time</p>
                    <p className="text-sm text-gray-600">{formatTime(consultation.preferred_time)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Status</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(consultation.status || 'pending')}`}>
                      {consultation.status || 'pending'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Consultation Type</p>
                    <p className="text-sm text-gray-600 capitalize">{consultation.consultation_type}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Information */}
          {(consultation.service_type || consultation.segment || consultation.sub_segment) && (
            <div className="mt-6 space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Service Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {consultation.service_type && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Service Type</p>
                    <p className="text-sm text-blue-700 capitalize">{consultation.service_type}</p>
                  </div>
                )}
                
                {consultation.segment && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-green-900">Segment</p>
                    <p className="text-sm text-green-700">{consultation.segment}</p>
                  </div>
                )}
                
                {consultation.sub_segment && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-purple-900">Sub-Segment</p>
                    <p className="text-sm text-purple-700">{consultation.sub_segment}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Medical Information */}
          {(consultation.condition || consultation.treatment_type || consultation.prescription || consultation.medicines_prescribed) && (
            <div className="mt-6 space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Medical Information
              </h4>
              
              <div className="space-y-4">
                {consultation.condition && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Condition</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      {consultation.condition}
                    </p>
                  </div>
                )}
                
                {consultation.treatment_type && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Treatment Type</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      {consultation.treatment_type}
                    </p>
                  </div>
                )}
                
                {consultation.prescription && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Prescription</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      {consultation.prescription}
                    </p>
                  </div>
                )}
                
                {consultation.medicines_prescribed && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Medicines Prescribed</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      {consultation.medicines_prescribed}
                    </p>
                  </div>
                )}
                
                {consultation.dosage_instructions && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Dosage Instructions</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      {consultation.dosage_instructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {(consultation.notes || consultation.remarks || consultation.manual_case_type) && (
            <div className="mt-6 space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Additional Notes
              </h4>
              
              <div className="space-y-4">
                {consultation.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Notes</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      {consultation.notes}
                    </p>
                  </div>
                )}
                
                {consultation.remarks && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Remarks</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      {consultation.remarks}
                    </p>
                  </div>
                )}
                
                {consultation.manual_case_type && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Manual Case Type</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      {consultation.manual_case_type}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
