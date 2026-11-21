/**
 * Captures real live screenshots of Cure's rebuilt Cloud + Local Vision AI workflow
 * using puppeteer-core against a live Next.js production server.
 */
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import puppeteer from 'puppeteer-core';

const PORT = 3015;
const BASE_URL = `http://localhost:${PORT}`;
const OUT_DIR = path.resolve(process.cwd(), 'evidence', 'vision-ai-screens');
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
  throw new Error('Could not find local Chrome/Edge executable.');
}

async function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // retry
    }
    await wait(300);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function main() {
  const server = spawn('cmd', ['/c', `npx next start -p ${PORT}`], {
    cwd: process.cwd(),
    stdio: 'ignore',
  });

  const browser = await puppeteer.launch({
    executablePath: findBrowserExecutable(),
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    await waitForServer(`${BASE_URL}/api/ai/status`);
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 1.5 });

    // 1. Dashboard (showing updated Categorical Confidence & AI Diagnostics link)
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await wait(500);
    await page.screenshot({ path: path.join(OUT_DIR, '01_dashboard_categorical_confidence.png'), fullPage: false });

    // 2. Click "Upload Rx" in Navbar to open redesigned UploadSection
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const uploadBtn = btns.find((b) => /upload rx|upload prescription/i.test(b.textContent || ''));
      if (uploadBtn) uploadBtn.click();
    });
    await wait(900);
    await page.screenshot({ path: path.join(OUT_DIR, '02_upload_vision_ai_providers.png'), fullPage: true });

    // 3. Select Local Qwen AI + Typed Prescription Text tab, enter synthetic Rx, submit to prove honest error (no fake demo data)
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const localBtn = btns.find((b) => /Local Qwen AI/i.test(b.textContent || ''));
      if (localBtn) localBtn.click();
      const textTab = btns.find((b) => /Typed Prescription Text/i.test(b.textContent || ''));
      if (textTab) textTab.click();
    });
    await wait(400);
    await page.type('textarea', 'Patient: Synthetic Browser Check\nRx: Tab. Metformin 500mg 1-0-1 After food x 30 days');
    await wait(250);
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const submitBtn = btns.find((b) => /Process Prescription/i.test(b.textContent || ''));
      if (submitBtn) submitBtn.click();
    });
    await wait(1200);
    await page.screenshot({ path: path.join(OUT_DIR, '03_upload_local_mode_honest_error.png'), fullPage: true });

    // 4. Open /ai-diagnostics page showing live Gemini + Ollama status, Windows setup, and sanitized last run telemetry
    await page.goto(`${BASE_URL}/ai-diagnostics`, { waitUntil: 'networkidle2' });
    await wait(700);
    await page.screenshot({ path: path.join(OUT_DIR, '04_ai_diagnostics_page.png'), fullPage: true });

    // 5. Return to Cure Home -> Editable Review tab (showing updated Allergy Status selector)
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await wait(500);
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const revBtn = btns.find((b) => /Review\s*&\s*Edit/i.test(b.textContent || ''));
      if (revBtn) revBtn.click();
    });
    await wait(600);
    await page.screenshot({ path: path.join(OUT_DIR, '05_review_edit_allergy_status.png'), fullPage: true });

    console.log(`Captured all 5 live Vision AI workflow screenshots in ${OUT_DIR}`);
  } finally {
    await browser.close();
    try {
      spawn('taskkill', ['/PID', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
    } catch {
      server.kill();
    }
  }
}

main().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
