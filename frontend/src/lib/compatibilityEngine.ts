import { SettingKey, StoneKey } from "./types";

export interface CompatibilityCheckResult {
  isCompatible: boolean;
  message?: string;
  suggestedGemstones: StoneKey[];
  suggestedGemstoneLabels: string[];
}

const SETTING_CUT_MATRIX: Record<SettingKey, StoneKey[]> = {
  prong: ["round", "oval", "princess"],
  halo: ["round", "oval"],
  bezel: ["round", "oval", "emerald"],
};

const GEMSTONE_LABELS: Record<StoneKey, string> = {
  round: "Round",
  oval: "Oval",
  princess: "Princess",
  emerald: "Emerald",
  marquise: "Marquise",
};

/**
 * Compatibility Engine.
 * Verifies whether a gemstone cut is compatible with the active setting.
 * If incompatible, returns isCompatible: false, exact error message, and suggested compatible gemstones.
 */
export function checkCompatibility(settingKey: SettingKey | null, stoneKey: StoneKey): CompatibilityCheckResult {
  const currentSetting = settingKey || "prong";
  const supportedCuts = SETTING_CUT_MATRIX[currentSetting] || ["round", "oval", "princess"];
  const isCompatible = supportedCuts.includes(stoneKey);

  const suggestedGemstones = supportedCuts;
  const suggestedGemstoneLabels = supportedCuts.map((cut) => GEMSTONE_LABELS[cut]);

  if (!isCompatible) {
    return {
      isCompatible: false,
      message: "This gemstone is not compatible with the selected setting.",
      suggestedGemstones,
      suggestedGemstoneLabels,
    };
  }

  return {
    isCompatible: true,
    suggestedGemstones,
    suggestedGemstoneLabels,
  };
}
