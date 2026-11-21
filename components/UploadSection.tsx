'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  PrescriptionData,
  SupportedLanguage,
  ProviderMode,
  ProviderAttempt,
} from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';
import {
  Upload,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  ShieldCheck,
  FileUp,
  FileText,
  Image as ImageIcon,
  Keyboard,
  Cloud,
  Cpu,
  Zap,
  RefreshCw,
  ArrowRight,
  Lock,
  Activity,
  Terminal,
} from 'lucide-react';

interface UploadSectionProps {
  onSuccess: (prescription: PrescriptionData) => void;
  onOpenDemo: () => void;
  currentLanguage: SupportedLanguage;
}

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

interface ProviderStatusSnapshot {
  recommendedActiveProvider: 'gemini' | 'ollama' | 'none';
  gemini: ProviderHealth;
  ollama: ProviderHealth;
}

type InputTab = 'image' | 'pdf' | 'text';

export const UploadSection: React.FC<UploadSectionProps> = ({
  onSuccess,
  onOpenDemo,
  currentLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const [inputTab, setInputTab] = useState<InputTab>('image');
  const [providerMode, setProviderMode] = useState<ProviderMode>('auto');
  const [providerStatus, setProviderStatus] = useState<ProviderStatusSnapshot | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [manualText, setManualText] = useState('');
  const [patientAllergies, setPatientAllergies] = useState('');
  const [patientExistingMeds, setPatientExistingMeds] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorAttempts, setErrorAttempts] = useState<ProviderAttempt[]>([]);
  const [extractedPreview, setExtractedPreview] = useState<PrescriptionData | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProviderStatus = useCallback(async () => {
    setIsLoadingStatus(true);
    try {
      const res = await fetch('/api/ai/status', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setProviderStatus(json);
      }
    } catch {
      // Keep status null if request fails
    } finally {
      setIsLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    fetchProviderStatus();
  }, [fetchProviderStatus]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setErrorMessage(null);
    setErrorAttempts([]);
    setExtractedPreview(null);

    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      setInputTab('pdf');
      setPreviewUrl(null);
    } else if (file.type.startsWith('image/')) {
      setInputTab('image');
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const canSubmit =
    inputTab === 'text' ? manualText.trim().length > 0 : Boolean(selectedFile);

  const handleProcess = async () => {
    if (!canSubmit) {
      setErrorMessage(
        inputTab === 'text'
          ? 'Please enter or paste the prescription text before processing.'
          : 'Please upload a prescription image (PNG/JPG/WEBP) or PDF document.'
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setErrorAttempts([]);
    setExtractedPreview(null);

    const modeLabel =
      providerMode === 'gemini'
        ? 'Gemini Cloud Vision AI'
        : providerMode === 'ollama'
        ? 'Local Qwen2.5-VL (Ollama)'
        : 'Automatic Vision AI (Gemini Cloud -> Local Qwen2.5-VL)';

    setLoadingStage(
      inputTab === 'text'
        ? `Extracting structured clinical fields via ${modeLabel}...`
        : `Sending document directly to ${modeLabel} (no Tesseract OCR)...`
    );

    try {
      const formData = new FormData();
      formData.append('providerMode', providerMode);

      if (inputTab === 'text') {
        formData.append('typedText', manualText.trim());
      } else if (selectedFile) {
        formData.append('file', selectedFile);
      }

      if (patientAllergies.trim()) {
        formData.append('patientAllergies', patientAllergies.trim());
      }
      if (patientExistingMeds.trim()) {
        formData.append('patientExistingMeds', patientExistingMeds.trim());
      }

      const res = await fetch('/api/process-prescription', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      const prescription: PrescriptionData | undefined = json.prescription || json.data;

      if (!res.ok || !json.success || !prescription) {
        setErrorAttempts(Array.isArray(json.attempts) ? json.attempts : []);
        throw new Error(
          json.error ||
            `Vision AI processing could not complete (HTTP ${res.status}). No fake or demo data was substituted.`
        );
      }

      if (previewUrl) {
        prescription.documentUrl = previewUrl;
      }

      setExtractedPreview(prescription);
      fetchProviderStatus();
    } catch (err: any) {
      console.error('Prescription Vision AI processing error:', err);
      setErrorMessage(
        err?.message ||
          'Vision AI processing failed. Please verify provider configuration or try again.'
      );
    } finally {
      setIsLoading(false);
      setLoadingStage('');
    }
  };

  const geminiReady = providerStatus?.gemini?.ready ?? false;
  const ollamaReady = providerStatus?.ollama?.ready ?? false;
  const ollamaModelName = providerStatus?.ollama?.model || 'qwen2.5vl:3b';

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileUp className="w-6 h-6 text-teal-600" />
            <span>{t.upload.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Direct multimodal Vision AI document understanding — Gemini Cloud primary with Local Qwen2.5-VL (Ollama) fallback.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/ai-diagnostics"
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all"
          >
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Diagnostics</span>
          </Link>
          <button
            type="button"
            onClick={onOpenDemo}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 hover:border-teal-300 text-teal-800 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-all"
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>{t.upload.tryDemoBtn}</span>
          </button>
        </div>
      </div>

      {/* AI Provider Selector & Live Availability Panel */}
      <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-teal-600" />
              <span>Vision AI Processing Provider</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Choose automatic cloud-to-local failover, Cloud Gemini only, or strict 100% on-device Local Qwen2.5-VL.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchProviderStatus}
            disabled={isLoadingStatus}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-700 hover:text-teal-900 px-2.5 py-1 rounded-lg bg-white border border-slate-200 w-fit"
          >
            <RefreshCw className={`w-3 h-3 ${isLoadingStatus ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>
        </div>

        {/* 3 Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Automatic */}
          <button
            type="button"
            onClick={() => setProviderMode('auto')}
            className={`text-start p-3.5 rounded-xl border transition-all ${
              providerMode === 'auto'
                ? 'bg-teal-50/70 border-teal-500 ring-1 ring-teal-400'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-teal-600" />
                Automatic
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                Recommended
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
              Uses Gemini Cloud Vision first; falls back automatically to Local Qwen AI if cloud is unavailable.
            </p>
          </button>

          {/* Gemini Cloud */}
          <button
            type="button"
            onClick={() => setProviderMode('gemini')}
            className={`text-start p-3.5 rounded-xl border transition-all ${
              providerMode === 'gemini'
                ? 'bg-teal-50/70 border-teal-500 ring-1 ring-teal-400'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-sky-600" />
                Gemini Cloud
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  geminiReady
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isLoadingStatus ? 'Checking...' : geminiReady ? 'Configured' : 'API Key Needed'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
              Highest accuracy for handwritten prescriptions &amp; multi-page PDFs (
              {providerStatus?.gemini?.model || 'gemini-2.5-flash'}).
            </p>
          </button>

          {/* Local Qwen AI */}
          <button
            type="button"
            onClick={() => setProviderMode('ollama')}
            className={`text-start p-3.5 rounded-xl border transition-all ${
              providerMode === 'ollama'
                ? 'bg-teal-50/70 border-teal-500 ring-1 ring-teal-400'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                Local Qwen AI
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  ollamaReady
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isLoadingStatus ? 'Checking...' : ollamaReady ? 'Ready Local' : 'Not Running'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
              On-device Ollama ({ollamaModelName}). Strict local mode — patient data never leaves this computer.
            </p>
          </button>
        </div>

        {/* Live Status Row */}
        {!isLoadingStatus && providerStatus && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[11px]">
            <div
              className={`p-2.5 rounded-xl border flex items-start gap-2 ${
                geminiReady
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              {geminiReady ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-bold">Gemini Cloud ({providerStatus.gemini.model})</div>
                <div className="mt-0.5">
                  {geminiReady
                    ? 'API key configured on server and ready for Vision AI processing.'
                    : providerStatus.gemini.error || 'GEMINI_API_KEY is not configured.'}
                </div>
              </div>
            </div>

            <div
              className={`p-2.5 rounded-xl border flex items-start gap-2 ${
                ollamaReady
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              {ollamaReady ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-bold">Local Ollama ({ollamaModelName})</div>
                <div className="mt-0.5">
                  {ollamaReady
                    ? `Local Ollama reachable at ${providerStatus.ollama.baseUrl || 'http://localhost:11434'} with ${ollamaModelName} installed.`
                    : providerStatus.ollama.error || 'Ollama is not running on http://localhost:11434.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Windows Setup Helper when Local Qwen AI is selected but unavailable, or neither provider is ready */}
        {!isLoadingStatus && !ollamaReady && (providerMode === 'ollama' || !geminiReady) && (
          <div className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] space-y-1.5">
            <div className="font-bold text-teal-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>Local AI Setup (Windows — 16 GB RAM CPU/GPU Friendly)</span>
            </div>
            <p className="text-slate-300">
              Cure never auto-downloads models without your consent. To enable offline Vision AI, run:
            </p>
            <pre className="p-2 bg-slate-950 rounded-lg font-mono text-[11px] text-emerald-300 overflow-x-auto">
{`winget install Ollama.Ollama
ollama pull ${ollamaModelName}
ollama serve`}
            </pre>
            {!geminiReady && (
              <p className="text-slate-300">
                Or set <code className="text-amber-300">GEMINI_API_KEY</code> in{' '}
                <code className="text-amber-300">.env.local</code> and restart Cure to enable Gemini Cloud Vision.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Input Mode Tabs: Image | PDF | Typed Text */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 flex-wrap">
        <button
          type="button"
          onClick={() => {
            setInputTab('image');
            setErrorMessage(null);
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            inputTab === 'image'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Upload Prescription Image</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setInputTab('pdf');
            setErrorMessage(null);
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            inputTab === 'pdf'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Upload PDF Document</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setInputTab('text');
            setErrorMessage(null);
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            inputTab === 'text'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Keyboard className="w-4 h-4" />
          <span>Typed Prescription Text</span>
        </button>
      </div>

      {/* Input Area */}
      {inputTab === 'text' ? (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 block">
            Enter or Paste Typed Prescription / Discharge Summary
          </label>
          <textarea
            rows={7}
            value={manualText}
            onChange={(e) => {
              setManualText(e.target.value);
              setExtractedPreview(null);
            }}
            placeholder={
              'Example:\nPatient: Ramesh Kumar, 54/M\nDiagnosis: Type 2 Diabetes Mellitus, Hypertension\nRx:\n1. Tab. Metformin 500mg — 1-0-1 After food x 30 days\n2. Tab. Telmisartan 40mg — 1-0-0 Before breakfast x 30 days\nAllergies: Penicillin\nFollow-up: After 4 weeks with HbA1c report'
            }
            className="w-full p-4 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-800 font-mono text-xs leading-relaxed bg-slate-50/40"
          />
          <p className="text-[11px] text-slate-500">
            Typed text is structured directly by the selected AI provider using Cure&apos;s validated clinical schema without inventing missing dosages.
          </p>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-teal-500 bg-teal-50/50 scale-[0.99]'
              : selectedFile
              ? 'border-emerald-400 bg-emerald-50/20'
              : 'border-slate-300 hover:border-teal-400 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={
              inputTab === 'pdf'
                ? 'application/pdf,.pdf'
                : 'image/png,image/jpeg,image/jpg,image/webp'
            }
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            {previewUrl ? (
              <div className="max-h-52 overflow-hidden rounded-xl border border-slate-200 shadow-xs bg-white p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Uploaded prescription preview"
                  className="max-h-48 object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shadow-2xs">
                {selectedFile ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                ) : inputTab === 'pdf' ? (
                  <FileText className="w-7 h-7" />
                ) : (
                  <Upload className="w-7 h-7" />
                )}
              </div>
            )}

            <div>
              {selectedFile ? (
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    {t.upload.selectedFile}: {selectedFile.name}
                  </span>
                  <p className="text-xs text-slate-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB • Click or drop another file to replace
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 text-sm sm:text-base">
                    {inputTab === 'pdf'
                      ? 'Drop a multi-page PDF prescription or discharge summary here'
                      : 'Drop a handwritten or printed prescription photo here'}
                  </span>
                  <p className="text-xs text-slate-400">
                    {inputTab === 'pdf'
                      ? 'PDF up to 20 MB (up to 12 pages processed automatically)'
                      : 'PNG, JPG, JPEG, or WEBP up to 20 MB • Sent directly to Vision AI'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Optional Patient Safety Context */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
        <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>{t.upload.backgroundTitle}</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {t.upload.allergiesHint}
            </label>
            <input
              type="text"
              placeholder="e.g. Penicillin, Sulfa, NSAIDs"
              value={patientAllergies}
              onChange={(e) => setPatientAllergies(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {t.upload.existingMedsHint}
            </label>
            <input
              type="text"
              placeholder="e.g. Ecosprin 75mg, Thyronorm 50mcg"
              value={patientExistingMeds}
              onChange={(e) => setPatientExistingMeds(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Actionable Provider Error Panel (Never Substitutes Fake Demo Data) */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 space-y-2.5">
          <div className="flex items-start gap-2 font-bold text-rose-950">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>

          {errorAttempts.length > 0 && (
            <div className="bg-white/80 border border-rose-200 rounded-xl p-2.5 space-y-1">
              <div className="font-bold text-[11px] uppercase tracking-wider text-rose-700">
                Provider Attempts
              </div>
              {errorAttempts.map((att, idx) => (
                <div key={idx} className="text-[11px] text-slate-700">
                  <strong className="uppercase">{att.provider}</strong> ({att.model}):{' '}
                  {att.succeeded ? 'Succeeded' : att.error || 'Failed'} ({att.durationMs} ms)
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post-Extraction Verification Summary */}
      {extractedPreview && (
        <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-950 text-sm">
                  Prescription Extracted — Human Verification Required
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Processed by{' '}
                  <strong>
                    {extractedPreview.aiMeta?.provider === 'ollama'
                      ? 'Local Qwen AI (Ollama)'
                      : 'Gemini Cloud Vision'}
                  </strong>{' '}
                  ({extractedPreview.aiMeta?.model}) • {extractedPreview.aiMeta?.pagesProcessed || 1}{' '}
                  page(s) • {extractedPreview.aiMeta?.durationMs || 0} ms
                </p>
              </div>
            </div>

            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border w-fit uppercase ${
                extractedPreview.overallConfidenceCategory === 'high'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : extractedPreview.overallConfidenceCategory === 'medium'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-rose-100 text-rose-900 border-rose-300'
              }`}
            >
              Confidence: {extractedPreview.overallConfidenceCategory || 'medium'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-white rounded-xl p-2.5 border border-emerald-200">
              <div className="text-slate-500 text-[11px]">Patient</div>
              <div className="font-bold text-slate-900 truncate">
                {extractedPreview.patientDetails.name}
              </div>
            </div>
            <div className="bg-white rounded-xl p-2.5 border border-emerald-200">
              <div className="text-slate-500 text-[11px]">Medicines Found</div>
              <div className="font-bold text-slate-900">{extractedPreview.medicines.length}</div>
            </div>
            <div className="bg-white rounded-xl p-2.5 border border-emerald-200">
              <div className="text-slate-500 text-[11px]">Needs Verification</div>
              <div className="font-bold text-amber-700">
                {extractedPreview.uncertainFields.length} item(s)
              </div>
            </div>
            <div className="bg-white rounded-xl p-2.5 border border-emerald-200">
              <div className="text-slate-500 text-[11px]">Investigations</div>
              <div className="font-bold text-slate-900">
                {extractedPreview.investigations.length}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <p className="text-[11px] text-emerald-900">
              Review all medicine names, strengths, dosages, and uncertain fields before relying on the schedule.
            </p>
            <button
              type="button"
              onClick={() => onSuccess(extractedPreview)}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Review &amp; Confirm Prescription</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Real Processing State OR Submit Bar */}
      {isLoading ? (
        <div className="p-6 bg-teal-50/70 border border-teal-200 rounded-2xl text-center space-y-3">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              {t.upload.analyzingTitle}
            </h4>
            <p className="text-xs text-teal-800 font-medium">{loadingStage}</p>
            <p className="text-[11px] text-slate-500">
              {providerMode === 'ollama'
                ? 'Local Qwen2.5-VL runs directly on your machine; CPU inference may take 20–90 seconds per page.'
                : 'Validating clinical fields strictly against Cure safety rules...'}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            {providerMode === 'ollama' ? (
              <>
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Local Qwen AI mode: patient prescription data stays strictly on this device.</span>
              </>
            ) : (
              <span>{t.upload.privacyNote}</span>
            )}
          </span>

          <button
            type="button"
            onClick={handleProcess}
            disabled={!canSubmit}
            className="w-full sm:w-auto px-7 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-sm shadow-md shadow-teal-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.actions.processPrescription}</span>
          </button>
        </div>
      )}
    </div>
  );
};
