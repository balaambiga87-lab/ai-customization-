"use client";

import { JewelleryType } from "@/stores/useLayerStore";

export interface ComponentMeta {
  key: string;
  jewelleryType: JewelleryType;
  category: string;
  name: string;
  metaLabel: string;
  grams?: number;
  carat?: number;
  estimatedPriceINR: number;
  imageUrl?: string;
  useSvg?: boolean;
  isCustom?: boolean;
}

export interface CategoryInfo {
  key: string;
  label: string;
  jewelleryType: JewelleryType;
}

export const JEWELLERY_TYPES: { key: JewelleryType; label: string; icon: string }[] = [
  { key: "ring", label: "Rings", icon: "💍" },
  { key: "earring", label: "Earrings", icon: "✨" },
  { key: "pendant", label: "Pendants", icon: "📿" },
];

export const CATEGORIES_BY_JEWELLERY_TYPE: Record<JewelleryType, CategoryInfo[]> = {
  ring: [
    { key: "ring_band", label: "Ring Bands", jewelleryType: "ring" },
    { key: "ring_setting", label: "Settings", jewelleryType: "ring" },
    { key: "center_stone", label: "Center Stones", jewelleryType: "ring" },
    { key: "side_stone", label: "Side Stones", jewelleryType: "ring" },
  ],
  earring: [
    { key: "hoop_base", label: "Hoop Bases", jewelleryType: "earring" },
    { key: "stud_base", label: "Stud Bases", jewelleryType: "earring" },
    { key: "connector", label: "Connectors", jewelleryType: "earring" },
    { key: "hanging_base", label: "Hanging Pendant Bases", jewelleryType: "earring" },
    { key: "center_decoration", label: "Center Decorations", jewelleryType: "earring" },
    { key: "side_stone", label: "Side Stones", jewelleryType: "earring" },
  ],
  pendant: [
    { key: "chain", label: "Chains", jewelleryType: "pendant" },
    { key: "pendant_base", label: "Pendant Bases", jewelleryType: "pendant" },
    { key: "center_stone", label: "Center Stones", jewelleryType: "pendant" },
    { key: "decorative", label: "Decorative Elements", jewelleryType: "pendant" },
    { key: "side_stone", label: "Side Stones", jewelleryType: "pendant" },
  ],
};

// Complete Realistic Built-in Asset Library
export const INITIAL_ASSET_LIBRARY: ComponentMeta[] = [
  // ── 1. RINGS ──────────────────────────────────────────────────────────
  // Ring Bands
  { key: "classic", jewelleryType: "ring", category: "ring_band", name: "Classic Band", metaLabel: "2.6 g base", grams: 2.6, estimatedPriceINR: 20410, imageUrl: "/images/band_plain.png" },
  { key: "twist", jewelleryType: "ring", category: "ring_band", name: "Twisted Band", metaLabel: "3.1 g base", grams: 3.1, estimatedPriceINR: 24335, imageUrl: "/images/band_twisted.png" },
  { key: "infinity_band", jewelleryType: "ring", category: "ring_band", name: "Infinity Band", metaLabel: "3.4 g base", grams: 3.4, estimatedPriceINR: 26690, imageUrl: "/images/band_twisted.png" },
  { key: "knife_edge", jewelleryType: "ring", category: "ring_band", name: "Knife Edge Band", metaLabel: "2.8 g base", grams: 2.8, estimatedPriceINR: 21980, imageUrl: "/images/band_plain.png" },
  { key: "cathedral_band", jewelleryType: "ring", category: "ring_band", name: "Cathedral Band", metaLabel: "3.2 g base", grams: 3.2, estimatedPriceINR: 25120, imageUrl: "/images/band_plain.png" },
  { key: "split_shank", jewelleryType: "ring", category: "ring_band", name: "Split Shank", metaLabel: "3.6 g base", grams: 3.6, estimatedPriceINR: 28260, imageUrl: "/images/band_plain.png" },
  { key: "pave", jewelleryType: "ring", category: "ring_band", name: "Pavé Band", metaLabel: "2.9 g · +0.18 ct", grams: 2.9, carat: 0.18, estimatedPriceINR: 38900, imageUrl: "/images/band_bezel_base.jpg" },

  // Settings
  { key: "prong", jewelleryType: "ring", category: "ring_setting", name: "4 Prong", metaLabel: "0.4 g", grams: 0.4, estimatedPriceINR: 3140, imageUrl: "/images/setting_prong.png" },
  { key: "six_prong", jewelleryType: "ring", category: "ring_setting", name: "6 Prong", metaLabel: "0.5 g", grams: 0.5, estimatedPriceINR: 3925, imageUrl: "/images/setting_prong.png" },
  { key: "halo", jewelleryType: "ring", category: "ring_setting", name: "Halo", metaLabel: "+0.24 ct", carat: 0.24, estimatedPriceINR: 28000, imageUrl: "/images/setting_halo.png" },
  { key: "hidden_halo", jewelleryType: "ring", category: "ring_setting", name: "Hidden Halo", metaLabel: "+0.15 ct", carat: 0.15, estimatedPriceINR: 21500, imageUrl: "/images/setting_halo.png" },
  { key: "bezel", jewelleryType: "ring", category: "ring_setting", name: "Bezel", metaLabel: "0.6 g", grams: 0.6, estimatedPriceINR: 4710, imageUrl: "/images/setting_bezel.png" },
  { key: "tension", jewelleryType: "ring", category: "ring_setting", name: "Tension", metaLabel: "0.7 g", grams: 0.7, estimatedPriceINR: 5495, imageUrl: "/images/setting_bezel.png" },
  { key: "cathedral_setting", jewelleryType: "ring", category: "ring_setting", name: "Cathedral", metaLabel: "0.8 g", grams: 0.8, estimatedPriceINR: 6280, imageUrl: "/images/setting_prong.png" },

  // Center Stones
  { key: "round", jewelleryType: "ring", category: "center_stone", name: "Round Diamond", metaLabel: "1.20 ct", carat: 1.2, estimatedPriceINR: 145000, imageUrl: "/images/gemstone_three_quarter.png" },
  { key: "oval", jewelleryType: "ring", category: "center_stone", name: "Oval Diamond", metaLabel: "1.15 ct", carat: 1.15, estimatedPriceINR: 138000, imageUrl: "/images/gemstone_three_quarter.png" },
  { key: "princess", jewelleryType: "ring", category: "center_stone", name: "Princess Diamond", metaLabel: "1.05 ct", carat: 1.05, estimatedPriceINR: 126000, imageUrl: "/images/stone_princess.png" },
  { key: "emerald", jewelleryType: "ring", category: "center_stone", name: "Emerald Cut", metaLabel: "1.30 ct", carat: 1.3, estimatedPriceINR: 156000, imageUrl: "/images/stone_princess.png" },
  { key: "pear_diamond", jewelleryType: "ring", category: "center_stone", name: "Pear Diamond", metaLabel: "1.25 ct", carat: 1.25, estimatedPriceINR: 150000, imageUrl: "/images/stone_marquise.png" },
  { key: "ruby", jewelleryType: "ring", category: "center_stone", name: "Ruby", metaLabel: "1.40 ct", carat: 1.4, estimatedPriceINR: 85000, useSvg: true },
  { key: "emerald_gem", jewelleryType: "ring", category: "center_stone", name: "Emerald", metaLabel: "1.35 ct", carat: 1.35, estimatedPriceINR: 92000, useSvg: true },
  { key: "sapphire", jewelleryType: "ring", category: "center_stone", name: "Sapphire", metaLabel: "1.50 ct", carat: 1.5, estimatedPriceINR: 98000, useSvg: true },

  // Side Stones
  { key: "round_melee", jewelleryType: "ring", category: "side_stone", name: "Round Melee", metaLabel: "0.12 ct", carat: 0.12, estimatedPriceINR: 14500, imageUrl: "/images/stone_round.png" },
  { key: "pear_side", jewelleryType: "ring", category: "side_stone", name: "Pear", metaLabel: "0.25 ct", carat: 0.25, estimatedPriceINR: 22000, imageUrl: "/images/stone_marquise.png" },
  { key: "baguette", jewelleryType: "ring", category: "side_stone", name: "Baguette", metaLabel: "0.20 ct", carat: 0.20, estimatedPriceINR: 19500, imageUrl: "/images/stone_princess.png" },
  { key: "marquise_side", jewelleryType: "ring", category: "side_stone", name: "Marquise", metaLabel: "0.22 ct", carat: 0.22, estimatedPriceINR: 21000, imageUrl: "/images/stone_marquise.png" },

  // ── 2. EARRINGS ──────────────────────────────────────────────────────
  // Hoop Bases
  { key: "hoop_classic", jewelleryType: "earring", category: "hoop_base", name: "Classic Hoop", metaLabel: "2.8 g", grams: 2.8, estimatedPriceINR: 18500, imageUrl: "/images/hoop_classic.png" },
  { key: "hoop_half", jewelleryType: "earring", category: "hoop_base", name: "Half Hoop", metaLabel: "2.2 g", grams: 2.2, estimatedPriceINR: 15200, imageUrl: "/images/hoop_classic.png" },
  { key: "hoop_oval", jewelleryType: "earring", category: "hoop_base", name: "Oval Hoop", metaLabel: "3.1 g", grams: 3.1, estimatedPriceINR: 21000, imageUrl: "/images/hoop_classic.png" },
  { key: "hoop_huggie", jewelleryType: "earring", category: "hoop_base", name: "Huggie Hoop", metaLabel: "2.4 g · +0.15 ct", grams: 2.4, carat: 0.15, estimatedPriceINR: 26500, imageUrl: "/images/hoop_classic.png" },
  { key: "hoop_square", jewelleryType: "earring", category: "hoop_base", name: "Square Hoop", metaLabel: "3.4 g", grams: 3.4, estimatedPriceINR: 23800, imageUrl: "/images/hoop_classic.png" },

  // Stud Bases
  { key: "stud_round", jewelleryType: "earring", category: "stud_base", name: "Round Stud", metaLabel: "0.8 g", grams: 0.8, estimatedPriceINR: 6280, imageUrl: "/images/setting_prong.png" },
  { key: "stud_princess", jewelleryType: "earring", category: "stud_base", name: "Princess Stud", metaLabel: "0.9 g", grams: 0.9, estimatedPriceINR: 7065, imageUrl: "/images/setting_bezel.png" },
  { key: "stud_floral", jewelleryType: "earring", category: "stud_base", name: "Floral Stud", metaLabel: "1.2 g", grams: 1.2, estimatedPriceINR: 9420, imageUrl: "/images/setting_halo.png" },
  { key: "stud_pear", jewelleryType: "earring", category: "stud_base", name: "Pear Stud", metaLabel: "1.0 g", grams: 1.0, estimatedPriceINR: 7850, imageUrl: "/images/setting_prong.png" },

  // Connectors
  { key: "conn_round", jewelleryType: "earring", category: "connector", name: "Round Connector", metaLabel: "0.4 g", grams: 0.4, estimatedPriceINR: 3140, imageUrl: "/images/setting_bezel.png" },
  { key: "conn_diamond", jewelleryType: "earring", category: "connector", name: "Diamond Connector", metaLabel: "0.6 g · +0.08 ct", grams: 0.6, carat: 0.08, estimatedPriceINR: 12800, imageUrl: "/images/setting_halo.png" },
  { key: "conn_gold", jewelleryType: "earring", category: "connector", name: "Gold Connector", metaLabel: "0.5 g", grams: 0.5, estimatedPriceINR: 3925, imageUrl: "/images/setting_prong.png" },
  { key: "conn_pear", jewelleryType: "earring", category: "connector", name: "Pear Connector", metaLabel: "0.7 g · +0.10 ct", grams: 0.7, carat: 0.10, estimatedPriceINR: 14500, imageUrl: "/images/setting_bezel.png" },

  // Hanging Pendant Bases
  { key: "base_teardrop", jewelleryType: "earring", category: "hanging_base", name: "Teardrop Base", metaLabel: "1.4 g", grams: 1.4, estimatedPriceINR: 10990, imageUrl: "/images/pendant_teardrop.png" },
  { key: "base_heart", jewelleryType: "earring", category: "hanging_base", name: "Heart Base", metaLabel: "1.6 g", grams: 1.6, estimatedPriceINR: 12560, imageUrl: "/images/pendant_heart.png" },
  { key: "base_circle", jewelleryType: "earring", category: "hanging_base", name: "Circle Base", metaLabel: "1.3 g", grams: 1.3, estimatedPriceINR: 10205, imageUrl: "/images/pendant_circle.png" },
  { key: "base_infinity", jewelleryType: "earring", category: "hanging_base", name: "Infinity Base", metaLabel: "1.8 g", grams: 1.8, estimatedPriceINR: 14130, imageUrl: "/images/pendant_circle.png" },
  { key: "base_leaf", jewelleryType: "earring", category: "hanging_base", name: "Leaf Base", metaLabel: "1.5 g", grams: 1.5, estimatedPriceINR: 11775, imageUrl: "/images/pendant_teardrop.png" },
  { key: "base_butterfly", jewelleryType: "earring", category: "hanging_base", name: "Butterfly Base", metaLabel: "1.7 g", grams: 1.7, estimatedPriceINR: 13345, imageUrl: "/images/pendant_heart.png" },
  { key: "base_lotus", jewelleryType: "earring", category: "hanging_base", name: "Lotus Base", metaLabel: "1.9 g", grams: 1.9, estimatedPriceINR: 14915, imageUrl: "/images/pendant_circle.png" },
  { key: "base_floral", jewelleryType: "earring", category: "hanging_base", name: "Floral Base", metaLabel: "1.8 g", grams: 1.8, estimatedPriceINR: 14130, imageUrl: "/images/pendant_circle.png" },
  { key: "base_geometric", jewelleryType: "earring", category: "hanging_base", name: "Geometric Base", metaLabel: "1.6 g", grams: 1.6, estimatedPriceINR: 12560, imageUrl: "/images/pendant_teardrop.png" },

  // Center Decorations
  { key: "dec_diamond_cluster", jewelleryType: "earring", category: "center_decoration", name: "Diamond Cluster", metaLabel: "+0.45 ct", carat: 0.45, estimatedPriceINR: 48000, imageUrl: "/images/setting_halo.png" },
  { key: "dec_emerald_flower", jewelleryType: "earring", category: "center_decoration", name: "Emerald Flower", metaLabel: "+0.60 ct", carat: 0.60, estimatedPriceINR: 42000, imageUrl: "/images/setting_halo.png" },
  { key: "dec_ruby_flower", jewelleryType: "earring", category: "center_decoration", name: "Ruby Flower", metaLabel: "+0.55 ct", carat: 0.55, estimatedPriceINR: 38000, imageUrl: "/images/setting_halo.png" },
  { key: "dec_pearl", jewelleryType: "earring", category: "center_decoration", name: "Pearl", metaLabel: "Freshwater", estimatedPriceINR: 14500, imageUrl: "/images/stone_round.png" },
  { key: "dec_solitaire", jewelleryType: "earring", category: "center_decoration", name: "Single Solitaire", metaLabel: "0.75 ct", carat: 0.75, estimatedPriceINR: 78000, imageUrl: "/images/stone_round.png" },
  { key: "dec_halo_cluster", jewelleryType: "earring", category: "center_decoration", name: "Halo Cluster", metaLabel: "+0.50 ct", carat: 0.50, estimatedPriceINR: 52000, imageUrl: "/images/setting_halo.png" },

  // Side Stones (Earrings)
  { key: "earring_round_diamonds", jewelleryType: "earring", category: "side_stone", name: "Round Diamonds", metaLabel: "0.15 ct", carat: 0.15, estimatedPriceINR: 16500, imageUrl: "/images/stone_round.png" },
  { key: "earring_pear_stones", jewelleryType: "earring", category: "side_stone", name: "Pear Stones", metaLabel: "0.20 ct", carat: 0.20, estimatedPriceINR: 19800, imageUrl: "/images/stone_marquise.png" },
  { key: "earring_baguettes", jewelleryType: "earring", category: "side_stone", name: "Baguettes", metaLabel: "0.18 ct", carat: 0.18, estimatedPriceINR: 18200, imageUrl: "/images/stone_princess.png" },
  { key: "earring_small_emeralds", jewelleryType: "earring", category: "side_stone", name: "Small Emeralds", metaLabel: "0.22 ct", carat: 0.22, estimatedPriceINR: 21000, imageUrl: "/images/stone_round.png" },

  // ── 3. PENDANTS ──────────────────────────────────────────────────────
  // Chains
  { key: "chain_cable", jewelleryType: "pendant", category: "chain", name: "Cable Chain", metaLabel: "18 in · 2.5 g", grams: 2.5, estimatedPriceINR: 19625, imageUrl: "/images/chain_cable.png" },
  { key: "chain_box", jewelleryType: "pendant", category: "chain", name: "Box Chain", metaLabel: "18 in · 3.0 g", grams: 3.0, estimatedPriceINR: 23550, imageUrl: "/images/chain_box.png" },
  { key: "chain_rope", jewelleryType: "pendant", category: "chain", name: "Rope Chain", metaLabel: "20 in · 3.8 g", grams: 3.8, estimatedPriceINR: 29830, imageUrl: "/images/chain_rope.png" },
  { key: "chain_snake", jewelleryType: "pendant", category: "chain", name: "Snake Chain", metaLabel: "18 in · 3.2 g", grams: 3.2, estimatedPriceINR: 25120, imageUrl: "/images/chain_snake.png" },
  { key: "chain_figaro", jewelleryType: "pendant", category: "chain", name: "Figaro Chain", metaLabel: "20 in · 4.2 g", grams: 4.2, estimatedPriceINR: 32970, imageUrl: "/images/chain_figaro.png" },
  { key: "chain_curb", jewelleryType: "pendant", category: "chain", name: "Curb Chain", metaLabel: "18 in · 3.6 g", grams: 3.6, estimatedPriceINR: 28260, imageUrl: "/images/chain_curb.png" },

  // Pendant Bases
  { key: "pendant_heart", jewelleryType: "pendant", category: "pendant_base", name: "Heart", metaLabel: "1.8 g", grams: 1.8, estimatedPriceINR: 14130, imageUrl: "/images/pendant_heart.png" },
  { key: "pendant_circle", jewelleryType: "pendant", category: "pendant_base", name: "Circle", metaLabel: "1.5 g", grams: 1.5, estimatedPriceINR: 11775, imageUrl: "/images/pendant_circle.png" },
  { key: "pendant_oval", jewelleryType: "pendant", category: "pendant_base", name: "Oval", metaLabel: "1.6 g", grams: 1.6, estimatedPriceINR: 12560, imageUrl: "/images/pendant_circle.png" },
  { key: "pendant_infinity", jewelleryType: "pendant", category: "pendant_base", name: "Infinity", metaLabel: "2.0 g", grams: 2.0, estimatedPriceINR: 15700, imageUrl: "/images/pendant_circle.png" },
  { key: "pendant_cross", jewelleryType: "pendant", category: "pendant_base", name: "Cross", metaLabel: "1.9 g", grams: 1.9, estimatedPriceINR: 14915, imageUrl: "/images/pendant_teardrop.png" },
  { key: "pendant_floral", jewelleryType: "pendant", category: "pendant_base", name: "Floral", metaLabel: "2.2 g", grams: 2.2, estimatedPriceINR: 17270, imageUrl: "/images/pendant_circle.png" },
  { key: "pendant_lotus", jewelleryType: "pendant", category: "pendant_base", name: "Lotus", metaLabel: "2.1 g", grams: 2.1, estimatedPriceINR: 16485, imageUrl: "/images/pendant_circle.png" },
  { key: "pendant_initial", jewelleryType: "pendant", category: "pendant_base", name: "Initial", metaLabel: "1.4 g", grams: 1.4, estimatedPriceINR: 10990, imageUrl: "/images/pendant_teardrop.png" },
  { key: "pendant_geometric", jewelleryType: "pendant", category: "pendant_base", name: "Geometric", metaLabel: "1.7 g", grams: 1.7, estimatedPriceINR: 13345, imageUrl: "/images/pendant_teardrop.png" },

  // Center Stones (Pendants)
  { key: "pendant_round_diamond", jewelleryType: "pendant", category: "center_stone", name: "Round Diamond", metaLabel: "1.50 ct", carat: 1.5, estimatedPriceINR: 260000, imageUrl: "/images/stone_round.png" },
  { key: "pendant_emerald", jewelleryType: "pendant", category: "center_stone", name: "Emerald", metaLabel: "1.60 ct", carat: 1.6, estimatedPriceINR: 115000, imageUrl: "/images/stone_princess.png" },
  { key: "pendant_ruby", jewelleryType: "pendant", category: "center_stone", name: "Ruby", metaLabel: "1.50 ct", carat: 1.5, estimatedPriceINR: 98000, imageUrl: "/images/stone_round.png" },
  { key: "pendant_sapphire", jewelleryType: "pendant", category: "center_stone", name: "Sapphire", metaLabel: "1.75 ct", carat: 1.75, estimatedPriceINR: 125000, imageUrl: "/images/stone_round.png" },
  { key: "pendant_pearl", jewelleryType: "pendant", category: "center_stone", name: "Pearl", metaLabel: "South Sea", estimatedPriceINR: 28000, imageUrl: "/images/stone_round.png" },
  { key: "pendant_black_diamond", jewelleryType: "pendant", category: "center_stone", name: "Black Diamond", metaLabel: "1.80 ct", carat: 1.8, estimatedPriceINR: 142000, imageUrl: "/images/stone_round.png" },

  // Decorative Elements
  { key: "dec_halo", jewelleryType: "pendant", category: "decorative", name: "Halo", metaLabel: "+0.22 ct", carat: 0.22, estimatedPriceINR: 24000, imageUrl: "/images/setting_halo.png" },
  { key: "dec_diamond_border", jewelleryType: "pendant", category: "decorative", name: "Diamond Border", metaLabel: "+0.30 ct", carat: 0.30, estimatedPriceINR: 32000, imageUrl: "/images/setting_halo.png" },
  { key: "dec_leaf_ornament", jewelleryType: "pendant", category: "decorative", name: "Leaf Ornament", metaLabel: "0.6 g", grams: 0.6, estimatedPriceINR: 4710, imageUrl: "/images/setting_prong.png" },
  { key: "dec_crown", jewelleryType: "pendant", category: "decorative", name: "Crown", metaLabel: "0.8 g", grams: 0.8, estimatedPriceINR: 6280, imageUrl: "/images/setting_prong.png" },
  { key: "dec_star", jewelleryType: "pendant", category: "decorative", name: "Star", metaLabel: "0.7 g", grams: 0.7, estimatedPriceINR: 5495, imageUrl: "/images/setting_halo.png" },
  { key: "dec_infinity_ornament", jewelleryType: "pendant", category: "decorative", name: "Infinity Ornament", metaLabel: "0.9 g", grams: 0.9, estimatedPriceINR: 7065, imageUrl: "/images/setting_halo.png" },

  // Side Stones (Pendants)
  { key: "pendant_round_diamonds", jewelleryType: "pendant", category: "side_stone", name: "Round Diamonds", metaLabel: "0.12 ct", carat: 0.12, estimatedPriceINR: 14000, imageUrl: "/images/stone_round.png" },
  { key: "pendant_pear_stones", jewelleryType: "pendant", category: "side_stone", name: "Pear Stones", metaLabel: "0.18 ct", carat: 0.18, estimatedPriceINR: 18000, imageUrl: "/images/stone_marquise.png" },
  { key: "pendant_baguettes", jewelleryType: "pendant", category: "side_stone", name: "Baguettes", metaLabel: "0.15 ct", carat: 0.15, estimatedPriceINR: 16000, imageUrl: "/images/stone_princess.png" },
  { key: "pendant_tiny_emeralds", jewelleryType: "pendant", category: "side_stone", name: "Tiny Emeralds", metaLabel: "0.16 ct", carat: 0.16, estimatedPriceINR: 17500, imageUrl: "/images/stone_round.png" },
];

// Extensible custom assets store (allows user uploads dynamically)
let customAssetsStore: ComponentMeta[] = [];

/**
 * Upload classification rules engine.
 * Classifies newly uploaded image assets into appropriate categories automatically.
 */
export function classifyUploadedAsset(
  filenameOrName: string,
  jewelleryType: JewelleryType
): string {
  const lower = filenameOrName.toLowerCase();
  if (lower.includes("band") || lower.includes("shank")) return "ring_band";
  if (lower.includes("hoop")) return "hoop_base";
  if (lower.includes("stud")) return "stud_base";
  if (lower.includes("connector") || lower.includes("link")) return "connector";
  if (lower.includes("chain")) return "chain";
  if (lower.includes("pendant") || lower.includes("base") || lower.includes("frame"))
    return jewelleryType === "earring" ? "hanging_base" : "pendant_base";
  if (
    lower.includes("stone") ||
    lower.includes("diamond") ||
    lower.includes("ruby") ||
    lower.includes("emerald") ||
    lower.includes("gem")
  )
    return "center_stone";
  if (lower.includes("accent") || lower.includes("side") || lower.includes("melee"))
    return "side_stone";
  if (lower.includes("decor") || lower.includes("ornament") || lower.includes("bail"))
    return "decorative";

  // Fallback to first valid category for the selected jewellery type
  return CATEGORIES_BY_JEWELLERY_TYPE[jewelleryType][0].key;
}

export function getAssetLibrary(): ComponentMeta[] {
  return [...INITIAL_ASSET_LIBRARY, ...customAssetsStore];
}

export function registerCustomAsset(asset: ComponentMeta) {
  customAssetsStore.push({ ...asset, isCustom: true });
}

export function findComponentMeta(key: string): ComponentMeta | undefined {
  return getAssetLibrary().find((item) => item.key === key);
}
