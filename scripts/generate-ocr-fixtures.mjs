import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import puppeteer from 'puppeteer-core';

const OUT_DIR = path.join(process.cwd(), 'tests', 'ocr-fixtures');
fs.mkdirSync(OUT_DIR, { recursive: true });

function findBrowser() {
  const paths = [
    process.env.CHROMIUM_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ].filter(Boolean);
  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error('No local Chrome/Edge executable found to render test fixtures.');
}

async function renderHtmlToPng(browser, html, width = 1100, height = 1400) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'load' });
  const buf = await page.screenshot({ type: 'png', fullPage: true });
  await page.close();
  return Buffer.from(buf);
}

function wrapRxHtml(bodyHtml, styleExtra = '') {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  body {
    font-family: 'Nirmala UI', 'Segoe UI', Arial, sans-serif;
    background: #ffffff;
    color: #0f172a;
    margin: 0;
    padding: 48px 56px;
    font-size: 20px;
    line-height: 1.65;
  }
  .header {
    border-bottom: 3px solid #0f766e;
    padding-bottom: 16px;
    margin-bottom: 24px;
  }
  .hospital { font-size: 28px; font-weight: 800; color: #0f172a; }
  .doctor { font-size: 20px; font-weight: 600; color: #334155; }
  .rx-symbol { font-size: 32px; font-weight: 900; margin: 18px 0 10px 0; }
  .section { margin-top: 20px; }
  .label { font-weight: 700; }
  ${styleExtra}
</style>
</head>
<body>${bodyHtml}</body>
</html>`;
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: findBrowser(),
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    // ---------------------------------------------------------
    // TEST 1: Clear printed prescription
    // ---------------------------------------------------------
    const text1 = `St. Martha Healthcare Clinic, Bengaluru
Dr. Rajesh Menon, MD (Internal Medicine)
Date: 2026-11-10
Patient Name: Arvind Joshi
Age: 49 / Male
UHID: SMH-2026-11402
Diagnosis: Type 2 Diabetes Mellitus, Essential Hypertension
Allergies: None

Rx:
1. Tab. Metformin 500 mg - 1 tablet 1-0-1 after food for 30 days
2. Tab. Telmisartan 40 mg - 1 tablet 1-0-0 after food for 30 days
3. Tab. Pantoprazole 40 mg - 1 tablet 1-0-0 empty stomach for 14 days

Follow-up: 2026-12-10 with Fasting Blood Sugar report.`;

    const png1 = await renderHtmlToPng(
      browser,
      wrapRxHtml(`
        <div class="header">
          <div class="hospital">St. Martha Healthcare Clinic, Bengaluru</div>
          <div class="doctor">Dr. Rajesh Menon, MD (Internal Medicine)</div>
        </div>
        <div>Date: 2026-11-10</div>
        <div>Patient Name: Arvind Joshi</div>
        <div>Age: 49 / Male</div>
        <div>UHID: SMH-2026-11402</div>
        <div class="section">Diagnosis: Type 2 Diabetes Mellitus, Essential Hypertension</div>
        <div>Allergies: None</div>
        <div class="rx-symbol">Rx:</div>
        <div>1. Tab. Metformin 500 mg - 1 tablet 1-0-1 after food for 30 days</div>
        <div>2. Tab. Telmisartan 40 mg - 1 tablet 1-0-0 after food for 30 days</div>
        <div>3. Tab. Pantoprazole 40 mg - 1 tablet 1-0-0 empty stomach for 14 days</div>
        <div class="section">Follow-up: 2026-12-10 with Fasting Blood Sugar report.</div>
      `)
    );
    fs.writeFileSync(path.join(OUT_DIR, '01_clear_printed.png'), png1);
    fs.writeFileSync(path.join(OUT_DIR, '01_clear_printed.expected.txt'), text1);

    // ---------------------------------------------------------
    // TEST 2: Blurred prescription (slightly blurred but readable)
    // ---------------------------------------------------------
    const blurredPng = await sharp(png1).blur(2.0).png().toBuffer();
    fs.writeFileSync(path.join(OUT_DIR, '02_blurred.png'), blurredPng);
    fs.writeFileSync(path.join(OUT_DIR, '02_blurred.expected.txt'), text1);

    // ---------------------------------------------------------
    // TEST 3: Rotated prescription (90 degrees clockwise)
    // ---------------------------------------------------------
    const rotatedPng = await sharp(png1).rotate(90).png().toBuffer();
    fs.writeFileSync(path.join(OUT_DIR, '03_rotated_90.png'), rotatedPng);
    fs.writeFileSync(path.join(OUT_DIR, '03_rotated_90.expected.txt'), text1);

    // ---------------------------------------------------------
    // TEST 4: Multi-page PDF (3 pages: Page 1 digital, Page 2 SCANNED IMAGE, Page 3 digital)
    // ---------------------------------------------------------
    const page2ScannedPng = await renderHtmlToPng(
      browser,
      wrapRxHtml(`
        <div class="header">
          <div class="hospital">DISCHARGE MEDICATIONS (SCANNED PAGE 2)</div>
        </div>
        <div class="rx-symbol">Rx:</div>
        <div>1. Tab. Atorvastatin 20 mg - 1 tablet 0-0-1 at bedtime for 30 days</div>
        <div>2. Tab. Aspirin 75 mg (Ecosprin) - 1 tablet 1-0-0 after food for 30 days</div>
        <div>3. Tab. Metoprolol 25 mg - 1 tablet 1-0-1 after food for 30 days</div>
        <div>4. Tab. Pantoprazole 40 mg - 1 tablet 1-0-0 empty stomach for 14 days</div>
      `),
      1000,
      700
    );
    const page2Base64 = page2ScannedPng.toString('base64');

    const text4 = `Apollo Specialty Hospital, Hyderabad
HOSPITAL DISCHARGE SUMMARY - PAGE 1
Patient Name: Kavitha Reddy
Age: 61 / Female
UHID: ASH-HYD-2026-77310
Date: 2026-11-12
Doctor: Dr. S. Venkatesh, DM (Cardiology)
Diagnosis: Coronary Artery Disease, Essential Hypertension
Allergies: Sulfa drugs

DISCHARGE MEDICATIONS (SCANNED PAGE 2)
Rx:
1. Tab. Atorvastatin 20 mg - 1 tablet 0-0-1 at bedtime for 30 days
2. Tab. Aspirin 75 mg (Ecosprin) - 1 tablet 1-0-0 after food for 30 days
3. Tab. Metoprolol 25 mg - 1 tablet 1-0-1 after food for 30 days
4. Tab. Pantoprazole 40 mg - 1 tablet 1-0-0 empty stomach for 14 days

INVESTIGATIONS AND FOLLOW-UP - PAGE 3
Investigations:
1. Fasting Lipid Profile - 12 hours fasting
2. Serum Creatinine and Electrolytes
3. Resting 12-Lead ECG
Follow-up: 2026-12-05 with Cardiology OPD Dr. S. Venkatesh.
Advice: Low salt diet, daily 20 minute walk.`;

    const pdfHtml4 = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  @page { size: A4; margin: 16mm; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #0f172a; }
  .page { page-break-after: always; }
  .page:last-child { page-break-after: auto; }
  h1 { font-size: 20px; color: #0f766e; border-bottom: 2px solid #0f766e; padding-bottom: 6px; }
</style>
</head>
<body>
  <div class="page">
    <h1>Apollo Specialty Hospital, Hyderabad</h1>
    <p><strong>HOSPITAL DISCHARGE SUMMARY - PAGE 1</strong></p>
    <p>Patient Name: Kavitha Reddy<br/>
    Age: 61 / Female<br/>
    UHID: ASH-HYD-2026-77310<br/>
    Date: 2026-11-12<br/>
    Doctor: Dr. S. Venkatesh, DM (Cardiology)</p>
    <p>Diagnosis: Coronary Artery Disease, Essential Hypertension<br/>
    Allergies: Sulfa drugs</p>
  </div>
  <div class="page">
    <img src="data:image/png;base64,${page2Base64}" style="width:100%;height:auto;" />
  </div>
  <div class="page">
    <h1>INVESTIGATIONS AND FOLLOW-UP - PAGE 3</h1>
    <p>Investigations:</p>
    <p>1. Fasting Lipid Profile - 12 hours fasting<br/>
    2. Serum Creatinine and Electrolytes<br/>
    3. Resting 12-Lead ECG</p>
    <p>Follow-up: 2026-12-05 with Cardiology OPD Dr. S. Venkatesh.<br/>
    Advice: Low salt diet, daily 20 minute walk.</p>
  </div>
</body>
</html>`;

    const pdfPage = await browser.newPage();
    await pdfPage.setContent(pdfHtml4, { waitUntil: 'load' });
    const pdf4Buf = await pdfPage.pdf({ format: 'A4', printBackground: true });
    await pdfPage.close();
    fs.writeFileSync(path.join(OUT_DIR, '04_multipage_discharge.pdf'), Buffer.from(pdf4Buf));
    fs.writeFileSync(path.join(OUT_DIR, '04_multipage_discharge.expected.txt'), text4);

    // ---------------------------------------------------------
    // TEST 5: Multiple medication prescription (similar names, distinct strengths & frequencies)
    // ---------------------------------------------------------
    const text5 = `City Multispecialty Hospital, Pune
Dr. Meera Deshmukh, MD
Date: 2026-11-14
Patient Name: Sandeep Kulkarni
Age: 56 / Male
Diagnosis: Type 2 Diabetes Mellitus, Essential Hypertension, Acute Bacterial Bronchitis

Rx:
1. Tab. Metformin 500 mg - 1 tablet 1-0-1 after food for 30 days
2. Tab. Metoprolol 25 mg - 1 tablet 1-0-0 after food for 30 days
3. Tab. Glimepiride 2 mg - 1 tablet 1-0-0 before food for 30 days
4. Tab. Atorvastatin 20 mg - 1 tablet 0-0-1 at bedtime for 30 days
5. Tab. Azithromycin 500 mg - 1 tablet 1-0-0 before food for 5 days

Follow-up: 2026-11-28`;

    const png5 = await renderHtmlToPng(
      browser,
      wrapRxHtml(`
        <div class="header">
          <div class="hospital">City Multispecialty Hospital, Pune</div>
          <div class="doctor">Dr. Meera Deshmukh, MD</div>
        </div>
        <div>Date: 2026-11-14 | Patient Name: Sandeep Kulkarni | Age: 56 / Male</div>
        <div>Diagnosis: Type 2 Diabetes Mellitus, Essential Hypertension, Acute Bacterial Bronchitis</div>
        <div class="rx-symbol">Rx:</div>
        <div>1. Tab. Metformin 500 mg - 1 tablet 1-0-1 after food for 30 days</div>
        <div>2. Tab. Metoprolol 25 mg - 1 tablet 1-0-0 after food for 30 days</div>
        <div>3. Tab. Glimepiride 2 mg - 1 tablet 1-0-0 before food for 30 days</div>
        <div>4. Tab. Atorvastatin 20 mg - 1 tablet 0-0-1 at bedtime for 30 days</div>
        <div>5. Tab. Azithromycin 500 mg - 1 tablet 1-0-0 before food for 5 days</div>
        <div class="section">Follow-up: 2026-11-28</div>
      `)
    );
    fs.writeFileSync(path.join(OUT_DIR, '05_multi_medications.png'), png5);
    fs.writeFileSync(path.join(OUT_DIR, '05_multi_medications.expected.txt'), text5);

    // ---------------------------------------------------------
    // TEST 6: Mixed-language prescription (English drug names + Kannada & Hindi instructions)
    // ---------------------------------------------------------
    const text6 = `Narayana Clinic, Mysuru
Dr. Prakash Gowda, MBBS, MD
Date: 2026-11-16
Patient Name: Lakshmi Narayanan
Age: 52 / Female
Diagnosis: Type 2 Diabetes Mellitus, Hypertension

Rx:
1. Tab. Metformin 500 mg - 1 tablet 1-0-1 ಊಟದ ನಂತರ (खाने के बाद) 30 days
2. Tab. Pantoprazole 40 mg - 1 tablet 1-0-0 ಖಾಲಿ ಹೊಟ್ಟೆಯಲ್ಲಿ (खाली पेट) 14 days
3. Tab. Telmisartan 40 mg - 1 tablet 1-0-0 ಬೆಳಿಗ್ಗೆ ಊಟದ ನಂತರ 30 days

Follow-up: 2026-12-16`;

    const png6 = await renderHtmlToPng(
      browser,
      wrapRxHtml(`
        <div class="header">
          <div class="hospital">Narayana Clinic, Mysuru</div>
          <div class="doctor">Dr. Prakash Gowda, MBBS, MD</div>
        </div>
        <div>Date: 2026-11-16</div>
        <div>Patient Name: Lakshmi Narayanan | Age: 52 / Female</div>
        <div>Diagnosis: Type 2 Diabetes Mellitus, Hypertension</div>
        <div class="rx-symbol">Rx:</div>
        <div>1. Tab. Metformin 500 mg - 1 tablet 1-0-1 ಊಟದ ನಂತರ (खाने के बाद) 30 days</div>
        <div>2. Tab. Pantoprazole 40 mg - 1 tablet 1-0-0 ಖಾಲಿ ಹೊಟ್ಟೆಯಲ್ಲಿ (खाली पेट) 14 days</div>
        <div>3. Tab. Telmisartan 40 mg - 1 tablet 1-0-0 ಬೆಳಿಗ್ಗೆ ಊಟದ ನಂತರ 30 days</div>
        <div class="section">Follow-up: 2026-12-16</div>
      `)
    );
    fs.writeFileSync(path.join(OUT_DIR, '06_mixed_language.png'), png6);
    fs.writeFileSync(path.join(OUT_DIR, '06_mixed_language.expected.txt'), text6);

    // ---------------------------------------------------------
    // TEST 7: Handwritten-style prescription (cursive, low contrast, skewed — tests uncertainty handling!)
    // ---------------------------------------------------------
    const text7 = `Dr. A. K. Verma Clinic
Patient: Mohan Lal, Age: 44
Date: 15-11-2026
Rx:
1. Tab. Augmentin 625 mg - 1 tab BD after food x 5 days
2. Tab. Dolo 650 - 1 tab SOS for fever
3. Syp. Montair LC - 1 tab HS x 7 days`;

    const rawHwPng = await renderHtmlToPng(
      browser,
      wrapRxHtml(
        `
        <div style="font-size:26px;font-weight:700;margin-bottom:14px;">Dr. A. K. Verma Clinic</div>
        <div>Patient: Mohan Lal, Age: 44</div>
        <div>Date: 15-11-2026</div>
        <div style="font-size:34px;margin:14px 0;">Rx:</div>
        <div style="transform:rotate(-2deg);">1. Tab. Augmentin 625 mg - 1 tab BD after food x 5 days</div>
        <div style="transform:rotate(1.5deg);opacity:0.65;">2. Tab. Dolo 650 - 1 tab SOS for fever</div>
        <div style="transform:rotate(-1.8deg);opacity:0.55;">3. Tab. Montair LC - 1 tab HS x 7 days</div>
      `,
        `
        body {
          font-family: 'Segoe Script', 'Segoe Print', cursive;
          background: #f4f1ea;
          color: #2f3b66;
          font-size: 24px;
          letter-spacing: 0.5px;
          font-style: italic;
        }
      `
      ),
      950,
      750
    );

    const hwPng = await sharp(rawHwPng).blur(1.4).modulate({ brightness: 1.08 }).png().toBuffer();
    fs.writeFileSync(path.join(OUT_DIR, '07_handwritten_style.png'), hwPng);
    fs.writeFileSync(path.join(OUT_DIR, '07_handwritten_style.expected.txt'), text7);

    console.log('Successfully generated all 7 OCR test fixtures in:', OUT_DIR);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
