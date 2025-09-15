import { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { 
  X, 
  Pill, 
  Stethoscope,
  Save,
  Trash2,
  FileText,
  AlertCircle,
  Settings,
  Download,
  Plus
} from 'lucide-react';
// Service options and related functions based on actual database data
const serviceOptions = [
  { value: 'consultation', label: 'Consultation' },
  { value: 'homeopathy', label: 'Homeopathy' },
  { value: 'aesthetics', label: 'Aesthetics' }
];

const caseTypeOptions = [
  { value: '', label: 'Select Case Type' },
  { value: 'normal_case', label: 'Normal Case' },
  { value: 'difficult_case', label: 'Difficult Case' },
  { value: 'rare_case', label: 'Rare Case' },
  { value: 'rare_difficult_case', label: 'Rare & Difficult Case' }
];

const associatedSegmentOptions = [
  // Complete list of Associated Segments
  { value: 'allergy', label: 'ALLERGY' },
  { value: 'ano_rectal_disorder', label: 'ANO RECTAL DISORDER' },
  { value: 'anorectal_disease', label: 'ANORECTAL DISEASE' },
  { value: 'b_fit_weight_management', label: 'B-FIT+ WEIGHT MANAGEMENT' },
  { value: 'cancer_malignancy', label: 'CANCER/MALIGNANCY' },
  { value: 'cardiovascular', label: 'CARDIOVASCULAR' },
  { value: 'children_disorders', label: 'CHILDREN DISORDERS' },
  { value: 'circulatory_disorder', label: 'CIRCULATORY DISORDER' },
  { value: 'cns', label: 'CNS' },
  { value: 'de_addiction', label: 'DE ADDICTION' },
  { value: 'dentition', label: 'DENTITION' },
  { value: 'endocrine', label: 'ENDOCRINE' },
  { value: 'ent', label: 'ENT' },
  { value: 'gastrointestinal', label: 'GASTROINTESTINAL' },
  { value: 'haematological', label: 'HAEMATOLOGICAL' },
  { value: 'hair', label: 'HAIR' },
  { value: 'mindfit', label: 'MINDFIT' },
  { value: 'musculoskeletal_system', label: 'MUSCULOSKELETAL SYSTEM' },
  { value: 'neurological', label: 'NEUROLOGICAL' },
  { value: 'ophthalmological_disorder', label: 'OPHTHALMOLOGICAL DISORDER' },
  { value: 'pain_management', label: 'PAIN MANAGEMENT' },
  { value: 'post_covid_ailments', label: 'POST COVID AILMENTS' },
  { value: 'psychiatric', label: 'PSYCHIATRIC' },
  { value: 'renal', label: 'RENAL' },
  { value: 'respiratory', label: 'RESPIRATORY' },
  { value: 'rheumatology', label: 'RHEUMATOLOGY' },
  { value: 'sexual_health', label: 'SEXUAL HEALTH' },
  { value: 'skin', label: 'SKIN' },
  { value: 'speech_disorder', label: 'SPEECH DISORDER' },
  { value: 'stress_management', label: 'STRESS MANAGEMENT' },
  { value: 'teen_and_adolescence', label: 'TEEN AND ADOLSCENCE' },
  { value: 'urinary', label: 'URINARY' },
  { value: 'weight_management', label: 'WEIGHT MANAGEMENT' },
  { value: 'womens_health', label: 'WOMENS HEALTH' }
];

const getSegmentsForService = (serviceType: string) => {
  if (serviceType === 'homeopathy') {
    return [
      { value: 'allergy', label: 'ALLERGY' },
      { value: 'ano_rectal_disorder', label: 'ANO RECTAL DISORDER' },
      { value: 'anorectal_disease', label: 'ANORECTAL DISEASE' },
      { value: 'b_fit_weight_management', label: 'B-FIT+ WEIGHT MANAGEMENT' },
      { value: 'cancer_malignancy', label: 'CANCER/MALIGNANCY' },
      { value: 'cardiovascular', label: 'CARDIOVASCULAR' },
      { value: 'children_disorders', label: 'CHILDREN DISORDERS' },
      { value: 'circulatory_disorder', label: 'CIRCULATORY DISORDER' },
      { value: 'cns', label: 'CNS' },
      { value: 'de_addiction', label: 'DE ADDICTION' },
      { value: 'dentition', label: 'DENTITION' },
      { value: 'endocrine', label: 'ENDOCRINE' },
      { value: 'ent', label: 'ENT' },
      { value: 'gastrointestinal', label: 'GASTROINTESTINAL' },
      { value: 'haematological', label: 'HAEMATOLOGICAL' },
      { value: 'hair', label: 'HAIR' },
      { value: 'mindfit', label: 'MINDFIT' },
      { value: 'musculoskeletal_system', label: 'MUSCULOSKELETAL SYSTEM' },
      { value: 'neurological', label: 'NEUROLOGICAL' },
      { value: 'ophthalmological_disorder', label: 'OPHTHALMOLOGICAL DISORDER' },
      { value: 'pain_management', label: 'PAIN MANAGEMENT' },
      { value: 'post_covid_ailments', label: 'POST COVID AILMENTS' },
      { value: 'psychiatric', label: 'PSYCHIATRIC' },
      { value: 'renal', label: 'RENAL' },
      { value: 'respiratory', label: 'RESPIRATORY' },
      { value: 'rheumatology', label: 'RHEUMATOLOGY' },
      { value: 'sexual_health', label: 'SEXUAL HEALTH' },
      { value: 'skin', label: 'SKIN' },
      { value: 'speech_disorder', label: 'SPEECH DISORDER' },
      { value: 'stress_management', label: 'STRESS MANAGEMENT' },
      { value: 'teen_and_adolescence', label: 'TEEN AND ADOLSCENCE' },
      { value: 'urinary', label: 'URINARY' },
      { value: 'weight_management', label: 'WEIGHT MANAGEMENT' },
      { value: 'womens_health', label: 'WOMENS HEALTH' }
    ];
  } else if (serviceType === 'aesthetics') {
    return [
      { value: 'AI SKIN PRO', label: 'AI SKIN PRO' },
      { value: 'AI SKIN PRO-BRIGHT', label: 'AI SKIN PRO-BRIGHT' },
      { value: 'B-FIT SUGA CONTROL', label: 'B-FIT SUGA CONTROL' },
      { value: 'B-FIT WEIGHT MANAGEMENT', label: 'B-FIT WEIGHT MANAGEMENT' },
      { value: 'DERMAHEAL', label: 'DERMAHEAL' },
      { value: 'GROHAIR', label: 'GROHAIR' },
      { value: 'GROHAIR- HAIR BOOSTER', label: 'GROHAIR- HAIR BOOSTER' },
      { value: 'HAIR BOOSTER', label: 'HAIR BOOSTER' },
      { value: 'HVT', label: 'HVT' },
      { value: 'LASER', label: 'LASER' },
      { value: 'MFIT ANXIETY', label: 'MFIT ANXIETY' },
      { value: 'MFIT DEPRESSION', label: 'MFIT DEPRESSION' },
      { value: 'MFIT STRESS', label: 'MFIT STRESS' },
      { value: 'NEW HAIR', label: 'NEW HAIR' },
      { value: 'NEW HAIR- HAIR BOOSTER', label: 'NEW HAIR- HAIR BOOSTER' },
      { value: 'QUIKHAIR', label: 'QUIKHAIR' },
      { value: 'SKIN', label: 'SKIN' },
      { value: 'SKIN BRIGHTENING', label: 'SKIN BRIGHTENING' },
      { value: 'SKIN CLEARING', label: 'SKIN CLEARING' },
      { value: 'SKIN REJUVENATION', label: 'SKIN REJUVENATION' },
      { value: 'SKIN TIGHTENING', label: 'SKIN TIGHTENING' },
      { value: 'STM CELL- HAIR BOOSTER', label: 'STM CELL- HAIR BOOSTER' },
      { value: 'STMCELL', label: 'STMCELL' },
      { value: 'XOGEN', label: 'XOGEN' },
      { value: 'AI HAIR PRO', label: 'AI HAIR PRO' },
      { value: 'AI HAIR PRO-GH', label: 'AI HAIR PRO-GH' },
      { value: 'AI HAIR PRO-NH', label: 'AI HAIR PRO-NH' },
      { value: 'AI HAIR PRO-STM', label: 'AI HAIR PRO-STM' },
      { value: 'AI SKIN PRO-CLEAR', label: 'AI SKIN PRO-CLEAR' },
      { value: 'AI SKIN PRO-RENEU', label: 'AI SKIN PRO-RENEU' },
      { value: 'AI SKIN PRO-YOUTH', label: 'AI SKIN PRO-YOUTH' },
      { value: 'BFIT INCLINIC', label: 'BFIT INCLINIC' },
      { value: 'LASER ARMS', label: 'LASER ARMS' },
      { value: 'LASER CHIN UPPER', label: 'LASER CHIN UPPER' },
      { value: 'LASER FULL BODY', label: 'LASER FULL BODY' },
      { value: 'LASER LEGS', label: 'LASER LEGS' },
      { value: 'LASER LOWER FACE', label: 'LASER LOWER FACE' },
      { value: 'LASER-MEDIUM PARTS', label: 'LASER-MEDIUM PARTS' },
      { value: 'LASER-SMALL PARTS', label: 'LASER-SMALL PARTS' },
      { value: 'LASER-WHOLE BODY', label: 'LASER-WHOLE BODY' },
      { value: 'MFIT STUDENT EXAM STRESS', label: 'MFIT STUDENT EXAM STRESS' },
      { value: 'XOGEN ADVANCE', label: 'XOGEN ADVANCE' }
    ];
  } else if (serviceType === 'consultation') {
    return [
      { value: 'general', label: 'General' }
    ];
  }
  return [];
};

const getSubSegmentsForSegment = (serviceType: string, segment: string) => {
  // Define sub-segments based on actual medical data for Homeopathy service
  const subSegmentMap: { [key: string]: { value: string; label: string }[] } = {
    'allergy': [
      { value: 'allergic_rhinitis', label: 'ALLERGIC RHINITIS' },
      { value: 'asthma', label: 'ASTHMA' },
      { value: 'gluten_intolerance', label: 'GLUTEN INTOLERANCE' },
      { value: 'lactose_intolerance', label: 'LACTOSE INTOLERANCE' },
      { value: 'protein_allergy', label: 'PROTEIN ALLERGY' }
    ],
    'ano_rectal_disorder': [
      { value: 'piles_fissure_fistula', label: 'PILES /FISSURE / FISTULA' }
    ],
    'anorectal_disease': [
      { value: 'piles_fissure_fistula', label: 'PILES /FISSURE / FISTULA' }
    ],
    'b_fit_weight_management': [
      // No options as specified
    ],
    'cancer_malignancy': [
      { value: 'na', label: 'NA' }
    ],
    'cardiovascular': [
      { value: 'hyperlipidemia', label: 'HYPERLIPIDEMIA' },
      { value: 'hypertension', label: 'HYPERTENSION' },
      { value: 'ischaemic_heart_disease', label: 'ISCHAEMIC HEART DISEASE/ LEFT VENTRICULAR FAILURE' },
      { value: 'pulmonary_hypertension', label: 'PULMONARY HYPERTENSION' },
      { value: 'restrictive_cardiomyopathy', label: 'RESTRICTIVE CARDIOMYOPATHY' },
      { value: 'rheumatic_heart_disease', label: 'RHEUMATIC HEART DISEASE' }
    ],
    'children_disorders': [
      { value: 'attention_deficit_disorder', label: 'ATTENTION DEFICIT DISORDER' },
      { value: 'autism', label: 'AUTISM' },
      { value: 'bed_wetting', label: 'BED WETTING' },
      { value: 'congenital_neurological_problems', label: 'CONGENITAL/NEUROLOGICAL PROBLEMS' },
      { value: 'gastrointestinal_disorder', label: 'GASTROINTESTINAL DISORDER' },
      { value: 'growth', label: 'GROWTH' },
      { value: 'memory', label: 'MEMORY' },
      { value: 'poor_appetite', label: 'POOR APPETITE' },
      { value: 'poor_immunity', label: 'POOR IMMUNITY' }
    ],
    'circulatory_disorder': [
      { value: 'dvt', label: 'DVT' },
      { value: 'haemangioma', label: 'HAEMANGIOMA' },
      { value: 'varicose_veins', label: 'VARICOSE VEINS' }
    ],
    'cns': [
      { value: 'cerebral_palsy', label: 'CEREBRAL PALSY' },
      { value: 'epilepsy', label: 'EPILEPSY' },
      { value: 'vertigo', label: 'VERTIGO' }
    ],
    'de_addiction': [
      { value: 'alcoholism', label: 'ALCOHOLISM' },
      { value: 'digital_addiction', label: 'DIGITAL ADDICTION' },
      { value: 'substance_addiction', label: 'SUBSTANCE ADDICTION' }
    ],
    'dentition': [
      { value: 'caries', label: 'CARIES' }
    ],
    'endocrine': [
      { value: 'thyroid_disorders', label: 'THYROID DISORDERS' },
      { value: 'type_1_diabetes_mellitus', label: 'TYPE 1 DIABETES MELLITUS' },
      { value: 'type_2_diabetes_mellitus', label: 'TYPE 2 DIABETES MELLITUS' }
    ],
    'ent': [
      { value: 'nasal_polyps', label: 'NASAL POLYPS' },
      { value: 'otitis_media', label: 'OTITIS MEDIA' },
      { value: 'tinnitus', label: 'TINNITUS' }
    ],
    'gastrointestinal': [
      { value: 'acid_reflux', label: 'ACID REFLUX' },
      { value: 'budd_chiari_syndrome', label: 'BUDD CHIARI SYNDROME' },
      { value: 'chronic_amoebiasis', label: 'CHRONIC AMOEBIASIS' },
      { value: 'cirrhosis_of_liver', label: 'CIRRHOSIS OF LIVER' },
      { value: 'constipation', label: 'CONSTIPATION' },
      { value: 'crohns_disease', label: 'CROHN\'S DISEASE' },
      { value: 'cryptogenic_liver_disease', label: 'CRYPTOGENIC LIVER DISEASE' },
      { value: 'diarrhoea', label: 'DIARRHOEA' },
      { value: 'duodenitis', label: 'DUODENITIS' },
      { value: 'dyspepsia_indigestion', label: 'DYSPEPSIA / INDIGESTION' },
      { value: 'gall_bladder_disease', label: 'GALL BLADDER DISEASE' },
      { value: 'gastritis', label: 'GASTRITIS' },
      { value: 'heart_burn', label: 'HEART BURN' },
      { value: 'hiatus_hernia', label: 'HIATUS HERNIA' },
      { value: 'inflammatory_bowel_disease', label: 'INFLAMMATORY BOWEL DISEASE' },
      { value: 'liver_fibrosis', label: 'LIVER FIBROSIS' },
      { value: 'non_ulcer_dyspepsia', label: 'NON ULCER DYSPEPSIA' },
      { value: 'peptic_ulcers', label: 'PEPTIC ULCERS' },
      { value: 'recurrent_apthae', label: 'RECURRENT APTHAE' },
      { value: 'ulcerative_colitis', label: 'ULCERATIVE COLITIS' }
    ],
    'haematological': [
      { value: 'aplastic_anaemia', label: 'APLASTIC ANAEMIA' },
      { value: 'chronic_myeloid_leukaemia', label: 'CHRONIC MYELOID LEUKAEMIA' },
      { value: 'non_hodgkins_lymphoma', label: 'NON-HODGKINS LYMPHOMA' },
      { value: 'thalassaemia', label: 'THALASSAEMIA' },
      { value: 'von_willebrands_disease', label: 'VON WILLEBRANDS DISEASE' }
    ],
    'hair': [
      { value: 'androgenetic_alopecia_female', label: 'Androgenetic Alopecia Female' },
      { value: 'androgenetic_alopecia_male', label: 'Androgenetic Alopecia Male' },
      { value: 'canities', label: 'CANITIES' },
      { value: 'nits_pediculosis_capitis', label: 'NITS/ PEDICULOSIS CAPITIS' },
      { value: 'patchy_hair_loss', label: 'PATCHY HAIR LOSS' },
      { value: 'telogen_effluvium', label: 'TELOGEN EFFLUVIUM' },
      { value: 'trichotillomania', label: 'TRICHOTILLOMANIA' },
      { value: 'wooly_hair_syndrome', label: 'WOOLY HAIR SYNDROME' }
    ],
    'mindfit': [
      { value: 'others', label: 'OTHERS' }
    ],
    'musculoskeletal_system': [
      { value: 'ankylosing_spondylitis', label: 'ANKYLOSING SPONDYLITIS' },
      { value: 'arthritis', label: 'ARTHRITIS' },
      { value: 'backache', label: 'BACKACHE' },
      { value: 'ganglion', label: 'GANGLION' },
      { value: 'gout', label: 'GOUT' },
      { value: 'lumbago', label: 'LUMBAGO' },
      { value: 'mixed_connective_tissue_disease', label: 'MIXED CONNECTIVE TISSUE DISEASE' },
      { value: 'multiple_sclerosis', label: 'MULTIPLE SCLEROSIS' },
      { value: 'muscular_dystrophy_myopathy', label: 'MUSCULAR DYSTRYOPHY OR MYOPATHY' },
      { value: 'prolapsed_intervertebral_disc', label: 'PROLAPSED INTERVERTEBRAL DISC (PID)' },
      { value: 'rheumatoid_arthritis', label: 'RHEUMATOID ARTHRITIS' },
      { value: 'stills_disease', label: 'STILLS DISEASE' },
      { value: 'systematic_lupus_erythematosus', label: 'SYSTEMATIC LUPUS ERYTHEMATOSUS' }
    ],
    'neurological': [
      { value: 'alzheimers', label: 'ALZHEIMERS' },
      { value: 'ataxia', label: 'ATAXIA' },
      { value: 'bells_palsy', label: 'BELL\'S PALSY' },
      { value: 'cerebral_space_occupying_lesion', label: 'CEREBRAL SPACE OCCUPYING LESION' },
      { value: 'cervical_spondylitis', label: 'CERVICAL SPONDYLITIS' },
      { value: 'epilepsy', label: 'EPILEPSY' },
      { value: 'guillain_barre_syndrome', label: 'GUILLAIN BARRE SYNDROME' },
      { value: 'parkinsons_disease', label: 'PARKINSONS DISEASE' },
      { value: 'petit_mal_epilepsy', label: 'PETIT MAL EPILEPSY' },
      { value: 'spastic_cerebral_palsy', label: 'SPASTIC CEREBRAL PALSY' },
      { value: 'trigeminal_neuralgia', label: 'TRIGEMINAL NEURALGIA' }
    ],
    'ophthalmological_disorder': [
      { value: 'central_serous_retinopathy', label: 'CENTRAL SEROUS RETINOPATHY' },
      { value: 'myopia', label: 'MYOPIA' }
    ],
    'pain_management': [
      { value: 'achilles_tendinitis_pain', label: 'ACHILLES TENDINITIS PAIN ( ANKLE PAIN)' },
      { value: 'ankylosing_spondylosis_pain', label: 'ANKYLOSING SPONDYLOSIS PAIN' },
      { value: 'appendicitis_pain', label: 'APPENDICITIS PAIN' },
      { value: 'blepharitis_pain', label: 'BLEPAHARITIS PAIN' },
      { value: 'carpal_tunnel_syndrome_pain', label: 'CARPAL TUNNEL SYNDROME PAIN' },
      { value: 'cervical_spondylosis_pain', label: 'CERVICAL SPONDYLOSIS PAIN' },
      { value: 'cluster_headache_pain', label: 'CLUSTER HEADACHE PAIN' },
      { value: 'conjunctivitis_pain', label: 'CONJUNCTIVITIS PAIN' },
      { value: 'dental_pain', label: 'DENTAL PAIN' },
      { value: 'encephalitis_pain', label: 'ENCEPHALITIS PAIN' },
      { value: 'facial_neuralgia_pain', label: 'FACIAL NEURALGIA PAIN' },
      { value: 'fibromyalgia_pain', label: 'FIBROMYELGIA PAIN' },
      { value: 'frozen_shoulder_pain', label: 'FROZEN SHOULER PAIN' },
      { value: 'gall_bladder_colic_pain', label: 'GALL BLADDER COLIC PAIN' },
      { value: 'gastritis_pain', label: 'GASTRITIS PAIN' },
      { value: 'gout_pain', label: 'GOUT PAIN' },
      { value: 'growing_pain', label: 'GROWING PAIN ( PAIN IN LEGS /KNEE IN KIDS)' },
      { value: 'hairline_fracture_pain', label: 'HAIRLINE FRACTURE PAIN' },
      { value: 'hip_pain_sacro_ilitis', label: 'HIP PAIN / SACRO ILITIS PAIN ( SERO NEGATIVE SPONDYLOARTHROPATHY)' },
      { value: 'iritis_pain', label: 'IRITIS PAIN' },
      { value: 'juvenile_ra_pain', label: 'JUVENILE RA PAIN' },
      { value: 'labyrinthitis_pain', label: 'LABYNTHINITIS PAIN' },
      { value: 'lumbar_prolapse_disc_pain', label: 'LUMBAR PROLAPSE DISC PAIN ( SCIATICA)' },
      { value: 'lumbar_spondylosis_pain', label: 'LUMBAR SPONDYLOSIS PAIN' },
      { value: 'mastoiditis_pain', label: 'MASTOIDITIS PAIN' },
      { value: 'meningitis_pain', label: 'MENINGITIS PAIN' },
      { value: 'migraine_pain', label: 'MIGRAINE PAIN' },
      { value: 'neuralgia_pain', label: 'NEURALGIA PAIN' },
      { value: 'optic_neuritis_pain', label: 'OPTIC NEURITIS PAIN' },
      { value: 'osteo_arthritis_pain', label: 'OSTEO ARTHRITIS PAIN' },
      { value: 'osteo_malacia_pain', label: 'OSTEO MALACIA PAIN' },
      { value: 'osteomyelitis_pain', label: 'OSTEOMYELITIS PAIN' },
      { value: 'otitis_media_pain', label: 'OTITIS MEDIA PAIN' },
      { value: 'peripheral_neuritis_pain', label: 'PERIPHERAL NEURITIS PAIN' },
      { value: 'phantom_pain', label: 'PHANTOM PAIN (POST AMPUTATION)' },
      { value: 'plantar_fasciitis_pain', label: 'PLANTAR FASCIITIS ( PAIN IN HEELS)' },
      { value: 'post_radiation_pain', label: 'POST RADIATION PAIN' },
      { value: 'post_surgical_pain', label: 'POST SURGICAL PAIN' },
      { value: 'post_traumatic_pain', label: 'POST TRAUMATIC PAIN' },
      { value: 'renal_colic_pain', label: 'RENAL COLIC PAIN' },
      { value: 'rheumatoid_arthritis_pain', label: 'RHEUMATOID ARTHRITIS PAIN' },
      { value: 'rib_pain', label: 'RIB PAIN (COSTOCHONDRITIS)' },
      { value: 'scalp_folliculitis_pain', label: 'SCALP FOLLICULITIS PAIN' },
      { value: 'sinusitis_pain', label: 'SINUSITIS PAIN' },
      { value: 'sprain_pain', label: 'SPRAIN PAIN' },
      { value: 'stye_pain', label: 'STYE PAIN' },
      { value: 'tennis_elbow_pain', label: 'TENNIS ELBOW PAIN' },
      { value: 'tension_headache_pain', label: 'TENSION HEADACHE PAIN' },
      { value: 'tmj_syndrome_pain', label: 'TMJ SYNDROME PAIN' },
      { value: 'trapezitis_pain', label: 'TRAPEZITIS PAIN' },
      { value: 'trigeminal_neuralgia_pain', label: 'TRIGEMINAL NERUALGIA PAIN' },
      { value: 'uveitis_pain', label: 'UVEITIS PAIN' }
    ],
    'post_covid_ailments': [
      { value: 'na', label: 'NA' }
    ],
    'psychiatric': [
      { value: 'anxiety_neurosis', label: 'ANXIETY NEUROSIS' },
      { value: 'conversion_reaction', label: 'CONVERSION REACTION' },
      { value: 'mental_retardation', label: 'MENTAL RETARDATION' },
      { value: 'panic_disorder', label: 'PANIC DISORDER' },
      { value: 'schizophrenia', label: 'SCHIZOPHRENIA' }
    ],
    'renal': [
      { value: 'acute_renal_failure', label: 'ACUTE RENAL FAILURE' },
      { value: 'chronic_cystitis', label: 'CHRONIC CYSTITIS' },
      { value: 'chronic_renal_failure', label: 'CHRONIC RENAL FAILURE' },
      { value: 'glomerular_nephritis', label: 'GLOMERULAR NEPHRITIS' },
      { value: 'nephritic_syndrome', label: 'NEPHRITIC SYNDROME' },
      { value: 'polycystic_renal_disease', label: 'POLYCYSTIC RENAL DISEASE' },
      { value: 'renal_calculus', label: 'RENAL CALCULUS' },
      { value: 'renal_stones', label: 'RENAL STONES' },
      { value: 'simple_renal_cyst', label: 'SIMPLE RENAL CYST' },
      { value: 'urinary_tract_infection', label: 'URINARY TRACT INFECTION' }
    ],
    'respiratory': [
      { value: 'allergic_bronchitis', label: 'ALLERGIC BRONCHITIS' },
      { value: 'aspergillosis', label: 'ASPERGILLOSIS' },
      { value: 'bronchiectasis', label: 'BRONCHIECTASIS' },
      { value: 'chronic_bronchitis', label: 'CHRONIC BRONCHITIS' },
      { value: 'chronic_laryngitis', label: 'CHRONIC LARYNGITIS' },
      { value: 'copd', label: 'COPD' },
      { value: 'cystic_fibrosis', label: 'CYSTIC FIBROSIS' },
      { value: 'interstitial_lung_disease', label: 'INTERSTITIAL LUNG DISEASE' },
      { value: 'pulmonary_kochs', label: 'PULMONARY KOCHS' },
      { value: 'recurrent_pharyngitis', label: 'RECURRENT PHARYNGITIS' },
      { value: 'sarcoidosis', label: 'SARCOIDOSIS' },
      { value: 'sinusitis', label: 'SINUSITIS' },
      { value: 'sleep_apnoea', label: 'SLEEP APNOEA' },
      { value: 'tonsillitis', label: 'TONSILLITIS' },
      { value: 'wegeners_granulomatosis', label: 'WEGENERS GRANULOMATOSIS PROTOCOL' }
    ],
    'rheumatology': [
      { value: 'juvenile_rheumatic_arthritis', label: 'JUVENIAL RHEUMATIC ARTHRITIS' },
      { value: 'rheumatic_fever', label: 'RHEUMATIC FEVER' }
    ],
    'sexual_health': [
      { value: 'erectile_dysfunction', label: 'ERECTILE DYSFUNCTION' },
      { value: 'female_sexual_health', label: 'FEMALE SEXUAL HEALTH' },
      { value: 'genital_warts', label: 'GENITAL WARTS' },
      { value: 'genital_herpes', label: 'GENTIAL HERPES' },
      { value: 'male_infertility', label: 'MALE INFERTILITY' },
      { value: 'male_sexual_health', label: 'MALE SEXUAL HEALTH' },
      { value: 'premature_ejaculation', label: 'PREMATURE EJACULATION' },
      { value: 'syphilis', label: 'SYPHILIS' },
      { value: 'varicocele', label: 'VARICOCELE' }
    ],
    'skin': [
      { value: 'acne', label: 'ACNE' },
      { value: 'acne_rosacea', label: 'ACNE ROSACEA' },
      { value: 'acrochordons', label: 'ACROCORDONS' },
      { value: 'acrokeratosis_verruciformis', label: 'ACROKERATOSIS VERRUCIFORMIS' },
      { value: 'acropigmentation', label: 'ACROPIGMENTATION' },
      { value: 'amyloidosis', label: 'AMYLOIDOSIS' },
      { value: 'ashy_dermatosis', label: 'ASHY DERMATOSIS' },
      { value: 'atopic_dermatitis', label: 'ATOPIC DERMATITIS' },
      { value: 'bed_sores', label: 'BED SORES / DECUBITUS ULCERS' },
      { value: 'bromhidrosis', label: 'BROMHIDROSIS' },
      { value: 'bullous_pemphigoid', label: 'BULLOUS PEMPHIGOID' },
      { value: 'carbuncle', label: 'CARBUNCLE' },
      { value: 'chalazion', label: 'CHALAZION' },
      { value: 'chicken_pox', label: 'CHICKEN POX' },
      { value: 'chilblains', label: 'CHILBLAINS' },
      { value: 'cicatrix', label: 'CICATRIX' },
      { value: 'corns', label: 'CORNS' },
      { value: 'cutaneous_candidiasis', label: 'CUTANEOUS CANDIDIASIS' },
      { value: 'dandruff', label: 'DANDRUFF' },
      { value: 'dariers_disease', label: 'DARIERS DISEASE' },
      { value: 'dermatitis_herpetiformis', label: 'DERMATITIS HERPETIFORMIS' },
      { value: 'dermatomyositis', label: 'DERMATOMYOSITIS' },
      { value: 'dermatosis_papulosa_nigra', label: 'DERMATOSIS PAPULOSA NIGRA' },
      { value: 'eczema', label: 'ECZEMA' },
      { value: 'epidermolysis_bullosa', label: 'EPIDERMOLYSIS BULLOSA' },
      { value: 'eruptive_xanthoma', label: 'ERUPTIVE XANTHOMA' },
      { value: 'folliculitis_decalvans', label: 'FOLLICULITIS DECALVANS' },
      { value: 'freckles', label: 'FRECKLES' },
      { value: 'fungal', label: 'FUNGAL' },
      { value: 'granuloma_annulare', label: 'GRANULOMA ANNULARE' },
      { value: 'hansens', label: 'HANSENS' },
      { value: 'henoch_schonlein_purpura', label: 'HENOCH-SCHONLEIN PURPURA' },
      { value: 'herpes_simplex', label: 'HERPES SIMPLEX' },
      { value: 'herpes_zoster', label: 'HERPES ZOSTER' },
      { value: 'hidradenitis_suppurativa', label: 'HIDRADENITIS SUPPURATIVA' },
      { value: 'hyperhidrosis', label: 'HYPERHIDROSIS' },
      { value: 'hyperpigmentation', label: 'HYPERPIGMENTATION' },
      { value: 'ichthyosis', label: 'ICTHYOSIS' },
      { value: 'idiopathic_guttate_hypomelanosis', label: 'IDIOPATHIC GUTTATE HYPOMELANOSIS' },
      { value: 'keloids', label: 'KELOIDS' },
      { value: 'keratoderma', label: 'KERATODERMA' },
      { value: 'keratosis_pilaris', label: 'KERATOSIS PILARIS' },
      { value: 'lentigenes', label: 'LENTIGENES' },
      { value: 'leprosy_ulcer', label: 'LEPROSY ULCER' },
      { value: 'lichen_planus', label: 'LICHEN PLANUS' },
      { value: 'lichen_striatus', label: 'LICHEN STRIATUS' },
      { value: 'lipoid_proteinosis', label: 'LIPOID PROTEINOSIS' },
      { value: 'lipoma', label: 'LIPOMA' },
      { value: 'lupus', label: 'LUPUS' },
      { value: 'macular_amyloidosis', label: 'MACULAR AMYLOIDOSIS' },
      { value: 'melasma', label: 'MELASMA' },
      { value: 'milia', label: 'MILIA' },
      { value: 'miliaria', label: 'MILIARIA' },
      { value: 'moles', label: 'MOLES' },
      { value: 'molluscum_contagiosum', label: 'MOLLUSCUM CONTAGIOSUM' },
      { value: 'morphoea', label: 'MORPHOEA' },
      { value: 'neurofibromatosis', label: 'NEUROFIBROMATOSIS' },
      { value: 'nevus', label: 'NEVUS' },
      { value: 'onychomycosis', label: 'ONYCHOMYCOSIS' },
      { value: 'papilloma', label: 'PAPILLOMA' },
      { value: 'papular_sarcoidosis', label: 'PAPULAR SARCOIDOSIS' },
      { value: 'pemphigus', label: 'PEMPHIGUS' },
      { value: 'phrynoderma', label: 'PHRYNODERMA' },
      { value: 'pityriasis_alba', label: 'PITYRIASIS ALBA' },
      { value: 'pityriasis_rubra_pilaris', label: 'PITYRIASIS RUBRA PILARIS' },
      { value: 'pityriasis_versicolor', label: 'PITYRIASIS VERSICOLOR' },
      { value: 'plantar_warts', label: 'PLANTAR WARTS' },
      { value: 'pleva', label: 'PLEVA' },
      { value: 'polymorphous_light_eruption', label: 'POLYMORPHOUS LIGHT ERUPTION' },
      { value: 'pompholyx', label: 'POMPHOYLX' },
      { value: 'prokeratosis', label: 'PROKERATOSIS' },
      { value: 'prurigo_nodularis', label: 'PRURIGO NODULARIS' },
      { value: 'psoriasis', label: 'PSORIASIS' },
      { value: 'scabies', label: 'SCABIES' },
      { value: 'schambergs_purpura', label: 'SCHAMBERGS PURPURA' },
      { value: 'scleroderma', label: 'SCLERODERMA' },
      { value: 'sebaceous_cyst', label: 'SEBACIOUS CYST' },
      { value: 'seborrhoeic_dermatitis', label: 'SEBORRHOEIC DERMATITIS' },
      { value: 'stretch_marks', label: 'STRETCH MARKS/STRIAE DISTENSAE' },
      { value: 'subcorneal_pustular_dermatosis', label: 'SUBCORNEAL PUSTULAR DERMATOSIS' },
      { value: 'tinea', label: 'TINEA' },
      { value: 'tuberous_sclerosis', label: 'TUBEROUS SCLEROSIS' },
      { value: 'urticaria', label: 'URTICARIA' },
      { value: 'vasculitis', label: 'VASCULITIS' },
      { value: 'vitiligo', label: 'VITILIGO' },
      { value: 'warts', label: 'WARTS' },
      { value: 'xanthelasma', label: 'XANTHELASMA' },
      { value: 'xeroderma_pigmentosum', label: 'XERODERMA PIGMENTOSUM' }
    ],
    'speech_disorder': [
      { value: 'stammering', label: 'STAMMERING' }
    ],
    'stress_management': [
      { value: 'anxiety', label: 'ANXIETY' },
      { value: 'depression', label: 'DEPRESSION' },
      { value: 'insomnia', label: 'INSOMIA' },
      { value: 'irritable_bowel_syndrome', label: 'IRRITABLE BOWEL SYNDROME' },
      { value: 'migraine', label: 'MIGRAINE' }
    ],
    'teen_and_adolescence': [
      { value: 'addictions', label: 'ADDICTIONS' },
      { value: 'anorexia_bulimia', label: 'ANOREXIA /BULIMIA' }
    ],
    'urinary': [
      { value: 'benign_prostatic_hypertrophy', label: 'BENIGN PROSTATIC HYPERTROPHY (BPH)' },
      { value: 'kidney_stones', label: 'KIDNEY STONES' },
      { value: 'stress_incontinence', label: 'STRESS INCONTINENCE' },
      { value: 'urinary_tract_infection', label: 'URINARY TRACT INFECTION' }
    ],
    'weight_management': [
      { value: 'obesity', label: 'OBESITY' },
      { value: 'weight_management', label: 'WEIGHT MANAGEMENT' }
    ],
    'womens_health': [
      { value: 'dysmenorrhea', label: 'DYSMENORRHEA' },
      { value: 'endometriosis', label: 'ENDOMETRIOSIS' },
      { value: 'fibroadenoma', label: 'FIBROADENOMA' },
      { value: 'infertility', label: 'INFERTILITY' },
      { value: 'leucorrhoea', label: 'LEUCORRHOEA' },
      { value: 'menopause', label: 'MENOPAUSE' },
      { value: 'osteoporosis', label: 'OSTEOPOROSIS' },
      { value: 'pcos', label: 'PCOS' },
      { value: 'pms', label: 'PMS' },
      { value: 'pregnancy', label: 'PREGNANCY' },
      { value: 'thyroid_disorders', label: 'THYROID DISORDERS' },
      { value: 'uterine_fibroids', label: 'UTERINE FIBROIDS' },
      { value: 'uterine_prolapse', label: 'UTERINE PROLAPSE' },
      { value: 'vaginal_prolapse', label: 'VAGINAL PROLAPSE' }
    ],
    'general': [
      { value: 'general_consultation', label: 'General Consultation' },
      { value: 'health_checkup', label: 'Health Checkup' }
    ],
    // Aesthetics sub-segments
    'AI SKIN PRO': [
      { value: 'ACNE', label: 'ACNE' },
      { value: 'HYPERPIGMENTATION', label: 'HYPERPIGMENTATION' },
      { value: 'MELASMA', label: 'MELASMA' },
      { value: 'PREMATURE AGEING', label: 'PREMATURE AGEING' }
    ],
    'AI SKIN PRO-BRIGHT': [
      { value: 'OTHERS', label: 'OTHERS' }
    ],
    'B-FIT SUGA CONTROL': [
      { value: 'OTHERS', label: 'OTHERS' }
    ],
    'B-FIT WEIGHT MANAGEMENT': [
      { value: 'OTHERS', label: 'OTHERS' }
    ],
    'DERMAHEAL': [
      { value: 'DERMATITIS', label: 'DERMATITIS' },
      { value: 'PSORIASIS', label: 'PSORIASIS' },
      { value: 'VITILIGO', label: 'VITILIGO' }
    ],
    'GROHAIR': [
      { value: 'AGA FEMALE', label: 'AGA FEMALE' },
      { value: 'AGA MALE', label: 'AGA MALE' },
      { value: 'ATE', label: 'ATE' },
      { value: 'CTE', label: 'CTE' },
      { value: 'OTHERS', label: 'OTHERS' }
    ],
    'GROHAIR- HAIR BOOSTER': [
      { value: 'AGA FEMALE', label: 'AGA FEMALE' },
      { value: 'AGA MALE', label: 'AGA MALE' },
      { value: 'ATE', label: 'ATE' },
      { value: 'CTE', label: 'CTE' }
    ],
    'HAIR BOOSTER': [
      { value: 'AGA FEMALE', label: 'AGA FEMALE' },
      { value: 'AGA MALE', label: 'AGA MALE' },
      { value: 'ATE', label: 'ATE' },
      { value: 'CTE', label: 'CTE' }
    ],
    'HVT': [
      { value: 'OTHERS', label: 'OTHERS' }
    ],
    'LASER': [
      { value: 'HAIR REMOVAL', label: 'HAIR REMOVAL' },
      { value: 'PCOD', label: 'PCOD' }
    ],
    'MFIT ANXIETY': [
      { value: 'OTHERS', label: 'OTHERS' }
    ],
    'MFIT DEPRESSION': [
      { value: 'OTHERS', label: 'OTHERS' }
    ],
    'MFIT STRESS': [
      { value: 'OTHERS', label: 'OTHERS' }
    ],
    'NEW HAIR': [
      { value: 'AGA FEMALE', label: 'AGA FEMALE' },
      { value: 'AGA MALE', label: 'AGA MALE' },
      { value: 'ATE', label: 'ATE' },
      { value: 'CTE', label: 'CTE' }
    ],
    'NEW HAIR- HAIR BOOSTER': [
      { value: 'AGA FEMALE', label: 'AGA FEMALE' },
      { value: 'AGA MALE', label: 'AGA MALE' },
      { value: 'ATE', label: 'ATE' },
      { value: 'CTE', label: 'CTE' }
    ],
    'QUIKHAIR': [
      { value: 'OTHERS', label: 'OTHERS' }
    ],
    'SKIN': [
      { value: 'OTHERS', label: 'OTHERS' }
    ],
    'SKIN BRIGHTENING': [
      { value: 'HYPERPIGMENTATION', label: 'HYPERPIGMENTATION' },
      { value: 'MELASMA', label: 'MELASMA' },
      { value: 'SUN TANNING', label: 'SUN TANNING' }
    ],
    'SKIN CLEARING': [
      { value: 'ACNE', label: 'ACNE' }
    ],
    'SKIN REJUVENATION': [
      { value: 'UNEVEN SKIN TONE', label: 'UNEVEN SKIN TONE' }
    ],
    'SKIN TIGHTENING': [
      { value: 'PREMATURE AGEING', label: 'PREMATURE AGEING' }
    ],
    'STM CELL- HAIR BOOSTER': [
      { value: 'AGA FEMALE', label: 'AGA FEMALE' },
      { value: 'AGA MALE', label: 'AGA MALE' },
      { value: 'ATE', label: 'ATE' },
      { value: 'CTE', label: 'CTE' }
    ],
    'STMCELL': [
      { value: 'AGA FEMALE', label: 'AGA FEMALE' },
      { value: 'AGA MALE', label: 'AGA MALE' },
      { value: 'ATE', label: 'ATE' },
      { value: 'CTE', label: 'CTE' },
      { value: 'OTHERS', label: 'OTHERS' }
    ],
    'XOGEN': [
      { value: 'OTHERS', label: 'OTHERS' }
    ],
    // Services with no sub-options
    'AI HAIR PRO': [],
    'AI HAIR PRO-GH': [],
    'AI HAIR PRO-NH': [],
    'AI HAIR PRO-STM': [],
    'AI SKIN PRO-CLEAR': [],
    'AI SKIN PRO-RENEU': [],
    'AI SKIN PRO-YOUTH': [],
    'BFIT INCLINIC': [],
    'LASER ARMS': [],
    'LASER CHIN UPPER': [],
    'LASER FULL BODY': [],
    'LASER LEGS': [],
    'LASER LOWER FACE': [],
    'LASER-MEDIUM PARTS': [],
    'LASER-SMALL PARTS': [],
    'LASER-WHOLE BODY': [],
    'MFIT STUDENT EXAM STRESS': [],
    'XOGEN ADVANCE': []
  };

  return subSegmentMap[segment] || [];
};

const resetDependentFields = (formData: any, field: string) => {
  const updates: any = {};
  if (field === 'treatment_type') {
    updates.segment = '';
    updates.sub_segment = '';
  } else if (field === 'segment') {
    updates.sub_segment = '';
  }
  return { ...formData, ...updates };
};
import { pdfGenerator } from '../../lib/pdf-generator';
import { MultiplePrescriptionDrugForm } from './MultiplePrescriptionDrugForm';
import { MultiplePrescriptionService } from '../../lib/multiple-prescription-service';
import type { Consultation, ConsultationUpdate, PrescriptionDrug } from '../../lib/supabase';
import { CONSULTATION_STATUS, STATUS_LABELS } from '../../lib/constants';

interface ConsultationEditModalProps {
  consultation: Consultation | null;
  isOpen?: boolean;
  onClose: () => void;
  onSave?: (updates: Partial<ConsultationUpdate>) => Promise<{ success: boolean; error?: string }>;
  onDelete?: () => Promise<{ success: boolean; error?: string }>;
  isReadOnly?: boolean;
}

export function ConsultationEditModal({ 
  consultation, 
  isOpen = true, 
  onClose, 
  onSave, 
  onDelete,
  isReadOnly = false
}: ConsultationEditModalProps) {
  const [formData, setFormData] = useState<Partial<ConsultationUpdate>>({
    // Empty block
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'prescription' | 'notes' | 'services' | 'drugs' | 'investigations'>('details');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState<Partial<ConsultationUpdate>>({
    // Empty block
  });
  const [multiplePrescriptions, setMultiplePrescriptions] = useState<PrescriptionDrug[]>([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);


  // Memoized callback for multiple prescription updates
  const handleMultiplePrescriptionsUpdate = useCallback((prescriptions: any[]) => {
    // Map the form data to the database format
    const mappedPrescriptions = prescriptions.map(p => ({
      ...p,
      repetition_frequency: p.repeat_start ? parseInt(p.repeat_start) : null,
      repetition_interval: p.repeat_end ? parseInt(p.repeat_end) : null,
      repetition_unit: p.repeat_type || null
    }));
    setMultiplePrescriptions(mappedPrescriptions);
  }, []);

  // Load multiple prescriptions when consultation changes
  useEffect(() => {
    const loadPrescriptions = async () => {
      if (!consultation?.id) {
        setMultiplePrescriptions([]);
        return;
      }

      setLoadingPrescriptions(true);
      try {
        const prescriptions = await MultiplePrescriptionService.getPrescriptionDrugs(consultation.id);
        setMultiplePrescriptions(prescriptions);

      } catch (error) {

        setError('Failed to load prescription data');
      } finally {
        setLoadingPrescriptions(false);
      }
    };

    loadPrescriptions();
  }, [consultation?.id]);

  // Initialize form data when consultation changes
  useEffect(() => {
    if (consultation) {

      setFormData({
        status: consultation.status,
        prescription: consultation.prescription || '',
        notes: consultation.notes || '',
        follow_up_date: consultation.follow_up_date || '',
        follow_up_notes: consultation.follow_up_notes || '',
        treatment_plan: consultation.treatment_plan || '',
        describe_it: consultation.describe_it || '',
        symptoms: consultation.symptoms || '',
        diagnosis: consultation.diagnosis || '',
        medicines_prescribed: consultation.medicines_prescribed || null,
        dosage_instructions: consultation.dosage_instructions || '',
        next_appointment_date: consultation.next_appointment_date || '',
        patient_concerns: consultation.patient_concerns || '',
        doctor_observations: consultation.doctor_observations || '',
        service_type: consultation.service_type || '',
        unit_doctor: consultation.unit_doctor || '',
        segment: consultation.segment || '',
        sub_segment: consultation.sub_segment || '',
        sub_sub_segment_text: consultation.sub_sub_segment_text || '',
        case_type: consultation.case_type || '',
        remarks: consultation.remarks || '',
        manual_case_type: consultation.manual_case_type || '',
        associated_segments: consultation.associated_segments || [],
        pathological_investigations: consultation.pathological_investigations || [],
        radio_diagnosis: consultation.radio_diagnosis || [],
        recommendations: consultation.recommendations || ''
      });
      
      // Initialize prescription data
      const prescriptionData = {
        drug_name: consultation.drug_name || null,
        potency: consultation.potency || null,
        dosage: consultation.dosage || null,
        repetition_frequency: consultation.repetition_frequency || null,
        repetition_interval: consultation.repetition_interval || null,
        repetition_unit: consultation.repetition_unit || null,
        quantity: consultation.quantity || null,
        period: consultation.period || null,
        prescription_remarks: consultation.prescription_remarks || null
      };

      setPrescriptionData(prescriptionData);
    }
  }, [consultation]);

  const handleInputChange = (field: keyof ConsultationUpdate, value: any) => {
    // Handle service field dependencies
    if (field === 'service_type' || field === 'segment') {
      const updatedData = resetDependentFields(formData, field);
      updatedData[field] = value;
      setFormData(updatedData);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAssociatedSegmentChange = (segment: string, isSelected: boolean) => {
    setFormData(prev => {
      const currentSegments = prev.associated_segments || [];
      if (isSelected) {
        return { ...prev, associated_segments: [...currentSegments, segment] };
      } else {
        return { ...prev, associated_segments: currentSegments.filter(s => s !== segment) };
      }
    });
  };

  const handleInvestigationChange = (field: 'pathological_investigations' | 'radio_diagnosis', investigation: string, isSelected: boolean) => {
    setFormData(prev => {
      const currentInvestigations = prev[field] || [];
      if (isSelected) {
        return { ...prev, [field]: [...currentInvestigations, investigation] };
      } else {
        return { ...prev, [field]: currentInvestigations.filter(i => i !== investigation) };
      }
    });
  };

  const handleSave = async () => {
    if (!consultation) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Save multiple prescriptions first
      if (multiplePrescriptions.length > 0) {
        const prescriptionInserts = multiplePrescriptions.map(p => ({
          drug_name: p.drug_name,
          potency: p.potency,
          dosage: p.dosage,
          repetition_frequency: p.repetition_frequency,
          repetition_interval: p.repetition_interval,
          repetition_unit: p.repetition_unit,
          quantity: p.quantity,
          period: p.period,
          remarks: p.remarks
        }));
        
        await MultiplePrescriptionService.savePrescriptionDrugs(consultation.id, prescriptionInserts);

      }

      // Merge form data with prescription data
      const mergedData = { ...formData, ...prescriptionData };
      
      // Clean up empty date fields to prevent database errors
      const cleanedFormData = { ...mergedData };
      
      // Convert empty strings to null for date fields
      if (cleanedFormData.follow_up_date === '') {
        cleanedFormData.follow_up_date = null;
      }
      if (cleanedFormData.next_appointment_date === '') {
        cleanedFormData.next_appointment_date = null;
      }
      
      // Convert empty strings to null for text fields
      if (cleanedFormData.patient_concerns === '') {
        cleanedFormData.patient_concerns = null;
      }
      if (cleanedFormData.doctor_observations === '') {
        cleanedFormData.doctor_observations = null;
      }
      if (cleanedFormData.diagnosis === '') {
        cleanedFormData.diagnosis = null;
      }
      if (cleanedFormData.symptoms === '') {
        cleanedFormData.symptoms = null;
      }
      if (cleanedFormData.treatment_plan === '') {
        cleanedFormData.treatment_plan = null;
      }
      if (cleanedFormData.describe_it === '') {
        cleanedFormData.describe_it = null;
      }
      if (cleanedFormData.notes === '') {
        cleanedFormData.notes = null;
      }
      if (cleanedFormData.follow_up_notes === '') {
        cleanedFormData.follow_up_notes = null;
      }
      if (cleanedFormData.dosage_instructions === '') {
        cleanedFormData.dosage_instructions = null;
      }
      
      // Clean up service fields
      if (cleanedFormData.service_type === '') {
        cleanedFormData.service_type = null;
      }
      if (cleanedFormData.segment === '') {
        cleanedFormData.segment = null;
      }
      if (cleanedFormData.sub_segment === '') {
        cleanedFormData.sub_segment = null;
      }
      if (cleanedFormData.sub_sub_segment_text === '') {
        cleanedFormData.sub_sub_segment_text = null;
      }
      if (cleanedFormData.case_type === '') {
        cleanedFormData.case_type = null;
      }
      if (cleanedFormData.remarks === '') {
        cleanedFormData.remarks = null;
      }
      if (cleanedFormData.manual_case_type === '') {
        cleanedFormData.manual_case_type = null;
      }
      if (!cleanedFormData.associated_segments || cleanedFormData.associated_segments.length === 0) {
        cleanedFormData.associated_segments = null;
      }

      if (onSave) {
        const result = await onSave(cleanedFormData);
        
        if (result.success) {
          onClose();
        } else {
          setError(result.error || 'Failed to save changes');
        }
      } else {
        setError('Save function not available');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!consultation || !confirm('Are you sure you want to delete this consultation? This action cannot be undone.')) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (onDelete) {
        const result = await onDelete();
        
        if (result.success) {
          onClose();
        } else {
          setError(result.error || 'Failed to delete consultation');
        }
      } else {
        setError('Delete function not available');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadUserPDF = async () => {
    if (!consultation) return;
    
    setIsGeneratingPDF(true);
    try {
      const pdfBlob = await pdfGenerator.generatePatientPrescriptionPDF(consultation);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${consultation.name}_user_info_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {

      alert(`Error generating PDF: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadAdminPDF = async () => {
    if (!consultation) return;
    
    setIsGeneratingPDF(true);
    try {
      const pdfBlob = await pdfGenerator.generateAdminPrescriptionPDF(consultation);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${consultation.name}_admin_complete_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {

      alert(`Error generating PDF: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!isOpen || !consultation) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xl">
      <div className="card-premium rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[98vh] sm:max-h-[95vh] overflow-hidden shadow-2xl animate-scale-in border-0 relative flex flex-col">
        {/* Header */}
        <div className="glass-dark rounded-t-2xl sm:rounded-t-3xl border-b border-white/10 p-3 sm:p-6 lg:p-8 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Edit Consultation
                </h2>
                <p className="text-blue-100 text-sm">
                  {consultation.name} - {consultation.treatment_type}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 glass rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-4">
            {[
              { id: 'details', name: 'Details', icon: FileText },
              { id: 'prescription', name: 'Prescription', icon: Pill },
              { id: 'notes', name: 'Notes', icon: Stethoscope },
              { id: 'services', name: 'Services', icon: Settings },
              { id: 'drugs', name: 'Prescription Drugs', icon: Plus },
              { id: 'investigations', name: 'Investigations', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-100 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 lg:p-6 overflow-y-auto flex-1">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                     <select
                     value={formData.status || ''}
                     onChange={(e) => handleInputChange('status', e.target.value)}
                     disabled={isReadOnly}
                     className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                   >
                     <option value={CONSULTATION_STATUS.PENDING}>{STATUS_LABELS[CONSULTATION_STATUS.PENDING]}</option>
                     <option value={CONSULTATION_STATUS.CONFIRMED}>{STATUS_LABELS[CONSULTATION_STATUS.CONFIRMED]}</option>
                     <option value={CONSULTATION_STATUS.IN_PROGRESS}>{STATUS_LABELS[CONSULTATION_STATUS.IN_PROGRESS]}</option>
                     <option value={CONSULTATION_STATUS.COMPLETED}>{STATUS_LABELS[CONSULTATION_STATUS.COMPLETED]}</option>
                     <option value={CONSULTATION_STATUS.CANCELLED}>{STATUS_LABELS[CONSULTATION_STATUS.CANCELLED]}</option>
                     <option value={CONSULTATION_STATUS.FOLLOW_UP}>{STATUS_LABELS[CONSULTATION_STATUS.FOLLOW_UP]}</option>
                   </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next Appointment Date</label>
                  <input
                    type="date"
                    value={formData.next_appointment_date || ''}
                    onChange={(e) => handleInputChange('next_appointment_date', e.target.value)}
                    readOnly={isReadOnly}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient Concerns</label>
                <textarea
                  rows={3}
                  value={formData.patient_concerns || ''}
                  onChange={(e) => handleInputChange('patient_concerns', e.target.value)}
                  readOnly={isReadOnly}
                  placeholder="Document patient's main concerns..."
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doctor's Observations</label>
                <textarea
                  rows={3}
                  value={formData.doctor_observations || ''}
                  onChange={(e) => handleInputChange('doctor_observations', e.target.value)}
                  placeholder="Document your clinical observations..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {activeTab === 'prescription' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescription & Treatment</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                <input
                  type="text"
                  value={formData.diagnosis || ''}
                  onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                  placeholder="Enter diagnosis..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                <textarea
                  rows={2}
                  value={formData.symptoms || ''}
                  onChange={(e) => handleInputChange('symptoms', e.target.value)}
                  placeholder="Document symptoms..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medicines Prescribed</label>
                <textarea
                  rows={4}
                  value={formData.medicines_prescribed || ''}
                  onChange={(e) => handleInputChange('medicines_prescribed', e.target.value)}
                  placeholder="Enter medicines with details, one per line or as needed..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dosage Instructions</label>
                <textarea
                  rows={3}
                  value={formData.dosage_instructions || ''}
                  onChange={(e) => handleInputChange('dosage_instructions', e.target.value)}
                  placeholder="Enter detailed dosage instructions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What are you suffering from?</label>
                <textarea
                  rows={3}
                  value={formData.treatment_plan || ''}
                  onChange={(e) => handleInputChange('treatment_plan', e.target.value)}
                  placeholder="Enter what the patient is suffering from..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Describe it (Admin Only)</label>
                <textarea
                  rows={3}
                  value={formData.describe_it || ''}
                  onChange={(e) => handleInputChange('describe_it', e.target.value)}
                  placeholder="Enter detailed description of the condition (admin only)..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes & Follow-up</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">General Notes</label>
                <textarea
                  rows={4}
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Enter general consultation notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recommendations</label>
                <textarea
                  rows={3}
                  value={formData.recommendations || ''}
                  onChange={(e) => handleInputChange('recommendations', e.target.value)}
                  placeholder="Enter recommendations and follow-up instructions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>
                <input
                  type="date"
                  value={formData.follow_up_date || ''}
                  onChange={(e) => handleInputChange('follow_up_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Services Classification</h3>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleDownloadUserPDF}
                    disabled={isGeneratingPDF}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>{isGeneratingPDF ? 'Generating...' : 'User PDF'}</span>
                  </Button>
                  <Button
                    onClick={handleDownloadAdminPDF}
                    disabled={isGeneratingPDF}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>{isGeneratingPDF ? 'Generating...' : 'Admin PDF'}</span>
                  </Button>
                </div>
              </div>
              
              {/* Service Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
                <select
                  value={formData.service_type || ''}
                  onChange={(e) => handleInputChange('service_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Service Type</option>
                  {serviceOptions.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit Doctor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit Doctor *</label>
                <select
                  value={formData.unit_doctor || ''}
                  onChange={(e) => handleInputChange('unit_doctor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Doctor</option>
                  <option value="Dr. Kajal Kumari">Dr. Kajal Kumari</option>
                  <option value="Dr. Sidharth Gavrav">Dr. Sidharth Gavrav</option>
                </select>
              </div>

              {/* Clinical Finding Selection */}
              {formData.service_type && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Clinical Finding *</label>
                  <select
                    value={formData.segment || ''}
                    onChange={(e) => handleInputChange('segment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Clinical Finding</option>
                    {getSegmentsForService(formData.service_type).map((segment) => (
                      <option key={segment.value} value={segment.value}>
                        {segment.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sub-Finding Selection */}
              {formData.segment && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Finding</label>
                  <select
                    value={formData.sub_segment || ''}
                    onChange={(e) => handleInputChange('sub_segment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Sub-Finding</option>
                    {getSubSegmentsForSegment(formData.service_type!, formData.segment).map((subSegment) => (
                      <option key={subSegment.value} value={subSegment.value}>
                        {subSegment.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sub-Sub-Segment Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Sub-Segment Details</label>
                <textarea
                  rows={3}
                  value={formData.sub_sub_segment_text || ''}
                  onChange={(e) => handleInputChange('sub_sub_segment_text', e.target.value)}
                  placeholder="Enter additional details or custom sub-segment information..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Case Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Case Type</label>
                <select
                  value={formData.case_type || ''}
                  onChange={(e) => handleInputChange('case_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {caseTypeOptions.map((caseType) => (
                    <option key={caseType.value} value={caseType.value}>
                      {caseType.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Manual Case Type Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manual Case Type</label>
                <textarea
                  rows={2}
                  value={formData.manual_case_type || ''}
                  onChange={(e) => handleInputChange('manual_case_type', e.target.value)}
                  placeholder="Enter custom case type if needed..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                <textarea
                  rows={4}
                  value={formData.remarks || ''}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  placeholder="Enter additional remarks, observations, or notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Associated Segments Multi-Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Associated Segments</label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-80 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {associatedSegmentOptions.map((segment) => {
                      const isSelected = formData.associated_segments?.includes(segment.value) || false;
                      return (
                        <label key={segment.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded border border-transparent hover:border-gray-200 transition-colors">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleAssociatedSegmentChange(segment.value, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                          />
                          <span className="text-xs text-gray-700 font-medium leading-tight">{segment.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Select multiple segments that are relevant to this case. You can choose from all available medical specialties and conditions.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'drugs' && consultation && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Prescription Drugs Management</h3>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleDownloadUserPDF}
                    disabled={isGeneratingPDF}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>{isGeneratingPDF ? 'Generating...' : 'User PDF'}</span>
                  </Button>
                  <Button
                    onClick={handleDownloadAdminPDF}
                    disabled={isGeneratingPDF}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>{isGeneratingPDF ? 'Generating...' : 'Admin PDF'}</span>
                  </Button>
                </div>
              </div>
              
              {loadingPrescriptions ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading prescriptions...</p>
                  </div>
                </div>
              ) : (
                <MultiplePrescriptionDrugForm
                  key={consultation.id}
                  consultationId={consultation.id}
                  initialPrescriptions={multiplePrescriptions}
                  onPrescriptionsUpdate={handleMultiplePrescriptionsUpdate}
                />
              )}
            </div>
          )}

          {activeTab === 'investigations' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Investigations</h3>
              
              {/* Pathological Investigations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">1). Pathological Investigation</label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-80 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {[
                      "CBC", "ESR", "LFT", "KFT", "Lipid Profile", "Thyroid Profile", "FSH", "LH", "Prolactin", "AMH",
                      "Estradiol", "Progesterone", "Androgens", "Widal Test", "Malarial Antigen", "Free Testosterone",
                      "Rh Factor", "Diabetic Profile", "Phosphorus", "ELISA", "Hba1c", "Sugar(Glucose) Fasting",
                      "Sugar(Glucose)PP", "Sugar(Glucose)Random", "Urine Sugar (Random)", "Urine Sugar (Fasting)",
                      "Urine Sugar(PP)", "Urine Complete", "Urine Pregnancy Test", "Vitamin D3", "Vitamin B12",
                      "Urine C/S", "Total IGE", "Uric Acid", "Iron Studies", "Cardiac Risk Marker", "Pancreatic Profile",
                      "Ferritin", "Jai Bihar Silver", "Jai Bihar Gold", "Jai Bihar Platinum"
                    ].map((investigation) => {
                      const isSelected = formData.pathological_investigations?.includes(investigation) || false;
                      return (
                        <label key={investigation} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded border border-transparent hover:border-gray-200 transition-colors">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleInvestigationChange('pathological_investigations', investigation, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                          />
                          <span className="text-xs text-gray-700 font-medium leading-tight">{investigation}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Radio Diagnosis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">2). Radio Diagnosis</label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      "USG of Whole Abdomen", "USG of Lower Abdominal Region", "MRI", "CT Scan", "X-Ray", "ECG"
                    ].map((investigation) => {
                      const isSelected = formData.radio_diagnosis?.includes(investigation) || false;
                      return (
                        <label key={investigation} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded border border-transparent hover:border-gray-200 transition-colors">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleInvestigationChange('radio_diagnosis', investigation, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                          />
                          <span className="text-xs text-gray-700 font-medium leading-tight">{investigation}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 lg:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            {!isReadOnly && (
              <div className="flex gap-3">
                {onDelete && (
                  <Button
                    onClick={handleDelete}
                    disabled={isLoading}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                disabled={isLoading}
              >
                {isReadOnly ? 'Close' : 'Cancel'}
              </Button>
              {!isReadOnly && onSave && (
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
