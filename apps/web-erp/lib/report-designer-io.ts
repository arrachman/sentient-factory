// ── Report Designer — persistence IO ─────────────────────────────────────────
// Serialize/parse the band-based designer model to/from the backend
// `templateJson` field, plus browser export/import (download / file picker).
// Pure helpers — no React. Browser-only (Blob/document) used in 'use client'.

import { rdInitialBands, type RdBand } from './report-designer-mock';
import { isReportEngineDoc, reToBands } from './report-engine-adapter';

/** Original report-engine document, kept for a lossless round-trip on save. */
export type RdEngineSource = Record<string, unknown>;

/** Stored template document shape (the `templateJson` payload). */
export interface RdTemplateDoc {
  version: number;
  paper: string;
  bands: RdBand[];
}

export const RD_TEMPLATE_VERSION = 1;
const DEFAULT_PAPER = 'A4';

/** Build the `templateJson` payload from the live designer state. */
export function serializeTemplate(bands: RdBand[], paper: string): Record<string, unknown> {
  return { version: RD_TEMPLATE_VERSION, paper, bands };
}

const isEditorBand = (b: unknown): boolean =>
  !!b && typeof b === 'object' && Array.isArray((b as { comps?: unknown }).comps);

/**
 * Parse a stored `templateJson` into designer state, or null when it is not in
 * this visual editor's own format. Seeded report-engine templates use a richer
 * schema (`components`/`dataSources`) the mock designer cannot edit — those are
 * rejected here so the editor falls back to its default report instead of
 * crashing on `band.comps`.
 */
export function parseTemplateJson(json: unknown): { bands: RdBand[]; paper: string } | null {
  if (!json || typeof json !== 'object') return null;
  const obj = json as Record<string, unknown>;
  if (obj.version !== RD_TEMPLATE_VERSION) return null;
  if (!Array.isArray(obj.bands) || obj.bands.length === 0) return null;
  if (!obj.bands.every(isEditorBand)) return null;
  const paper = typeof obj.paper === 'string' ? obj.paper : DEFAULT_PAPER;
  return { bands: obj.bands as RdBand[], paper };
}

/**
 * True when `json` has content but cannot be edited safely — i.e. it is neither
 * this editor's own format NOR a report-engine template (which the adapter makes
 * editable with a lossless round-trip). Drives the "overwrite original?" warning.
 */
export function isForeignTemplate(json: unknown): boolean {
  if (!json || typeof json !== 'object') return false;
  if (Object.keys(json as Record<string, unknown>).length === 0) return false;
  if (parseTemplateJson(json) !== null) return false;
  return !isReportEngineDoc(json);
}

/**
 * Load designer state from stored json. Tries this editor's own format first,
 * then a report-engine template (carrying its source for round-trip save), and
 * finally falls back to the default report layout.
 */
export function loadBands(json: unknown): {
  bands: RdBand[]; paper: string; engineSource?: RdEngineSource;
} {
  const native = parseTemplateJson(json);
  if (native) return native;
  const engine = reToBands(json);
  if (engine) return { bands: engine.bands, paper: engine.paper, engineSource: engine.source };
  return { bands: rdInitialBands(), paper: DEFAULT_PAPER };
}

const safeFileName = (name: string): string =>
  (name || 'template').trim().replace(/[^\w.-]+/g, '_') || 'template';

/** Trigger a browser download of the current template as a `.json` file. */
export function downloadTemplate(name: string, bands: RdBand[], paper: string): void {
  const blob = new Blob([JSON.stringify(serializeTemplate(bands, paper), null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeFileName(name)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Open a file picker and parse the chosen `.json` into designer state. */
export function pickTemplateFile(): Promise<{ bands: RdBand[]; paper: string } | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);
      try {
        resolve(parseTemplateJson(JSON.parse(await file.text())));
      } catch {
        resolve(null);
      }
    };
    input.click();
  });
}
