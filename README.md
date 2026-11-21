# Cure — Multilingual Prescription & Medication Safety Assistant

> **AI-Powered Multilingual Prescription & Hospital Discharge Summary Understanding Platform for Patients in India**

**Cure** converts handwritten and printed doctor prescriptions and multi-page hospital discharge summaries into clear, actionable treatment guides across **12 Indian languages**, complete with human verification, independent clinical drug-safety checks, daily dose tracking, and real multilingual Unicode PDF reports.

---

## Direct Multimodal Vision AI Pipeline (Zero Tesseract OCR)

Cure uses a **direct Image/PDF → Vision AI → Validated Clinical JSON** pipeline:

1. **Primary Cloud Provider — Google Gemini Vision (`lib/ai/gemini-provider.ts`)**
   - Uses the official `@google/genai` SDK (`GEMINI_API_KEY`, default model `gemini-3.8-flash` with fallback to `gemini-3.5-flash-lite`).
   - Accepts prescription images (`PNG`, `JPG`, `JPEG`, `WEBP`), native PDFs (with automatic `mupdf` page-render fallback), and typed prescription text directly.

2. **Local Offline Fallback Provider — Qwen2.5-VL via Ollama (`lib/ai/ollama-provider.ts`)**
   - Connects to local Ollama (`OLLAMA_BASE_URL=http://localhost:11434`, default model `OLLAMA_VISION_MODEL=qwen2.5vl:3b`).
   - Sized for **16 GB RAM Windows CPU/GPU systems** using 1-page batching and bounded context (`num_ctx: 4096`).
   - When **Local Qwen AI** mode is selected, Cure enforces strict on-device isolation — patient documents never leave the local machine.
   - Cure never auto-downloads models without user consent.

3. **Intelligent Provider Routing (`lib/ai/provider-manager.ts`, `app/api/process-prescription/route.ts`)**
   - `auto` (default): Gemini Cloud first → automatic fallback to Local Qwen2.5-VL if cloud is unconfigured/unreachable.
   - `gemini`: Gemini Cloud only.
   - `ollama`: Local Qwen2.5-VL only (zero cloud traffic).
   - Never masks provider failures with fabricated or demo data.

4. **Strict Zod Clinical Validation & Safety Rules (`lib/ai/clinical-extraction-schema.ts`, `lib/ai/clinical-validation.ts`)**
   - Categorical confidence (`high` | `medium` | `low`) — no fabricated numeric percentages.
   - Preserves `originalWrittenName` alongside interpreted generic/brand/active-ingredient names.
   - Separates `allergyStatus: 'documented' | 'none_documented' | 'unknown'`.
   - Never guesses illegible drugs or invents missing strengths, dosages, durations, or follow-up dates.

5. **AI Provider Diagnostics (`/ai-diagnostics`, alias `/ocr-diagnostics`)**
   - Displays Gemini configuration/reachability, Ollama connection & local model availability, Windows setup commands, live Vision AI test upload/typed-text runner, and sanitized telemetry (zero API keys or patient PHI).

---

## Preserved Cure Modules

- **Editable Prescription Review** (`components/ReviewEditSection.tsx`): Human-in-the-loop review with categorical confidence, source page badges, allergy status confirmation, and propagation to all downstream modules.
- **12-Language UI & Clinical Localization** (`components/LanguageContext.tsx`, `lib/translations.ts`, `lib/clinical-translator.ts`): English, Kannada, Hindi, Tamil, Telugu, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Odia, and Urdu (full RTL).
- **Independent Medication Safety Engine** (`lib/safety-engine.ts`, `lib/drug-database.ts`): Drug-drug interactions, duplicate active ingredients, dosage safety, allergy conflicts, existing medication conflicts, and missing-field alerts.
- **Daily Medication Planner & Investigation Tracker** (`components/MedicationPlanner.tsx`, `components/InvestigationTracker.tsx`).
- **Multilingual A4 PDF Export** (`lib/pdf-generator.ts`, `app/api/pdf/route.ts`): Real Unicode PDF generation via local Chrome/Edge + `puppeteer-core`.

---

## Windows Setup: Local Qwen2.5-VL (3B) via Ollama

Recommended for Windows laptops/desktops with **16 GB RAM** (CPU or GPU):

```powershell
# 1. Install Ollama on Windows
winget install Ollama.Ollama

# 2. Download the 16 GB RAM-friendly multimodal Vision model (~3.2 GB)
ollama pull qwen2.5vl:3b

# 3. Verify the model is installed
ollama list

# 4. Ensure Ollama is running on http://localhost:11434
ollama serve
```

Then verify connection in Cure at **[http://localhost:3000/ai-diagnostics](http://localhost:3000/ai-diagnostics)**.

---

## Running Cure

```bash
npm install
npm run build
npm run start
```

Open **[http://localhost:3000](http://localhost:3000)** and **[http://localhost:3000/ai-diagnostics](http://localhost:3000/ai-diagnostics)**.

### Environment Variables (`.env.local`)

```env
GEMINI_API_KEY=                     # Optional: enables Gemini Cloud Vision AI
GEMINI_MODEL=gemini-3.8-flash       # Optional: Gemini Vision model
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_VISION_MODEL=qwen2.5vl:3b
CHROMIUM_PATH=                      # Optional: auto-detected for PDF export
```

---

## Automated Verification & 10-Case AI Test Suite

With the server running on `http://localhost:3000`:

```bash
# 1. Generate all 10 synthetic prescription test fixtures (printed, handwritten, ambiguous, multi-med, blurry, rotated, 3-page PDF, mixed, typed text, missing dosage)
node scripts/generate-ai-fixtures.mjs

# 2. Run the factual AI Vision & Safety Pipeline test suite (never mocks unavailable providers; marks them NOT RUN honestly)
node scripts/test-ai-pipeline.mjs

# 3. Verify multilingual PDF reports across all 12 languages
node scripts/test-pdf-multilingual.mjs
```
