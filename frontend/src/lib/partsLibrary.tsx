"use client";

import { ReactNode } from "react";
import { TransparentImage } from "@/components/TransparentImage";
import { JewelryAssetSvg } from "@/components/JewelryAssetSvg";
import { findComponentMeta, INITIAL_ASSET_LIBRARY } from "./jewelryAssetLibrary";
import { Metal } from "./types";

export const PART_LIBRARY: Record<string, any[]> = {
  band: INITIAL_ASSET_LIBRARY.filter((i) => i.category === "ring_band"),
  stone: INITIAL_ASSET_LIBRARY.filter((i) => i.category === "center_stone"),
  setting: INITIAL_ASSET_LIBRARY.filter((i) => i.category === "ring_setting"),
  accent: INITIAL_ASSET_LIBRARY.filter((i) => i.category === "accent_stone"),
};

export function findPart(cat: string, key: string): any {
  const meta = findComponentMeta(key);
  if (meta) return meta;
  return { key, category: cat, name: key, metaLabel: "" };
}

/** Metal filter for band/setting metal images (white-bg removal). */
export function getMetalFilterStyle(metal: string): React.CSSProperties {
  switch (metal) {
    case "rose_gold":
      return {
        filter: "hue-rotate(-35deg) saturate(1.4) brightness(0.95) contrast(1.05) drop-shadow(0 4px 10px rgba(107,44,61,0.2))",
      };
    case "silver":
    case "platinum":
      return {
        filter: "grayscale(1) brightness(1.1) contrast(1.1) drop-shadow(0 4px 10px rgba(107,44,61,0.15))",
      };
    case "gold":
    default:
      return { filter: "drop-shadow(0 4px 10px rgba(107,44,61,0.2))" };
  }
}

/**
 * Per-metal tint applied to the diamond via CSS filter.
 */
export function getDiamondMetalTint(metal: string): React.CSSProperties {
  const base = "brightness(1.12) contrast(1.08) saturate(1.1)";
  switch (metal) {
    case "rose_gold":
      return {
        filter: `${base} sepia(0.12) hue-rotate(-10deg) drop-shadow(0 6px 18px rgba(180,90,60,0.5)) drop-shadow(0 2px 6px rgba(220,120,90,0.3))`,
      };
    case "gold":
      return {
        filter: `${base} sepia(0.15) hue-rotate(5deg) drop-shadow(0 6px 18px rgba(180,140,30,0.45)) drop-shadow(0 2px 6px rgba(200,160,50,0.3))`,
      };
    case "silver":
    case "platinum":
      return {
        filter: `${base} hue-rotate(200deg) saturate(0.9) drop-shadow(0 6px 18px rgba(80,110,160,0.4)) drop-shadow(0 2px 6px rgba(100,130,180,0.25))`,
      };
    default:
      return {
        filter: `${base} drop-shadow(0 6px 18px rgba(80,80,120,0.4))`,
      };
  }
}

/**
 * Renders a gemstone for the canvas using mix-blend-mode:multiply.
 */
export function renderDiamondForCanvas(
  key: string,
  size: number,
  metal: string,
): ReactNode {
  const meta = findComponentMeta(key);
  if (meta?.useSvg) {
    return <JewelryAssetSvg cat={meta.category} itemKey={key} metal={metal as Metal} size={size} />;
  }

  const url = meta?.imageUrl || "/images/gemstone_three_quarter.png";
  const tint = getDiamondMetalTint(metal);

  return (
    <img
      src={url}
      width={size}
      height={size}
      draggable={false}
      alt={`diamond-${key}`}
      style={{
        display:       "block",
        objectFit:     "contain",
        pointerEvents: "none",
        mixBlendMode:  "multiply" as const,
        ...tint,
      }}
    />
  );
}

/** Renders asset icons for sidebar grid cards or canvas layers. */
export function renderPartIcon(
  cat: string,
  key: string,
  size: number,
  metal?: string,
): ReactNode {
  const meta = findComponentMeta(key);

  // If component is configured to use SVG or has no bitmap URL, use JewelryAssetSvg
  if (meta?.useSvg || !meta?.imageUrl) {
    return <JewelryAssetSvg cat={meta?.category || cat} itemKey={key} metal={(metal as Metal) || "gold"} size={size} />;

  }

  const url = meta.imageUrl;
  const isStone = ["center_stone", "stone", "accent", "accent_stone", "center_ornament", "side_stone"].includes(cat);
  const isMetal = ["ring_band", "band", "ring_setting", "setting", "hoop_base", "stud_base", "connector", "hanging_base", "pendant_base", "chain", "decorative"].includes(cat);

  if (isStone) {
    const metalTint = getDiamondMetalTint(metal || "platinum");
    return (
      <TransparentImage
        src={url}
        width={size}
        height={size}
        threshold={215}
        bgColor="white"
        style={{
          display:       "block",
          objectFit:     "contain",
          pointerEvents: "none",
          ...metalTint,
        }}
        alt={`${cat}-${key}`}
        draggable={false}
      />
    );
  }

  if (isMetal) {
    const filterStyle = metal
      ? getMetalFilterStyle(metal)
      : { filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.08))" };
    return (
      <TransparentImage
        src={url}
        width={size}
        height={size}
        threshold={220}
        bgColor="white"
        style={{
          display:       "block",
          objectFit:     "contain",
          pointerEvents: "none",
          ...filterStyle,
        }}
        alt={`${cat}-${key}`}
        draggable={false}
      />
    );
  }

  return (
    <TransparentImage
      src={url}
      width={size}
      height={size}
      threshold={220}
      bgColor="white"
      style={{
        display:       "block",
        objectFit:     "contain",
        pointerEvents: "none",
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.08))",
      }}
      alt={`${cat}-${key}`}
      draggable={false}
    />
  );
}
