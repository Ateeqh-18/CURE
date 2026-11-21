import { PrescriptionData } from './types';

export const DEMO_PRESCRIPTIONS: Record<string, PrescriptionData> = {
  cardio_diabetic: {
    id: 'demo-rx-001',
    isDemo: true,
    sourceLanguage: 'English',
    patientDetails: {
      name: 'Ramesh Kumar',
      age: 58,
      gender: 'Male',
      uhid: 'MH-BLR-2026-98124',
      date: '2026-11-15',
      doctorName: 'Dr. Anand Rao, MD (Endocrinology)',
      hospitalName: 'Manipal Hospital, Bengaluru',
      allergies: ['Sulfa drugs (mild skin rash)'],
      existingMedications: ['Vitamin D3 60,000 IU once weekly']
    },
    diagnosis: [
      'Type 2 Diabetes Mellitus (Uncontrolled)',
      'Essential Hypertension (Grade 1)',
      'Dyslipidemia (Elevated LDL)'
    ],
    diagnosisSimplified: 'You have high blood sugar (Type 2 Diabetes), high blood pressure (Hypertension), and elevated cholesterol levels. These conditions require daily medicines, diet moderation, and periodic blood sugar monitoring to protect your heart, blood vessels, and kidneys.',
    symptoms: ['Increased thirst', 'Frequent urination at night', 'Mild fatigue', 'Occasional morning headache'],
    medicines: [
      {
        id: 'med-1',
        name: 'Metformin',
        brandName: 'Glycomet 500 SR',
        strength: '500 mg',
        dosage: '1 tablet',
        frequency: '1-0-1 (Twice daily)',
        route: 'Oral',
        duration: '30 days (Ongoing chronic therapy)',
        foodInstruction: 'After food',
        timeSlots: ['morning', 'night'],
        timeRecommendations: '08:30 AM (after breakfast), 08:30 PM (after dinner)',
        purposeSimple: 'Controls blood glucose levels by helping your body utilize insulin better and decreasing excess sugar release by the liver.',
        sideEffects: ['Mild stomach upset', 'Metallic taste', 'Loose stools in the first week'],
        precautions: [
          'Always take right after meals to avoid nausea or stomach discomfort.',
          'Do not consume alcohol while on this medication.',
          'Stay well-hydrated throughout the day.'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'med-2',
        name: 'Glimepiride',
        brandName: 'Amaryl 1mg',
        strength: '1 mg',
        dosage: '1 tablet',
        frequency: '1-0-0 (Once daily)',
        route: 'Oral',
        duration: '30 days',
        foodInstruction: 'Before food',
        timeSlots: ['morning'],
        timeRecommendations: '08:00 AM (15-30 mins before breakfast)',
        purposeSimple: 'Assists your pancreas in releasing natural insulin to reduce morning blood glucose spikes.',
        sideEffects: ['Low blood sugar (hypoglycemia)', 'Sweating or shaking if a meal is missed', 'Mild dizziness'],
        precautions: [
          'Always eat breakfast shortly after taking this tablet; never skip meals.',
          'Carry glucose tablets or hard candies in your pocket in case of sudden shakiness or sweating.',
          'Note: You have a reported Sulfa allergy; verify tolerance with your doctor.'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'med-3',
        name: 'Telmisartan',
        brandName: 'Telma 40',
        strength: '40 mg',
        dosage: '1 tablet',
        frequency: '1-0-0 (Once daily)',
        route: 'Oral',
        duration: '30 days',
        foodInstruction: 'After food',
        timeSlots: ['morning'],
        timeRecommendations: '09:00 AM (after morning meal)',
        purposeSimple: 'Relaxes tight blood vessels to normalize high blood pressure and protect your kidneys.',
        sideEffects: ['Mild dizziness on standing quickly', 'Slight fatigue'],
        precautions: [
          'Stand up slowly from bed or a chair to avoid feeling faint or dizzy.',
          'Take at the same fixed hour every morning.',
          'Do not use salt substitutes containing potassium without physician approval.'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'med-4',
        name: 'Atorvastatin',
        brandName: 'Atorva 20',
        strength: '20 mg',
        dosage: '1 tablet',
        frequency: '0-0-0-1 (Once at bedtime)',
        route: 'Oral',
        duration: '30 days',
        foodInstruction: 'At bedtime',
        timeSlots: ['night'],
        timeRecommendations: '10:00 PM (just before sleeping)',
        purposeSimple: 'Lowers LDL ("bad") cholesterol and triglycerides, reducing long-term heart disease risks.',
        sideEffects: ['Mild muscular ache', 'Headache', 'Indigestion'],
        precautions: [
          'Take at bedtime because your liver produces most cholesterol while you sleep.',
          'Report any unusual or severe muscle weakness or unexplained soreness.',
          'Avoid consuming large quantities of grapefruit juice.'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'med-5',
        name: 'Pantoprazole',
        brandName: 'Pan 40',
        strength: '40 mg',
        dosage: '1 tablet',
        frequency: '1-0-0 (Once daily)',
        route: 'Oral',
        duration: '14 days',
        foodInstruction: 'Empty stomach',
        timeSlots: ['morning'],
        timeRecommendations: '07:30 AM (at least 30-45 minutes before breakfast)',
        purposeSimple: 'Calms excess stomach acid and prevents gastric irritation from other medications.',
        sideEffects: ['Mild headache', 'Gas / bloating'],
        precautions: [
          'Swallow whole with a full glass of plain water. Do not chew or crush.',
          'Must be taken on an empty stomach at least 30 minutes before any food or tea.'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&auto=format&fit=crop&q=60'
      }
    ],
    investigations: [
      {
        id: 'inv-1',
        name: 'Fasting Blood Sugar (FBS) & Post-Prandial (PPBS)',
        purpose: 'To verify if Metformin and Glimepiride dosages are effectively controlling daily sugar spikes.',
        instructions: 'Overnight fasting of 8-10 hours for FBS; PPBS exactly 2 hours after breakfast.',
        dueDate: '2026-11-28',
        completed: false
      },
      {
        id: 'inv-2',
        name: 'HbA1c (Glycated Hemoglobin)',
        purpose: 'Measures your average 3-month blood sugar control.',
        instructions: 'No fasting required. Can be done anytime of the day.',
        dueDate: '2026-12-10',
        completed: false
      },
      {
        id: 'inv-3',
        name: 'Lipid Profile & Serum Creatinine',
        purpose: 'Monitors response to Atorvastatin and checks kidney filtration function.',
        instructions: '10-12 hours fasting required before blood collection.',
        dueDate: '2026-12-10',
        completed: false
      }
    ],
    followUp: {
      doctorName: 'Dr. Anand Rao',
      department: 'Department of Endocrinology & Diabetes',
      appointmentDate: '2026-12-15',
      instructions: 'Bring your home blood glucose monitoring log (fasting and post-meal records) and fresh HbA1c lab report.',
      isCompleted: false
    },
    generalPrecautions: [
      'Limit refined carbohydrates, white rice, sugar, and sweets.',
      'Engage in 30 minutes of brisk walking 5 days a week.',
      'Check feet daily for any minor cuts, blisters, or redness.',
      'Keep your blood pressure cuff readings logged twice a week.'
    ],
    dietaryAdvice: [
      'Increase green leafy vegetables, cucumber, and high-fiber millets (ragi, jowar).',
      'Use less than 1 teaspoon (5 grams) of salt per day.',
      'Drink 2.5 to 3 liters of water unless medically restricted.'
    ],
    extractionConfidence: 98,
    uncertainFields: [],
    createdAt: '2026-11-18T10:00:00.000Z'
  },

  bronchitis_allergy_risk: {
    id: 'demo-rx-002',
    isDemo: true,
    sourceLanguage: 'English',
    patientDetails: {
      name: 'Priya Sharma',
      age: 34,
      gender: 'Female',
      uhid: 'AP-MUM-2026-44219',
      date: '2026-11-17',
      doctorName: 'Dr. Sunita Kulkarni, MD (Chest Medicine)',
      hospitalName: 'Apollo Clinic, Bandra, Mumbai',
      allergies: ['Penicillin (Severe hives, facial swelling)'],
      existingMedications: ['Ecosprin 75mg (Aspirin) daily for cardiac prophylaxis']
    },
    diagnosis: [
      'Acute Bacterial Bronchitis',
      'High Grade Pyrexia (Fever)',
      'Severe Allergic Rhinitis'
    ],
    diagnosisSimplified: 'You have an acute bacterial infection of the airways (bronchitis) causing cough and fever, accompanied by allergic sinus congestion.',
    symptoms: ['Productive cough with yellow phlegm', 'Fever of 102°F', 'Chest tightness', 'Runny nose and sneezing'],
    medicines: [
      {
        id: 'med-201',
        name: 'Amoxicillin + Clavulanic Acid',
        brandName: 'Augmentin 625 Duo',
        strength: '625 mg',
        dosage: '1 tablet',
        frequency: '1-0-1 (Twice daily)',
        route: 'Oral',
        duration: '5 days',
        foodInstruction: 'After food',
        timeSlots: ['morning', 'night'],
        timeRecommendations: '08:00 AM, 08:00 PM',
        purposeSimple: 'Broad-spectrum antibiotic to treat the bacterial chest and bronchial infection.',
        sideEffects: ['Loose stools', 'Nausea', 'Mild stomach cramps'],
        precautions: [
          'CRITICAL: You have a Penicillin allergy on file. Augmentin is a penicillin-group antibiotic and could trigger an allergic reaction. Confirm safe alternative with doctor!',
          'Must be taken with food to prevent severe nausea.'
        ],
        isUncertain: true,
        uncertainReason: 'Direct conflict with patient penicillin allergy recorded in file.',
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'med-202',
        name: 'Paracetamol',
        brandName: 'Dolo 650',
        strength: '650 mg',
        dosage: '1 tablet',
        frequency: '1-1-1 (Thrice daily as needed)',
        route: 'Oral',
        duration: '3 days for fever',
        foodInstruction: 'After food',
        timeSlots: ['morning', 'afternoon', 'night'],
        timeRecommendations: '08:30 AM, 02:00 PM, 08:30 PM',
        purposeSimple: 'Reduces high fever and relieves body aches and headache.',
        sideEffects: ['Generally very well tolerated at standard doses.'],
        precautions: [
          'Do not take more than 4 tablets in 24 hours.',
          'Maintain at least 6 hours gap between two doses.'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'med-203',
        name: 'Montelukast + Levocetirizine',
        brandName: 'Montair LC',
        strength: '10mg / 5mg',
        dosage: '1 tablet',
        frequency: '0-0-0-1 (Once daily at night)',
        route: 'Oral',
        duration: '7 days',
        foodInstruction: 'At bedtime',
        timeSlots: ['night'],
        timeRecommendations: '09:30 PM',
        purposeSimple: 'Opens airways, calms allergic cough, and stops nighttime sneezing and nasal discharge.',
        sideEffects: ['Mild drowsiness', 'Dry mouth', 'Fatigue'],
        precautions: [
          'Take at bedtime as it can cause sleepiness.',
          'Avoid driving or heavy machinery if you feel drowsy.'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=60'
      }
    ],
    investigations: [
      {
        id: 'inv-201',
        name: 'Complete Blood Count (CBC) with Differential',
        purpose: 'Evaluates white blood cell count (infection marker).',
        dueDate: '2026-11-19',
        completed: false
      },
      {
        id: 'inv-202',
        name: 'Chest X-Ray (PA View)',
        purpose: 'Rules out focal pneumonia or lung consolidation.',
        dueDate: '2026-11-19',
        completed: false
      }
    ],
    followUp: {
      doctorName: 'Dr. Sunita Kulkarni',
      department: 'Pulmonology / Chest Clinic',
      appointmentDate: '2026-11-22',
      instructions: 'Return in 5 days for chest re-examination. Come immediately if shortness of breath or high fever persists.',
      isCompleted: false
    },
    generalPrecautions: [
      'Inhale warm saline steam twice daily.',
      'Drink warm water or herbal ginger/tulsi tea frequently.',
      'Wear a surgical mask when near family members.'
    ],
    dietaryAdvice: [
      'Avoid cold drinks, ice cream, and chilled foods.',
      'Consume warm soups and light khichdi.'
    ],
    extractionConfidence: 94,
    uncertainFields: ['Antibiotic suitability given penicillin allergy'],
    createdAt: '2026-11-18T10:00:00.000Z'
  },

  ortho_duplicate_nsaid: {
    id: 'demo-rx-003',
    isDemo: true,
    sourceLanguage: 'English',
    patientDetails: {
      name: 'Harpreet Singh',
      age: 62,
      gender: 'Male',
      uhid: 'FT-DEL-2026-38291',
      date: '2026-11-16',
      doctorName: 'Dr. Vikramjeet Roy, MS (Ortho)',
      hospitalName: 'Fortis Healthcare, Vasant Kunj, New Delhi',
      allergies: [], // Unknown status - triggers vigilance warning
      existingMedications: ['Amlodipine 5mg OD for blood pressure']
    },
    diagnosis: [
      'Severe Osteoarthritis Right Knee (Grade 3)',
      'Subacute Joint Inflammation & Morning Stiffness'
    ],
    diagnosisSimplified: 'You have wear-and-tear arthritis in your right knee with painful swelling and joint stiffness, especially during walking and stairs.',
    symptoms: ['Right knee swelling', 'Inability to squat', 'Severe morning knee stiffness'],
    medicines: [
      {
        id: 'med-301',
        name: 'Paracetamol',
        brandName: 'Dolo 650',
        strength: '650 mg',
        dosage: '1 tablet',
        frequency: '1-0-1 (Twice daily)',
        route: 'Oral',
        duration: '7 days',
        foodInstruction: 'After food',
        timeSlots: ['morning', 'night'],
        timeRecommendations: '09:00 AM, 09:00 PM',
        purposeSimple: 'Basal joint pain relief and fever control.',
        sideEffects: ['Mild nausea'],
        precautions: ['Do not double dose with other paracetamol syrups.'],
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'med-302',
        name: 'Ibuprofen + Paracetamol',
        brandName: 'Combiflam',
        strength: '400mg + 325mg',
        dosage: '1 tablet',
        frequency: '1-0-1 (Twice daily)',
        route: 'Oral',
        duration: '5 days',
        foodInstruction: 'After food',
        timeSlots: ['morning', 'night'],
        timeRecommendations: '09:00 AM, 09:00 PM',
        purposeSimple: 'Reduces joint swelling, cartilage inflammation, and acute knee pain.',
        sideEffects: ['Heartburn', 'Acidity', 'Stomach irritation'],
        precautions: [
          'WARNING: Combiflam contains 325mg Paracetamol. Taking it with Dolo 650 duplicates paracetamol and risks liver overload!',
          'Always take with food or milk to safeguard stomach lining.'
        ],
        isUncertain: true,
        uncertainReason: 'Duplicate active ingredient (Paracetamol) combined with Dolo 650.',
        imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'med-303',
        name: 'Pantoprazole',
        brandName: 'Pan 40',
        strength: '40 mg',
        dosage: '1 tablet',
        frequency: '1-0-0 (Once daily)',
        route: 'Oral',
        duration: '7 days',
        foodInstruction: 'Empty stomach',
        timeSlots: ['morning'],
        timeRecommendations: '08:00 AM (30 min before breakfast)',
        purposeSimple: 'Protects stomach wall from acid erosion while taking pain relievers.',
        sideEffects: ['Mild headache'],
        precautions: ['Take 30 minutes before first morning meal.'],
        imageUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'med-304',
        name: 'Calcium + Vitamin D3',
        brandName: 'Shelcal 500',
        strength: '500 mg + 250 IU',
        dosage: '1 tablet',
        frequency: '0-1-0 (Once daily after lunch)',
        route: 'Oral',
        duration: '60 days',
        foodInstruction: 'After food',
        timeSlots: ['afternoon'],
        timeRecommendations: '01:30 PM (after lunch)',
        purposeSimple: 'Strengthens bone mineral density around the knee joint.',
        sideEffects: ['Mild constipation'],
        precautions: ['Drink plenty of water. Space 2 hours apart from thyroid medicines if any.'],
        imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=60'
      }
    ],
    investigations: [
      {
        id: 'inv-301',
        name: 'X-Ray Both Knees (Standing AP & Lateral View)',
        purpose: 'Quantify joint space narrowing and bone spur formation.',
        dueDate: '2026-11-20',
        completed: false
      },
      {
        id: 'inv-302',
        name: 'Serum Uric Acid & ESR',
        purpose: 'Rule out gouty arthritis and systemic inflammatory markers.',
        dueDate: '2026-11-20',
        completed: false
      }
    ],
    followUp: {
      doctorName: 'Dr. Vikramjeet Roy',
      department: 'Department of Orthopedic Surgery',
      appointmentDate: '2026-12-02',
      instructions: 'Review with fresh standing X-rays. Discuss knee brace and physiotherapy regimen.',
      isCompleted: false
    },
    generalPrecautions: [
      'Avoid floor sitting, cross-legged posture, and deep squatting.',
      'Use a knee cap or hinge brace while walking outdoors.',
      'Apply ice pack to right knee for 15 minutes twice daily after walking.'
    ],
    dietaryAdvice: [
      'Maintain healthy body weight to decrease mechanical load on knee cartilage.',
      'Include anti-inflammatory foods like turmeric and ginger in meals.'
    ],
    extractionConfidence: 96,
    uncertainFields: ['Duplicate paracetamol between Combiflam and Dolo 650'],
    createdAt: '2026-11-18T10:00:00.000Z'
  }
};
