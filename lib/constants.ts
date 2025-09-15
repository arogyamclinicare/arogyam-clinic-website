// Consultation status constants
// These must match the database constraint exactly

export const CONSULTATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  FOLLOW_UP: 'follow_up'
} as const;

export type ConsultationStatus = typeof CONSULTATION_STATUS[keyof typeof CONSULTATION_STATUS];

// Status display labels for the UI
export const STATUS_LABELS: Record<ConsultationStatus, string> = {
  [CONSULTATION_STATUS.PENDING]: 'Pending',
  [CONSULTATION_STATUS.CONFIRMED]: 'Confirmed',
  [CONSULTATION_STATUS.IN_PROGRESS]: 'In Progress',
  [CONSULTATION_STATUS.COMPLETED]: 'Completed',
  [CONSULTATION_STATUS.CANCELLED]: 'Cancelled',
  [CONSULTATION_STATUS.FOLLOW_UP]: 'Follow-up Required'
};

// Status colors for the UI
export const STATUS_COLORS: Record<ConsultationStatus, string> = {
  [CONSULTATION_STATUS.PENDING]: 'text-yellow-600 bg-yellow-100',
  [CONSULTATION_STATUS.CONFIRMED]: 'text-green-600 bg-green-100',
  [CONSULTATION_STATUS.IN_PROGRESS]: 'text-blue-600 bg-blue-100',
  [CONSULTATION_STATUS.COMPLETED]: 'text-purple-600 bg-purple-100',
  [CONSULTATION_STATUS.CANCELLED]: 'text-red-600 bg-red-100',
  [CONSULTATION_STATUS.FOLLOW_UP]: 'text-orange-600 bg-orange-100'
};

// Status icons for the UI
export const STATUS_ICONS: Record<ConsultationStatus, string> = {
  [CONSULTATION_STATUS.PENDING]: 'Clock',
  [CONSULTATION_STATUS.CONFIRMED]: 'CheckCircle',
  [CONSULTATION_STATUS.IN_PROGRESS]: 'Clock',
  [CONSULTATION_STATUS.COMPLETED]: 'CheckCircle',
  [CONSULTATION_STATUS.CANCELLED]: 'AlertCircle',
  [CONSULTATION_STATUS.FOLLOW_UP]: 'AlertCircle'
};

// Status descriptions for tooltips
export const STATUS_DESCRIPTIONS: Record<ConsultationStatus, string> = {
  [CONSULTATION_STATUS.PENDING]: 'New consultation awaiting review',
  [CONSULTATION_STATUS.CONFIRMED]: 'Patient confirmed, ready for consultation',
  [CONSULTATION_STATUS.IN_PROGRESS]: 'Consultation currently happening',
  [CONSULTATION_STATUS.COMPLETED]: 'Consultation finished successfully',
  [CONSULTATION_STATUS.CANCELLED]: 'Cancelled by patient or admin',
  [CONSULTATION_STATUS.FOLLOW_UP]: 'Requires follow-up appointment'
};

// Valid status transitions (what status can change to what)
export const VALID_STATUS_TRANSITIONS: Record<ConsultationStatus, ConsultationStatus[]> = {
  [CONSULTATION_STATUS.PENDING]: [
    CONSULTATION_STATUS.CONFIRMED,  // Admin clicks "Confirm" → moves to Interacting
    CONSULTATION_STATUS.CANCELLED
  ],
  [CONSULTATION_STATUS.CONFIRMED]: [
    CONSULTATION_STATUS.COMPLETED,  // Doctor talks → Admin clicks "Completed" → moves to Live Patients
    CONSULTATION_STATUS.CANCELLED
  ],
  [CONSULTATION_STATUS.IN_PROGRESS]: [
    CONSULTATION_STATUS.COMPLETED,
    CONSULTATION_STATUS.FOLLOW_UP,
    CONSULTATION_STATUS.CANCELLED
  ],
  [CONSULTATION_STATUS.COMPLETED]: [
    CONSULTATION_STATUS.FOLLOW_UP
  ],
  [CONSULTATION_STATUS.CANCELLED]: [
    CONSULTATION_STATUS.PENDING
  ],
  [CONSULTATION_STATUS.FOLLOW_UP]: [
    CONSULTATION_STATUS.IN_PROGRESS,
    CONSULTATION_STATUS.COMPLETED
  ]
};

// Helper function to check if a status transition is valid
export function isValidStatusTransition(from: ConsultationStatus, to: ConsultationStatus): boolean {
  return VALID_STATUS_TRANSITIONS[from]?.includes(to) || false;
}

// Helper function to get next possible statuses
export function getNextPossibleStatuses(currentStatus: ConsultationStatus): ConsultationStatus[] {
  return VALID_STATUS_TRANSITIONS[currentStatus] || [];
}

// =============================================================================
// SIMPLE APPOINTMENT WORKFLOW (Today's & Tomorrow's Schedule)
// =============================================================================

// Simple appointment status options for Today's & Tomorrow's Schedule
// These are SEPARATE from the main consultation workflow to avoid conflicts
export const APPOINTMENT_OPTIONS = {
  PENDING: 'appt_pending',
  FOLLOWUP: 'appt_followup',
  INPROGRESS: 'appt_inprogress',
  NOT_INTERESTED: 'appt_not_interested',
  SALE_MADE: 'appt_sale_made'
} as const;

export type AppointmentOption = typeof APPOINTMENT_OPTIONS[keyof typeof APPOINTMENT_OPTIONS];

// Simple appointment option labels
export const APPOINTMENT_OPTION_LABELS: Record<AppointmentOption, string> = {
  [APPOINTMENT_OPTIONS.PENDING]: 'Pending',
  [APPOINTMENT_OPTIONS.FOLLOWUP]: 'Follow-up',
  [APPOINTMENT_OPTIONS.INPROGRESS]: 'In Progress',
  [APPOINTMENT_OPTIONS.NOT_INTERESTED]: 'Not Interested',
  [APPOINTMENT_OPTIONS.SALE_MADE]: 'Sale Made'
};
