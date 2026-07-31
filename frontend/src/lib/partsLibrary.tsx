"use client";

import { ReactNode } from "react";
import { TransparentImage } from "@/components/TransparentImage";
import {
  AccentKey,
  BandKey,
  Category,
  PartKey,
  PartMeta,
  SettingKey,
  StoneKey,
} from "./types";

export const PART_LIBRARY: Record<Category, PartMeta[]> = {
  band: [
    { key: "classic", category: "band", name: "Classic Shank", metaLabel: "2.6 g base", grams: 2.6 },
    { key: "twist", category: "band", name: "Twisted Shank", metaLabel: "3.1 g base", grams: 3.1 },
    { key: "pave", category: "band", name: "Pavé Rail", metaLabel: "2.9 g · +0.18 ct", grams: 2.9, carat: 0.18 },
  ],
  stone: [
    { key: "round", category: "stone", name: "Round Brilliant", metaLabel: "1.20 ct", carat: 1.2 },
    { key: "oval", category: "stone", name: "Oval Cut", metaLabel: "1.15 ct", carat: 1.15 },
    { key: "princess", category: "stone", name: "Princess Cut", metaLabel: "1.05 ct", carat: 1.05 },
    { key: "emerald", category: "stone", name: "Emerald Cut", metaLabel: "1.30 ct", carat: 1.3 },
    { key: "marquise", category: "stone", name: "Marquise Cut", metaLabel: "0.95 ct", carat: 0.95 },
  ],
  setting: [
    { key: "prong", category: "setting", name: "Four-Prong", metaLabel: "0.4 g", grams: 0.4 },
    { key: "bezel", category: "setting", name: "Bezel Wrap", metaLabel: "0.6 g", grams: 0.6 },
    { key: "halo", category: "setting", name: "Diamond Halo", metaLabel: "+0.24 ct", carat: 0.24 },
  ],
  accent: [
    { key: "accent", category: "accent", name: "Side Accent", metaLabel: "0.08 ct", carat: 0.08 },
  ],
};

export function findPart(cat: Category, key: PartKey): PartMeta {
  const part = PART_LIBRARY[cat].find((p) => p.key === key);
  if (!part) throw new Error(`Unknown part ${cat}/${String(key)}`);
  return part;
}

export function getPartImageUrl(cat: Category, key: PartKey, view: string = "side"): string {
  if (cat === "band") {
    if (key === "twist") return "/images/band_twisted.png";
    if (key === "pave") return "/images/band_bezel_base.jpg";
    if (view === "top") return "/images/band_plain_top.png";
    if (view === "three_quarter") return "/images/band_plain_three_quarter.png";
    return "/images/band_plain.png";
  }
  if (cat === "stone") {
    if (key === "round" || key === "oval") {
      if (view === "top") return "/images/gemstone_top.png";
      if (view === "bottom") return "/images/gemstone_bottom.png";
      if (view === "three_quarter") return "/images/gemstone_three_quarter.png";
      return "/images/stone_round.png";
    }
    if (key === "princess" || key === "emerald") return "/images/stone_princess.png";
    if (key === "marquise") return "/images/stone_marquise.png";
    return "/images/stone_round.png";
  }
  if (cat === "setting") {
    if (key === "prong") return "/images/setting_prong.png";
    if (key === "bezel") return "/images/setting_bezel.png";
    if (key === "halo") return "/images/setting_halo.png";
    return "/images/setting_prong.png";
  }
  if (cat === "accent") {
    return "/images/stone_round.png";
  }
  return "/images/stone_round.png";
}

export function getMetalFilterStyle(metal: string): React.CSSProperties {
  switch (metal) {
    case "rose_gold":
      return { filter: "hue-rotate(-35deg) saturate(1.4) brightness(0.95) contrast(1.05) drop-shadow(0 4px 10px rgba(107, 44, 61, 0.2))" };
    case "silver":
    case "platinum":
      return { filter: "grayscale(1) brightness(1.1) contrast(1.1) drop-shadow(0 4px 10px rgba(107, 44, 61, 0.15))" };
    case "gold":
    default:
      return { filter: "drop-shadow(0 4px 10px rgba(107, 44, 61, 0.2))" };
  }
}

/** Renders the right realistic image for a given category/key at a given pixel size. */
export function renderPartIcon(cat: Category, key: PartKey, size: number, metal?: string, view: string = "side"): ReactNode {
  const url = getPartImageUrl(cat, key, view);
  if (!url) return null;

  const isMetal = cat === "band" || cat === "setting";
  const filterStyle = isMetal && metal ? getMetalFilterStyle(metal) : { filter: "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.08))" };

  return (
    <TransparentImage
      src={url}
      width={size}
      height={size}
      threshold={220}
      style={{ display: "block", objectFit: "contain", ...filterStyle }}
      alt={`${cat}-${key}`}
      draggable={false}
    />
  );
}
