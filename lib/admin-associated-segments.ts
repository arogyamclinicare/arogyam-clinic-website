/**
 * Admin Associated Segments - All available segment options for multi-select
 * This file contains all the segments that admins can associate with consultations
 */

export interface AssociatedSegmentOption {
  label: string;
  value: string;
}

// Complete associated segment options (all segments from both services)
export const associatedSegmentOptions: AssociatedSegmentOption[] = [
  // Homeopathy Segments
  { label: 'ALLERGY', value: 'allergy' },
  { label: 'ANO RECTAL DISORDER', value: 'ano_rectal_disorder' },
  { label: 'ANORECTAL DISEASE', value: 'anorectal_disease' },
  { label: 'B-FIT+ WEIGHT MANAGEMENT', value: 'b_fit_plus_weight_management' },
  { label: 'CANCER/MALIGNANCY', value: 'cancer_malignancy' },
  { label: 'CARDIOVASCULAR', value: 'cardiovascular' },
  { label: 'CHILDREN DISORDERS', value: 'children_disorders' },
  { label: 'CIRCULATORY DISORDER', value: 'circulatory_disorder' },
  { label: 'CNS', value: 'cns' },
  { label: 'DE ADDICTION', value: 'de_addiction' },
  { label: 'DENTITION', value: 'dentition' },
  { label: 'ENDOCRINE', value: 'endocrine' },
  { label: 'ENT', value: 'ent' },
  { label: 'GASTROINTESTINAL', value: 'gastrointestinal' },
  { label: 'HAEMATOLOGICAL', value: 'haematological' },
  { label: 'HAIR', value: 'hair' },
  { label: 'MINDFIT', value: 'mindfit' },
  { label: 'MUSCULOSKELETAL SYSTEM', value: 'musculoskeletal_system' },
  { label: 'NEUROLOGICAL', value: 'neurological' },
  { label: 'OPHTHALMOLOGICAL DISORDER', value: 'ophthalmological_disorder' },
  { label: 'PAIN MANAGEMENT', value: 'pain_management' },
  { label: 'POST COVID AILMENTS', value: 'post_covid_ailments' },
  { label: 'PSYCHIATRIC', value: 'psychiatric' },
  { label: 'RENAL', value: 'renal' },
  { label: 'RESPIRATORY', value: 'respiratory' },
  { label: 'RHEUMATOLOGY', value: 'rheumatology' },
  { label: 'SEXUAL HEALTH', value: 'sexual_health' },
  { label: 'SKIN', value: 'skin_homeopathy' },
  { label: 'SPEECH DISORDER', value: 'speech_disorder' },
  { label: 'STRESS MANAGEMENT', value: 'stress_management' },
  { label: 'TEEN AND ADOLSCENCE', value: 'teen_and_adolescence' },
  { label: 'URINARY', value: 'urinary' },
  { label: 'WEIGHT MANAGEMENT', value: 'weight_management' },
  { label: 'WOMENS HEALTH', value: 'womens_health' },
  
  // Aesthetics Segments
  { label: 'AI HAIR PRO', value: 'ai_hair_pro' },
  { label: 'AI HAIR PRO-GH', value: 'ai_hair_pro_gh' },
  { label: 'AI HAIR PRO-NH', value: 'ai_hair_pro_nh' },
  { label: 'AI HAIR PRO-STM', value: 'ai_hair_pro_stm' },
  { label: 'AI SKIN PRO', value: 'ai_skin_pro' },
  { label: 'AI SKIN PRO-BRIGHT', value: 'ai_skin_pro_bright' },
  { label: 'AI SKIN PRO-CLEAR', value: 'ai_skin_pro_clear' },
  { label: 'AI SKIN PRO-RENEU', value: 'ai_skin_pro_reneu' },
  { label: 'AI SKIN PRO-YOUTH', value: 'ai_skin_pro_youth' },
  { label: 'B-FIT SUGA CONTROL', value: 'b_fit_suga_control' },
  { label: 'B-FIT WEIGHT MANAGEMENT', value: 'b_fit_weight_management' },
  { label: 'BFIT INCLINIC', value: 'bfit_inclinic' },
  { label: 'DERMAHEAL', value: 'dermaheal' },
  { label: 'GROHAIR', value: 'grohair' },
  { label: 'GROHAIR- HAIR BOOSTER', value: 'grohair_hair_booster' },
  { label: 'HAIR BOOSTER', value: 'hair_booster' },
  { label: 'HVT', value: 'hvt' },
  { label: 'LASER', value: 'laser' },
  { label: 'LASER ARMS', value: 'laser_arms' },
  { label: 'LASER CHIN UPPER', value: 'laser_chin_upper' },
  { label: 'LASER FULL BODY', value: 'laser_full_body' },
  { label: 'LASER LEGS', value: 'laser_legs' },
  { label: 'LASER LOWER FACE', value: 'laser_lower_face' },
  { label: 'LASER-MEDIUM PARTS', value: 'laser_medium_parts' },
  { label: 'LASER-SMALL PARTS', value: 'laser_small_parts' },
  { label: 'LASER-WHOLE BODY', value: 'laser_whole_body' },
  { label: 'MFIT ANXIETY', value: 'mfit_anxiety' },
  { label: 'MFIT DEPRESSION', value: 'mfit_depression' },
  { label: 'MFIT STRESS', value: 'mfit_stress' },
  { label: 'MFIT STUDENT EXAM STRESS', value: 'mfit_student_exam_stress' },
  { label: 'NEW HAIR', value: 'new_hair' },
  { label: 'NEW HAIR- HAIR BOOSTER', value: 'new_hair_hair_booster' },
  { label: 'QUIKHAIR', value: 'quikhair' },
  { label: 'SKIN', value: 'skin_aesthetics' },
  { label: 'SKIN BRIGHTENING', value: 'skin_brightening' },
  { label: 'SKIN CLEARING', value: 'skin_clearing' },
  { label: 'SKIN REJUVENATION', value: 'skin_rejuvenation' },
  { label: 'SKIN TIGHTENING', value: 'skin_tightening' },
  { label: 'STM CELL- HAIR BOOSTER', value: 'stm_cell_hair_booster' },
  { label: 'STMCELL', value: 'stmcell' },
  { label: 'XOGEN', value: 'xogen' },
  { label: 'XOGEN ADVANCE', value: 'xogen_advance' }
];

// Export the data structure
export default associatedSegmentOptions;
