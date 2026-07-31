import { BandKey, SettingKey, StoneKey } from "./types";

import classicBandMeta from "./metadata/bands/classic.json";
import twistBandMeta from "./metadata/bands/twist.json";
import paveBandMeta from "./metadata/bands/pave.json";

import prongSettingMeta from "./metadata/settings/prong.json";
import bezelSettingMeta from "./metadata/settings/bezel.json";
import haloSettingMeta from "./metadata/settings/halo.json";

import roundGemMeta from "./metadata/gemstones/round.json";
import princessGemMeta from "./metadata/gemstones/princess.json";
import marquiseGemMeta from "./metadata/gemstones/marquise.json";

export interface BandAssetMetadata {
  id: string;
  name?: string;
  anchor: {
    x: number; // percentage (0.50 = 50%)
    y: number; // percentage (0.28 = 28%)
  };
}

export interface SettingAssetMetadata {
  id: string;
  name?: string;
  anchor: {
    x: number; // percentage (0.50 = 50%)
    y: number; // percentage (0.50 = 50%)
  };
  recommendedScale: number;
  rotation?: number;
  supportedCuts: string[];
}

export interface GemstoneAssetMetadata {
  id: string;
  name?: string;
  diameter: number; // in mm
}

const BAND_METADATA_REGISTRY: Record<string, BandAssetMetadata> = {
  classic: classicBandMeta as BandAssetMetadata,
  twist: twistBandMeta as BandAssetMetadata,
  pave: paveBandMeta as BandAssetMetadata,
};

const SETTING_METADATA_REGISTRY: Record<string, SettingAssetMetadata> = {
  prong: prongSettingMeta as SettingAssetMetadata,
  bezel: bezelSettingMeta as SettingAssetMetadata,
  halo: haloSettingMeta as SettingAssetMetadata,
};

const GEMSTONE_METADATA_REGISTRY: Record<string, GemstoneAssetMetadata> = {
  round: roundGemMeta as GemstoneAssetMetadata,
  princess: princessGemMeta as GemstoneAssetMetadata,
  marquise: marquiseGemMeta as GemstoneAssetMetadata,
};

/**
 * Automatically loads Band asset JSON metadata when selected.
 * Checks for user-edited persistent anchors saved in localStorage first.
 */
export function getBandMetadata(bandKey: BandKey | null): BandAssetMetadata {
  const key = bandKey || "classic";
  const baseMeta = BAND_METADATA_REGISTRY[key] || BAND_METADATA_REGISTRY.classic;

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(`caratline_band_anchor_${key}`);
      if (saved) {
        const customAnchor = JSON.parse(saved);
        return { ...baseMeta, anchor: customAnchor };
      }
    } catch (e) {
      console.warn("Failed to read band anchor from storage", e);
    }
  }

  return baseMeta;
}

/**
 * Saves a visually edited anchor position (in percentage format { x: 0.50, y: 0.27 }) into persistent metadata JSON store.
 */
export function saveBandAnchorMetadata(bandKey: BandKey, anchor: { x: number; y: number }) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`caratline_band_anchor_${bandKey}`, JSON.stringify(anchor));
  } catch (e) {
    console.warn("Failed to save band anchor to storage", e);
  }
}

/**
 * Automatically loads Setting asset JSON metadata when selected.
 * Checks for user-edited persistent anchors saved in localStorage first.
 */
export function getSettingMetadata(settingKey: SettingKey | null): SettingAssetMetadata {
  const key = settingKey || "prong";
  const baseMeta = SETTING_METADATA_REGISTRY[key] || SETTING_METADATA_REGISTRY.prong;

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(`caratline_setting_anchor_${key}`);
      if (saved) {
        const customAnchor = JSON.parse(saved);
        return { ...baseMeta, anchor: customAnchor };
      }
    } catch (e) {
      console.warn("Failed to read setting anchor from storage", e);
    }
  }

  return baseMeta;
}

/**
 * Saves a visually edited setting anchor position into persistent metadata JSON store.
 */
export function saveSettingAnchorMetadata(settingKey: SettingKey, anchor: { x: number; y: number }) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`caratline_setting_anchor_${settingKey}`, JSON.stringify(anchor));
  } catch (e) {
    console.warn("Failed to save setting anchor to storage", e);
  }
}

/**
 * Automatically loads Gemstone asset JSON metadata when selected.
 */
export function getGemstoneMetadata(stoneKey: StoneKey | null): GemstoneAssetMetadata {
  if (!stoneKey || !GEMSTONE_METADATA_REGISTRY[stoneKey]) {
    return GEMSTONE_METADATA_REGISTRY.round;
  }
  return GEMSTONE_METADATA_REGISTRY[stoneKey];
}
