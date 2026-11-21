/**
 * Generates all 10 synthetic prescription/discharge test fixtures for Cure's
 * Cloud (Gemini Vision) + Local (Ollama Qwen2.5-VL) multimodal AI test suite.
 *
 * Uses strictly synthetic patient data (zero real PHI).
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import puppeteer from 'puppeteer-core';

const OUT_DIR = path.resolve(process.cwd(), 'tests', 'ai-fixtures');
fs.mkdirSync(OUT_DIR, { recursive: true });

function findBrowserExecutable() {
  const candidates = [
    process.env.CHROMIUM_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ].filter(Boolean);
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error('Could not find local Chrome/Edge executable to render synthetic fixtures.');
}

async function renderHtmlToPng(browser, html, outPath, width = 960, height = 1280) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.screenshot({ path: outPath, fullPage: true });
  await page.close();
}

async function renderHtmlToPdf(browser, html, outPath) {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.pdf({
    path: outPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '14mm', right: '14mm', bottom: '14mm', left: '14mm' },
  });
  await page.close();
}

const BASE_CSS = `
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; background: #ffffff; margin: 0; padding: 36px; line-height: 1.5; }
  .card { border: 2px solid #cbd5e1; border-radius: 12px; padding: 28px 32px; background: #fff; }
  .header { border-bottom: 2px solid #0f766e; padding-bottom: 12px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-start; }
  .clinic { font-size: 22px; font-weight: 800; color: #0f766e; }
  .doc { font-size: 13px; color: #334155; }
  .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: #f8fafc; padding: 12px 16px; border-radius: 8px; font-size: 14px; margin-bottom: 18px; border: 1px solid #e2e8f0; }
  .rx-symbol { font-size: 30px; font-weight: 800; color: #0f766e; margin: 12px 0 8px; font-family: Georgia, serif; }
  .med-list { font-size: 15px; }
  .med-item { margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px dashed #cbd5e1; }
  .handwriting { font-family: 'Segoe Script', 'Comic Sans MS', 'Bradley Hand', cursive; color: #1e3a8a; font-size: 18px; letter-spacing: 0.3px; transform: rotate(-0.6deg); }
  .smudged { filter: blur(1.4px); opacity: 0.72; letter-spacing: 2px; font-style: italic; }
  .footer { margin-top: 22px; padding-top: 12px; border-top: 1px solid #cbd5e1; font-size: 13px; color: #334155; }
`;

async function main() {
  const executablePath = findBrowserExecutable();
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    // 1. Clear printed prescription
    await renderHtmlToPng(
      browser,
      `<html><head><style>${BASE_CSS}</style></head><body><div class="card">
        <div class="header">
          <div><div class="clinic">Bengaluru City Heart &amp; Medical Clinic</div><div class="doc">Dr. Ananya Rao, MD (Internal Medicine) • Reg: KMC-78412</div></div>
          <div class="doc"><strong>Date:</strong> 18 Nov 2026<br/><strong>UHID:</strong> SYN-1001</div>
        </div>
        <div class="meta">
          <div><strong>Patient Name:</strong> Arjun Mehta</div>
          <div><strong>Age / Sex:</strong> 52 Years / Male</div>
          <div><strong>Diagnosis:</strong> Type 2 Diabetes Mellitus, Essential Hypertension</div>
          <div><strong>Allergies:</strong> No Known Drug Allergies (NKDA)</div>
        </div>
        <div class="rx-symbol">Rx</div>
        <div class="med-list">
          <div class="med-item"><strong>1. Tab. Metformin 500 mg</strong> (Glycomet)<br/>1 tablet • 1-0-1 (Twice daily) • After food • For 30 days</div>
          <div class="med-item"><strong>2. Tab. Telmisartan 40 mg</strong> (Telma 40)<br/>1 tablet • 1-0-0 (Once daily morning) • Before breakfast • For 30 days</div>
        </div>
        <div class="footer">
          <strong>Investigations:</strong> HbA1c, Fasting Blood Sugar (fasting 10 hours)<br/>
          <strong>Follow-up:</strong> Review after 4 weeks with lab reports.<br/>
          <strong>Advice:</strong> Low salt, low sugar diet; daily 30 min brisk walk.
        </div>
      </div></body></html>`,
      path.join(OUT_DIR, '01_clear_printed.png')
    );

    // 2. Handwritten prescription with readable medicine names
    await renderHtmlToPng(
      browser,
      `<html><head><style>${BASE_CSS}</style></head><body><div class="card" style="background:#fffef8;">
        <div class="header">
          <div><div class="clinic">Namma Family Clinic, Mysuru</div><div class="doc">Dr. Prakash Kulkarni, MBBS</div></div>
          <div class="doc">Date: 17-11-2026</div>
        </div>
        <div class="meta">
          <div><strong>Patient:</strong> Kavitha Nair</div>
          <div><strong>Age/Gender:</strong> 34 Y / Female</div>
          <div><strong>Complaints:</strong> Fever, throat pain x 2 days</div>
          <div><strong>Allergies:</strong> Penicillin</div>
        </div>
        <div class="rx-symbol">Rx</div>
        <div class="handwriting">
          <div class="med-item">1) Tab. Azithromycin 500mg — 1 tab OD (1-0-0) After food x 3 days</div>
          <div class="med-item">2) Tab. Paracetamol 650mg (Dolo 650) — 1 tab TDS (1-1-1) After food x 3 days</div>
          <div class="med-item">3) Tab. Pantoprazole 40mg — 1 tab OD Empty stomach x 5 days</div>
          <div style="margin-top:16px;">Advice: Warm saline gargles. Drink plenty of warm water.</div>
          <div>Review after 5 days if fever persists.</div>
        </div>
      </div></body></html>`,
      path.join(OUT_DIR, '02_handwritten_readable.png')
    );

    // 3. Handwritten prescription with one ambiguous medicine
    await renderHtmlToPng(
      browser,
      `<html><head><style>${BASE_CSS}</style></head><body><div class="card" style="background:#fffef5;">
        <div class="header">
          <div><div class="clinic">Shree Sai Outpatient Clinic</div><div class="doc">Dr. R. Deshmukh, MBBS</div></div>
          <div class="doc">Date: 16/11/2026</div>
        </div>
        <div class="meta">
          <div><strong>Patient:</strong> Suresh Patil</div>
          <div><strong>Age/Sex:</strong> 46 / M</div>
          <div><strong>Diagnosis:</strong> Acute Upper Respiratory Tract Infection</div>
        </div>
        <div class="rx-symbol">Rx</div>
        <div class="handwriting">
          <div class="med-item">1) Tab. Cetirizine 10mg — 0-0-1 At bedtime x 5 days</div>
          <div class="med-item">2) Tab. <span class="smudged">Cl~~x~n? 500</span> — 1-0-1 After food x 5 days</div>
          <div class="med-item">3) Tab. Paracetamol 500mg — 1-1-1 After food x 3 days</div>
        </div>
      </div></body></html>`,
      path.join(OUT_DIR, '03_handwritten_ambiguous.png')
    );

    // 4. Multi-medication prescription (5 medicines including duplicate paracetamol)
    await renderHtmlToPng(
      browser,
      `<html><head><style>${BASE_CSS}</style></head><body><div class="card">
        <div class="header">
          <div><div class="clinic">South India Multispecialty Care</div><div class="doc">Dr. Meenakshi Iyer, MD</div></div>
          <div class="doc">Date: 18 Nov 2026 • UHID: SYN-4004</div>
        </div>
        <div class="meta">
          <div><strong>Patient:</strong> Venkatraman S.</div>
          <div><strong>Age / Sex:</strong> 61 Y / Male</div>
          <div><strong>Diagnosis:</strong> Osteoarthritis Knee, Dyslipidemia, Acid Peptic Disease</div>
          <div><strong>Allergies:</strong> Sulfa drugs</div>
        </div>
        <div class="rx-symbol">Rx</div>
        <div class="med-list">
          <div class="med-item"><strong>1. Tab. Atorvastatin 20 mg</strong> — 1 tab • 0-0-1 (At bedtime) • After dinner • 30 days</div>
          <div class="med-item"><strong>2. Tab. Aspirin 75 mg</strong> (Ecosprin 75) — 1 tab • 0-1-0 (Once daily) • After lunch • 30 days</div>
          <div class="med-item"><strong>3. Tab. Ibuprofen 400 mg + Paracetamol 325 mg</strong> (Combiflam) — 1 tab • 1-0-1 • After food • 5 days</div>
          <div class="med-item"><strong>4. Tab. Paracetamol 650 mg</strong> (Dolo 650) — 1 tab • 1-1-1 • After food • 5 days</div>
          <div class="med-item"><strong>5. Cap. Pantoprazole 40 mg</strong> (Pan 40) — 1 cap • 1-0-0 • Empty stomach • 15 days</div>
        </div>
      </div></body></html>`,
      path.join(OUT_DIR, '04_multi_medication.png')
    );

    // 5. Blurry prescription (generated clear then Gaussian blurred via sharp)
    const clearForBlur = path.join(OUT_DIR, '_tmp_clear_blur.png');
    await renderHtmlToPng(
      browser,
      `<html><head><style>${BASE_CSS}</style></head><body><div class="card">
        <div class="header">
          <div><div class="clinic">Greenfield Health Centre</div><div class="doc">Dr. Naveen Bhat</div></div>
          <div class="doc">Date: 15-11-2026</div>
        </div>
        <div class="meta">
          <div><strong>Patient:</strong> Priya Sharma</div>
          <div><strong>Age/Sex:</strong> 29 / Female</div>
        </div>
        <div class="rx-symbol">Rx</div>
        <div class="med-list">
          <div class="med-item"><strong>1. Tab. Levothyroxine 50 mcg</strong> (Thyronorm 50) — 1-0-0 Empty stomach x 30 days</div>
          <div class="med-item"><strong>2. Tab. Calcium Carbonate 500 mg</strong> (Shelcal 500) — 0-1-0 After lunch x 30 days</div>
        </div>
      </div></body></html>`,
      clearForBlur
    );
    await sharp(clearForBlur)
      .blur(2.4)
      .modulate({ brightness: 0.96, saturation: 0.7 })
      .png()
      .toFile(path.join(OUT_DIR, '05_blurry_prescription.png'));
    fs.unlinkSync(clearForBlur);

    // 6. Rotated prescription (90 degrees clockwise)
    await sharp(path.join(OUT_DIR, '01_clear_printed.png'))
      .rotate(90)
      .png()
      .toFile(path.join(OUT_DIR, '06_rotated_90deg.png'));

    // 7. 3-page hospital discharge summary PDF
    await renderHtmlToPdf(
      browser,
      `<html><head><style>
        ${BASE_CSS}
        .page { page-break-after: always; }
        .page:last-child { page-break-after: auto; }
        h2 { color: #0f766e; border-bottom: 1.5px solid #0f766e; padding-bottom: 6px; }
      </style></head><body>
        <div class="page">
          <h2>PAGE 1 — HOSPITAL DISCHARGE SUMMARY (ADMISSION &amp; DIAGNOSIS)</h2>
          <p><strong>Hospital:</strong> Sahyadri Tertiary Care Hospital, Bengaluru</p>
          <p><strong>Patient:</strong> Rajeshwari Devi • <strong>Age/Sex:</strong> 58 Years / Female • <strong>UHID:</strong> SYN-DS-301</p>
          <p><strong>Consultant:</strong> Dr. Siddharth Menon, MD (Cardiology)</p>
          <p><strong>Admission Date:</strong> 12 Nov 2026 • <strong>Discharge Date:</strong> 16 Nov 2026</p>
          <p><strong>Final Diagnosis:</strong> Acute Coronary Syndrome (NSTEMI — Stabilized), Type 2 Diabetes Mellitus, Hypertension</p>
          <p><strong>Known Allergies:</strong> Penicillin (skin rash)</p>
          <p><strong>Hospital Course:</strong> Patient presented with exertional chest discomfort. ECG and Troponin-I elevated. Stabilized medically with antiplatelets, statin, and glycemic control. Hemodynamically stable at discharge.</p>
        </div>
        <div class="page">
          <h2>PAGE 2 — DISCHARGE MEDICATIONS</h2>
          <div class="med-list">
            <div class="med-item"><strong>1. Tab. Aspirin 75 mg</strong> (Ecosprin 75) — 1 tablet • 0-1-0 (Once daily) • After lunch • Ongoing (30 days)</div>
            <div class="med-item"><strong>2. Tab. Clopidogrel 75 mg</strong> (Clopilet 75) — 1 tablet • 0-1-0 (Once daily) • After lunch • For 30 days</div>
            <div class="med-item"><strong>3. Tab. Atorvastatin 40 mg</strong> (Atorva 40) — 1 tablet • 0-0-1 (At bedtime) • After dinner • For 30 days</div>
            <div class="med-item"><strong>4. Tab. Metformin 500 mg</strong> — 1 tablet • 1-0-1 (Twice daily) • After food • For 30 days</div>
            <div class="med-item"><strong>5. Tab. Pantoprazole 40 mg</strong> — 1 tablet • 1-0-0 (Once daily morning) • Empty stomach • For 15 days</div>
          </div>
        </div>
        <div class="page">
          <h2>PAGE 3 — INVESTIGATIONS, FOLLOW-UP &amp; RED-FLAG PRECAUTIONS</h2>
          <p><strong>Investigations Advised Before Review:</strong></p>
          <ul>
            <li>Fasting Lipid Profile — due in 4 weeks (12 hours fasting)</li>
            <li>HbA1c &amp; Fasting Blood Glucose — due in 4 weeks</li>
            <li>Serum Creatinine &amp; Electrolytes — due in 2 weeks</li>
          </ul>
          <p><strong>Follow-up Appointment:</strong> Dr. Siddharth Menon (Cardiology OPD) on 30 Nov 2026 with lab reports.</p>
          <p><strong>Dietary Advice:</strong> Strict low-sodium, low-oil, diabetic diet. Avoid smoking and alcohol.</p>
          <p><strong>Emergency Precautions:</strong> Report to Emergency immediately if chest pain, sweating, dizziness, or severe shortness of breath recurs.</p>
        </div>
      </body></html>`,
      path.join(OUT_DIR, '07_three_page_discharge_summary.pdf')
    );

    // 8. Mixed printed header + handwritten Rx body
    await renderHtmlToPng(
      browser,
      `<html><head><style>${BASE_CSS}</style></head><body><div class="card">
        <div class="header">
          <div><div class="clinic">Kaveri Diagnostic &amp; Polyclinic</div><div class="doc">Dr. Deepak Joshi, MD (General Medicine) • Reg: MCI-55210</div></div>
          <div class="doc">Date: 18 Nov 2026 • OP No: KDP-881</div>
        </div>
        <div class="meta">
          <div><strong>Patient Name:</strong> Mohammed Irfan</div>
          <div><strong>Age / Gender:</strong> 41 Years / Male</div>
          <div><strong>Diagnosis (Printed):</strong> Community Acquired Pneumonia (Mild)</div>
          <div><strong>Allergies:</strong> None documented</div>
        </div>
        <div class="rx-symbol">Rx</div>
        <div class="handwriting">
          <div class="med-item">1. Tab. Amoxicillin + Clavulanic Acid 625mg (Augmentin 625) — 1-0-1 After food x 5 days</div>
          <div class="med-item">2. Tab. Paracetamol 650mg — 1 tab SOS for fever (max 3/day)</div>
          <div class="med-item">3. Syp. Ambroxol 10ml — 1-0-1 After food x 5 days</div>
        </div>
        <div class="footer"><strong>Investigations:</strong> Chest X-Ray PA view, Complete Blood Count (CBC) • <strong>Review:</strong> After 5 days</div>
      </div></body></html>`,
      path.join(OUT_DIR, '08_mixed_printed_handwritten.png')
    );

    // 9. Typed prescription text
    const typedText = `CLINIC: Metro Care Outpatient Center, Pune
DOCTOR: Dr. Sneha Deshpande, MD (Medicine)
DATE: 18 Nov 2026
PATIENT: Lakshmi Narayanan
AGE/GENDER: 64 Years / Male
DIAGNOSIS: Essential Hypertension, Type 2 Diabetes Mellitus
ALLERGIES: Penicillin
EXISTING MEDICATIONS: Ecosprin 75mg OD

Rx:
1. Tab. Amlodipine 5mg (Amlong 5) — 1 tablet, 1-0-0 (Once daily morning), After breakfast, for 30 days
2. Tab. Metformin 500mg (Glycomet 500) — 1 tablet, 1-0-1 (Twice daily), After food, for 30 days
3. Cap. Vitamin D3 60000 IU — 1 capsule once weekly on Sundays after lunch for 8 weeks

INVESTIGATIONS:
- HbA1c (before next visit)
- Serum Creatinine & eGFR

FOLLOW-UP:
Review on 18 Dec 2026 with blood pressure log and lab reports.
PRECAUTIONS: Monitor blood pressure twice weekly; do not skip morning BP medicine.`;
    fs.writeFileSync(path.join(OUT_DIR, '09_typed_prescription.txt'), typedText, 'utf8');

    // 10. Prescription with deliberately missing dosage/strength/duration info
    await renderHtmlToPng(
      browser,
      `<html><head><style>${BASE_CSS}</style></head><body><div class="card">
        <div class="header">
          <div><div class="clinic">Sunrise Neighborhood Clinic</div><div class="doc">Dr. A. Verma, MBBS</div></div>
          <div class="doc">Date: 18 Nov 2026</div>
        </div>
        <div class="meta">
          <div><strong>Patient:</strong> Rohan Kulkarni</div>
          <div><strong>Age / Sex:</strong> 38 / Male</div>
          <div><strong>Diagnosis:</strong> Acute Gastritis &amp; Body Ache</div>
        </div>
        <div class="rx-symbol">Rx</div>
        <div class="med-list">
          <div class="med-item"><strong>1. Tab. Pantoprazole</strong> — Before breakfast (strength, dosage &amp; duration not written)</div>
          <div class="med-item"><strong>2. Tab. Ibuprofen 400 mg</strong> — Take when pain occurs (frequency &amp; duration not written)</div>
          <div class="med-item"><strong>3. Tab. Domperidone 10 mg</strong> — 1-0-1 (food instruction &amp; duration omitted)</div>
        </div>
      </div></body></html>`,
      path.join(OUT_DIR, '10_missing_dosage.png')
    );

    const manifest = [
      { id: 'case-01', name: 'Clear printed prescription', file: '01_clear_printed.png', kind: 'image', expectedMedicines: ['Metformin', 'Telmisartan'], expectedAllergyStatus: 'none_documented' },
      { id: 'case-02', name: 'Handwritten prescription (readable)', file: '02_handwritten_readable.png', kind: 'image', expectedMedicines: ['Azithromycin', 'Paracetamol', 'Pantoprazole'], expectedAllergies: ['Penicillin'] },
      { id: 'case-03', name: 'Handwritten prescription (ambiguous medicine)', file: '03_handwritten_ambiguous.png', kind: 'image', expectedMedicines: ['Cetirizine', 'Paracetamol'], expectUncertain: true },
      { id: 'case-04', name: 'Multi-medication prescription (5 meds)', file: '04_multi_medication.png', kind: 'image', expectedMedicines: ['Atorvastatin', 'Aspirin', 'Ibuprofen', 'Paracetamol', 'Pantoprazole'], expectDuplicateParacetamol: true },
      { id: 'case-05', name: 'Blurry prescription', file: '05_blurry_prescription.png', kind: 'image', expectedMedicines: ['Levothyroxine', 'Calcium'] },
      { id: 'case-06', name: 'Rotated 90-degree prescription', file: '06_rotated_90deg.png', kind: 'image', expectedMedicines: ['Metformin', 'Telmisartan'] },
      { id: 'case-07', name: '3-page hospital discharge summary PDF', file: '07_three_page_discharge_summary.pdf', kind: 'pdf', expectedPages: 3, expectedMedicines: ['Aspirin', 'Clopidogrel', 'Atorvastatin', 'Metformin', 'Pantoprazole'] },
      { id: 'case-08', name: 'Mixed printed + handwritten document', file: '08_mixed_printed_handwritten.png', kind: 'image', expectedMedicines: ['Amoxicillin', 'Paracetamol', 'Ambroxol'] },
      { id: 'case-09', name: 'Typed prescription text', file: '09_typed_prescription.txt', kind: 'text', expectedMedicines: ['Amlodipine', 'Metformin', 'Vitamin D3'], expectedAllergies: ['Penicillin'] },
      { id: 'case-10', name: 'Prescription with missing dosage details', file: '10_missing_dosage.png', kind: 'image', expectedMedicines: ['Pantoprazole', 'Ibuprofen', 'Domperidone'], expectMissingDosageAlerts: true },
    ];

    fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
    console.log(`Generated all 10 synthetic AI fixtures in ${OUT_DIR}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Fixture generation failed:', err);
  process.exit(1);
});
