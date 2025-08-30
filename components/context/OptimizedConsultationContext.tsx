/**
 * Optimized Consultation Context with performance improvements
 * Following best practices: memoization, reduced re-renders, proper state management
 */

import React, { createContext, useContext, useCallback, useMemo, useReducer } from 'react';
import { ConsultationContextState } from '../types/consultation';
import { createLogger } from '../../lib/utils/logger';

const logger = createLogger('OptimizedConsultationContext');

// State management with useReducer for better performance
interface ConsultationState {
  readonly isBookingOpen: boolean;
  readonly treatmentType: string;
}

type ConsultationAction =
  | { type: 'OPEN_BOOKING'; payload: string }
  | { type: 'CLOSE_BOOKING' };

// Reducer function for state management
function consultationReducer(state: ConsultationState, action: ConsultationAction): ConsultationState {
  switch (action.type) {
    case 'OPEN_BOOKING':
      return {
        ...state,
        isBookingOpen: true,
        treatmentType: action.payload,
      };
      
    case 'CLOSE_BOOKING':
      return {
        ...state,
        isBookingOpen: false,
      };
      
    default:
      return state;
  }
}

// Initial state
const initialState: ConsultationState = {
  isBookingOpen: false,
  treatmentType: 'General Consultation',
};

// Create context with undefined default (will throw if used outside provider)
const ConsultationContext = createContext<ConsultationContextState | undefined>(undefined);

interface ConsultationProviderProps {
  readonly children: React.ReactNode;
}

export function OptimizedConsultationProvider({ children }: ConsultationProviderProps) {
  const [state, dispatch] = useReducer(consultationReducer, initialState);

  // Memoized callback functions to prevent unnecessary re-renders
  const openBooking = useCallback((treatmentType: string = 'General Consultation') => {
    try {
      logger.debug('🔵 openBooking called with treatmentType:', treatmentType);
      document.body.style.overflow = 'hidden';
      dispatch({ type: 'OPEN_BOOKING', payload: treatmentType });
      logger.info('✅ Booking modal opened successfully');
    } catch (error) {
      logger.error('❌ Error in openBooking:', error);
    }
  }, []);

  const closeBooking = useCallback(() => {
    try {
      logger.debug('🔵 closeBooking called');
      // Restore body scroll
      document.body.style.overflow = 'unset';
      dispatch({ type: 'CLOSE_BOOKING' });
      logger.info('✅ Booking modal closed successfully');
    } catch (error) {
      logger.error('❌ Error in closeBooking:', error);
    }
  }, []);

  // Memoized context value to prevent unnecessary re-renders of consumers
  const contextValue = useMemo<ConsultationContextState>(() => ({
    isBookingOpen: state.isBookingOpen,
    treatmentType: state.treatmentType,
    openBooking,
    closeBooking,
  }), [state.isBookingOpen, state.treatmentType, openBooking, closeBooking]);

  return (
    <ConsultationContext.Provider value={contextValue}>
      {children}
    </ConsultationContext.Provider>
  );
}

/**
 * Custom hook to use consultation context
 * Includes proper error handling if used outside provider
 */
export function useOptimizedConsultation(): ConsultationContextState {
  const context = useContext(ConsultationContext);
  
  if (context === undefined) {
    throw new Error(
      'useOptimizedConsultation must be used within an OptimizedConsultationProvider. ' +
      'Make sure to wrap your component tree with <OptimizedConsultationProvider>.'
    );
  }
  
  return context;
}

// Specialized hooks for specific context values (further optimization)
export function useBookingState(): boolean {
  const { isBookingOpen } = useOptimizedConsultation();
  return isBookingOpen;
}

export function useTreatmentType(): string {
  const { treatmentType } = useOptimizedConsultation();
  return treatmentType;
}

export function useBookingActions() {
  const { openBooking, closeBooking } = useOptimizedConsultation();
  return useMemo(() => ({ openBooking, closeBooking }), [openBooking, closeBooking]);
}
