import { PlacementCorrection } from "./types";

const LEARNING_STORAGE_KEY = "caratline_cad_learned_corrections_v1";

/**
 * Stores a manual CAD adjustment correction into persistent local memory.
 */
export function savePlacementCorrection(correction: PlacementCorrection): void {
  try {
    const existing = getStoredCorrections();
    const key = makeCorrectionKey(
      correction.ringType,
      correction.settingType,
      correction.stoneCut,
      correction.cameraView
    );
    existing[key] = correction;
    localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // Ignore storage errors in sandbox/private browsing
  }
}

/**
 * Retrieves learned corrections for a specific combination of ring, setting, stone cut, and view.
 */
export function getPlacementCorrection(
  ringType: string,
  settingType: string,
  stoneCut: string,
  cameraView: string
): PlacementCorrection | null {
  try {
    const existing = getStoredCorrections();
    const key = makeCorrectionKey(ringType, settingType, stoneCut, cameraView);
    return existing[key] || null;
  } catch {
    return null;
  }
}

function getStoredCorrections(): Record<string, PlacementCorrection> {
  try {
    const raw = localStorage.getItem(LEARNING_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function makeCorrectionKey(ringType: string, settingType: string, stoneCut: string, cameraView: string): string {
  return `${ringType}:${settingType}:${stoneCut}:${cameraView}`.toLowerCase();
}
