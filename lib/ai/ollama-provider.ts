import {
  buildTypedTextClinicalPrompt,
  buildVisionClinicalPrompt,
  ClinicalExtractionResult,
} from './clinical-extraction-schema';
import {
  extractJsonFromModelText,
  mergeMultiPageExtractions,
  validateAndNormalizeExtraction,
} from './clinical-validation';
import {
  PrescriptionProcessInput,
  ProviderHealthStatus,
  VisionAiProvider,
} from './provider-interface';

const DEFAULT_OLLAMA_BASE_URL = 'http://localhost:11434';
const DEFAULT_OLLAMA_VISION_MODEL = 'qwen2.5vl:3b';

export const OLLAMA_WINDOWS_SETUP_STEPS = [
  'Install Ollama for Windows from https://ollama.com/download/windows (or run: winget install Ollama.Ollama).',
  'Start Ollama (the tray app runs automatically on http://localhost:11434, or run: ollama serve).',
  'Pull the memory-friendly 3B vision model (recommended for 16 GB RAM): ollama pull qwen2.5vl:3b',
  'Verify the model is installed: ollama list',
];

function modelMatches(installedName: string, requestedModel: string): boolean {
  const normInstalled = installedName.trim().toLowerCase();
  const normReq = requestedModel.trim().toLowerCase();
  if (normInstalled === normReq) return true;
  if (normInstalled === `${normReq}:latest`) return true;
  // Match exact tag prefix if user passed tag
  return false;
}

export class OllamaVisionProvider implements VisionAiProvider {
  readonly id = 'ollama' as const;
  readonly displayName = 'Local Qwen AI' as const;

  getBaseUrl(): string {
    return ((process.env.OLLAMA_BASE_URL || '').trim() || DEFAULT_OLLAMA_BASE_URL).replace(/\/+$/, '');
  }

  getModel(): string {
    return (process.env.OLLAMA_VISION_MODEL || '').trim() || DEFAULT_OLLAMA_VISION_MODEL;
  }

  async getStatus(): Promise<ProviderHealthStatus> {
    const baseUrl = this.getBaseUrl();
    const model = this.getModel();

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${baseUrl}/api/tags`, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!res.ok) {
        return {
          id: 'ollama',
          displayName: 'Local Qwen AI',
          configured: true,
          reachable: false,
          ready: false,
          model,
          baseUrl,
          error: `Ollama responded with HTTP ${res.status} at ${baseUrl}.`,
          setupInstructions: OLLAMA_WINDOWS_SETUP_STEPS,
        };
      }

      const json = await res.json();
      const availableModels: string[] = Array.isArray(json?.models)
        ? json.models.map((m: any) => String(m?.name || '')).filter(Boolean)
        : [];

      const hasModel = availableModels.some((m) => modelMatches(m, model));
      if (!hasModel) {
        return {
          id: 'ollama',
          displayName: 'Local Qwen AI',
          configured: true,
          reachable: true,
          ready: false,
          model,
          availableModels,
          baseUrl,
          error: `Ollama is running, but model "${model}" is not downloaded yet. Run: ollama pull ${model}`,
          setupInstructions: [
            `Run in PowerShell or Terminal: ollama pull ${model}`,
            'Wait for the download (~3.2 GB) to finish, then click Retry or Refresh Status.',
          ],
        };
      }

      return {
        id: 'ollama',
        displayName: 'Local Qwen AI',
        configured: true,
        reachable: true,
        ready: true,
        model,
        availableModels,
        baseUrl,
      };
    } catch (err: any) {
      const reason =
        err?.name === 'AbortError'
          ? `Connection timed out at ${baseUrl}`
          : `Ollama is not running or not installed at ${baseUrl}`;
      return {
        id: 'ollama',
        displayName: 'Local Qwen AI',
        configured: true,
        reachable: false,
        ready: false,
        model,
        baseUrl,
        error: `${reason}. Start Ollama and pull ${model} to enable offline Local Qwen AI.`,
        setupInstructions: OLLAMA_WINDOWS_SETUP_STEPS,
      };
    }
  }

  private async callOllamaChat(
    prompt: string,
    base64Images: string[],
    timeoutMs: number
  ): Promise<string> {
    const baseUrl = this.getBaseUrl();
    const model = this.getModel();

    const message: any = {
      role: 'user',
      content: prompt,
    };
    if (base64Images.length > 0) {
      message.images = base64Images;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          stream: false,
          format: 'json',
          messages: [message],
          options: {
            temperature: 0.1,
            num_ctx: 4096, // Keeps RAM usage safe on 16 GB Windows laptops (CPU/GPU friendly)
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!res.ok) {
        let errDetail = `HTTP ${res.status}`;
        try {
          const errJson = await res.json();
          if (errJson?.error) errDetail = errJson.error;
        } catch {
          // ignore
        }
        throw new Error(`Ollama vision API error: ${errDetail}`);
      }

      const json = await res.json();
      const content = (json?.message?.content || '').trim();
      if (!content) {
        throw new Error(`Ollama model "${model}" returned an empty response.`);
      }
      return content;
    } catch (err: any) {
      clearTimeout(timer);
      if (err?.name === 'AbortError') {
        throw new Error(
          `Local Qwen AI (${model}) timed out after ${Math.round(timeoutMs / 1000)}s. CPU vision inference can take longer on large images.`
        );
      }
      throw err;
    }
  }

  async processPrescription(input: PrescriptionProcessInput): Promise<ClinicalExtractionResult> {
    // Verify Ollama reachability & model presence first (NEVER auto-pulls models!)
    const status = await this.getStatus();
    if (!status.ready) {
      throw new Error(
        status.error ||
          `Local Qwen AI is unavailable. Install Ollama and run: ollama pull ${this.getModel()}`
      );
    }

    const model = this.getModel();
    const startTime = Date.now();
    // CPU vision inference needs generous timeout
    const perCallTimeoutMs = input.timeoutMs ?? 120000;

    // 1. Typed prescription text mode
    if (input.kind === 'text') {
      const prompt = buildTypedTextClinicalPrompt(input.typedText || '');
      const rawText = await this.callOllamaChat(prompt, [], perCallTimeoutMs);
      const rawJson = extractJsonFromModelText(rawText);
      return validateAndNormalizeExtraction(rawJson, {
        provider: 'ollama',
        model,
        pagesProcessed: 1,
        durationMs: Date.now() - startTime,
        inputKind: 'text',
      });
    }

    // 2. Direct image or rendered PDF pages (batched 1 page per call for 16 GB RAM stability)
    const pages = input.pageImages || [];
    if (pages.length === 0) {
      throw new Error(
        'No rendered images available for Local Qwen AI. PDF pages must be rendered to images before local vision inference.'
      );
    }

    const batchResults: ClinicalExtractionResult[] = [];
    for (const page of pages) {
      const prompt = buildVisionClinicalPrompt({
        pageNumbers: [page.pageNumber],
        totalPages: input.totalPages,
      });
      const rawText = await this.callOllamaChat(
        prompt,
        [page.buffer.toString('base64')],
        perCallTimeoutMs
      );
      const rawJson = extractJsonFromModelText(rawText);
      const validated = validateAndNormalizeExtraction(rawJson, {
        provider: 'ollama',
        model,
        pagesProcessed: 1,
        durationMs: Date.now() - startTime,
        inputKind: input.kind,
      });

      // Ensure accurate sourcePage tagging on every extracted item from this page
      validated.medications = validated.medications.map((m) => ({
        ...m,
        sourcePage: page.pageNumber,
      }));
      validated.investigations = validated.investigations.map((inv) => ({
        ...inv,
        sourcePage: page.pageNumber,
      }));
      validated.followUp = validated.followUp.map((fu) => ({
        ...fu,
        sourcePage: page.pageNumber,
      }));
      validated.uncertainFields = validated.uncertainFields.map((u) => ({
        ...u,
        sourcePage: page.pageNumber,
      }));

      batchResults.push(validated);
    }

    return mergeMultiPageExtractions(batchResults, {
      provider: 'ollama',
      model,
      totalPages: input.totalPages,
      durationMs: Date.now() - startTime,
    });
  }
}
