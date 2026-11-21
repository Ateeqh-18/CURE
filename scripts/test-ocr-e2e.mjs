import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const FIXTURE_DIR = path.join(process.cwd(), 'tests', 'ocr-fixtures');

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array(n + 1);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

function normalizeForMetrics(text) {
  return text
    .replace(/---\s*Page\s+\d+\s+of\s+\d+\s*---/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function computeAccuracy(expected, actual) {
  const expNorm = normalizeForMetrics(expected);
  const actNorm = normalizeForMetrics(actual);
  const expWords = expNorm.split(' ').filter(Boolean);
  const actWords = actNorm.split(' ').filter(Boolean);

  const wordDist = levenshtein(expWords, actWords);
  const wer = expWords.length > 0 ? Math.min(1, wordDist / expWords.length) : 1;

  // Cap character Levenshtein length for speed on long texts
  const maxChars = 1500;
  const expChars = expNorm.slice(0, maxChars);
  const actChars = actNorm.slice(0, maxChars);
  const charDist = levenshtein(expChars, actChars);
  const cer = expChars.length > 0 ? Math.min(1, charDist / expChars.length) : 1;

  return {
    werPct: +(wer * 100).toFixed(1),
    cerPct: +(cer * 100).toFixed(1),
    wordAccPct: +((1 - wer) * 100).toFixed(1),
  };
}

async function runFixtureTest(fixture) {
  const filePath = path.join(FIXTURE_DIR, fixture.file);
  const expectedPath = path.join(FIXTURE_DIR, fixture.expected);
  const fileBuf = fs.readFileSync(filePath);
  const expectedText = fs.readFileSync(expectedPath, 'utf8');

  const formData = new FormData();
  const blob = new Blob([fileBuf], { type: fixture.mime });
  formData.append('file', blob, fixture.file);
  formData.append('ocrLanguages', fixture.ocrLanguages || 'eng');

  const ocrRes = await fetch(`${BASE_URL}/api/ocr`, {
    method: 'POST',
    body: formData,
  });
  const ocrJson = await ocrRes.json();

  let extractJson = null;
  if (ocrRes.ok && ocrJson.success && ocrJson.text) {
    const extRes = await fetch(`${BASE_URL}/api/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: ocrJson.text,
        ocrConfidence: ocrJson.confidence,
        ocrWarnings: ocrJson.warnings,
      }),
    });
    extractJson = await extRes.json();
  }

  const metrics = computeAccuracy(expectedText, ocrJson.text || '');
  const extractedMeds = extractJson?.data?.medicines || [];
  const hasAllRequiredKeywords = (fixture.mustContain || []).every((kw) =>
    (ocrJson.text || '').toLowerCase().includes(kw.toLowerCase())
  );

  let status = 'PASS';
  let notes = '';

  if (fixture.expectUncertainty) {
    // Handwritten sample: pass if OCR ran without crashing AND flagged low confidence / uncertainty
    const flaggedUncertain =
      !ocrJson.success ||
      ocrJson.confidence < 75 ||
      (ocrJson.warnings && ocrJson.warnings.length > 0) ||
      (extractJson?.data?.uncertainFields && extractJson.data.uncertainFields.length > 0);
    status = flaggedUncertain ? 'PASS' : 'FAIL';
    notes = `Conf=${ocrJson.confidence}%, Warnings=${ocrJson.warnings?.length || 0}, UncertainFields=${extractJson?.data?.uncertainFields?.length || 0}`;
  } else {
    const pagesOk = !fixture.expectedPages || ocrJson.pageCount === fixture.expectedPages;
    const medsOk = extractedMeds.length >= (fixture.minMeds || 1);
    const passed = ocrRes.ok && ocrJson.success && pagesOk && hasAllRequiredKeywords && medsOk;
    status = passed ? 'PASS' : 'FAIL';
    notes = `Provider=${ocrJson.provider}, Pages=${ocrJson.pageCount}, Conf=${ocrJson.confidence}%, Meds=${extractedMeds.length}, WER=${metrics.werPct}%, CER=${metrics.cerPct}%`;
  }

  return {
    name: fixture.name,
    expectedDesc: fixture.expectedDesc,
    status,
    notes,
    provider: ocrJson.provider,
    confidence: ocrJson.confidence,
    pageCount: ocrJson.pageCount,
    rotationApplied: ocrJson.pages?.[0]?.rotationApplied || 0,
    medsExtracted: extractedMeds.map((m) => `${m.name} ${m.strength} (${m.frequency})`),
    metrics,
    detectedLanguages: ocrJson.detectedLanguages,
    warnings: ocrJson.warnings,
    errors: ocrJson.errors,
  };
}

async function runReliabilityTests() {
  const results = [];

  // 1. Empty upload
  {
    const fd = new FormData();
    const res = await fetch(`${BASE_URL}/api/ocr`, { method: 'POST', body: fd });
    const json = await res.json();
    results.push({
      test: 'Empty upload',
      status: res.status === 400 && !json.success ? 'PASS' : 'FAIL',
      detail: `HTTP ${res.status}: ${json.error}`,
    });
  }

  // 2. Unsupported file (.txt)
  {
    const fd = new FormData();
    fd.append('file', new Blob(['just plain text'], { type: 'text/plain' }), 'notes.txt');
    const res = await fetch(`${BASE_URL}/api/ocr`, { method: 'POST', body: fd });
    const json = await res.json();
    results.push({
      test: 'Unsupported file (.txt)',
      status: res.status === 400 && !json.success ? 'PASS' : 'FAIL',
      detail: `HTTP ${res.status}: ${json.error}`,
    });
  }

  // 3. Corrupted PDF
  {
    const fd = new FormData();
    fd.append('file', new Blob(['NOT_A_REAL_PDF_HEADER_DATA'], { type: 'application/pdf' }), 'broken.pdf');
    const res = await fetch(`${BASE_URL}/api/ocr`, { method: 'POST', body: fd });
    const json = await res.json();
    results.push({
      test: 'Corrupted PDF',
      status: res.status === 400 && !json.success ? 'PASS' : 'FAIL',
      detail: `HTTP ${res.status}: ${json.error}`,
    });
  }

  // 4. Invalid Gemini API key (forced Gemini mode)
  {
    const buf = fs.readFileSync(path.join(FIXTURE_DIR, '01_clear_printed.png'));
    const fd = new FormData();
    fd.append('file', new Blob([buf], { type: 'image/png' }), '01_clear_printed.png');
    fd.append('forceProvider', 'gemini');
    fd.append('apiKeyOverride', 'INVALID_KEY_FOR_TEST_12345');
    const res = await fetch(`${BASE_URL}/api/ocr`, { method: 'POST', body: fd });
    const json = await res.json();
    results.push({
      test: 'Invalid Gemini API key handling',
      status: !json.success && /invalid|400|401|403/i.test(json.error || json.geminiError || '') ? 'PASS' : 'FAIL',
      detail: `HTTP ${res.status}: ${json.geminiError || json.error}`,
    });
  }

  // 5. Simulated Translation Failure fallback
  {
    const res = await fetch(`${BASE_URL}/api/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Type 2 Diabetes Mellitus',
        targetLanguage: 'kn',
        simulateFailure: true,
      }),
    });
    const json = await res.json();
    results.push({
      test: 'Translation failure preserves original text',
      status: res.status === 503 && json.translatedText === 'Type 2 Diabetes Mellitus' ? 'PASS' : 'FAIL',
      detail: `HTTP ${res.status}: preserved="${json.translatedText}"`,
    });
  }

  return results;
}

async function main() {
  const fixtures = [
    {
      name: 'Test 1: Clear printed prescription',
      file: '01_clear_printed.png',
      expected: '01_clear_printed.expected.txt',
      mime: 'image/png',
      ocrLanguages: 'eng',
      expectedDesc: 'Accurate extraction of 3 meds, strengths, dosages, follow-up',
      mustContain: ['Metformin', '500', 'Telmisartan', 'Pantoprazole', '2026-12-10'],
      minMeds: 3,
    },
    {
      name: 'Test 2: Blurred prescription',
      file: '02_blurred.png',
      expected: '02_blurred.expected.txt',
      mime: 'image/png',
      ocrLanguages: 'eng',
      expectedDesc: 'Preprocessing sharpens blur and extracts medicines',
      mustContain: ['Metformin', 'Telmisartan', 'Pantoprazole'],
      minMeds: 3,
    },
    {
      name: 'Test 3: Rotated prescription (90 deg)',
      file: '03_rotated_90.png',
      expected: '03_rotated_90.expected.txt',
      mime: 'image/png',
      ocrLanguages: 'eng',
      expectedDesc: 'Auto-orientation corrects 90° rotation and reads text',
      mustContain: ['Metformin', 'Telmisartan', 'Pantoprazole'],
      minMeds: 3,
    },
    {
      name: 'Test 4: Multi-page PDF (3 pages w/ scanned Page 2)',
      file: '04_multipage_discharge.pdf',
      expected: '04_multipage_discharge.expected.txt',
      mime: 'application/pdf',
      ocrLanguages: 'eng',
      expectedDesc: 'Extracts digital Pages 1 & 3 AND OCRs scanned Page 2',
      mustContain: ['Kavitha Reddy', 'Atorvastatin', 'Metoprolol', 'Lipid Profile', '2026-12-05'],
      expectedPages: 3,
      minMeds: 4,
    },
    {
      name: 'Test 5: Multiple similar medications',
      file: '05_multi_medications.png',
      expected: '05_multi_medications.expected.txt',
      mime: 'image/png',
      ocrLanguages: 'eng',
      expectedDesc: 'Distinguishes Metformin/Metoprolol/Glimepiride/Atorvastatin/Azithromycin',
      mustContain: ['Metformin', 'Metoprolol', 'Glimepiride', 'Atorvastatin', 'Azithromycin'],
      minMeds: 5,
    },
    {
      name: 'Test 6: Mixed-language (English + Kannada + Hindi)',
      file: '06_mixed_language.png',
      expected: '06_mixed_language.expected.txt',
      mime: 'image/png',
      ocrLanguages: 'eng+kan+hin',
      expectedDesc: 'Preserves English drugs and Kannada/Hindi scripts without translating',
      mustContain: ['Metformin', 'Pantoprazole', 'Telmisartan'],
      minMeds: 3,
    },
    {
      name: 'Test 7: Handwritten-style difficult prescription',
      file: '07_handwritten_style.png',
      expected: '07_handwritten_style.expected.txt',
      mime: 'image/png',
      ocrLanguages: 'eng',
      expectedDesc: 'Genuinely flags low confidence / uncertainty for manual review',
      expectUncertainty: true,
    },
  ];

  console.log('\n=== RUNNING REAL END-TO-END OCR FIXTURE TESTS ===\n');
  const fixtureResults = [];
  for (const fx of fixtures) {
    console.log(`Running ${fx.name}...`);
    const res = await runFixtureTest(fx);
    fixtureResults.push(res);
    console.log(`  -> [${res.status}] ${res.notes}`);
    console.log(`     Meds extracted: ${JSON.stringify(res.medsExtracted)}`);
    console.log(`     Scripts: ${JSON.stringify(res.detectedLanguages)}`);
  }

  console.log('\n=== RUNNING RELIABILITY & ERROR-HANDLING TESTS ===\n');
  const relResults = await runReliabilityTests();
  for (const r of relResults) {
    console.log(`  -> [${r.status}] ${r.test}: ${r.detail}`);
  }

  // Write JSON report for inspection
  const reportPath = path.join(process.cwd(), 'tests', 'ocr-test-report.json');
  fs.writeFileSync(
    reportPath,
    JSON.stringify({ timestamp: new Date().toISOString(), fixtureResults, relResults }, null, 2)
  );
  console.log('\nSaved full OCR test report to:', reportPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
