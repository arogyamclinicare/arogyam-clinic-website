/**
 * Admin Services Index - Central export for all admin service modules
 * This file provides a single import point for all admin service functionality
 */

// Data structures
export { default as serviceOptions, type ServiceOption, type SegmentOption, type SubSegmentOption } from '../admin-service-data';
export { default as caseTypeOptions, type CaseTypeOption } from '../admin-case-types';
export { default as associatedSegmentOptions, type AssociatedSegmentOption } from '../admin-associated-segments';

// Utility functions
export * from '../admin-service-utils';

// Re-export types for convenience
export type {
  ServiceOption,
  SegmentOption,
  SubSegmentOption,
  CaseTypeOption,
  AssociatedSegmentOption
} from '../admin-service-data';
