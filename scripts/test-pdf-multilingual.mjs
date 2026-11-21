import fs from 'fs';
import path from 'path';
import * as mupdf from 'mupdf';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const PDF_OUT_DIR = path.join(process.cwd(), 'tests', 'pdf-outputs');
const PREVIEW_OUT_DIR = path.join(process.cwd(), 'tests', 'pdf-previews');
fs.mkdirSync(PDF_OUT_DIR, { recursive: true });
fs.mkdirSync(PREVIEW_OUT_DIR, { recursive: true });

// Sample clinical prescription (matches Demo Case 1)
const SAMPLE_RX = {
  id: 'demo-rx-001',
  isDemo: true,
  patientDetails: {
    name: 'Ramesh Kumar',
    age: 58,
    gender: 'Male',
    uhid: 'MH-BLR-2026-98124',
    date: '2026-11-15',
    doctorName: 'Dr. Anand Rao, MD (Endocrinology)',
    hospitalName: 'Manipal Hospital, Bengaluru',
    allergies: ['Sulfa drugs (mild skin rash)'],
    existingMedications: ['Vitamin D3 60,000 IU once weekly'],
  },
  diagnosis: [
    'Type 2 Diabetes Mellitus (Uncontrolled)',
    'Essential Hypertension (Grade 1)',
    'Dyslipidemia (Elevated LDL)',
  ],
  diagnosisSimplified:
    'You have high blood sugar (Type 2 Diabetes), high blood pressure (Hypertension), and elevated cholesterol levels.',
  symptoms: ['Increased thirst', 'Frequent urination at night', 'Mild fatigue'],
  medicines: [
    {
      id: 'med-1',
      name: 'Metformin',
      brandName: 'Glycomet 500 SR',
      strength: '500 mg',
      dosage: '1 tablet',
      frequency: '1-0-1 (Twice daily)',
      route: 'Oral',
      duration: '30 days',
      foodInstruction: 'After food',
      timeSlots: ['morning', 'night'],
      purposeSimple: 'Controls blood glucose levels.',
      sideEffects: ['Mild stomach upset', 'Metallic taste'],
      precautions: ['Take right after meals.'],
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
      purposeSimple: 'Assists your pancreas in releasing insulin.',
      sideEffects: ['Low blood sugar'],
      precautions: ['Never skip breakfast after taking.'],
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
      purposeSimple: 'Lowers high blood pressure.',
      sideEffects: ['Mild dizziness'],
      precautions: ['Stand up slowly from bed.'],
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
      purposeSimple: 'Lowers LDL cholesterol.',
      sideEffects: ['Mild muscle ache'],
      precautions: ['Take at bedtime.'],
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
      purposeSimple: 'Reduces excess stomach acid.',
      sideEffects: ['Mild headache'],
      precautions: ['Take 30 minutes before breakfast.'],
    },
  ],
  investigations: [
    {
      id: 'inv-1',
      name: 'Fasting Blood Sugar (FBS) & PPBS',
      purpose: 'Verify blood sugar control.',
      instructions: '8-10 hours overnight fasting.',
      dueDate: '2026-11-28',
      completed: false,
    },
    {
      id: 'inv-2',
      name: 'HbA1c',
      purpose: '3-month blood sugar average.',
      instructions: 'No fasting required.',
      dueDate: '2026-12-10',
      completed: false,
    },
  ],
  followUp: {
    doctorName: 'Dr. Anand Rao',
    department: 'Endocrinology & Diabetes',
    appointmentDate: '2026-12-15',
    instructions: 'Bring blood glucose log and fresh HbA1c report.',
    isCompleted: false,
  },
  generalPrecautions: ['Walk 30 minutes daily.', 'Monitor blood pressure weekly.'],
  dietaryAdvice: ['Limit refined sugar.', 'Use less than 5g salt per day.'],
  extractionConfidence: 98,
  uncertainFields: [],
  createdAt: '2026-11-18T10:00:00.000Z',
};

const LANGUAGES = [
  { code: 'en', name: 'English', scriptRegex: /[A-Za-z]{5,}/ },
  { code: 'kn', name: 'Kannada', scriptRegex: /[\u0C80-\u0CFF]{3,}/ },
  { code: 'hi', name: 'Hindi', scriptRegex: /[\u0900-\u097F]{3,}/ },
  { code: 'ta', name: 'Tamil', scriptRegex: /[\u0B80-\u0BFF]{3,}/ },
  { code: 'te', name: 'Telugu', scriptRegex: /[\u0C00-\u0C7F]{3,}/ },
  { code: 'ml', name: 'Malayalam', scriptRegex: /[\u0D00-\u0D7F]{3,}/ },
  { code: 'mr', name: 'Marathi', scriptRegex: /[\u0900-\u097F]{3,}/ },
  { code: 'bn', name: 'Bengali', scriptRegex: /[\u0980-\u09FF]{3,}/ },
  { code: 'gu', name: 'Gujarati', scriptRegex: /[\u0A80-\u0AFF]{3,}/ },
  { code: 'pa', name: 'Punjabi', scriptRegex: /[\u0A00-\u0A7F]{3,}/ },
  { code: 'or', name: 'Odia', scriptRegex: /[\u0B00-\u0B7F]{3,}/ },
  { code: 'ur', name: 'Urdu', scriptRegex: /[\u0600-\u06FF]{3,}/ },
];

async function main() {
  console.log('\n=== RUNNING 12-LANGUAGE TRANSLATION & PDF EXPORT E2E TESTS ===\n');

  // Step 1: Compute safety alerts from live /api/safety
  const safetyRes = await fetch(`${BASE_URL}/api/safety`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      medicines: SAMPLE_RX.medicines,
      patientDetails: SAMPLE_RX.patientDetails,
    }),
  });
  const safetyJson = await safetyRes.json();
  const baseAlerts = safetyJson.alerts || [];
  console.log(`Base safety alerts fetched: ${baseAlerts.length}`);

  const results = [];

  for (const lang of LANGUAGES) {
    // 1. Translate bundle via /api/translate
    const trRes = await fetch(`${BASE_URL}/api/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prescription: SAMPLE_RX,
        alerts: baseAlerts,
        targetLanguage: lang.code,
      }),
    });
    const trJson = await trRes.json();

    // 2. Generate actual PDF via /api/pdf
    const pdfRes = await fetch(`${BASE_URL}/api/pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prescription: trJson.prescription || SAMPLE_RX,
        alerts: trJson.alerts || baseAlerts,
        language: lang.code,
      }),
    });

    if (!pdfRes.ok) {
      const errText = await pdfRes.text();
      results.push({
        language: `${lang.name} (${lang.code})`,
        status: 'FAIL',
        error: `HTTP ${pdfRes.status}: ${errText}`,
      });
      console.log(`  [FAIL] ${lang.name}: HTTP ${pdfRes.status}`);
      continue;
    }

    const pdfBuf = Buffer.from(await pdfRes.arrayBuffer());
    const outFile = path.join(PDF_OUT_DIR, `Cure_Treatment_Report_${lang.name}.pdf`);
    fs.writeFileSync(outFile, pdfBuf);

    // 3. Inspect PDF using mupdf: page count, text extraction, script check, dosage preservation, PNG render
    const doc = mupdf.Document.openDocument(pdfBuf, 'application/pdf');
    const pageCount = doc.countPages();
    let fullText = '';
    for (let i = 0; i < pageCount; i++) {
      const page = doc.loadPage(i);
      fullText += '\n' + page.toStructuredText().asText();
      if (i === 0) {
        const pix = page.toPixmap(mupdf.Matrix.scale(1.6, 1.6), mupdf.ColorSpace.DeviceRGB, false, true);
        fs.writeFileSync(path.join(PREVIEW_OUT_DIR, `${lang.code}_page1.png`), Buffer.from(pix.asPNG()));
      }
    }

    const hasTargetScript = lang.scriptRegex.test(fullText);
    const hasPreservedDosages =
      fullText.includes('500 mg') &&
      fullText.includes('40 mg') &&
      fullText.includes('20 mg') &&
      fullText.includes('1 mg');
    const hasCureBrand = fullText.includes('Cure');
    const hasPatientName = fullText.includes('Ramesh Kumar');

    const passed =
      pdfBuf.length > 5000 &&
      pageCount >= 1 &&
      hasTargetScript &&
      hasPreservedDosages &&
      hasCureBrand &&
      hasPatientName;

    const row = {
      language: `${lang.name} (${lang.code})`,
      file: `Cure_Treatment_Report_${lang.name}.pdf`,
      bytes: pdfBuf.length,
      pages: pageCount,
      translationProvider: trJson.meta?.provider || 'unknown',
      targetScriptPresent: hasTargetScript,
      dosagesPreserved: hasPreservedDosages,
      cureBrandingPresent: hasCureBrand,
      status: passed ? 'PASS' : 'FAIL',
    };
    results.push(row);
    console.log(
      `  [${row.status}] ${lang.name.padEnd(10)} | ${(row.bytes / 1024).toFixed(1)} KB | ${row.pages} pages | script=${hasTargetScript} | dosages=${hasPreservedDosages}`
    );
  }

  const reportPath = path.join(process.cwd(), 'tests', 'pdf-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2));
  console.log('\nSaved full 12-language PDF test report to:', reportPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
