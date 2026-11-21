import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const BASE_URL = 'http://localhost:3000';
const ROOT = process.cwd();
const EVIDENCE_DIR = path.join(ROOT, 'evidence');
const SHOTS_DIR = path.join(EVIDENCE_DIR, 'screenshots');
const PDF_PREV_DEST = path.join(SHOTS_DIR, 'pdf-previews');
const PDF_DEST = path.join(EVIDENCE_DIR, 'generated-pdfs');
const REPORTS_DEST = path.join(EVIDENCE_DIR, 'test-reports');
const FIXTURES_DEST = path.join(EVIDENCE_DIR, 'ocr-fixtures');

for (const d of [SHOTS_DIR, PDF_PREV_DEST, PDF_DEST, REPORTS_DEST, FIXTURES_DEST]) {
  fs.mkdirSync(d, { recursive: true });
}

function findBrowser() {
  const candidates = [
    process.env.CHROMIUM_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ].filter(Boolean);
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error('No Chrome/Edge browser found.');
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function clickButtonByText(page, textMatch) {
  const clicked = await page.evaluate((needle) => {
    const btns = Array.from(document.querySelectorAll('button'));
    const match = btns.find((b) => (b.innerText || '').toLowerCase().includes(needle.toLowerCase()));
    if (match) {
      match.click();
      return true;
    }
    return false;
  }, textMatch);
  if (!clicked) {
    throw new Error(`Button containing "${textMatch}" not found on page.`);
  }
  await delay(600);
}

async function selectLanguage(page, langCode) {
  await page.select('select[aria-label="Select preferred language"]', langCode);
  // Wait for /api/translate to finish and loading notice to disappear
  await delay(1400);
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: findBrowser(),
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1024'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1024, deviceScaleFactor: 1.5 });

    // 1. Main Application Dashboard (English)
    console.log('1. Capturing Main Dashboard...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await delay(800);
    await page.screenshot({
      path: path.join(SHOTS_DIR, '01_dashboard_english.png'),
      fullPage: true,
    });

    // 2. Prescription Upload Screen
    console.log('2. Capturing Prescription Upload Screen...');
    await clickButtonByText(page, 'Upload Rx');
    await delay(500);
    await page.screenshot({
      path: path.join(SHOTS_DIR, '02_prescription_upload.png'),
      fullPage: true,
    });

    // 3. Upload REAL printed prescription fixture & run LIVE OCR + Extraction
    console.log('3. Uploading 01_clear_printed.png & running live OCR...');
    const fileInput = await page.$('input[type="file"]');
    await fileInput.uploadFile(path.join(ROOT, 'tests', 'ocr-fixtures', '01_clear_printed.png'));
    await delay(400);
    await clickButtonByText(page, 'Process Prescription');

    // Wait for Review & Edit screen to appear after live /api/ocr + /api/extract
    await page.waitForFunction(
      () => document.body.innerText.includes('Original OCR Transcription') || document.body.innerText.includes('Arvind Joshi'),
      { timeout: 30000 }
    );
    await delay(800);

    // Open the Original OCR Transcription <details> so the user can see BOTH raw OCR text & extracted fields!
    await page.evaluate(() => {
      const det = document.querySelector('details');
      if (det) det.open = true;
    });
    await delay(400);
    await page.screenshot({
      path: path.join(SHOTS_DIR, '03_after_ocr_extraction_review.png'),
      fullPage: true,
    });

    // Also click Save & Update Guide and show extracted prescription on Dashboard
    await clickButtonByText(page, 'Save & Update Guide');
    await delay(600);
    await clickButtonByText(page, 'Dashboard');
    await delay(600);
    await page.screenshot({
      path: path.join(SHOTS_DIR, '04_after_ocr_dashboard.png'),
      fullPage: true,
    });

    // 4. Load Demo Case 2 (Penicillin Allergy Risk) -> Safety Dashboard + Editable Review Screen
    console.log('4. Capturing Safety Dashboard with Critical Allergy Alert...');
    await clickButtonByText(page, 'Sample Cases');
    await delay(500);
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('h3'));
      const bronc = cards.find((c) => c.innerText.includes('Acute Bronchitis'));
      if (bronc) bronc.click();
    });
    await delay(800);
    await clickButtonByText(page, 'Safety Checks');
    await delay(700);
    await page.screenshot({
      path: path.join(SHOTS_DIR, '05_safety_dashboard_alerts.png'),
      fullPage: true,
    });

    console.log('5. Capturing Editable Review Screen (Case 2 w/ Allergy & Uncertainty)...');
    await clickButtonByText(page, 'Review & Edit');
    await delay(600);
    await page.screenshot({
      path: path.join(SHOTS_DIR, '06_editable_review_screen.png'),
      fullPage: true,
    });

    // 5. Load Demo Case 1 (Cardio-Diabetic) -> Medication Planner (Taken/Missed) + Investigations
    console.log('6. Capturing Medication Planner with Taken & Missed Doses...');
    await clickButtonByText(page, 'Sample Cases');
    await delay(500);
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('h3'));
      const cardio = cards.find((c) => c.innerText.includes('Cardio-Diabetic'));
      if (cardio) cardio.click();
    });
    await delay(800);
    await clickButtonByText(page, 'Daily Schedule');
    await delay(600);

    // Click Mark Taken on first 2 doses and Missed on 3rd dose
    await page.evaluate(() => {
      const takenBtns = Array.from(document.querySelectorAll('button')).filter((b) =>
        b.innerText.trim().includes('Mark Taken')
      );
      if (takenBtns[0]) takenBtns[0].click();
    });
    await delay(300);
    await page.evaluate(() => {
      const takenBtns = Array.from(document.querySelectorAll('button')).filter((b) =>
        b.innerText.trim().includes('Mark Taken')
      );
      if (takenBtns[0]) takenBtns[0].click();
    });
    await delay(300);
    await page.evaluate(() => {
      const missedBtns = Array.from(document.querySelectorAll('button')).filter((b) =>
        b.innerText.trim() === 'Missed'
      );
      if (missedBtns[0]) missedBtns[0].click();
    });
    await delay(600);
    await page.screenshot({
      path: path.join(SHOTS_DIR, '07_medication_planner_taken_missed.png'),
      fullPage: true,
    });

    // 6. Investigation & Follow-Up Tracker (mark 1 lab test completed!)
    console.log('7. Capturing Investigation & Follow-up Tracker...');
    await clickButtonByText(page, 'Tests & Follow-up');
    await delay(600);
    await page.evaluate(() => {
      const cb = document.querySelector('input[type="checkbox"]');
      if (cb) cb.click();
    });
    await delay(500);
    await page.screenshot({
      path: path.join(SHOTS_DIR, '08_investigation_followup_tracker.png'),
      fullPage: true,
    });

    // 7. Treatment Guide in Kannada
    console.log('8. Capturing Treatment Guide in Kannada...');
    await clickButtonByText(page, 'Treatment Guide');
    await delay(500);
    await selectLanguage(page, 'kn');
    await delay(1000);
    await page.screenshot({
      path: path.join(SHOTS_DIR, '09_treatment_guide_kannada.png'),
      fullPage: true,
    });

    // 8. Treatment Guide in Hindi
    console.log('9. Capturing Treatment Guide in Hindi...');
    await selectLanguage(page, 'hi');
    await delay(1000);
    await page.screenshot({
      path: path.join(SHOTS_DIR, '10_treatment_guide_hindi.png'),
      fullPage: true,
    });

    // 9. Urdu with full RTL Layout (Dashboard + Medicines)
    console.log('10. Capturing Application in Urdu with RTL Layout...');
    await selectLanguage(page, 'ur');
    await delay(1200);
    // Switch to Dashboard tab (Urdu label: ڈیش بورڈ)
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const dash = btns.find((b) => (b.innerText || '').includes('ڈیش بورڈ'));
      if (dash) dash.click();
    });
    await delay(800);
    await page.screenshot({
      path: path.join(SHOTS_DIR, '11_urdu_rtl_layout.png'),
      fullPage: true,
    });

    // 10. OCR Diagnostics Page with LIVE 3-page hybrid PDF run!
    console.log('11. Capturing Live OCR Diagnostics Page (3-page Hybrid PDF)...');
    await page.goto(`${BASE_URL}/ocr-diagnostics`, { waitUntil: 'networkidle0' });
    await delay(600);
    const diagInput = await page.$('input[type="file"]');
    await diagInput.uploadFile(path.join(ROOT, 'tests', 'ocr-fixtures', '04_multipage_discharge.pdf'));
    await delay(400);
    await clickButtonByText(page, 'Run OCR Diagnostics');

    await page.waitForFunction(
      () => document.body.innerText.includes('hybrid_pdf_ocr') && document.body.innerText.includes('Structured Clinical Extraction Output'),
      { timeout: 45000 }
    );
    await delay(900);
    await page.screenshot({
      path: path.join(SHOTS_DIR, '12_ocr_diagnostics_live.png'),
      fullPage: true,
    });

    // 11. Copy all generated artifacts into evidence/
    console.log('12. Copying generated PDFs, previews, test reports, and OCR fixtures into evidence/...');

    // Copy all 12 PDFs
    for (const f of fs.readdirSync(path.join(ROOT, 'tests', 'pdf-outputs'))) {
      fs.copyFileSync(path.join(ROOT, 'tests', 'pdf-outputs', f), path.join(PDF_DEST, f));
    }

    // Copy all 12 PDF visual previews + highlight top 3 inside screenshots/
    for (const f of fs.readdirSync(path.join(ROOT, 'tests', 'pdf-previews'))) {
      fs.copyFileSync(path.join(ROOT, 'tests', 'pdf-previews', f), path.join(PDF_PREV_DEST, f));
    }
    fs.copyFileSync(
      path.join(ROOT, 'tests', 'pdf-previews', 'kn_page1.png'),
      path.join(SHOTS_DIR, '13_rendered_pdf_kannada.png')
    );
    fs.copyFileSync(
      path.join(ROOT, 'tests', 'pdf-previews', 'ur_page1.png'),
      path.join(SHOTS_DIR, '14_rendered_pdf_urdu_rtl.png')
    );
    fs.copyFileSync(
      path.join(ROOT, 'tests', 'pdf-previews', 'hi_page1.png'),
      path.join(SHOTS_DIR, '15_rendered_pdf_hindi.png')
    );

    // Copy test reports
    fs.copyFileSync(
      path.join(ROOT, 'tests', 'ocr-test-report.json'),
      path.join(REPORTS_DEST, 'ocr-test-report.json')
    );
    fs.copyFileSync(
      path.join(ROOT, 'tests', 'pdf-test-report.json'),
      path.join(REPORTS_DEST, 'pdf-test-report.json')
    );

    // Copy all OCR fixtures & expected texts
    for (const f of fs.readdirSync(path.join(ROOT, 'tests', 'ocr-fixtures'))) {
      fs.copyFileSync(path.join(ROOT, 'tests', 'ocr-fixtures', f), path.join(FIXTURES_DEST, f));
    }

    console.log('All live screenshots & evidence files assembled in:', EVIDENCE_DIR);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Evidence capture failed:', err);
  process.exit(1);
});
