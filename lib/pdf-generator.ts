import fs from 'fs';
import puppeteer from 'puppeteer-core';
import {
  PrescriptionData,
  SafetyAlert,
  SupportedLanguage,
  TimeSlot,
} from './types';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from './translations';
import { localizeFoodInstruction, translateClinicalBundle } from './clinical-translator';

function findBrowserExecutable(): string | null {
  const candidates = [
    process.env.CHROMIUM_PATH,
    process.env.PUPPETEER_EXECUTABLE_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean) as string[];

  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {
      // ignore
    }
  }
  return null;
}

function escapeHtml(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getFontStackForLanguage(lang: SupportedLanguage): string {
  if (lang === 'ur') {
    return "'Segoe UI', 'Tahoma', 'Arial', 'Nirmala UI', sans-serif";
  }
  return "'Nirmala UI', 'Segoe UI', 'Tahoma', 'Arial', sans-serif";
}

function buildReportHtml(
  rx: PrescriptionData,
  alerts: SafetyAlert[],
  language: SupportedLanguage
): string {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  const isRtl = langInfo.dir === 'rtl';
  const fontStack = getFontStackForLanguage(language);
  const unavailable = t.pdf.unavailable;

  const diagnoses =
    rx.localizedDiagnosis && rx.localizedDiagnosis.length > 0
      ? rx.localizedDiagnosis
      : rx.diagnosis;

  const severityLabel = (sev: SafetyAlert['severity']) => {
    switch (sev) {
      case 'critical':
        return t.severities.critical;
      case 'high':
        return t.severities.high;
      case 'moderate':
        return t.severities.moderate;
      case 'low':
        return t.severities.low;
      default:
        return t.severities.unverified;
    }
  };

  const severityStyle = (sev: SafetyAlert['severity']) => {
    switch (sev) {
      case 'critical':
        return 'background:#ffe4e6;color:#9f1239;border-color:#fda4af;';
      case 'high':
        return 'background:#fef3c7;color:#92400e;border-color:#fcd34d;';
      case 'moderate':
        return 'background:#fef9c3;color:#854d0e;border-color:#fde047;';
      default:
        return 'background:#f1f5f9;color:#334155;border-color:#cbd5e1;';
    }
  };

  // Build daily timetable slots
  const slotConfigs: { slot: TimeSlot; label: string; defaultTime: string }[] = [
    { slot: 'morning', label: t.timeSlots.morning, defaultTime: '08:30 AM' },
    { slot: 'afternoon', label: t.timeSlots.afternoon, defaultTime: '01:30 PM' },
    { slot: 'evening', label: t.timeSlots.evening, defaultTime: '06:00 PM' },
    { slot: 'night', label: t.timeSlots.night, defaultTime: '09:30 PM' },
  ];

  const ltr = (v: string | number | null | undefined) =>
    `<bdi dir="ltr">${escapeHtml(v)}</bdi>`;

  const timetableRows = slotConfigs
    .map((sc) => {
      const medsInSlot = rx.medicines.filter((m) => m.timeSlots?.includes(sc.slot));
      if (medsInSlot.length === 0) return '';
      const medItems = medsInSlot
        .map(
          (m) => `
          <div class="slot-med">
            <strong>${escapeHtml(m.localizedName || m.name)}</strong>
            <span class="pill-badge">${ltr(m.dosage)} (${ltr(m.strength)})</span>
            <span class="food-badge">${escapeHtml(
              m.localizedFoodInstruction || localizeFoodInstruction(m.foodInstruction, language)
            )}</span>
          </div>`
        )
        .join('');
      return `
        <tr>
          <td style="width:26%;font-weight:700;color:#0f766e;">${escapeHtml(sc.label)}<br/><span style="font-weight:400;color:#64748b;font-size:10px;">${ltr(sc.defaultTime)}</span></td>
          <td>${medItems}</td>
        </tr>`;
    })
    .filter(Boolean)
    .join('');

  const ambiguousMeds = rx.medicines.filter((m) => !m.timeSlots || m.timeSlots.length === 0);

  const medicinesHtml =
    rx.medicines.length === 0
      ? `<p class="muted">${escapeHtml(t.medicine.noMedicines)}</p>`
      : rx.medicines
          .map(
            (m, idx) => `
      <div class="med-card">
        <div class="med-header">
          <div>
            <span class="med-index">${idx + 1}</span>
            <span class="med-title">${escapeHtml(m.localizedName || m.name)}</span>
            <span class="strength-pill">${ltr(m.strength)}</span>
            ${m.isUncertain ? `<span class="warn-pill">⚠ ${escapeHtml(t.medicine.manualVerificationNeeded)}</span>` : ''}
          </div>
          <div class="med-sub">
            ${escapeHtml(t.review.genericName)}: <strong>${ltr(m.name)}</strong>
            ${m.brandName ? ` | ${escapeHtml(t.medicine.brandName)}: <strong>${ltr(m.brandName)}</strong>` : ''}
          </div>
        </div>
        <table class="mini-grid">
          <tr>
            <td><span class="lbl">${escapeHtml(t.sections.dosage)}</span><br/><strong>${ltr(m.dosage)}</strong></td>
            <td><span class="lbl">${escapeHtml(t.sections.frequency)}</span><br/><strong>${escapeHtml(m.localizedFrequency || m.frequency)}</strong></td>
            <td><span class="lbl">${escapeHtml(t.sections.duration)}</span><br/><strong>${escapeHtml(m.localizedDuration || m.duration)}</strong></td>
            <td><span class="lbl">${escapeHtml(t.sections.route)}</span><br/><strong>${escapeHtml(m.localizedRoute || m.route)}</strong></td>
            <td><span class="lbl">${escapeHtml(t.review.foodLabel)}</span><br/><strong>${escapeHtml(
              m.localizedFoodInstruction || localizeFoodInstruction(m.foodInstruction, language)
            )}</strong></td>
          </tr>
        </table>
        <div class="med-body">
          <p><strong>${escapeHtml(t.sections.purpose)}:</strong> ${escapeHtml(m.purposeSimple)}</p>
          ${
            m.additionalInstructions
              ? `<p><strong>${escapeHtml(t.medicine.additionalInstructions)}:</strong> ${escapeHtml(m.additionalInstructions)}</p>`
              : ''
          }
          ${
            m.sideEffects && m.sideEffects.length > 0
              ? `<p><strong>${escapeHtml(t.sections.sideEffects)}:</strong> ${escapeHtml(m.sideEffects.join('; '))}</p>`
              : ''
          }
          ${
            m.precautions && m.precautions.length > 0
              ? `<p><strong>${escapeHtml(t.sections.precautions)}:</strong> ${escapeHtml(m.precautions.join(' • '))}</p>`
              : ''
          }
          ${
            m.isUncertain && m.uncertainReason
              ? `<p class="warn-text">⚠ ${escapeHtml(m.uncertainReason)}</p>`
              : ''
          }
        </div>
      </div>`
          )
          .join('');

  const alertsHtml =
    alerts.length === 0
      ? `<p class="muted">${escapeHtml(t.safety.noConflictsTitle)}</p>`
      : alerts
          .map(
            (a) => `
      <div class="alert-box" style="${severityStyle(a.severity)}">
        <div class="alert-top">
          <strong>${escapeHtml(a.title)}</strong>
          <span class="sev-badge">${escapeHtml(severityLabel(a.severity))}</span>
        </div>
        ${
          a.medicinesInvolved?.length
            ? `<div style="font-size:10px;margin:3px 0;"><strong>${escapeHtml(t.safety.medicinesInvolved)}:</strong> ${escapeHtml(a.medicinesInvolved.join(', '))}</div>`
            : ''
        }
        <div style="font-size:11px;margin:4px 0;">${escapeHtml(a.description)}</div>
        <div style="font-size:10.5px;margin-top:4px;"><strong>${escapeHtml(t.safety.recommendedNextStep)}:</strong> ${escapeHtml(a.recommendation)}</div>
      </div>`
          )
          .join('');

  const investigationsHtml =
    !rx.investigations || rx.investigations.length === 0
      ? `<p class="muted">${escapeHtml(t.investigations.noTestsListed)}</p>`
      : `<table class="data-table">
          <thead>
            <tr>
              <th>${escapeHtml(t.investigations.diagnosticTestsTitle)}</th>
              <th>${escapeHtml(t.investigations.purposeLabel)}</th>
              <th>${escapeHtml(t.investigations.preparationLabel)}</th>
              <th>${escapeHtml(t.investigations.dueLabel)}</th>
            </tr>
          </thead>
          <tbody>
            ${rx.investigations
              .map(
                (inv) => `
              <tr>
                <td><strong>${escapeHtml(inv.name)}</strong></td>
                <td>${escapeHtml(inv.purpose)}</td>
                <td>${escapeHtml(inv.instructions || unavailable)}</td>
                <td>${escapeHtml(inv.dueDate || unavailable)}</td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>`;

  const generatedDate = new Date().toISOString().split('T')[0];

  return `<!DOCTYPE html>
<html lang="${escapeHtml(language)}" dir="${isRtl ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8" />
  <title>Cure — ${escapeHtml(t.pdf.reportTitle)}</title>
  <style>
    @page {
      size: A4;
      margin: 14mm 12mm 16mm 12mm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: ${fontStack};
      color: #1e293b;
      font-size: 11.5px;
      line-height: 1.5;
      margin: 0;
      padding: 0;
      direction: ${isRtl ? 'rtl' : 'ltr'};
      text-align: ${isRtl ? 'right' : 'left'};
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #0d9488;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      color: #0f766e;
      margin: 0;
    }
    .brand-sub {
      font-size: 11px;
      color: #475569;
      margin: 2px 0 0 0;
    }
    .lang-pill {
      display: inline-block;
      background: #f0fdfa;
      border: 1px solid #99f6e4;
      color: #0f766e;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
    }
    .section {
      margin-bottom: 14px;
      page-break-inside: avoid;
    }
    .section-wide {
      margin-bottom: 14px;
    }
    .section-title {
      font-size: 13px;
      font-weight: 800;
      color: #0f766e;
      background: #f0fdfa;
      border-${isRtl ? 'right' : 'left'}: 4px solid #0d9488;
      padding: 5px 10px;
      margin: 0 0 8px 0;
      border-radius: 4px;
    }
    .info-grid {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 6px;
    }
    .info-grid td {
      padding: 5px 8px;
      border: 1px solid #e2e8f0;
      vertical-align: top;
      font-size: 11px;
    }
    .lbl {
      color: #64748b;
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .diag-chip {
      display: inline-block;
      background: #ecfdf5;
      border: 1px solid #6ee7b7;
      color: #065f46;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 700;
      margin: 2px 4px 4px 0;
      font-size: 11px;
    }
    .med-card {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      margin-bottom: 10px;
      overflow: hidden;
      page-break-inside: avoid;
    }
    .med-header {
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      padding: 7px 10px;
    }
    .med-index {
      display: inline-block;
      background: #0d9488;
      color: #fff;
      width: 18px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      border-radius: 50%;
      font-size: 10px;
      font-weight: 700;
      margin-${isRtl ? 'left' : 'right'}: 6px;
    }
    .med-title {
      font-size: 12.5px;
      font-weight: 800;
      color: #0f172a;
    }
    .med-sub {
      font-size: 10px;
      color: #64748b;
      margin-top: 2px;
    }
    .strength-pill {
      display: inline-block;
      background: #ccfbf1;
      color: #115e59;
      padding: 1px 7px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 700;
      margin-${isRtl ? 'right' : 'left'}: 6px;
    }
    .warn-pill {
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      padding: 1px 7px;
      border-radius: 999px;
      font-size: 9.5px;
      font-weight: 700;
      margin-${isRtl ? 'right' : 'left'}: 6px;
    }
    .mini-grid {
      width: 100%;
      border-collapse: collapse;
    }
    .mini-grid td {
      padding: 5px 8px;
      border-bottom: 1px solid #e2e8f0;
      border-${isRtl ? 'left' : 'right'}: 1px solid #f1f5f9;
      font-size: 10.5px;
    }
    .med-body {
      padding: 7px 10px;
      font-size: 10.5px;
    }
    .med-body p {
      margin: 3px 0;
    }
    .warn-text {
      color: #92400e;
      background: #fffbeb;
      padding: 4px 6px;
      border-radius: 4px;
      font-weight: 600;
    }
    .alert-box {
      border: 1px solid;
      border-radius: 8px;
      padding: 8px 10px;
      margin-bottom: 8px;
      page-break-inside: avoid;
    }
    .alert-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      font-size: 11.5px;
    }
    .sev-badge {
      font-size: 9.5px;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 999px;
      background: rgba(255,255,255,0.75);
      border: 1px solid currentColor;
      white-space: nowrap;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10.5px;
    }
    .data-table th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      padding: 6px 8px;
      border: 1px solid #cbd5e1;
      text-align: ${isRtl ? 'right' : 'left'};
    }
    .data-table td {
      padding: 6px 8px;
      border: 1px solid #e2e8f0;
      vertical-align: top;
    }
    .slot-med {
      margin-bottom: 4px;
    }
    .pill-badge {
      display: inline-block;
      background: #f1f5f9;
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 10px;
      margin: 0 4px;
    }
    .food-badge {
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 10px;
    }
    .disclaimer-box {
      background: #fffbeb;
      border: 1px solid #fcd34d;
      border-radius: 8px;
      padding: 9px 12px;
      font-size: 10px;
      color: #78350f;
      margin-top: 12px;
      page-break-inside: avoid;
    }
    .muted {
      color: #64748b;
      font-style: italic;
    }
    ul {
      margin: 4px 0;
      padding-${isRtl ? 'right' : 'left'}: 18px;
    }
    li { margin-bottom: 3px; }
  </style>
</head>
<body>
  <div class="header-bar">
    <div>
      <h1 class="brand-title">${escapeHtml(t.appTitle)}</h1>
      <p class="brand-sub">${escapeHtml(t.pdf.reportTitle)}</p>
    </div>
    <div style="text-align:${isRtl ? 'left' : 'right'};">
      <div class="lang-pill">${escapeHtml(langInfo.nativeName)} (${escapeHtml(langInfo.name)})</div>
      <div style="font-size:10px;color:#64748b;margin-top:4px;">${escapeHtml(t.pdf.generatedOn)}: ${escapeHtml(generatedDate)}</div>
    </div>
  </div>

  <!-- 1. Patient & Prescription Info -->
  <div class="section">
    <h2 class="section-title">${escapeHtml(t.pdf.patientInfoSection)}</h2>
    <table class="info-grid">
      <tr>
        <td><span class="lbl">${escapeHtml(t.review.fullName)}</span><br/><strong>${escapeHtml(rx.patientDetails.name || unavailable)}</strong></td>
        <td><span class="lbl">${escapeHtml(t.review.age)} / ${escapeHtml(t.review.gender)}</span><br/><strong>${escapeHtml(rx.patientDetails.age ?? unavailable)} / ${escapeHtml(rx.patientDetails.gender || unavailable)}</strong></td>
        <td><span class="lbl">${escapeHtml(t.review.rxDate)}</span><br/><strong>${escapeHtml(rx.patientDetails.date || unavailable)}</strong></td>
      </tr>
      <tr>
        <td><span class="lbl">${escapeHtml(t.review.doctorName)}</span><br/><strong>${escapeHtml(rx.patientDetails.doctorName || unavailable)}</strong></td>
        <td><span class="lbl">${escapeHtml(t.review.hospitalName)}</span><br/><strong>${escapeHtml(rx.patientDetails.hospitalName || unavailable)}</strong></td>
        <td><span class="lbl">${escapeHtml(t.patient.uhid)}</span><br/><strong>${escapeHtml(rx.patientDetails.uhid || unavailable)}</strong></td>
      </tr>
      <tr>
        <td colspan="2"><span class="lbl">${escapeHtml(t.patient.documentedAllergies)}</span><br/><strong>${
          rx.patientDetails.allergies?.length
            ? escapeHtml(rx.patientDetails.allergies.join(', '))
            : escapeHtml(t.patient.noAllergiesRecorded)
        }</strong></td>
        <td><span class="lbl">${escapeHtml(t.patient.existingMedications)}</span><br/><strong>${
          rx.patientDetails.existingMedications?.length
            ? escapeHtml(rx.patientDetails.existingMedications.join(', '))
            : escapeHtml(t.patient.noExistingMeds)
        }</strong></td>
      </tr>
    </table>
  </div>

  <!-- 2. Diagnosis & Symptoms -->
  <div class="section">
    <h2 class="section-title">${escapeHtml(t.pdf.diagnosisSection)}</h2>
    <div>
      ${
        diagnoses.length > 0
          ? diagnoses.map((d) => `<span class="diag-chip">${escapeHtml(d)}</span>`).join('')
          : `<span class="muted">${escapeHtml(unavailable)}</span>`
      }
    </div>
    <p style="margin:6px 0;">${escapeHtml(rx.diagnosisSimplified || unavailable)}</p>
    ${
      rx.symptoms?.length
        ? `<p style="margin:4px 0;"><strong>${escapeHtml(t.sections.symptoms)}:</strong> ${escapeHtml(rx.symptoms.join(', '))}</p>`
        : ''
    }
  </div>

  <!-- 3. Prescribed Medications -->
  <div class="section-wide">
    <h2 class="section-title">${escapeHtml(t.pdf.medicinesSection)} (${rx.medicines.length})</h2>
    ${medicinesHtml}
  </div>

  <!-- 4. Daily Medication Timetable -->
  <div class="section">
    <h2 class="section-title">${escapeHtml(t.pdf.timetableSection)}</h2>
    ${
      timetableRows
        ? `<table class="data-table"><tbody>${timetableRows}</tbody></table>`
        : `<p class="muted">${escapeHtml(t.planner.ambiguousDesc)}</p>`
    }
    ${
      ambiguousMeds.length > 0
        ? `<p class="warn-text" style="margin-top:6px;">⚠ ${escapeHtml(t.planner.ambiguousTitle)}: ${escapeHtml(
            ambiguousMeds.map((m) => m.localizedName || m.name).join(', ')
          )}</p>`
        : ''
    }
  </div>

  <!-- 5. Medication Safety Alerts -->
  <div class="section-wide">
    <h2 class="section-title">${escapeHtml(t.pdf.safetySection)} (${alerts.length})</h2>
    ${alertsHtml}
  </div>

  <!-- 6. Investigations -->
  <div class="section">
    <h2 class="section-title">${escapeHtml(t.pdf.investigationsSection)}</h2>
    ${investigationsHtml}
  </div>

  <!-- 7. Follow-Up Appointment -->
  <div class="section">
    <h2 class="section-title">${escapeHtml(t.pdf.followUpSection)}</h2>
    <table class="info-grid">
      <tr>
        <td><span class="lbl">${escapeHtml(t.investigations.consultant)}</span><br/><strong>${escapeHtml(rx.followUp?.doctorName || unavailable)}</strong></td>
        <td><span class="lbl">${escapeHtml(t.investigations.department)}</span><br/><strong>${escapeHtml(rx.followUp?.department || unavailable)}</strong></td>
        <td><span class="lbl">${escapeHtml(t.investigations.scheduled)}</span><br/><strong>${escapeHtml(rx.followUp?.appointmentDate || t.investigations.dateNotSpecified)}</strong></td>
      </tr>
      <tr>
        <td colspan="3"><span class="lbl">${escapeHtml(t.investigations.preVisitInstructions)}</span><br/>${escapeHtml(rx.followUp?.instructions || unavailable)}</td>
      </tr>
    </table>
  </div>

  <!-- 8. Precautions & Dietary Advice -->
  ${
    (rx.generalPrecautions?.length || rx.dietaryAdvice?.length)
      ? `<div class="section">
          <h2 class="section-title">${escapeHtml(t.pdf.adviceSection)}</h2>
          <table class="info-grid">
            <tr>
              <td style="width:50%;">
                <strong>${escapeHtml(t.sections.generalPrecautions)}</strong>
                <ul>${(rx.generalPrecautions || []).map((p) => `<li>${escapeHtml(p)}</li>`).join('') || `<li>${escapeHtml(unavailable)}</li>`}</ul>
              </td>
              <td style="width:50%;">
                <strong>${escapeHtml(t.sections.dietaryAdvice)}</strong>
                <ul>${(rx.dietaryAdvice || []).map((d) => `<li>${escapeHtml(d)}</li>`).join('') || `<li>${escapeHtml(unavailable)}</li>`}</ul>
              </td>
            </tr>
          </table>
        </div>`
      : ''
  }

  <!-- 9. Medical Disclaimer -->
  <div class="disclaimer-box">
    <strong>${escapeHtml(t.pdf.disclaimerSection)}:</strong> ${escapeHtml(t.disclaimerText)}
  </div>
</body>
</html>`;
}

export async function generateTreatmentReportPdf(
  prescription: PrescriptionData,
  alerts: SafetyAlert[],
  language: SupportedLanguage
): Promise<{ buffer: Buffer; fileName: string }> {
  const executablePath = findBrowserExecutable();
  if (!executablePath) {
    throw new Error(
      'No local Chromium/Chrome/Edge browser executable found for Unicode PDF rendering. Set CHROMIUM_PATH in .env.local.'
    );
  }

  // Ensure the clinical content matches the requested language even if called directly via API
  let effectiveRx = prescription;
  let effectiveAlerts = alerts;
  if (prescription.translationMeta?.language !== language) {
    const translated = await translateClinicalBundle(prescription, alerts, language);
    effectiveRx = translated.prescription;
    effectiveAlerts = translated.alerts;
  }

  const html = buildReportHtml(effectiveRx, effectiveAlerts, language);
  const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  const fileName = `Cure_Treatment_Report_${langInfo.name}.pdf`;

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load', timeout: 20000 });
    const pdfUint8 = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="width:100%;font-size:8px;color:#64748b;padding:0 14mm;display:flex;justify-content:space-between;font-family:Segoe UI,Arial,sans-serif;">
          <span>Cure — Multilingual Prescription &amp; Medication Safety Assistant</span>
          <span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span>
        </div>`,
      margin: {
        top: '12mm',
        bottom: '16mm',
        left: '10mm',
        right: '10mm',
      },
    });

    const buffer = Buffer.from(pdfUint8);
    if (buffer.length < 500 || !buffer.subarray(0, 5).toString('ascii').startsWith('%PDF-')) {
      throw new Error('Generated PDF failed header or size validation.');
    }

    return { buffer, fileName };
  } finally {
    await browser.close();
  }
}
