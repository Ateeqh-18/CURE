'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { PrescriptionData, ProviderAttempt, ProviderMode } from '@/lib/types';
import {
  Activity,
  ArrowLeft,
  Cloud,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Upload,
  Play,
  Loader2,
  Terminal,
  ShieldCheck,
  Clock,
  Layers,
  Code2,
  FileText,
  Lock,
} from 'lucide-react';

interface ProviderHealth {
  id: 'gemini' | 'ollama';
  displayName: string;
  configured: boolean;
  reachable: boolean;
  ready: boolean;
  model: string;
  availableModels?: string[];
  baseUrl?: string;
  error?: string;
  setupInstructions?: string[];
}

interface SanitizedDiagnosticRecord {
  timestamp: string;
  requestedMode: ProviderMode;
  activeProvider: 'gemini' | 'ollama' | null;
  model: string | null;
  succeeded: boolean;
  durationMs: number;
  pagesProcessed: number;
  extractedMedicationCount: number;
  extractedFieldCount: number;
  uncertainFieldCount: number;
  attempts: ProviderAttempt[];
  error?: string;
}

interface AiStatusResponse {
  gemini: ProviderHealth;
  ollama: ProviderHealth;
  recommendedActiveProvider: 'gemini' | 'ollama' | 'none';
  lastRun: SanitizedDiagnosticRecord | null;
}

export default function AiDiagnosticsPage() {
  const [status, setStatus] = useState<AiStatusResponse | null>(null);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [probingLive, setProbingLive] = useState(false);

  const [testMode, setTestMode] = useState<'file' | 'text'>('file');
  const [providerMode, setProviderMode] = useState<ProviderMode>('auto');
  const [file, setFile] = useState<File | null>(null);
  const [typedText, setTypedText] = useState(
    'Patient: Test Synthetic Patient, 48/M\nDiagnosis: Acute Viral Fever\nRx:\n1. Tab. Paracetamol 650mg — 1-1-1 After food x 3 days\n2. Tab. Pantoprazole 40mg — 1-0-0 Before breakfast x 5 days\nAllergies: None known (NKDA)'
  );

  const [isRunning, setIsRunning] = useState(false);
  const [runDurationMs, setRunDurationMs] = useState<number | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [runAttempts, setRunAttempts] = useState<ProviderAttempt[]>([]);
  const [extractedData, setExtractedData] = useState<PrescriptionData | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadStatus = useCallback(async (liveCheck = false) => {
    if (liveCheck) setProbingLive(true);
    else setLoadingStatus(true);
    try {
      const res = await fetch(`/api/ai/status${liveCheck ? '?live=1' : ''}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        setStatus(json);
        setLastCheckedAt(new Date().toLocaleTimeString());
      }
    } catch {
      // ignore network failure
    } finally {
      setLoadingStatus(false);
      setProbingLive(false);
    }
  }, []);

  useEffect(() => {
    loadStatus(false);
  }, [loadStatus]);

  const handleRunTest = async () => {
    if (testMode === 'file' && !file) {
      setRunError('Please choose a prescription image (PNG/JPG/WEBP) or PDF file.');
      return;
    }
    if (testMode === 'text' && !typedText.trim()) {
      setRunError('Please enter synthetic prescription text to test.');
      return;
    }

    setIsRunning(true);
    setRunError(null);
    setRunAttempts([]);
    setExtractedData(null);
    setRunDurationMs(null);

    const started = performance.now();
    try {
      const formData = new FormData();
      formData.append('providerMode', providerMode);
      if (testMode === 'file' && file) {
        formData.append('file', file);
      } else {
        formData.append('typedText', typedText.trim());
      }

      const res = await fetch('/api/process-prescription', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      setRunDurationMs(json.diagnostic?.durationMs ?? Math.round(performance.now() - started));
      setRunAttempts(Array.isArray(json.attempts) ? json.attempts : []);

      const rx: PrescriptionData | undefined = json.prescription || json.data;
      if (!res.ok || !json.success || !rx) {
        setRunError(
          json.error || `Processing failed (HTTP ${res.status}). No fake or demo data returned.`
        );
      } else {
        setExtractedData(rx);
      }
      await loadStatus(false);
    } catch (err: any) {
      setRunError(err?.message || 'Network or runtime error while running diagnostic test.');
    } finally {
      setIsRunning(false);
    }
  };

  const gemini = status?.gemini;
  const ollama = status?.ollama;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Cure</span>
            </Link>
            <div>
              <h1 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" />
                <span>Cure — AI Provider Diagnostics</span>
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Direct Multimodal Vision AI Architecture (Gemini Cloud Primary + Local Qwen2.5-VL Fallback • Zero Tesseract OCR)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadStatus(false)}
              disabled={loadingStatus}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingStatus ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={() => loadStatus(true)}
              disabled={probingLive}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5"
            >
              {probingLive ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5" />
              )}
              <span>Test Live Connections</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Privacy Guarantee Notice */}
        <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-2xl text-xs text-teal-950 flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-teal-700 flex-shrink-0" />
          <span>
            <strong>Security &amp; Privacy Guarantee:</strong> API keys remain strictly server-side and are never rendered in the browser. Telemetry records only sanitized structural metrics — never patient names, prescription text, or secrets.
          </span>
        </div>

        {/* Provider Status Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Active / Recommended Provider Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Routing
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  status?.recommendedActiveProvider === 'none'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {loadingStatus
                  ? 'Checking...'
                  : status?.recommendedActiveProvider === 'gemini'
                  ? 'Gemini Cloud Primary'
                  : status?.recommendedActiveProvider === 'ollama'
                  ? 'Local Qwen AI Ready'
                  : 'No Provider Ready'}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Automatic Mode:</strong> Tries Gemini Vision Cloud first, then seamlessly falls back to Local Qwen2.5-VL via Ollama if cloud fails or is unconfigured.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Local Qwen AI Mode:</strong> Enforces strict on-device isolation — never sends patient documents to cloud endpoints.
            </p>
            <div className="text-[11px] text-slate-400 pt-1">
              Last checked: {lastCheckedAt || '—'}
            </div>
          </div>

          {/* Gemini Cloud Status Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Cloud className="w-5 h-5 text-sky-600" />
                <span>Gemini Vision (Cloud)</span>
              </div>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  gemini?.ready
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {gemini?.ready ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <AlertTriangle className="w-3 h-3" />
                )}
                {loadingStatus ? '...' : gemini?.ready ? 'Ready' : 'Not Configured'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[10px] text-slate-500">API Key Status</div>
                <div className="font-bold text-slate-800">
                  {gemini?.configured ? 'Present (Server-side)' : 'Missing'}
                </div>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[10px] text-slate-500">Configured Model</div>
                <div className="font-bold text-slate-800 font-mono text-[11px]">
                  {gemini?.model || 'gemini-2.5-flash'}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              {loadingStatus
                ? 'Loading status...'
                : gemini?.ready
                ? 'Configured on server and ready for Vision AI processing.'
                : gemini?.error || 'GEMINI_API_KEY is not configured.'}
            </p>
            {gemini?.setupInstructions && gemini.setupInstructions.length > 0 && (
              <ul className="text-[11px] bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-lg list-disc ps-5 space-y-0.5">
                {gemini.setupInstructions.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Ollama Local Qwen2.5-VL Status Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Cpu className="w-5 h-5 text-emerald-600" />
                <span>Local Qwen2.5-VL (Ollama)</span>
              </div>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  ollama?.ready
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {ollama?.ready ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <AlertTriangle className="w-3 h-3" />
                )}
                {loadingStatus
                  ? '...'
                  : ollama?.ready
                  ? 'Ready Local'
                  : ollama?.reachable
                  ? 'Model Missing'
                  : 'Not Running'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[10px] text-slate-500">Ollama Endpoint</div>
                <div className="font-bold text-slate-800 font-mono text-[11px] truncate">
                  {ollama?.baseUrl || 'http://localhost:11434'}
                </div>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[10px] text-slate-500">Target Vision Model</div>
                <div className="font-bold text-slate-800 font-mono text-[11px]">
                  {ollama?.model || 'qwen2.5vl:3b'}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              {loadingStatus
                ? 'Loading status...'
                : ollama?.ready
                ? `Ollama is reachable and ${ollama.model} is available locally.`
                : ollama?.error || 'Ollama server is not reachable.'}
            </p>

            {ollama?.availableModels && ollama.availableModels.length > 0 && (
              <div className="text-[11px] text-slate-600">
                Installed models:{' '}
                <span className="font-mono font-semibold">{ollama.availableModels.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Windows Local AI Setup Box */}
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-sm font-bold text-teal-300 flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span>Windows Setup Guide — Local Qwen2.5-VL (3B Recommended for 16 GB RAM CPU/GPU)</span>
            </h2>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Never auto-downloaded without consent
            </span>
          </div>
          <pre className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
{`# 1. Install Ollama on Windows
winget install Ollama.Ollama

# 2. Pull the 16 GB RAM-friendly Vision model (~3.2 GB)
ollama pull qwen2.5vl:3b

# 3. Verify Ollama server is listening on http://localhost:11434
ollama list
ollama serve`}
          </pre>
        </div>

        {/* Live Processing Test Runner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Play className="w-4 h-4 text-teal-600" />
                <span>Live Vision AI Pipeline Test</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload a synthetic prescription image/PDF or test typed text through <code className="font-mono">/api/process-prescription</code>.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <label className="text-xs font-semibold text-slate-600">Provider Mode:</label>
              <select
                value={providerMode}
                onChange={(e) => setProviderMode(e.target.value as ProviderMode)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold bg-white text-slate-800"
              >
                <option value="auto">Automatic (Gemini → Ollama)</option>
                <option value="gemini">Gemini Cloud Only</option>
                <option value="ollama">Local Qwen AI Only (Offline)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTestMode('file')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                testMode === 'file'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Image / PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setTestMode('text')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                testMode === 'text'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Synthetic Typed Text</span>
            </button>
          </div>

          {testMode === 'file' ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-teal-400 rounded-xl p-6 text-center cursor-pointer bg-slate-50/50"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                    setRunError(null);
                  }
                }}
              />
              <Upload className="w-7 h-7 text-teal-600 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-800">
                {file
                  ? `Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`
                  : 'Click to choose a synthetic prescription image (PNG/JPG/WEBP) or PDF'}
              </div>
            </div>
          ) : (
            <textarea
              rows={5}
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl font-mono text-xs text-slate-800 bg-slate-50/50"
            />
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleRunTest}
              disabled={isRunning}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold flex items-center gap-2"
            >
              {isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{isRunning ? 'Processing with Vision AI...' : 'Run Live Diagnostic Test'}</span>
            </button>
          </div>

          {/* Diagnostic Result Output */}
          {runError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-2">
              <div className="font-bold flex items-center gap-2 text-rose-950">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{runError}</span>
              </div>
              {runAttempts.length > 0 && (
                <div className="bg-white rounded-lg p-2.5 border border-rose-200 space-y-1">
                  {runAttempts.map((a, i) => (
                    <div key={i} className="font-mono text-[11px] text-slate-700">
                      [{a.provider} / {a.model}] {a.succeeded ? 'OK' : 'FAILED'} —{' '}
                      {a.error || 'Success'} ({a.durationMs} ms)
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {extractedData && (
            <div className="space-y-3 border-t border-slate-200 pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="text-[10px] text-emerald-700 font-bold uppercase">Provider</div>
                  <div className="font-bold text-emerald-950">
                    {extractedData.aiMeta?.provider} ({extractedData.aiMeta?.model})
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Duration
                  </div>
                  <div className="font-bold text-slate-900">{runDurationMs ?? 0} ms</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                    <Layers className="w-3 h-3" /> Pages / Meds
                  </div>
                  <div className="font-bold text-slate-900">
                    {extractedData.aiMeta?.pagesProcessed || 1} page(s) •{' '}
                    {extractedData.medicines.length} med(s)
                  </div>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="text-[10px] text-amber-700 font-bold uppercase">
                    Uncertain Items
                  </div>
                  <div className="font-bold text-amber-950">
                    {extractedData.uncertainFields.length} flagged
                  </div>
                </div>
              </div>

              <details open className="bg-slate-900 text-slate-100 rounded-xl p-4 text-xs">
                <summary className="cursor-pointer font-bold text-teal-300 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" />
                  <span>Validated Structured Clinical JSON Output</span>
                </summary>
                <pre className="mt-3 overflow-x-auto font-mono text-[11px] text-slate-200 max-h-96">
                  {JSON.stringify(extractedData, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>

        {/* Last Sanitized Server Telemetry */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <span>Last Processing Run Telemetry (Sanitized — Zero PHI / Zero API Keys)</span>
          </h2>

          {status?.lastRun ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-500">Status / Mode</div>
                <div className="font-bold text-slate-900">
                  {status.lastRun.succeeded ? 'Success' : 'Failed'} ({status.lastRun.requestedMode})
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-500">Provider / Model</div>
                <div className="font-bold text-slate-900">
                  {status.lastRun.activeProvider || 'None'} / {status.lastRun.model || '—'}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-500">Duration &amp; Pages</div>
                <div className="font-bold text-slate-900">
                  {status.lastRun.durationMs} ms • {status.lastRun.pagesProcessed} page(s)
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] text-slate-500">Extracted / Uncertain</div>
                <div className="font-bold text-slate-900">
                  {status.lastRun.extractedMedicationCount} meds •{' '}
                  {status.lastRun.extractedFieldCount} fields • {status.lastRun.uncertainFieldCount}{' '}
                  uncertain
                </div>
              </div>
              {status.lastRun.error && (
                <div className="col-span-2 sm:col-span-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs">
                  <strong>Last Error:</strong> {status.lastRun.error}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              No prescription processing runs recorded since the server started. Run a live diagnostic test above to populate sanitized telemetry.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
