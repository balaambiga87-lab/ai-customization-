import { CanvasLayer, JewelleryType } from "@/stores/useLayerStore";

export interface AlignRecommendation {
  detectedJewelleryType: JewelleryType;
  detectedSummary: string;
  originalLayers: CanvasLayer[];
  alignedLayers: CanvasLayer[];
  changesDescription: string[];
}

/**
 * AI Auto Align Engine
 * Analyzes current canvas layers, determines product category, and computes
 * physically realistic jewellery alignment proposal without altering state.
 */
export function computeAiAutoAlign(layers: CanvasLayer[]): AlignRecommendation | null {
  if (!layers || layers.length === 0) return null;

  // 1. Detect Primary Jewellery Type
  let detectedType: JewelleryType = "ring";
  const hasEarringParts = layers.some(
    (l) => l.jewelleryType === "earring" || ["hoop", "stud", "connector", "center_ornament"].includes(l.category)
  );
  const hasPendantParts = layers.some(
    (l) => l.jewelleryType === "pendant" || ["chain", "decorative"].includes(l.category)
  );
  const hasRingParts = layers.some(
    (l) => l.jewelleryType === "ring" || ["ring_band", "ring_setting", "band", "setting"].includes(l.category)
  );

  if (hasEarringParts && !hasRingParts) {
    detectedType = "earring";
  } else if (hasPendantParts && !hasRingParts) {
    detectedType = "pendant";
  } else if (hasRingParts) {
    detectedType = "ring";
  }

  const alignedLayers: CanvasLayer[] = JSON.parse(JSON.stringify(layers));
  const changesDescription: string[] = [];

  // 2. Perform Category-Specific Geometric Alignment
  if (detectedType === "ring") {
    // Locate Ring Band as Anchor
    const band = alignedLayers.find((l) => ["ring_band", "band"].includes(l.category) || l.type.includes("band"));
    const anchorX = band ? band.x : 50;
    const anchorY = band ? band.y : 50;

    if (band) {
      band.x = 50;
      band.y = 52;
      changesDescription.push("Centered Ring Shank at canvas focal point (50%, 52%).");
    }

    // Align Ring Setting to Top Crown
    const setting = alignedLayers.find((l) => ["ring_setting", "setting"].includes(l.category) || l.type.includes("setting"));
    if (setting) {
      setting.x = 50;
      setting.y = 35;
      setting.rotation = 0;
      changesDescription.push("Positioned Four-Prong Setting at ring crown (50%, 35%).");
    }

    // Seat Center Stone inside Setting
    const stone = alignedLayers.find((l) => ["center_stone", "stone"].includes(l.category) || l.type.includes("stone"));
    if (stone) {
      stone.x = 50;
      stone.y = 35;
      stone.rotation = 0;
      changesDescription.push("Seated Center Gemstone securely inside setting basket.");
    }

    // Distribute Side Stones symmetrically on shoulders
    const sideStones = alignedLayers.filter(
      (l) => ["side_stone", "accent_stone", "accent"].includes(l.category) || l.type.includes("accent")
    );
    if (sideStones.length > 0) {
      sideStones.forEach((st, idx) => {
        const isLeft = idx % 2 === 0;
        st.x = isLeft ? 41 - Math.floor(idx / 2) * 6 : 59 + Math.floor(idx / 2) * 6;
        st.y = 44 + Math.floor(idx / 2) * 4;
        st.rotation = isLeft ? -15 : 15;
      });
      changesDescription.push(`Symmetrically anchored ${sideStones.length} side stone(s) along ring shoulder rails.`);
    }
  } else if (detectedType === "earring") {
    // Earring Drop Assembly: Hoop/Stud → Connector → Base → Center Ornament
    const topAnchor = alignedLayers.find((l) => ["hoop", "stud"].includes(l.category));
    const connector = alignedLayers.find((l) => l.category === "connector");
    const base = alignedLayers.find((l) => l.category === "pendant_base");
    const ornament = alignedLayers.find((l) => ["center_ornament", "center_stone", "stone"].includes(l.category));

    if (topAnchor) {
      topAnchor.x = 50;
      topAnchor.y = 22;
      changesDescription.push("Suspended Earring Top (Hoop/Stud) at top anchor (50%, 22%).");
    }

    if (connector) {
      connector.x = 50;
      connector.y = 40;
      changesDescription.push("Attached Drop Link Connector at (50%, 40%).");
    }

    if (base) {
      base.x = 50;
      base.y = 58;
      changesDescription.push("Aligned Teardrop Base below connector (50%, 58%).");
    }

    if (ornament) {
      ornament.x = 50;
      ornament.y = 58;
      changesDescription.push("Centered Drop Gemstone inside teardrop base (50%, 58%).");
    }
  } else if (detectedType === "pendant") {
    // Pendant Assembly: Chain → Decorative Bail → Pendant Base → Center Stone
    const chain = alignedLayers.find((l) => l.category === "chain");
    const bail = alignedLayers.find((l) => l.category === "decorative");
    const base = alignedLayers.find((l) => l.category === "pendant_base");
    const stone = alignedLayers.find((l) => ["center_stone", "stone"].includes(l.category));

    if (chain) {
      chain.x = 50;
      chain.y = 25;
      changesDescription.push("Draped Neck Chain across top canvas (50%, 25%).");
    }

    if (bail) {
      bail.x = 50;
      bail.y = 38;
      changesDescription.push("Aligned Decorative Diamond Bail at chain apex (50%, 38%).");
    }

    if (base) {
      base.x = 50;
      base.y = 54;
      changesDescription.push("Suspended Pendant Basket Frame (50%, 54%).");
    }

    if (stone) {
      stone.x = 50;
      stone.y = 54;
      changesDescription.push("Seated Solitaire Gemstone inside pendant frame (50%, 54%).");
    }
  }

  const detectedSummary = `Detected ${detectedType.toUpperCase()} design with ${alignedLayers.length} modular component(s).`;

  return {
    detectedJewelleryType: detectedType,
    detectedSummary,
    originalLayers: layers,
    alignedLayers,
    changesDescription,
  };
}
