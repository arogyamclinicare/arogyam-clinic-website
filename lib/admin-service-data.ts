/**
 * Admin Service Data - Complete hierarchical structure for Services, Segments, and Sub-Segments
 * This file contains all the data needed for the admin portal's Services section
 */

// TypeScript interfaces for type safety
export interface SubSegmentOption {
  label: string;
  value: string;
}

export interface SegmentOption {
  label: string;
  value: string;
  subSegments: SubSegmentOption[];
}

export interface ServiceOption {
  label: string;
  value: string;
  segments: SegmentOption[];
}

// Complete service options data structure
export const serviceOptions: ServiceOption[] = [
  {
    label: 'Homeopathy',
    value: 'homeopathy',
    segments: [
      {
        label: 'ALLERGY',
        value: 'allergy',
        subSegments: [
          { label: 'ALLERGIC RHINITIS', value: 'allergic_rhinitis' },
          { label: 'ASTHMA', value: 'asthma' },
          { label: 'GLUTEN INTOLERANCE', value: 'gluten_intolerance' },
          { label: 'LACTOSE INTOLERANCE', value: 'lactose_intolerance' },
          { label: 'PROTEIN ALLERGY', value: 'protein_allergy' }
        ]
      },
      {
        label: 'ANO RECTAL DISORDER',
        value: 'ano_rectal_disorder',
        subSegments: [
          { label: 'PILES/FISSURE / FISTULA', value: 'piles_fissure_fistula' }
        ]
      },
      {
        label: 'ANORECTAL DISEASE',
        value: 'anorectal_disease',
        subSegments: [
          { label: 'PILONIDAL SINUS', value: 'pilonidal_sinus' }
        ]
      },
      {
        label: 'B-FIT+ WEIGHT MANAGEMENT',
        value: 'b_fit_plus_weight_management',
        subSegments: []
      },
      {
        label: 'CANCER/MALIGNANCY',
        value: 'cancer_malignancy',
        subSegments: [
          { label: 'N/A', value: 'na' }
        ]
      },
      {
        label: 'CARDIOVASCULAR',
        value: 'cardiovascular',
        subSegments: [
          { label: 'HYPERLIPIDEMIA', value: 'hyperlipidemia' },
          { label: 'HYPERTENSION', value: 'hypertension' },
          { label: 'ISCHAEMIC HEART DISEASE/ LEFT VENTRICULAR FAILURE', value: 'ischaemic_heart_disease' },
          { label: 'PULMONARY HYPERTENSION', value: 'pulmonary_hypertension' },
          { label: 'RESTRICTIVE CARDIOMYOPATHY', value: 'restrictive_cardiomyopathy' },
          { label: 'RHEUMATIC HEART DISEASE', value: 'rheumatic_heart_disease' }
        ]
      },
      {
        label: 'CHILDREN DISORDERS',
        value: 'children_disorders',
        subSegments: [
          { label: 'ATTENTION DEFICIT DISORDER', value: 'attention_deficit_disorder' },
          { label: 'AUTISM', value: 'autism' },
          { label: 'BED WETTING', value: 'bed_wetting' },
          { label: 'CONGENITAL/NEUROLOGICAL PROBLEMS', value: 'congenital_neurological_problems' },
          { label: 'GASTROINTESTINAL DISORDER', value: 'gastrointestinal_disorder' },
          { label: 'GROWTH', value: 'growth' },
          { label: 'MEMORY', value: 'memory' },
          { label: 'POOR APPETITE', value: 'poor_appetite' },
          { label: 'POOR IMMUNITY', value: 'poor_immunity' }
        ]
      },
      {
        label: 'CIRCULATORY DISORDER',
        value: 'circulatory_disorder',
        subSegments: [
          { label: 'DVT', value: 'dvt' },
          { label: 'HAEMANGIOMA', value: 'haemangioma' },
          { label: 'VARICOSE VEINS', value: 'varicose_veins' }
        ]
      },
      {
        label: 'CNS',
        value: 'cns',
        subSegments: [
          { label: 'CEREBRAL PALSY', value: 'cerebral_palsy' },
          { label: 'EPILEPSY', value: 'epilepsy' },
          { label: 'VERTIGO', value: 'vertigo' }
        ]
      },
      {
        label: 'DE ADDICTION',
        value: 'de_addiction',
        subSegments: [
          { label: 'ALCOHOLISM', value: 'alcoholism' },
          { label: 'DIGITAL ADDICTION', value: 'digital_addiction' },
          { label: 'SUBSTANCE ADDICTION', value: 'substance_addiction' }
        ]
      },
      {
        label: 'DENTITION',
        value: 'dentition',
        subSegments: [
          { label: 'CARIES', value: 'caries' }
        ]
      },
      {
        label: 'ENDOCRINE',
        value: 'endocrine',
        subSegments: [
          { label: 'THYROID DISORDERS', value: 'thyroid_disorders' },
          { label: 'TYPE 1 DIABETES MELLITUS', value: 'type_1_diabetes_mellitus' },
          { label: 'TYPE 2 DIABETES MELLITUS', value: 'type_2_diabetes_mellitus' }
        ]
      },
      {
        label: 'ENT',
        value: 'ent',
        subSegments: [
          { label: 'THYROID DISORDERS', value: 'thyroid_disorders' },
          { label: 'TYPE 1 DIABETES MELLITUS', value: 'type_1_diabetes_mellitus' },
          { label: 'TYPE 2 DIABETES MELLITUS', value: 'type_2_diabetes_mellitus' }
        ]
      },
      {
        label: 'GASTROINTESTINAL',
        value: 'gastrointestinal',
        subSegments: [
          { label: 'ACID REFLUX', value: 'acid_reflux' },
          { label: 'BUDD CHIARI SYNDROME', value: 'budd_chiari_syndrome' },
          { label: 'CHRONIC AMOEBIASIS', value: 'chronic_amoebiasis' },
          { label: 'CIRRHOSIS OF LIVER', value: 'cirrhosis_of_liver' },
          { label: 'CONSTIPATION', value: 'constipation' },
          { label: 'CROHN\'S DISEASE', value: 'crohns_disease' },
          { label: 'CRYPTOGENIC LIVER DISEASE', value: 'cryptogenic_liver_disease' },
          { label: 'DIARRHOEA', value: 'diarrhoea' },
          { label: 'DUODENITIS', value: 'duodenitis' },
          { label: 'DYSPEPSIA / INDIGESTION', value: 'dyspepsia_indigestion' },
          { label: 'GALL BLADDER DISEASE', value: 'gall_bladder_disease' },
          { label: 'GASTRITIS', value: 'gastritis' },
          { label: 'HEART BURN', value: 'heart_burn' },
          { label: 'HIATUS HERNIA', value: 'hiatus_hernia' },
          { label: 'INFLAMMATORY BOWEL DISEASE', value: 'inflammatory_bowel_disease' },
          { label: 'LIVER FIBROSIS', value: 'liver_fibrosis' },
          { label: 'NON ULCER DYSPEPSIA', value: 'non_ulcer_dyspepsia' },
          { label: 'PEPTIC ULCERS', value: 'peptic_ulcers' },
          { label: 'RECURRENT APTHAE', value: 'recurrent_apthae' },
          { label: 'ULCERATIVE COLITIS', value: 'ulcerative_colitis' }
        ]
      },
      {
        label: 'HAEMATOLOGICAL',
        value: 'haematological',
        subSegments: [
          { label: 'APLASTIC ANAEMIA', value: 'aplastic_anaemia' },
          { label: 'CHRONIC MYELOID LEUKAEMIA', value: 'chronic_myeloid_leukaemia' },
          { label: 'NON-HODGKINS LYMPHOMA', value: 'non_hodgkins_lymphoma' },
          { label: 'THALASSAEMIA', value: 'thalassaemia' },
          { label: 'VON WILLEBRANDS DISEASE', value: 'von_willebrands_disease' }
        ]
      },
      {
        label: 'HAIR',
        value: 'hair',
        subSegments: [
          { label: 'Androgenetic Alopecia Female', value: 'androgenetic_alopecia_female' },
          { label: 'Androgenetic Alopecia Male', value: 'androgenetic_alopecia_male' },
          { label: 'CANITIES', value: 'canities' },
          { label: 'NITS/ PEDICULOSIS CAPITIS', value: 'nits_pediculosis_capitis' },
          { label: 'PATCHY HAIR LOSS', value: 'patchy_hair_loss' },
          { label: 'TELOGEN EFFLUVIUM', value: 'telogen_effluvium' },
          { label: 'TRICHOTILLOMANIA', value: 'trichotillomania' },
          { label: 'WOOLY HAIR SYNDROME', value: 'wooly_hair_syndrome' }
        ]
      },
      {
        label: 'MINDFIT',
        value: 'mindfit',
        subSegments: [
          { label: 'OTHERS', value: 'others' }
        ]
      },
      {
        label: 'MUSCULOSKELETAL SYSTEM',
        value: 'musculoskeletal_system',
        subSegments: [
          { label: 'ANKYLOSING SPONDYLITIS', value: 'ankylosing_spondylitis' },
          { label: 'ARTHRITIS', value: 'arthritis' },
          { label: 'BACKACHE', value: 'backache' },
          { label: 'GANGLION', value: 'ganglion' },
          { label: 'GOUT', value: 'gout' },
          { label: 'LUMBAGO', value: 'lumbago' },
          { label: 'MIXED CONNECTIVE TISSUE DISEASE', value: 'mixed_connective_tissue_disease' },
          { label: 'MULTIPLE SCLEROSIS', value: 'multiple_sclerosis' },
          { label: 'MUSCULAR DYSTRYOPHY OR MYOPATHY', value: 'muscular_dystrophy_myopathy' },
          { label: 'PROLAPSED INTERVERTEBRAL DISC (PID)', value: 'prolapsed_intervertebral_disc' },
          { label: 'RHEUMATOID ARTHRITIS', value: 'rheumatoid_arthritis' },
          { label: 'STILLS DISEASE', value: 'stills_disease' },
          { label: 'SYSTEMATIC LUPUS ERYTHEMATOSUS', value: 'systematic_lupus_erythematosus' }
        ]
      },
      {
        label: 'NEUROLOGICAL',
        value: 'neurological',
        subSegments: [
          { label: 'ALZHEIMERS', value: 'alzheimers' },
          { label: 'ATAXIA', value: 'ataxia' },
          { label: 'BELL\'S PALSY', value: 'bells_palsy' },
          { label: 'CEREBRAL SPACE OCCUPYING LESION', value: 'cerebral_space_occupying_lesion' },
          { label: 'CERVICAL SPONDYLITIS', value: 'cervical_spondylitis' },
          { label: 'EPILEPSY', value: 'epilepsy' },
          { label: 'GUILLAIN BARRE SYNDROME', value: 'guillain_barre_syndrome' },
          { label: 'PARKINSONS DISEASE', value: 'parkinsons_disease' },
          { label: 'PETIT MAL EPILEPSY', value: 'petit_mal_epilepsy' },
          { label: 'SPASTIC CEREBRAL PALSY', value: 'spastic_cerebral_palsy' },
          { label: 'TRIGEMINAL NEURALGIA', value: 'trigeminal_neuralgia' }
        ]
      },
      {
        label: 'OPHTHALMOLOGICAL DISORDER',
        value: 'ophthalmological_disorder',
        subSegments: [
          { label: 'CENTRAL SEROUS RETINOPATHY', value: 'central_serous_retinopathy' },
          { label: 'MYOPIA', value: 'myopia' }
        ]
      },
      {
        label: 'PAIN MANAGEMENT',
        value: 'pain_management',
        subSegments: [
          { label: 'ACHILLES TENDINITIS PAIN ( ANKLE PAIN)', value: 'achilles_tendinitis_pain' },
          { label: 'ANKYLOSING SPONDYLOSIS PAIN', value: 'ankylosing_spondylosis_pain' },
          { label: 'APPENDICITIS PAIN', value: 'appendicitis_pain' },
          { label: 'BLEPAHARITIS PAIN', value: 'blepharitis_pain' },
          { label: 'CARPAL TUNNEL SYNDROME PAIN', value: 'carpal_tunnel_syndrome_pain' },
          { label: 'CERVICAL SPONDYLOSIS PAIN', value: 'cervical_spondylosis_pain' },
          { label: 'CLUSTER HEADACHE PAIN', value: 'cluster_headache_pain' },
          { label: 'CONJUNCTIVITIS PAIN', value: 'conjunctivitis_pain' },
          { label: 'DENTAL PAIN', value: 'dental_pain' },
          { label: 'ENCEPHALITIS PAIN', value: 'encephalitis_pain' },
          { label: 'FACIAL NEURALGIA PAIN', value: 'facial_neuralgia_pain' },
          { label: 'FIBROMYELGIA PAIN', value: 'fibromyalgia_pain' },
          { label: 'FROZEN SHOULDER PAIN', value: 'frozen_shoulder_pain' },
          { label: 'GALL BLADDER COLIC PAIN', value: 'gall_bladder_colic_pain' },
          { label: 'GASTRITIS PAIN', value: 'gastritis_pain' },
          { label: 'GOUT PAIN', value: 'gout_pain' },
          { label: 'GROWING PAIN ( PAIN IN LEGS /KNEE IN KIDS)', value: 'growing_pain' },
          { label: 'HAIRLINE FRACTURE PAIN', value: 'hairline_fracture_pain' },
          { label: 'HIP PAIN / SACRO ILITIS PAIN ( SERO NEGATIVE SPONDYLOARTHROPATHY)', value: 'hip_pain_sacro_ilitis' },
          { label: 'IRITIS PAIN', value: 'iritis_pain' },
          { label: 'JUVENILE RA PAIN', value: 'juvenile_ra_pain' },
          { label: 'LABYNTHINITIS PAIN', value: 'labyrinthitis_pain' },
          { label: 'LUMBAR PROLAPSE DISC PAIN ( SCIATICA)', value: 'lumbar_prolapse_disc_pain' },
          { label: 'LUMBAR SPONDYLOSIS PAIN', value: 'lumbar_spondylosis_pain' },
          { label: 'MASTOIDITIS PAIN', value: 'mastoiditis_pain' },
          { label: 'MENINGITIS PAIN', value: 'meningitis_pain' },
          { label: 'MIGRAINE PAIN', value: 'migraine_pain' },
          { label: 'NEURALGIA PAIN', value: 'neuralgia_pain' },
          { label: 'OPTIC NEURITIS PAIN', value: 'optic_neuritis_pain' },
          { label: 'OSTEO ARTHRITIS PAIN', value: 'osteo_arthritis_pain' },
          { label: 'OSTEO MALACIA PAIN', value: 'osteo_malacia_pain' },
          { label: 'OSTEOMYELITIS PAIN', value: 'osteomyelitis_pain' },
          { label: 'OTITIS MEDIA PAIN', value: 'otitis_media_pain' },
          { label: 'PERIPHERAL NEURITIS PAIN', value: 'peripheral_neuritis_pain' },
          { label: 'PHANTOM PAIN (POST AMPUTATION)', value: 'phantom_pain' },
          { label: 'PLANTAR FASCIITIS ( PAIN IN HEELS)', value: 'plantar_fasciitis_pain' },
          { label: 'POST RADIATION PAIN', value: 'post_radiation_pain' },
          { label: 'POST SURGICAL PAIN', value: 'post_surgical_pain' },
          { label: 'POST TRAUMATIC PAIN', value: 'post_traumatic_pain' },
          { label: 'RENAL COLIC PAIN', value: 'renal_colic_pain' },
          { label: 'RHEUMATOID ARTHRITIS PAIN', value: 'rheumatoid_arthritis_pain' },
          { label: 'RIB PAIN (COSTOCHONDRITIS)', value: 'rib_pain_costochondritis' },
          { label: 'SCALP FOLLICULITIS PAIN', value: 'scalp_folliculitis_pain' },
          { label: 'SINUSITIS PAIN', value: 'sinusitis_pain' },
          { label: 'SPRAIN PAIN', value: 'sprain_pain' },
          { label: 'STYE PAIN', value: 'stye_pain' },
          { label: 'TENNIS ELBOW PAIN', value: 'tennis_elbow_pain' },
          { label: 'TENSION HEADACHE PAIN', value: 'tension_headache_pain' },
          { label: 'TMJ SYNDROME PAIN', value: 'tmj_syndrome_pain' },
          { label: 'TRAPEZITIS PAIN', value: 'trapezitis_pain' },
          { label: 'TRIGEMINAL NERUALGIA PAIN', value: 'trigeminal_neuralgia_pain' },
          { label: 'UVEITIS PAIN', value: 'uveitis_pain' }
        ]
      },
      {
        label: 'POST COVID AILMENTS',
        value: 'post_covid_ailments',
        subSegments: [
          { label: 'NA', value: 'na' }
        ]
      },
      {
        label: 'PSYCHIATRIC',
        value: 'psychiatric',
        subSegments: [
          { label: 'ANXIETY NEUROSIS', value: 'anxiety_neurosis' },
          { label: 'CONVERSION REACTION', value: 'conversion_reaction' },
          { label: 'MENTAL RETARDATION', value: 'mental_retardation' },
          { label: 'PANIC DISORDER', value: 'panic_disorder' },
          { label: 'SCHIZOPHRENIA', value: 'schizophrenia' }
        ]
      },
      {
        label: 'RENAL',
        value: 'renal',
        subSegments: [
          { label: 'ACUTE RENAL FAILURE', value: 'acute_renal_failure' },
          { label: 'CHRONIC CYSTITIS', value: 'chronic_cystitis' },
          { label: 'CHRONIC RENAL FAILURE', value: 'chronic_renal_failure' },
          { label: 'GLOMERULAR NEPHRITIS', value: 'glomerular_nephritis' },
          { label: 'NEPHRITIC SYNDROME', value: 'nephritic_syndrome' },
          { label: 'POLYCYSTIC RENAL DISEASE', value: 'polycystic_renal_disease' },
          { label: 'RENAL CALCULUS', value: 'renal_calculus' },
          { label: 'RENAL STONES', value: 'renal_stones' },
          { label: 'SIMPLE RENAL CYST', value: 'simple_renal_cyst' },
          { label: 'URINARY TRACT INFECTION', value: 'urinary_tract_infection' }
        ]
      },
      {
        label: 'RESPIRATORY',
        value: 'respiratory',
        subSegments: [
          { label: 'ALLERGIC BRONCHITIS', value: 'allergic_bronchitis' },
          { label: 'ASPERGILLOSIS', value: 'aspergillosis' },
          { label: 'BRONCHIECTASIS', value: 'bronchiectasis' },
          { label: 'CHRONIC BRONCHITIS', value: 'chronic_bronchitis' },
          { label: 'CHRONIC LARYNGITIS', value: 'chronic_laryngitis' },
          { label: 'COPD', value: 'copd' },
          { label: 'CYSTIC FIBROSIS', value: 'cystic_fibrosis' },
          { label: 'INTERSTITIAL LUNG DISEASE', value: 'interstitial_lung_disease' },
          { label: 'PULMONARY KOCHS', value: 'pulmonary_kochs' },
          { label: 'RECURRENT PHARYNGITIS', value: 'recurrent_pharyngitis' },
          { label: 'SARCOIDOSIS', value: 'sarcoidosis' },
          { label: 'SINUSITIS', value: 'sinusitis' },
          { label: 'SLEEP APNOEA', value: 'sleep_apnoea' },
          { label: 'TONSILLITIS', value: 'tonsillitis' },
          { label: 'WEGENERS GRANULOMATOSIS PROTOCOL', value: 'wegeners_granulomatosis_protocol' }
        ]
      },
      {
        label: 'RHEUMATOLOGY',
        value: 'rheumatology',
        subSegments: [
          { label: 'JUVENIAL RHEUMATIC ARTHRITIS', value: 'juvenile_rheumatic_arthritis' },
          { label: 'RHEUMATIC FEVER', value: 'rheumatic_fever' }
        ]
      },
      {
        label: 'SEXUAL HEALTH',
        value: 'sexual_health',
        subSegments: [
          { label: 'ERECTILE DYSFUNCTION', value: 'erectile_dysfunction' },
          { label: 'FEMALE SEXUAL HEALTH', value: 'female_sexual_health' },
          { label: 'GENITAL WARTS', value: 'genital_warts' },
          { label: 'GENTIAL HERPES', value: 'genital_herpes' },
          { label: 'MALE INFERTILITY', value: 'male_infertility' },
          { label: 'MALE SEXUAL HEALTH', value: 'male_sexual_health' },
          { label: 'PREMATURE EJACULATION', value: 'premature_ejaculation' },
          { label: 'SYPHILIS', value: 'syphilis' },
          { label: 'VARICOCELE', value: 'varicocele' }
        ]
      },
      {
        label: 'SKIN',
        value: 'skin',
        subSegments: [
          { label: 'ACNE', value: 'acne' },
          { label: 'ACNE ROSACEA', value: 'acne_rosacea' },
          { label: 'ACROCORDONS', value: 'acrocordons' },
          { label: 'ACROKERATOSIS VERRUCIFORMIS', value: 'acrokeratosis_verruciformis' },
          { label: 'ACROPIGMENTATION', value: 'acropigmentation' },
          { label: 'AMYLOIDOSIS', value: 'amyloidosis' },
          { label: 'ASHY DERMATOSIS', value: 'ashy_dermatosis' },
          { label: 'ATOPIC DERMATITIS', value: 'atopic_dermatitis' },
          { label: 'BED SORES / DECUBITUS ULCERS', value: 'bed_sores_decubitus_ulcers' },
          { label: 'BROMHIDROSIS', value: 'bromhidrosis' },
          { label: 'BULLOUS PEMPHIGOID', value: 'bullous_pemphigoid' },
          { label: 'CARBUNCLE', value: 'carbuncle' },
          { label: 'CHALAZION', value: 'chalazion' },
          { label: 'CHICKEN POX', value: 'chicken_pox' },
          { label: 'CHILBLAINS', value: 'chilblains' },
          { label: 'CICATRIX', value: 'cicatrix' },
          { label: 'CORNS', value: 'corns' },
          { label: 'CUTANEOUS CANDIDIASIS', value: 'cutaneous_candidiasis' },
          { label: 'DANDRUFF', value: 'dandruff' },
          { label: 'DARIERS DISEASE', value: 'dariers_disease' },
          { label: 'DERMATITIS HERPETIFORMIS', value: 'dermatitis_herpetiformis' },
          { label: 'DERMATOMYOSITIS', value: 'dermatomyositis' },
          { label: 'DERMATOSIS PAPULOSA NIGRA', value: 'dermatosis_papulosa_nigra' },
          { label: 'ECZEMA', value: 'eczema' },
          { label: 'EPIDERMOLYSIS BULLOSA', value: 'epidermolysis_bullosa' },
          { label: 'ERUPTIVE XANTHOMA', value: 'eruptive_xanthoma' },
          { label: 'FOLLICULITIS DECALVANS', value: 'folliculitis_decalvans' },
          { label: 'FRECKLES', value: 'freckles' },
          { label: 'FUNGAL', value: 'fungal' },
          { label: 'GRANULOMA ANNULARE', value: 'granuloma_annulare' },
          { label: 'HANSENS', value: 'hansens' },
          { label: 'HENOCH-SCHONLEIN PURPURA', value: 'henoch_schonlein_purpura' },
          { label: 'HERPES SIMPLEX', value: 'herpes_simplex' },
          { label: 'HERPES ZOSTER', value: 'herpes_zoster' },
          { label: 'HIDRADENITIS SUPPURATIVA', value: 'hidradenitis_suppurativa' },
          { label: 'HYPERHIDROSIS', value: 'hyperhidrosis' },
          { label: 'HYPERPIGMENTATION', value: 'hyperpigmentation' },
          { label: 'ICTHYOSIS', value: 'ichthyosis' },
          { label: 'IDIOPATHIC GUTTATE HYPOMELANOSIS', value: 'idiopathic_guttate_hypomelanosis' },
          { label: 'KELOIDS', value: 'keloids' },
          { label: 'KERATODERMA', value: 'keratoderma' },
          { label: 'KERATOSIS PILARIS', value: 'keratosis_pilaris' },
          { label: 'LENTIGENES', value: 'lentigenes' },
          { label: 'LEPROSY ULCER', value: 'leprosy_ulcer' },
          { label: 'LICHEN PLANUS', value: 'lichen_planus' },
          { label: 'LICHEN STRIATUS', value: 'lichen_striatus' },
          { label: 'LIPOID PROTEINOSIS', value: 'lipoid_proteinosis' },
          { label: 'LIPOMA', value: 'lipoma' },
          { label: 'LUPUS', value: 'lupus' },
          { label: 'MACULAR AMYLOIDOSIS', value: 'macular_amyloidosis' },
          { label: 'MELASMA', value: 'melasma' },
          { label: 'MILIA', value: 'milia' },
          { label: 'MILIARIA', value: 'miliaria' },
          { label: 'MOLES', value: 'moles' },
          { label: 'MOLLUSCUM CONTAGIOSUM', value: 'molluscum_contagiosum' },
          { label: 'MORPHOEA', value: 'morphoea' },
          { label: 'NEUROFIBROMATOSIS', value: 'neurofibromatosis' },
          { label: 'NEVUS', value: 'nevus' },
          { label: 'ONYCHOMYCOSIS', value: 'onychomycosis' },
          { label: 'PAPILLOMA', value: 'papilloma' },
          { label: 'PAPULAR SARCOIDOSIS', value: 'papular_sarcoidosis' },
          { label: 'PEMPHIGUS', value: 'pemphigus' },
          { label: 'PHRYNODERMA', value: 'phrynoderma' },
          { label: 'PITYRIASIS ALBA', value: 'pityriasis_alba' },
          { label: 'PITYRIASIS RUBRA PILARIS', value: 'pityriasis_rubra_pilaris' },
          { label: 'PITYRIASIS VERSICOLOR', value: 'pityriasis_versicolor' },
          { label: 'PLANTAR WARTS', value: 'plantar_warts' },
          { label: 'PLEVA', value: 'pleva' },
          { label: 'POLYMORPHOUS LIGHT ERUPTION', value: 'polymorphous_light_eruption' },
          { label: 'POMPHOYLX', value: 'pompholyx' },
          { label: 'PROKERATOSIS', value: 'prokeratosis' },
          { label: 'PRURIGO NODULARIS', value: 'prurigo_nodularis' },
          { label: 'PSORIASIS', value: 'psoriasis' },
          { label: 'SCABIES', value: 'scabies' },
          { label: 'SCHAMBERGS PURPURA', value: 'schambergs_purpura' },
          { label: 'SCLERODERMA', value: 'scleroderma' },
          { label: 'SEBACIOUS CYST', value: 'sebaceous_cyst' },
          { label: 'SEBORRHOEIC DERMATITIS', value: 'seborrhoeic_dermatitis' },
          { label: 'STRETCH MARKS/STRIAE DISTENSAE', value: 'stretch_marks_striae_distensae' },
          { label: 'SUBCORNEAL PUSTULAR DERMATOSIS', value: 'subcorneal_pustular_dermatosis' },
          { label: 'TINEA', value: 'tinea' },
          { label: 'TUBEROUS SCLEROSIS', value: 'tuberous_sclerosis' },
          { label: 'URTICARIA', value: 'urticaria' },
          { label: 'VASCULITIS', value: 'vasculitis' },
          { label: 'VITILIGO', value: 'vitiligo' },
          { label: 'WARTS', value: 'warts' },
          { label: 'XANTHELASMA', value: 'xanthelasma' },
          { label: 'XERODERMA PIGMENTOSUM', value: 'xeroderma_pigmentosum' }
        ]
      },
      {
        label: 'SPEECH DISORDER',
        value: 'speech_disorder',
        subSegments: [
          { label: 'STAMMERING', value: 'stammering' }
        ]
      },
      {
        label: 'STRESS MANAGEMENT',
        value: 'stress_management',
        subSegments: [
          { label: 'ANXIETY', value: 'anxiety' },
          { label: 'DEPRESSION', value: 'depression' },
          { label: 'INSOMIA', value: 'insomnia' },
          { label: 'IRRITABLE BOWEL SYNDROME', value: 'irritable_bowel_syndrome' },
          { label: 'MIGRAINE', value: 'migraine' }
        ]
      },
      {
        label: 'TEEN AND ADOLSCENCE',
        value: 'teen_and_adolescence',
        subSegments: [
          { label: 'ADDICTIONS', value: 'addictions' },
          { label: 'ANOREXIA /BULIMIA', value: 'anorexia_bulimia' }
        ]
      },
      {
        label: 'URINARY',
        value: 'urinary',
        subSegments: [
          { label: 'BENIGN PROSTATIC HYPERTROPHY (BPH)', value: 'benign_prostatic_hypertrophy' },
          { label: 'KIDNEY STONES', value: 'kidney_stones' },
          { label: 'STRESS INCONTINENCE', value: 'stress_incontinence' },
          { label: 'URINARY TRACT INFECTION', value: 'urinary_tract_infection' }
        ]
      },
      {
        label: 'WEIGHT MANAGEMENT',
        value: 'weight_management',
        subSegments: [
          { label: 'OBESITY', value: 'obesity' },
          { label: 'UNDER WEIGHT', value: 'under_weight' }
        ]
      },
      {
        label: 'WOMENS HEALTH',
        value: 'womens_health',
        subSegments: [
          { label: 'DYSMENORRHEA', value: 'dysmenorrhea' },
          { label: 'ENDOMETRIOSIS', value: 'endometriosis' },
          { label: 'FIBROADENOMA', value: 'fibroadenoma' },
          { label: 'INFERTILITY', value: 'infertility' },
          { label: 'LEUCORRHOEA', value: 'leucorrhoea' },
          { label: 'MENOPAUSE', value: 'menopause' },
          { label: 'OSTEOPOROSIS', value: 'osteoporosis' },
          { label: 'PCOS', value: 'pcos' },
          { label: 'PMS', value: 'pms' },
          { label: 'PREGNANCY', value: 'pregnancy' },
          { label: 'THYROID DISORDERS', value: 'thyroid_disorders' },
          { label: 'UTERINE FIBROIDS', value: 'uterine_fibroids' },
          { label: 'UTERINE PROLAPSE', value: 'uterine_prolapse' },
          { label: 'VAGINAL PROLAPSE', value: 'vaginal_prolapse' }
        ]
      }
    ]
  },
  {
    label: 'Aesthetics',
    value: 'aesthetics',
    segments: [
      {
        label: 'AI HAIR PRO',
        value: 'ai_hair_pro',
        subSegments: []
      },
      {
        label: 'AI HAIR PRO-GH',
        value: 'ai_hair_pro_gh',
        subSegments: []
      },
      {
        label: 'AI HAIR PRO-NH',
        value: 'ai_hair_pro_nh',
        subSegments: []
      },
      {
        label: 'AI HAIR PRO-STM',
        value: 'ai_hair_pro_stm',
        subSegments: []
      },
      {
        label: 'AI SKIN PRO',
        value: 'ai_skin_pro',
        subSegments: [
          { label: 'ACNE', value: 'acne' },
          { label: 'HYPERPIGMENTATION', value: 'hyperpigmentation' },
          { label: 'MELASMA', value: 'melasma' },
          { label: 'PREMATURE AGEING', value: 'premature_ageing' }
        ]
      },
      {
        label: 'AI SKIN PRO-BRIGHT',
        value: 'ai_skin_pro_bright',
        subSegments: [
          { label: 'OTHERS', value: 'others' }
        ]
      },
      {
        label: 'AI SKIN PRO-CLEAR',
        value: 'ai_skin_pro_clear',
        subSegments: []
      },
      {
        label: 'AI SKIN PRO-RENEU',
        value: 'ai_skin_pro_reneu',
        subSegments: []
      },
      {
        label: 'AI SKIN PRO-YOUTH',
        value: 'ai_skin_pro_youth',
        subSegments: []
      },
      {
        label: 'B-FIT SUGA CONTROL',
        value: 'b_fit_suga_control',
        subSegments: [
          { label: 'OTHERS', value: 'others' }
        ]
      },
      {
        label: 'B-FIT WEIGHT MANAGEMENT',
        value: 'b_fit_weight_management',
        subSegments: [
          { label: 'OTHERS', value: 'others' }
        ]
      },
      {
        label: 'BFIT INCLINIC',
        value: 'bfit_inclinic',
        subSegments: []
      },
      {
        label: 'DERMAHEAL',
        value: 'dermaheal',
        subSegments: [
          { label: 'DERMATITIS', value: 'dermatitis' },
          { label: 'PSORIASIS', value: 'psoriasis' },
          { label: 'VITILIGO', value: 'vitiligo' }
        ]
      },
      {
        label: 'GROHAIR',
        value: 'grohair',
        subSegments: [
          { label: 'AGA FEMALE', value: 'aga_female' },
          { label: 'AGA MALE', value: 'aga_male' },
          { label: 'ATE', value: 'ate' },
          { label: 'CTE', value: 'cte' },
          { label: 'OTHERS', value: 'others' }
        ]
      },
      {
        label: 'GROHAIR- HAIR BOOSTER',
        value: 'grohair_hair_booster',
        subSegments: [
          { label: 'AGA FEMALE', value: 'aga_female' },
          { label: 'AGA MALE', value: 'aga_male' },
          { label: 'ATE', value: 'ate' },
          { label: 'CTE', value: 'cte' }
        ]
      },
      {
        label: 'HAIR BOOSTER',
        value: 'hair_booster',
        subSegments: [
          { label: 'AGA FEMALE', value: 'aga_female' },
          { label: 'AGA MALE', value: 'aga_male' },
          { label: 'ATE', value: 'ate' },
          { label: 'CTE', value: 'cte' }
        ]
      },
      {
        label: 'HVT',
        value: 'hvt',
        subSegments: [
          { label: 'OTHERS', value: 'others' }
        ]
      },
      {
        label: 'LASER',
        value: 'laser',
        subSegments: [
          { label: 'HAIR REMOVAL', value: 'hair_removal' },
          { label: 'PCOD', value: 'pcod' }
        ]
      },
      {
        label: 'LASER ARMS',
        value: 'laser_arms',
        subSegments: []
      },
      {
        label: 'LASER CHIN UPPER',
        value: 'laser_chin_upper',
        subSegments: []
      },
      {
        label: 'LASER FULL BODY',
        value: 'laser_full_body',
        subSegments: []
      },
      {
        label: 'LASER LEGS',
        value: 'laser_legs',
        subSegments: []
      },
      {
        label: 'LASER LOWER FACE',
        value: 'laser_lower_face',
        subSegments: []
      },
      {
        label: 'LASER-MEDIUM PARTS',
        value: 'laser_medium_parts',
        subSegments: []
      },
      {
        label: 'LASER-SMALL PARTS',
        value: 'laser_small_parts',
        subSegments: []
      },
      {
        label: 'LASER-WHOLE BODY',
        value: 'laser_whole_body',
        subSegments: []
      },
      {
        label: 'MFIT ANXIETY',
        value: 'mfit_anxiety',
        subSegments: [
          { label: 'OTHERS', value: 'others' }
        ]
      },
      {
        label: 'MFIT DEPRESSION',
        value: 'mfit_depression',
        subSegments: [
          { label: 'OTHERS', value: 'others' }
        ]
      },
      {
        label: 'MFIT STRESS',
        value: 'mfit_stress',
        subSegments: [
          { label: 'OTHERS', value: 'others' }
        ]
      },
      {
        label: 'MFIT STUDENT EXAM STRESS',
        value: 'mfit_student_exam_stress',
        subSegments: []
      },
      {
        label: 'NEW HAIR',
        value: 'new_hair',
        subSegments: [
          { label: 'AGA FEMALE', value: 'aga_female' },
          { label: 'AGA MALE', value: 'aga_male' },
          { label: 'ATE', value: 'ate' },
          { label: 'CTE', value: 'cte' }
        ]
      },
      {
        label: 'NEW HAIR- HAIR BOOSTER',
        value: 'new_hair_hair_booster',
        subSegments: [
          { label: 'AGA FEMALE', value: 'aga_female' },
          { label: 'AGA MALE', value: 'aga_male' },
          { label: 'ATE', value: 'ate' },
          { label: 'CTE', value: 'cte' }
        ]
      },
      {
        label: 'QUIKHAIR',
        value: 'quikhair',
        subSegments: [
          { label: 'OTHERS', value: 'others' }
        ]
      },
      {
        label: 'SKIN',
        value: 'skin_aesthetics',
        subSegments: [
          { label: 'OTHERS', value: 'others' }
        ]
      },
      {
        label: 'SKIN BRIGHTENING',
        value: 'skin_brightening',
        subSegments: [
          { label: 'HYPERPIGMENTATION', value: 'hyperpigmentation' },
          { label: 'MELASMA', value: 'melasma' },
          { label: 'SUN TANNING', value: 'sun_tanning' }
        ]
      },
      {
        label: 'SKIN CLEARING',
        value: 'skin_clearing',
        subSegments: [
          { label: 'ACNE', value: 'acne' }
        ]
      },
      {
        label: 'SKIN REJUVENATION',
        value: 'skin_rejuvenation',
        subSegments: [
          { label: 'UNEVEN SKIN TONE', value: 'uneven_skin_tone' }
        ]
      },
      {
        label: 'SKIN TIGHTENING',
        value: 'skin_tightening',
        subSegments: [
          { label: 'PREMATURE AGEING', value: 'premature_ageing' }
        ]
      },
      {
        label: 'STM CELL- HAIR BOOSTER',
        value: 'stm_cell_hair_booster',
        subSegments: [
          { label: 'AGA FEMALE', value: 'aga_female' },
          { label: 'AGA MALE', value: 'aga_male' },
          { label: 'ATE', value: 'ate' },
          { label: 'CTE', value: 'cte' }
        ]
      },
      {
        label: 'STMCELL',
        value: 'stmcell',
        subSegments: [
          { label: 'AGA FEMALE', value: 'aga_female' },
          { label: 'AGA MALE', value: 'aga_male' },
          { label: 'ATE', value: 'ate' },
          { label: 'CTE', value: 'cte' },
          { label: 'OTHERS', value: 'others' }
        ]
      },
      {
        label: 'XOGEN',
        value: 'xogen',
        subSegments: [
          { label: 'OTHERS', value: 'others' }
        ]
      },
      {
        label: 'XOGEN ADVANCE',
        value: 'xogen_advance',
        subSegments: []
      }
    ]
  }
];

// Export the data structure
export default serviceOptions;
