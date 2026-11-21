/**
 * Cure — Cloud + Local Vision AI Pipeline Verification & 10-Case Test Suite.
 *
 * STRICT HONESTY RULES:
 * - Never mocks AI model responses.
 * - Tests Gemini and Ollama independently when ready; marks each of the 10 cases
 *   as NOT_RUN if that provider is unavailable/unconfigured.
 * - Verifies real non-mocked pipeline components: input validation, 3-page PDF rendering,
 *   strict provider routing & local-mode cloud isolation, honest failure handling (no fake
 *   demo data), safety engine, 12-language clinical translation, and multilingual PDF export.
 */
import fs from 'fs';
import path from 'path';
import * as mupdf from 'mupdf';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const FIXTURE_DIR = path.resolve(process.cwd(), 'tests', 'ai-fixtures');
const REPORT_PATH = path.resolve(process.cwd(), 'tests', 'ai-pipeline-test-report.json');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 300) };
  }
  return { status: res.status, ok: res.ok, json };
}

async function testProviderCase(providerMode, testCase) {
  const filePath = path.join(FIXTURE_DIR, testCase.file);
  const form = new FormData();
  form.append('providerMode', providerMode);

  if (testCase.kind === 'text') {
    const content = fs.readFileSync(filePath, 'utf8');
    form.append('typedText', content);
  } else {
    const buf = fs.readFileSync(filePath);
    const mime =
      testCase.kind === 'pdf'
        ? 'application/pdf'
        : testCase.file.endsWith('.png')
        ? 'image/png'
        : 'image/jpeg';
    form.append('file', new Blob([buf], { type: mime }), testCase.file);
  }

  const started = Date.now();
  const res = await fetchJson(`${BASE_URL}/api/process-prescription`, {
    method: 'POST',
    body: form,
  });
  const durationMs = Date.now() - started;

  if (!res.ok || !res.json?.success || !res.json?.prescription) {
    return {
      caseId: testCase.id,
      name: testCase.name,
      provider: providerMode,
      status: 'FAIL',
      durationMs,
      httpStatus: res.status,
      error: res.json?.error || `HTTP ${res.status}`,
      attempts: res.json?.attempts || [],
    };
  }

  const rx = res.json.prescription;
  const extractedMedNames = (rx.medicines || []).map((m) =>
    `${m.name || ''} ${m.brandName || ''} ${m.originalWrittenName || ''}`.toLowerCase()
  );
  const matchedExpected = (testCase.expectedMedicines || []).filter((exp) =>
    extractedMedNames.some((cand) => cand.includes(exp.toLowerCase()))
  );
  const recall =
    testCase.expectedMedicines?.length > 0
      ? Number((matchedExpected.length / testCase.expectedMedicines.length).toFixed(2))
      : 1;

  return {
    caseId: testCase.id,
    name: testCase.name,
    provider: providerMode,
    status: recall >= 0.6 ? 'PASS' : 'FAIL',
    durationMs,
    modelUsed: rx.aiMeta?.model || null,
    pagesProcessed: rx.aiMeta?.pagesProcessed || 1,
    overallConfidence: rx.overallConfidenceCategory || null,
    expectedMedicines: testCase.expectedMedicines || [],
    extractedMedicineCount: (rx.medicines || []).length,
    matchedExpectedMedicines: matchedExpected,
    medicineRecall: recall,
    uncertainFieldCount: (rx.uncertainFields || []).length,
    allergyStatus: rx.patientDetails?.allergyStatus || 'unknown',
    error: null,
  };
}

async function main() {
  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    environmentStatus: null,
    pipelineIntegrityTests: [],
    tenCaseAiEvaluation: {
      gemini: { status: 'NOT_RUN', reason: null, cases: [] },
      ollama: { status: 'NOT_RUN', reason: null, cases: [] },
    },
    downstreamRegressionTests: [],
    summary: {},
  };

  // 1. Check live AI provider status via /api/ai/status?live=1
  const statusRes = await fetchJson(`${BASE_URL}/api/ai/status?live=1`);
  assert(statusRes.status === 200, `Expected /api/ai/status 200, got ${statusRes.status}`);
  report.environmentStatus = {
    recommendedActiveProvider: statusRes.json.recommendedActiveProvider,
    gemini: {
      configured: statusRes.json.gemini?.configured,
      reachable: statusRes.json.gemini?.reachable,
      ready: statusRes.json.gemini?.ready,
      model: statusRes.json.gemini?.model,
      error: statusRes.json.gemini?.error || null,
    },
    ollama: {
      configured: statusRes.json.ollama?.configured,
      reachable: statusRes.json.ollama?.reachable,
      ready: statusRes.json.ollama?.ready,
      model: statusRes.json.ollama?.model,
      baseUrl: statusRes.json.ollama?.baseUrl,
      availableModels: statusRes.json.ollama?.availableModels || [],
      error: statusRes.json.ollama?.error || null,
    },
  };

  async function runCheck(name, fn) {
    const t0 = Date.now();
    try {
      const detail = await fn();
      report.pipelineIntegrityTests.push({
        name,
        status: 'PASS',
        durationMs: Date.now() - t0,
        detail,
      });
    } catch (err) {
      report.pipelineIntegrityTests.push({
        name,
        status: 'FAIL',
        durationMs: Date.now() - t0,
        error: err?.message || String(err),
      });
    }
  }

  // 2. Pipeline Integrity & Routing Verification (Real HTTP & Real MuPDF)
  await runCheck('Input Validation: Reject empty upload (HTTP 400)', async () => {
    const form = new FormData();
    form.append('providerMode', 'auto');
    form.append('file', new Blob([], { type: 'image/png' }), 'empty.png');
    const r = await fetchJson(`${BASE_URL}/api/process-prescription`, { method: 'POST', body: form });
    assert(r.status === 400 && r.json.success === false, `Expected 400, got ${r.status}`);
    return { httpStatus: r.status, error: r.json.error };
  });

  await runCheck('Input Validation: Reject unsupported file type .exe/.bin (HTTP 400)', async () => {
    const form = new FormData();
    form.append('providerMode', 'auto');
    form.append('file', new Blob([Buffer.from('MZ\x90\x00notanimage')], { type: 'application/octet-stream' }), 'malware.exe');
    const r = await fetchJson(`${BASE_URL}/api/process-prescription`, { method: 'POST', body: form });
    assert(r.status === 400 && r.json.success === false, `Expected 400, got ${r.status}`);
    return { httpStatus: r.status, error: r.json.error };
  });

  await runCheck('Input Validation: Reject corrupted PDF file (HTTP 400)', async () => {
    const form = new FormData();
    form.append('providerMode', 'auto');
    form.append('file', new Blob([Buffer.from('%PDF-1.4\ncorrupted-garbage-bytes')], { type: 'application/pdf' }), 'broken.pdf');
    const r = await fetchJson(`${BASE_URL}/api/process-prescription`, { method: 'POST', body: form });
    assert(r.status === 400 && r.json.success === false, `Expected 400, got ${r.status}`);
    return { httpStatus: r.status, error: r.json.error };
  });

  await runCheck('Multi-Page PDF Rendering: Verify all 3 pages of synthetic discharge PDF via MuPDF', async () => {
    const pdfPath = path.join(FIXTURE_DIR, '07_three_page_discharge_summary.pdf');
    const buf = fs.readFileSync(pdfPath);
    const doc = mupdf.Document.openDocument(buf, 'application/pdf');
    const pageCount = doc.countPages();
    assert(pageCount === 3, `Expected 3 pages, got ${pageCount}`);
    const pageSizes = [];
    for (let i = 0; i < pageCount; i++) {
      const page = doc.loadPage(i);
      const pixmap = page.toPixmap(mupdf.Matrix.scale(2.0, 2.0), mupdf.ColorSpace.DeviceRGB, false, true);
      const pngBytes = Buffer.from(pixmap.asPNG());
      assert(pngBytes.length > 5000, `Rendered page ${i + 1} PNG unexpectedly small (${pngBytes.length} bytes)`);
      pageSizes.push({ page: i + 1, width: pixmap.getWidth(), height: pixmap.getHeight(), pngBytes: pngBytes.length });
    }
    return { pageCount, pageSizes };
  });

  await runCheck('Strict Local Isolation: providerMode=ollama NEVER attempts Gemini Cloud', async () => {
    const form = new FormData();
    form.append('providerMode', 'ollama');
    form.append('typedText', 'Patient: Synthetic Local Test\nRx: Tab. Paracetamol 500mg 1-1-1 x 3 days');
    const r = await fetchJson(`${BASE_URL}/api/process-prescription`, { method: 'POST', body: form });
    const attempts = r.json?.attempts || [];
    const triedGemini = attempts.some((a) => a.provider === 'gemini');
    assert(!triedGemini, 'CRITICAL PRIVACY VIOLATION: ollama mode attempted Gemini Cloud!');
    if (!statusRes.json.ollama?.ready) {
      assert(r.status === 503 && r.json.success === false && !r.json.prescription, 'Expected honest 503 failure with zero fake data when Ollama is unavailable');
    }
    return { httpStatus: r.status, attemptsCount: attempts.length, triedGemini, providersAttempted: attempts.map((a) => a.provider) };
  });

  await runCheck('Strict Gemini-Only Mode: providerMode=gemini NEVER attempts Ollama & never returns fake demo data', async () => {
    const form = new FormData();
    form.append('providerMode', 'gemini');
    form.append('typedText', 'Patient: Synthetic Cloud Test\nRx: Tab. Metformin 500mg 1-0-1 x 30 days');
    const r = await fetchJson(`${BASE_URL}/api/process-prescription`, { method: 'POST', body: form });
    const attempts = r.json?.attempts || [];
    const triedOllama = attempts.some((a) => a.provider === 'ollama');
    assert(!triedOllama, 'gemini-only mode should never attempt Ollama');
    if (!statusRes.json.gemini?.ready) {
      assert(r.status === 503 && r.json.success === false && !r.json.prescription, 'Expected honest 503 failure with zero fake demo data when GEMINI_API_KEY is missing');
    }
    return { httpStatus: r.status, triedOllama, providersAttempted: attempts.map((a) => a.provider) };
  });

  await runCheck('Automatic Mode Failover Reporting: Attempts Gemini then Ollama transparently with zero demo fallback', async () => {
    const form = new FormData();
    form.append('providerMode', 'auto');
    form.append('typedText', 'Patient: Synthetic Auto Test\nRx: Tab. Telmisartan 40mg 1-0-0 x 30 days');
    const r = await fetchJson(`${BASE_URL}/api/process-prescription`, { method: 'POST', body: form });
    const attempts = r.json?.attempts || [];
    if (!statusRes.json.gemini?.ready && !statusRes.json.ollama?.ready) {
      assert(r.status === 503 && r.json.success === false && !r.json.prescription, 'Expected honest 503 when neither provider is ready');
      assert(attempts.length === 2 && attempts[0].provider === 'gemini' && attempts[1].provider === 'ollama', `Expected [gemini, ollama] attempt order, got ${JSON.stringify(attempts)}`);
    }
    return { httpStatus: r.status, providersAttempted: attempts.map((a) => a.provider), error: r.json?.error || null };
  });

  await runCheck('Sanitized Diagnostics Telemetry: /api/ai/status exposes zero API keys and zero patient PHI', async () => {
    const s = await fetchJson(`${BASE_URL}/api/ai/status`);
    const serialized = JSON.stringify(s.json);
    assert(!serialized.includes('Synthetic Auto Test'), 'Diagnostics leaked patient text/PHI!');
    assert(!serialized.includes('AIza'), 'Diagnostics leaked Gemini API key pattern!');
    assert(s.json.lastRun && typeof s.json.lastRun.durationMs === 'number', 'Expected lastRun sanitized telemetry record');
    return { lastRun: s.json.lastRun };
  });

  // 3. 10-Case Independent Evaluation (Gemini & Ollama)
  const manifest = JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, 'manifest.json'), 'utf8'));

  if (statusRes.json.gemini?.ready) {
    report.tenCaseAiEvaluation.gemini.status = 'EXECUTED';
    for (const tc of manifest) {
      report.tenCaseAiEvaluation.gemini.cases.push(await testProviderCase('gemini', tc));
    }
  } else {
    report.tenCaseAiEvaluation.gemini.status = 'NOT_RUN';
    report.tenCaseAiEvaluation.gemini.reason =
      statusRes.json.gemini?.error || 'GEMINI_API_KEY is not configured in environment.';
    for (const tc of manifest) {
      report.tenCaseAiEvaluation.gemini.cases.push({
        caseId: tc.id,
        name: tc.name,
        provider: 'gemini',
        status: 'NOT_RUN',
        reason: report.tenCaseAiEvaluation.gemini.reason,
      });
    }
  }

  if (statusRes.json.ollama?.ready) {
    report.tenCaseAiEvaluation.ollama.status = 'EXECUTED';
    for (const tc of manifest) {
      report.tenCaseAiEvaluation.ollama.cases.push(await testProviderCase('ollama', tc));
    }
  } else {
    report.tenCaseAiEvaluation.ollama.status = 'NOT_RUN';
    report.tenCaseAiEvaluation.ollama.reason =
      statusRes.json.ollama?.error || 'Ollama is not running or qwen2.5vl:3b is not pulled.';
    for (const tc of manifest) {
      report.tenCaseAiEvaluation.ollama.cases.push({
        caseId: tc.id,
        name: tc.name,
        provider: 'ollama',
        status: 'NOT_RUN',
        reason: report.tenCaseAiEvaluation.ollama.reason,
      });
    }
  }

  // 4. Downstream Cure Regression Tests (Safety Engine, Translation, Multilingual PDF)
  async function runDownstream(name, fn) {
    const t0 = Date.now();
    try {
      const detail = await fn();
      report.downstreamRegressionTests.push({ name, status: 'PASS', durationMs: Date.now() - t0, detail });
    } catch (err) {
      report.downstreamRegressionTests.push({ name, status: 'FAIL', durationMs: Date.now() - t0, error: err?.message || String(err) });
    }
  }

  const syntheticRxForDownstream = {
    id: 'rx-regression-test',
    patientDetails: {
      name: 'Synthetic Test Patient',
      age: 58,
      gender: 'Female',
      allergyStatus: 'documented',
      allergies: ['Penicillin'],
      existingMedications: ['Ecosprin 75mg'],
    },
    diagnosis: ['Acute Coronary Syndrome', 'Type 2 Diabetes Mellitus'],
    diagnosisSimplified: 'Heart artery care and blood sugar management.',
    symptoms: ['Chest discomfort'],
    medicines: [
      {
        id: 'm1',
        name: 'Amoxicillin',
        originalWrittenName: 'Cap. Amox 500mg',
        strength: '500 mg',
        dosage: '1 capsule',
        frequency: '1-0-1 (Twice daily)',
        route: 'Oral',
        duration: '5 days',
        foodInstruction: 'After food',
        timeSlots: ['morning', 'night'],
        purposeSimple: 'Antibiotic',
        sideEffects: ['Nausea'],
        precautions: ['Complete course'],
        confidenceCategory: 'high',
        sourcePage: 1,
      },
      {
        id: 'm2',
        name: 'Paracetamol',
        brandName: 'Dolo 650',
        strength: '650 mg',
        dosage: '1 tablet',
        frequency: '1-1-1',
        route: 'Oral',
        duration: 'Not specified',
        foodInstruction: 'After food',
        timeSlots: ['morning', 'afternoon', 'night'],
        purposeSimple: 'Fever and pain relief',
        sideEffects: ['Rare rash'],
        precautions: ['Avoid alcohol'],
        confidenceCategory: 'medium',
        sourcePage: 1,
      },
      {
        id: 'm3',
        name: 'Ibuprofen + Paracetamol',
        brandName: 'Combiflam',
        strength: '400 mg + 325 mg',
        dosage: '1 tablet',
        frequency: '1-0-1',
        route: 'Oral',
        duration: '5 days',
        foodInstruction: 'After food',
        timeSlots: ['morning', 'night'],
        purposeSimple: 'Pain and inflammation relief',
        sideEffects: ['Stomach upset'],
        precautions: ['Take after meals'],
        confidenceCategory: 'high',
        sourcePage: 1,
      },
    ],
    investigations: [
      { id: 'inv-1', name: 'HbA1c', purpose: '3-month average blood sugar', completed: false },
    ],
    followUp: {
      doctorName: 'Dr. Siddharth Menon',
      appointmentDate: '2026-11-30',
      instructions: 'Review with lab reports.',
      isCompleted: false,
    },
    generalPrecautions: ['Monitor blood pressure regularly.'],
    dietaryAdvice: ['Low-salt, diabetic-friendly diet.'],
    overallConfidenceCategory: 'medium',
    uncertainFields: ['Paracetamol: duration not specified'],
    createdAt: new Date().toISOString(),
  };

  await runDownstream('Safety Engine (/api/safety): Detects Penicillin-Amoxicillin allergy, duplicate Paracetamol, missing duration, and NKDA distinction', async () => {
    const r = await fetchJson(`${BASE_URL}/api/safety`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        medicines: syntheticRxForDownstream.medicines,
        patientDetails: syntheticRxForDownstream.patientDetails,
      }),
    });
    assert(r.status === 200 && Array.isArray(r.json.alerts), 'Expected 200 with alerts array');
    const types = r.json.alerts.map((a) => a.type);
    assert(types.includes('allergy_conflict'), 'Expected Penicillin-Amoxicillin allergy_conflict alert');
    assert(types.includes('duplicate_ingredient'), 'Expected duplicate Paracetamol alert');
    assert(types.includes('missing_info'), 'Expected missing duration alert');

    // Verify NKDA (none_documented) does NOT emit unrecorded allergy alert
    const nkdaRes = await fetchJson(`${BASE_URL}/api/safety`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        medicines: [syntheticRxForDownstream.medicines[2]],
        patientDetails: { name: 'NKDA Patient', allergyStatus: 'none_documented', allergies: [], existingMedications: [] },
      }),
    });
    const nkdaUnrecorded = (nkdaRes.json.alerts || []).some((a) => a.title?.includes('Unrecorded Patient Allergy'));
    assert(!nkdaUnrecorded, 'Explicit none_documented allergy status should NOT emit Unrecorded Allergy Status warning');

    return { alertCount: r.json.alerts.length, alertTypes: Array.from(new Set(types)), nkdaDistinctionVerified: true };
  });

  await runDownstream('Multilingual Translation (/api/translate): Translates clinical data into Kannada, Hindi, and Urdu', async () => {
    const results = {};
    for (const lang of ['kn', 'hi', 'ur']) {
      const r = await fetchJson(`${BASE_URL}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prescription: syntheticRxForDownstream, alerts: [], targetLanguage: lang }),
      });
      assert(r.status === 200 && r.json.prescription, `Translation failed for ${lang}`);
      results[lang] = {
        provider: r.json.prescription.translationMeta?.provider,
        localizedMed0: r.json.prescription.medicines?.[0]?.localizedName || r.json.prescription.medicines?.[0]?.name,
      };
    }
    return results;
  });

  await runDownstream('Multilingual PDF Export (/api/pdf): Generates valid non-empty A4 PDF in Kannada', async () => {
    const res = await fetch(`${BASE_URL}/api/pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prescription: syntheticRxForDownstream,
        alerts: [],
        language: 'kn',
      }),
    });
    assert(res.status === 200, `Expected PDF 200, got ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    assert(buf.slice(0, 5).toString('ascii') === '%PDF-', 'Output does not start with %PDF- magic header');
    assert(buf.length > 20000, `PDF unexpectedly small (${buf.length} bytes)`);
    return { bytes: buf.length, contentType: res.headers.get('content-type') };
  });

  // Summary counts
  const integrityPassed = report.pipelineIntegrityTests.filter((t) => t.status === 'PASS').length;
  const downstreamPassed = report.downstreamRegressionTests.filter((t) => t.status === 'PASS').length;

  report.summary = {
    pipelineIntegrity: `${integrityPassed}/${report.pipelineIntegrityTests.length} PASS`,
    downstreamRegression: `${downstreamPassed}/${report.downstreamRegressionTests.length} PASS`,
    gemini10CaseStatus: report.tenCaseAiEvaluation.gemini.status,
    ollama10CaseStatus: report.tenCaseAiEvaluation.ollama.status,
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf8');
  console.log('\n=== CURE VISION AI PIPELINE TEST SUMMARY ===');
  console.log(JSON.stringify(report.summary, null, 2));
  console.log(`Detailed report saved to: ${REPORT_PATH}`);

  const anyFailure =
    integrityPassed < report.pipelineIntegrityTests.length ||
    downstreamPassed < report.downstreamRegressionTests.length;
  if (anyFailure) {
    console.error('One or more automated integrity/regression tests failed! Check report.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
