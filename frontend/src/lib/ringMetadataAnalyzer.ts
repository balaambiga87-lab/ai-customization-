import { BandKey, SettingKey, StoneKey, RingMetadata, AnchorPoint } from "./types";

// In-memory cache to ensure a ring is analyzed ONCE and never re-analyzed repeatedly
const metadataCache = new Map<string, RingMetadata>();

/**
 * AI Responsibility: Analyzes ring assets once to extract physical CAD parameters & metadata.
 * Returns cached RingMetadata if already analyzed.
 */
export function analyzeRingMetadata(bandKey: BandKey | null, settingKey: SettingKey | null): RingMetadata {
  const cacheKey = `${bandKey || "none"}:${settingKey || "none"}`;
  
  if (metadataCache.has(cacheKey)) {
    return metadataCache.get(cacheKey)!;
  }

  // Determine physical CAD characteristics
  let ringType = "Solitaire Shank";
  if (bandKey === "twist") ringType = "Twisted Shank";
  else if (bandKey === "pave") ringType = "Pavé Rail";

  let settingType = "4-Prong Crown Seat";
  let prongCount = 4;
  let seatDiameter = 82; // px base seat diameter
  let mountHeight = 44;
  let supportedCuts: StoneKey[] = ["round", "princess", "marquise"];

  if (settingKey === "bezel") {
    settingType = "Bezel Collar Wrap";
    prongCount = 0;
    seatDiameter = 78;
    mountHeight = 40;
    supportedCuts = ["round", "princess"];
  } else if (settingKey === "halo") {
    settingType = "Diamond Micro-Halo Platform";
    prongCount = 4;
    seatDiameter = 88;
    mountHeight = 48;
    supportedCuts = ["round", "marquise"];
  }

  // Define Invisible Anchors for CAD Snapping
  const centerPos = { x: 50, y: 24.6 }; // Fixed 3/4 Isometric Ring Center Seat

  const anchors: Record<string, AnchorPoint> = {
    CenterStoneAnchor: {
      type: "CenterStoneAnchor",
      x: centerPos.x,
      y: centerPos.y,
      depthOffset: 2,
      angle: 0,
    },
    HaloAnchor: {
      type: "HaloAnchor",
      x: centerPos.x,
      y: centerPos.y,
      depthOffset: -1,
      angle: 0,
    },
    LeftSideStoneAnchor: {
      type: "LeftSideStoneAnchor",
      x: 33,
      y: 47,
      depthOffset: 1,
      angle: -15,
    },
    RightSideStoneAnchor: {
      type: "RightSideStoneAnchor",
      x: 67,
      y: 47,
      depthOffset: 1,
      angle: 15,
    },
    PendantAnchor: {
      type: "PendantAnchor",
      x: centerPos.x,
      y: centerPos.y,
      depthOffset: 0,
      angle: 0,
    },
    CharmAnchor: {
      type: "CharmAnchor",
      x: centerPos.x,
      y: centerPos.y + 10,
      depthOffset: 4,
      angle: 0,
    },
  };

  const metadata: RingMetadata = {
    ringType,
    settingType,
    ringCenter: { x: 50, y: 50 },
    cameraAngle: 45, // Fixed 3/4 Isometric Perspective during editing
    perspective: "3/4 Isometric CAD View",
    bandWidth: bandKey === "twist" ? 3.2 : 2.5,
    stoneSeat: { x: centerPos.x, y: centerPos.y },
    seatDiameter,
    mountHeight,
    prongCount,
    haloRegion: settingKey === "halo" ? { x: centerPos.x, y: centerPos.y, radius: 46 } : null,
    sideStonePositions: [
      { x: 33, y: 47, angle: -15 },
      { x: 67, y: 47, angle: 15 },
    ],
    gallery: { depth: 16, width: seatDiameter },
    supportedCuts,
    supportedStoneSizes: { minCarat: 0.5, maxCarat: 5.0 },
    anchors: anchors as any,
  };

  // Cache metadata
  metadataCache.set(cacheKey, metadata);
  return metadata;
}

/**
 * Clears the metadata cache if a user uploads a new custom ring model.
 */
export function clearRingMetadataCache() {
  metadataCache.clear();
}
