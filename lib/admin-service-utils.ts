/**
 * Admin Service Utilities - Helper functions for the Services section
 * This file contains utility functions for filtering and manipulating service data
 */

import { serviceOptions, ServiceOption, SegmentOption, SubSegmentOption } from './admin-service-data';

/**
 * Get segments for a specific service
 */
export const getSegmentsForService = (serviceValue: string): SegmentOption[] => {
  const service = serviceOptions.find(s => s.value === serviceValue);
  return service ? service.segments : [];
};

/**
 * Get sub-segments for a specific service and segment
 */
export const getSubSegmentsForSegment = (serviceValue: string, segmentValue: string): SubSegmentOption[] => {
  const service = serviceOptions.find(s => s.value === serviceValue);
  if (!service) return [];
  
  const segment = service.segments.find(seg => seg.value === segmentValue);
  return segment ? segment.subSegments : [];
};

/**
 * Check if a segment has sub-segments
 */
export const hasSubSegments = (serviceValue: string, segmentValue: string): boolean => {
  const subSegments = getSubSegmentsForSegment(serviceValue, segmentValue);
  return subSegments.length > 0;
};

/**
 * Get service label by value
 */
export const getServiceLabel = (serviceValue: string): string => {
  const service = serviceOptions.find(s => s.value === serviceValue);
  return service ? service.label : '';
};

/**
 * Get segment label by value
 */
export const getSegmentLabel = (serviceValue: string, segmentValue: string): string => {
  const segments = getSegmentsForService(serviceValue);
  const segment = segments.find(s => s.value === segmentValue);
  return segment ? segment.label : '';
};

/**
 * Get sub-segment label by value
 */
export const getSubSegmentLabel = (serviceValue: string, segmentValue: string, subSegmentValue: string): string => {
  const subSegments = getSubSegmentsForSegment(serviceValue, segmentValue);
  const subSegment = subSegments.find(ss => ss.value === subSegmentValue);
  return subSegment ? subSegment.label : '';
};

/**
 * Reset dependent fields when service changes
 */
export const resetDependentFields = (currentData: any, field: string): any => {
  const updatedData = { ...currentData };
  
  if (field === 'service_type') {
    updatedData.segment = '';
    updatedData.sub_segment = '';
    updatedData.sub_sub_segment_text = '';
  } else if (field === 'segment') {
    updatedData.sub_segment = '';
    updatedData.sub_sub_segment_text = '';
  }
  
  return updatedData;
};

/**
 * Validate if the selected combination is valid
 */
export const validateServiceCombination = (
  serviceValue: string,
  segmentValue: string,
  subSegmentValue: string
): boolean => {
  if (!serviceValue) return false;
  
  const segments = getSegmentsForService(serviceValue);
  const segment = segments.find(s => s.value === segmentValue);
  
  if (!segment) return false;
  
  if (subSegmentValue) {
    const subSegments = getSubSegmentsForSegment(serviceValue, segmentValue);
    return subSegments.some(ss => ss.value === subSegmentValue);
  }
  
  return true;
};
