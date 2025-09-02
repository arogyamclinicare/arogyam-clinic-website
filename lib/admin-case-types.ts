/**
 * Admin Case Types - All available case type options for the Services section
 * This file contains the case type options that admins can select from
 */

export interface CaseTypeOption {
  label: string;
  value: string;
}

// Complete case type options
export const caseTypeOptions: CaseTypeOption[] = [
  {
    label: 'Select Case Type',
    value: ''
  },
  {
    label: 'DIFFICULT CASE',
    value: 'difficult_case'
  },
  {
    label: 'NORMAL CASE',
    value: 'normal_case'
  },
  {
    label: 'RARE & DIFFICULT CASE',
    value: 'rare_difficult_case'
  },
  {
    label: 'RARE CASE',
    value: 'rare_case'
  }
];

// Export the data structure
export default caseTypeOptions;
