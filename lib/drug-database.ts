export interface DrugInfo {
  genericName: string;
  brandNames: string[];
  aliases: string[];
  drugClass: string;
  category: 'antibiotic' | 'antidiabetic' | 'cardiovascular' | 'analgesic' | 'gastrointestinal' | 'respiratory' | 'other';
  standardMaxDailyDoseMg: number;
  foodInstructions: 'Before food' | 'After food' | 'With food' | 'Empty stomach' | 'At bedtime' | 'As directed';
  primaryPurpose: string;
  commonSideEffects: string[];
  precautions: string[];
  allergyGroup?: 'penicillin' | 'sulfa' | 'nsaid' | 'macrolide' | 'quinolone';
  activeIngredients: string[];
}

export interface DrugInteractionRule {
  drugA: string; // generic or class
  drugB: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  title: string;
  description: string;
  recommendation: string;
}

export const DRUG_DATABASE: Record<string, DrugInfo> = {
  metformin: {
    genericName: 'Metformin',
    brandNames: ['Glycomet', 'Obimet', 'Riomet', 'Formin', 'Glucophage'],
    aliases: ['metformin hcl', 'metformin hydrochloride'],
    drugClass: 'Biguanide Antidiabetic',
    category: 'antidiabetic',
    standardMaxDailyDoseMg: 2550,
    foodInstructions: 'After food',
    primaryPurpose: 'Lowers blood glucose levels by decreasing liver sugar production and improving insulin sensitivity.',
    commonSideEffects: ['Mild nausea', 'Stomach upset', 'Metallic taste in mouth', 'Diarrhea initially'],
    precautions: [
      'Take with or immediately after meals to reduce stomach upset.',
      'Report any persistent severe nausea, fatigue, or muscle cramps (rare lactic acidosis sign).',
      'Inform doctor before any CT scans requiring iodine contrast dye.'
    ],
    activeIngredients: ['metformin']
  },
  glimepiride: {
    genericName: 'Glimepiride',
    brandNames: ['Amaryl', 'Glimy', 'Zoryl', 'Glimestar'],
    aliases: ['glimepiride'],
    drugClass: 'Sulfonylurea Antidiabetic',
    category: 'antidiabetic',
    standardMaxDailyDoseMg: 8,
    foodInstructions: 'Before food',
    primaryPurpose: 'Stimulates the pancreas to release more insulin to control blood sugar levels.',
    commonSideEffects: ['Hypoglycemia (low blood sugar)', 'Mild dizziness', 'Weight gain', 'Headache'],
    precautions: [
      'Take with breakfast or the first main meal of the day.',
      'Always keep fast-acting glucose sweets or fruit juice nearby for sudden low sugar episodes.',
      'Do not skip meals after taking this medicine.'
    ],
    allergyGroup: 'sulfa',
    activeIngredients: ['glimepiride']
  },
  telmisartan: {
    genericName: 'Telmisartan',
    brandNames: ['Telma', 'Telpres', 'Cresar', 'Telsartan', 'Micardis'],
    aliases: ['telmisartan'],
    drugClass: 'Angiotensin Receptor Blocker (ARB)',
    category: 'cardiovascular',
    standardMaxDailyDoseMg: 80,
    foodInstructions: 'As directed',
    primaryPurpose: 'Relaxes blood vessels to lower high blood pressure and protect kidney and heart health.',
    commonSideEffects: ['Mild dizziness when standing up', 'Fatigue', 'Sinus congestion', 'Back pain'],
    precautions: [
      'Take at the same time each day (morning or night).',
      'Stand up slowly from sitting or lying down to prevent lightheadedness.',
      'Avoid high-potassium salt substitutes unless advised by doctor.'
    ],
    activeIngredients: ['telmisartan']
  },
  amlodipine: {
    genericName: 'Amlodipine',
    brandNames: ['Stamlo', 'Amlong', 'Amlopres', 'Norvasc'],
    aliases: ['amlodipine besylate'],
    drugClass: 'Calcium Channel Blocker',
    category: 'cardiovascular',
    standardMaxDailyDoseMg: 10,
    foodInstructions: 'As directed',
    primaryPurpose: 'Relaxes arterial muscles to improve blood flow and lower elevated blood pressure.',
    commonSideEffects: ['Ankle swelling (peripheral edema)', 'Flushing', 'Headache', 'Dizziness'],
    precautions: [
      'Elevate feet while resting if mild ankle swelling occurs.',
      'Do not stop taking abruptly even if blood pressure readings improve.'
    ],
    activeIngredients: ['amlodipine']
  },
  atorvastatin: {
    genericName: 'Atorvastatin',
    brandNames: ['Atorva', 'Lipitor', 'Storvas', 'Tonact', 'Atocor'],
    aliases: ['atorvastatin calcium'],
    drugClass: 'HMG-CoA Reductase Inhibitor (Statin)',
    category: 'cardiovascular',
    standardMaxDailyDoseMg: 80,
    foodInstructions: 'At bedtime',
    primaryPurpose: 'Reduces LDL (bad cholesterol) and triglycerides while raising HDL (good cholesterol) to prevent heart attacks.',
    commonSideEffects: ['Mild muscle aches', 'Joint stiffness', 'Mild digestive upset'],
    precautions: [
      'Usually taken at night or bedtime as the liver synthesizes cholesterol overnight.',
      'Promptly report unexplained severe muscle soreness, tenderness, or weakness.',
      'Avoid drinking large quantities of grapefruit juice.'
    ],
    activeIngredients: ['atorvastatin']
  },
  ecosprin: {
    genericName: 'Aspirin',
    brandNames: ['Ecosprin', 'Disprin', 'Loprin', 'Delisprin'],
    aliases: ['acetylsalicylic acid', 'aspirin', 'ecosprin 75', 'ecosprin 150'],
    drugClass: 'Antiplatelet Agent / Salicylate',
    category: 'cardiovascular',
    standardMaxDailyDoseMg: 325,
    foodInstructions: 'After food',
    primaryPurpose: 'Prevents blood clots from forming in coronary arteries, lowering heart attack and stroke risks.',
    commonSideEffects: ['Mild stomach irritation', 'Easy bruising', 'Prolonged bleeding from minor cuts'],
    precautions: [
      'Always swallow after food or with a glass of water; never on an empty stomach.',
      'Do not take alongside other pain relievers (like Ibuprofen or Diclofenac) without doctor approval.',
      'Inform dentist or surgeon that you take low-dose aspirin before any procedure.'
    ],
    allergyGroup: 'nsaid',
    activeIngredients: ['aspirin']
  },
  clopidogrel: {
    genericName: 'Clopidogrel',
    brandNames: ['Deplatt', 'Clopilet', 'Plavix', 'Ceruvit'],
    aliases: ['clopidogrel bisulfate'],
    drugClass: 'P2Y12 Antiplatelet Agent',
    category: 'cardiovascular',
    standardMaxDailyDoseMg: 75,
    foodInstructions: 'As directed',
    primaryPurpose: 'Prevents platelets from clumping together to stop dangerous blood clots after stents or cardiovascular events.',
    commonSideEffects: ['Easy bleeding', 'Bruising', 'Minor nosebleeds'],
    precautions: [
      'Take regularly at the prescribed time without missing doses.',
      'Do not take with Omeprazole without doctor consultation, as it may reduce clopidogrel efficacy.'
    ],
    activeIngredients: ['clopidogrel']
  },
  paracetamol: {
    genericName: 'Paracetamol',
    brandNames: ['Dolo 650', 'Crocin', 'Calpol', 'Pacimol', 'P-650', 'Pyrigesic'],
    aliases: ['acetaminophen', 'paracetamol 650', 'paracetamol 500'],
    drugClass: 'Antipyretic and Analgesic',
    category: 'analgesic',
    standardMaxDailyDoseMg: 4000,
    foodInstructions: 'After food',
    primaryPurpose: 'Relieves mild to moderate pain and reduces elevated body temperature during fever.',
    commonSideEffects: ['Generally well tolerated', 'Rare nausea or mild allergic rash'],
    precautions: [
      'Never exceed 4000 mg (4 grams) in 24 hours to prevent severe liver toxicity.',
      'Leave at least 4 to 6 hours between doses.',
      'Check all other cold, flu, and cough syrups to ensure you do not double-dose paracetamol.'
    ],
    activeIngredients: ['paracetamol']
  },
  ibuprofen: {
    genericName: 'Ibuprofen',
    brandNames: ['Brufen', 'Ibugesic', 'Combiflam (partial)'],
    aliases: ['ibuprofen'],
    drugClass: 'Non-Steroidal Anti-Inflammatory Drug (NSAID)',
    category: 'analgesic',
    standardMaxDailyDoseMg: 2400,
    foodInstructions: 'After food',
    primaryPurpose: 'Reduces inflammation, joint swelling, muscular aches, and moderate pain.',
    commonSideEffects: ['Heartburn', 'Acidity', 'Stomach pain', 'Nausea'],
    precautions: [
      'Never take on an empty stomach; always take with food or milk.',
      'Caution in patients with high blood pressure, heart disease, or kidney conditions.',
      'Do not use if you have an active peptic ulcer or aspirin allergy.'
    ],
    allergyGroup: 'nsaid',
    activeIngredients: ['ibuprofen']
  },
  pantoprazole: {
    genericName: 'Pantoprazole',
    brandNames: ['Pan 40', 'Pantocid', 'Pantodac', 'Protofic'],
    aliases: ['pantoprazole sodium'],
    drugClass: 'Proton Pump Inhibitor (PPI)',
    category: 'gastrointestinal',
    standardMaxDailyDoseMg: 80,
    foodInstructions: 'Empty stomach',
    primaryPurpose: 'Reduces excess stomach acid secretion, protecting against ulcers, acidity, and medication-induced gastritis.',
    commonSideEffects: ['Mild headache', 'Flatulence', 'Mild diarrhea or constipation'],
    precautions: [
      'Best taken 30 to 60 minutes before breakfast on an empty stomach with a glass of water.',
      'Do not crush or chew enteric-coated tablets.'
    ],
    activeIngredients: ['pantoprazole']
  },
  amoxicillin: {
    genericName: 'Amoxicillin',
    brandNames: ['Augmentin (with Clavulanate)', 'Mox', 'Novamox', 'Amoxil', 'Clavam'],
    aliases: ['amoxicillin trihydrate', 'amoxicillin and potassium clavulanate'],
    drugClass: 'Penicillin-class Antibiotic',
    category: 'antibiotic',
    standardMaxDailyDoseMg: 3000,
    foodInstructions: 'After food',
    primaryPurpose: 'Eliminates susceptible bacterial infections of the respiratory tract, ear, throat, and skin.',
    commonSideEffects: ['Loose stools / diarrhea', 'Nausea', 'Mild rash', 'Stomach cramps'],
    precautions: [
      'Complete the entire prescribed duration even if you feel completely recovered earlier.',
      'Take after food to reduce gastric irritation.',
      'Stop immediately and seek emergency medical care if you develop severe hives, lip swelling, or breathing difficulty.'
    ],
    allergyGroup: 'penicillin',
    activeIngredients: ['amoxicillin']
  },
  azithromycin: {
    genericName: 'Azithromycin',
    brandNames: ['Azithral', 'Azee', 'Zady', 'Zithromax'],
    aliases: ['azithromycin dihydrate'],
    drugClass: 'Macrolide Antibiotic',
    category: 'antibiotic',
    standardMaxDailyDoseMg: 500,
    foodInstructions: 'Before food',
    primaryPurpose: 'Treats bacterial respiratory infections, sinusitis, tonsillitis, and atypical bacterial pneumonia.',
    commonSideEffects: ['Abdominal cramping', 'Diarrhea', 'Nausea', 'Temporary taste disturbance'],
    precautions: [
      'Take at least 1 hour before a meal or 2 hours after food unless instructed otherwise.',
      'Complete the short course (usually 3 to 5 days) exactly as prescribed.',
      'Consult doctor if you have a history of irregular heart rhythm (prolonged QT interval).'
    ],
    allergyGroup: 'macrolide',
    activeIngredients: ['azithromycin']
  },
  ciprofloxacin: {
    genericName: 'Ciprofloxacin',
    brandNames: ['Ciplox', 'Cifran', 'Ciprobid'],
    aliases: ['ciprofloxacin hcl'],
    drugClass: 'Fluoroquinolone Antibiotic',
    category: 'antibiotic',
    standardMaxDailyDoseMg: 1500,
    foodInstructions: 'As directed',
    primaryPurpose: 'Treats severe bacterial infections of the urinary tract, gastrointestinal tract, and abdomen.',
    commonSideEffects: ['Nausea', 'Dizziness', 'Headache', 'Sunlight sensitivity'],
    precautions: [
      'Drink plenty of fluids throughout the day.',
      'Avoid taking antacids, calcium supplements, or milk within 2 hours of this medicine.',
      'Report any tendon pain, joint swelling, or numbness immediately.'
    ],
    allergyGroup: 'quinolone',
    activeIngredients: ['ciprofloxacin']
  },
  montelukast_levocetirizine: {
    genericName: 'Montelukast + Levocetirizine',
    brandNames: ['Montair LC', 'Montek LC', 'Levocet M', 'Telekast L'],
    aliases: ['montelukast and levocetirizine'],
    drugClass: 'Antihistamine and Leukotriene Receptor Antagonist',
    category: 'respiratory',
    standardMaxDailyDoseMg: 15,
    foodInstructions: 'At bedtime',
    primaryPurpose: 'Relieves allergic rhinitis, sneezing, watery eyes, chronic cough, and bronchial allergy.',
    commonSideEffects: ['Mild drowsiness', 'Dry mouth', 'Fatigue', 'Headache'],
    precautions: [
      'Take once daily in the evening or bedtime due to mild calming/sedative effect.',
      'Avoid driving or alcohol until you know how it affects your alertness.'
    ],
    activeIngredients: ['montelukast', 'levocetirizine']
  },
  metoprolol: {
    genericName: 'Metoprolol',
    brandNames: ['Betaloc', 'Metolar', 'Met XL', 'Seloken'],
    aliases: ['metoprolol succinate', 'metoprolol tartrate'],
    drugClass: 'Beta-Blocker',
    category: 'cardiovascular',
    standardMaxDailyDoseMg: 200,
    foodInstructions: 'After food',
    primaryPurpose: 'Controls elevated blood pressure, lowers fast heart rate, and protects the heart after cardiac events.',
    commonSideEffects: ['Fatigue', 'Mild dizziness', 'Slower heart rate', 'Cold hands or feet'],
    precautions: [
      'Do not stop taking suddenly as it may worsen blood pressure or chest discomfort.',
      'Take with or immediately after meals.'
    ],
    activeIngredients: ['metoprolol']
  },
  gliclazide: {
    genericName: 'Gliclazide',
    brandNames: ['Diamicron', 'Glizid', 'Reclide'],
    aliases: ['gliclazide mr', 'gliclazide xr'],
    drugClass: 'Sulfonylurea Antidiabetic',
    category: 'antidiabetic',
    standardMaxDailyDoseMg: 320,
    foodInstructions: 'Before food',
    primaryPurpose: 'Stimulates insulin secretion from the pancreas to control blood sugar in Type 2 Diabetes.',
    commonSideEffects: ['Low blood sugar (hypoglycemia)', 'Mild dizziness', 'Indigestion'],
    precautions: [
      'Take before breakfast and do not skip meals.',
      'Keep fast-acting glucose handy for low sugar episodes.'
    ],
    allergyGroup: 'sulfa',
    activeIngredients: ['gliclazide']
  },
  rosuvastatin: {
    genericName: 'Rosuvastatin',
    brandNames: ['Rozavel', 'Rosuvas', 'Crestor', 'Turbovas'],
    aliases: ['rosuvastatin calcium'],
    drugClass: 'HMG-CoA Reductase Inhibitor (Statin)',
    category: 'cardiovascular',
    standardMaxDailyDoseMg: 40,
    foodInstructions: 'At bedtime',
    primaryPurpose: 'Reduces bad cholesterol (LDL) and triglycerides to prevent heart attacks and strokes.',
    commonSideEffects: ['Mild muscle aches', 'Headache', 'Mild abdominal discomfort'],
    precautions: [
      'Report unexplained muscle tenderness or weakness promptly.',
      'Avoid excessive alcohol consumption.'
    ],
    activeIngredients: ['rosuvastatin']
  },
  levothyroxine: {
    genericName: 'Levothyroxine',
    brandNames: ['Thyronorm', 'Eltroxin', 'Thyrox'],
    aliases: ['levothyroxine sodium', 'thyroxine'],
    drugClass: 'Thyroid Hormone Replacement',
    category: 'other',
    standardMaxDailyDoseMg: 1,
    foodInstructions: 'Empty stomach',
    primaryPurpose: 'Replaces missing thyroid hormone in hypothyroidism to restore normal metabolism and energy.',
    commonSideEffects: ['Rare palpitations or restlessness if dose is too high'],
    precautions: [
      'Take early morning on an empty stomach with plain water, 30–60 minutes before tea, coffee, or breakfast.',
      'Keep at least 4 hours gap from calcium or iron tablets.'
    ],
    activeIngredients: ['levothyroxine']
  },
  calcium_vit_d3: {
    genericName: 'Calcium + Vitamin D3',
    brandNames: ['Shelcal 500', 'Shelcal', 'Gemcal', 'Cipcal'],
    aliases: ['calcium carbonate', 'vitamin d3', 'cholecalciferol'],
    drugClass: 'Mineral & Vitamin Supplement',
    category: 'other',
    standardMaxDailyDoseMg: 2000,
    foodInstructions: 'After food',
    primaryPurpose: 'Supports bone strength, joint health, and prevents calcium or vitamin D deficiency.',
    commonSideEffects: ['Mild constipation', 'Bloating'],
    precautions: [
      'Drink plenty of water.',
      'Separate by at least 2 hours from antibiotics like Ciprofloxacin or thyroid tablets.'
    ],
    activeIngredients: ['calcium', 'vitamin d3']
  },
  combiflam: {
    genericName: 'Ibuprofen + Paracetamol',
    brandNames: ['Combiflam', 'Flexon', 'Ibugesic Plus'],
    aliases: ['ibuprofen and paracetamol'],
    drugClass: 'NSAID + Analgesic Combination',
    category: 'analgesic',
    standardMaxDailyDoseMg: 2400,
    foodInstructions: 'After food',
    primaryPurpose: 'Relieves acute pain, joint inflammation, and fever.',
    commonSideEffects: ['Acidity', 'Heartburn', 'Stomach upset'],
    precautions: [
      'Contains both Ibuprofen and Paracetamol — avoid combining with other paracetamol tablets like Dolo 650 without doctor approval.',
      'Always take after food.'
    ],
    allergyGroup: 'nsaid',
    activeIngredients: ['ibuprofen', 'paracetamol']
  },
  cefixime: {
    genericName: 'Cefixime',
    brandNames: ['Taxim-O', 'Zifi', 'Mahacef', 'Cefolac'],
    aliases: ['cefixime trihydrate'],
    drugClass: 'Third-Generation Cephalosporin Antibiotic',
    category: 'antibiotic',
    standardMaxDailyDoseMg: 400,
    foodInstructions: 'After food',
    primaryPurpose: 'Treats bacterial infections of the throat, ear, sinuses, chest, and urinary tract.',
    commonSideEffects: ['Loose stools', 'Nausea', 'Mild stomach cramping'],
    precautions: [
      'Complete the full prescribed course even if symptoms improve early.',
      'Inform your doctor if you have a severe Penicillin allergy.'
    ],
    activeIngredients: ['cefixime']
  },
  omeprazole: {
    genericName: 'Omeprazole',
    brandNames: ['Omez', 'Ocid', 'Lomac'],
    aliases: ['omeprazole magnesium'],
    drugClass: 'Proton Pump Inhibitor (PPI)',
    category: 'gastrointestinal',
    standardMaxDailyDoseMg: 80,
    foodInstructions: 'Empty stomach',
    primaryPurpose: 'Reduces excess stomach acid to relieve acidity, reflux, and stomach ulcers.',
    commonSideEffects: ['Mild headache', 'Gas', 'Mild abdominal discomfort'],
    precautions: [
      'Take 30–60 minutes before breakfast on an empty stomach.',
      'Avoid combining with Clopidogrel unless specifically cleared by a cardiologist.'
    ],
    activeIngredients: ['omeprazole']
  }
};

export const DRUG_INTERACTION_RULES: DrugInteractionRule[] = [
  {
    drugA: 'aspirin',
    drugB: 'ibuprofen',
    severity: 'critical',
    title: 'Severe Bleeding & GI Ulceration Risk',
    description: 'Combining Aspirin (Ecosprin) with Ibuprofen or other NSAIDs significantly increases the risk of severe stomach ulcers and internal gastrointestinal bleeding. Furthermore, Ibuprofen can interfere with the cardioprotective antiplatelet effect of low-dose Aspirin.',
    recommendation: 'Do not combine without direct physician supervision. If pain relief is needed, consult doctor about alternative analgesics such as Paracetamol.'
  },
  {
    drugA: 'aspirin',
    drugB: 'clopidogrel',
    severity: 'moderate',
    title: 'Dual Antiplatelet Therapy (DAPT) - Bleeding Vigilance Required',
    description: 'Dual antiplatelet therapy is often intentionally prescribed after cardiac stents or acute coronary syndrome, but increases systemic bleeding risk.',
    recommendation: 'Take exactly as prescribed. Report dark tarry stools, unusual bruising, or persistent gum bleeding. Do not add over-the-counter pain medications.'
  },
  {
    drugA: 'telmisartan',
    drugB: 'spironolactone',
    severity: 'high',
    title: 'Hyperkalemia (Elevated Blood Potassium) Risk',
    description: 'Both medications can retain potassium in the body. Concomitant use may lead to dangerously high potassium levels causing cardiac arrhythmias.',
    recommendation: 'Monitor serum potassium and renal function periodically. Avoid potassium supplements and high-potassium salt substitutes.'
  },
  {
    drugA: 'metformin',
    drugB: 'contrast_dye',
    severity: 'high',
    title: 'Contrast-Induced Nephropathy & Lactic Acidosis Risk',
    description: 'Metformin combined with radiographic iodinated contrast dye may induce acute renal impairment and lactic acidosis.',
    recommendation: 'Metformin must be temporarily withheld at the time of or prior to iodinated contrast procedures and resumed 48 hours later after kidney function re-check.'
  },
  {
    drugA: 'atorvastatin',
    drugB: 'clarithromycin',
    severity: 'high',
    title: 'Severe Myopathy / Rhabdomyolysis Risk',
    description: 'Macrolide antibiotics (Clarithromycin, Erythromycin) inhibit CYP3A4 metabolism of Atorvastatin, dramatically increasing statin blood levels and triggering severe muscle breakdown.',
    recommendation: 'Temporarily pause Atorvastatin during macrolide therapy or use an alternative antibiotic under medical guidance.'
  },
  {
    drugA: 'ciprofloxacin',
    drugB: 'antacids_calcium',
    severity: 'moderate',
    title: 'Chelation & Reduced Antibiotic Absorption',
    description: 'Calcium, magnesium, or aluminum in antacids or dairy bind to Ciprofloxacin in the stomach, rendering the antibiotic ineffective.',
    recommendation: 'Space Ciprofloxacin at least 2 hours before or 4 hours after calcium supplements, antacids, or iron.'
  },
  {
    drugA: 'clopidogrel',
    drugB: 'omeprazole',
    severity: 'moderate',
    title: 'Decreased Antiplatelet Efficacy',
    description: 'Omeprazole inhibits CYP2C19, preventing Clopidogrel from being converted into its active antiplatelet form, increasing clot recurrence risk.',
    recommendation: 'Consider Pantoprazole instead, which has significantly less CYP2C19 inhibition.'
  }
];

export const ALLERGY_CROSS_REACTIVITY: Record<string, { genericMembers: string[]; warningText: string }> = {
  penicillin: {
    genericMembers: ['amoxicillin', 'ampicillin', 'augmentin', 'penicillin', 'piperacillin', 'clavam', 'mox'],
    warningText: 'Patient has a documented Penicillin allergy. This medicine contains Amoxicillin/Penicillin derivatives, which may trigger severe anaphylactic allergic reactions.'
  },
  sulfa: {
    genericMembers: ['sulfamethoxazole', 'bactrim', 'septran', 'glimepiride', 'gliclazide', 'sulfasalazine'],
    warningText: 'Patient has a documented Sulfa drug allergy. This medicine is a sulfonamide derivative and may cause allergic rash or hypersensitivity.'
  },
  nsaid: {
    genericMembers: ['aspirin', 'ecosprin', 'ibuprofen', 'brufen', 'diclofenac', 'voveran', 'aceclofenac', 'hifenac', 'mefenamic', 'meftal'],
    warningText: 'Patient has a documented NSAID or Aspirin allergy. This medicine is in the NSAID family and may induce severe bronchospasm, urticaria, or anaphylaxis.'
  }
};
