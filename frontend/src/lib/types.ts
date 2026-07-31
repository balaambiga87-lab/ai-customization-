export type Metal = "rose_gold" | "gold" | "silver" | "platinum";

export type Category = "band" | "stone" | "setting" | "accent";

export type BandKey = "classic" | "twist" | "pave";
export type StoneKey = "round" | "oval" | "princess" | "emerald" | "marquise";
export type SettingKey = "prong" | "bezel" | "halo";
export type AccentKey = "accent";

export type PartKey = BandKey | StoneKey | SettingKey | AccentKey;

export type MountKey = "center" | "accentL1" | "accentL2" | "accentR1" | "accentR2";

export interface MountPoint {
  x: number; // percent within tray
  y: number; // percent within tray
}

export interface PartMeta {
  key: PartKey;
  category: Category;
  name: string;
  metaLabel: string; // display string e.g. "1.20 ct"
  carat?: number;
  grams?: number;
}

export interface DragPayload {
  cat: Category;
  key: PartKey;
}

export interface ConfigState {
  band: BandKey | null;
  stone: StoneKey | null;
  setting: SettingKey | null;
  accents: Partial<Record<MountKey, AccentKey>>;
}

export interface LayerObject {
  id: string;
  type: Category | "side_stone" | "decorative";
  key: PartKey;
  name: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  scale: number;
  rotation: number;
  zIndex: number;
}

export interface DesignJSON {
  id: string;
  name: string;
  metal: Metal;
  createdAt: string;
  zoom: number;
  layers: LayerObject[];
}

export interface DocketRow {
  slotId: string; // "band" | "stone" | "setting" | "accent:<mountKey>"
  name: string;
  metaLabel: string;
}

export type AnchorType = 
  | "CenterStoneAnchor"
  | "HaloAnchor"
  | "LeftSideStoneAnchor"
  | "RightSideStoneAnchor"
  | "PendantAnchor"
  | "CharmAnchor";

export interface AnchorPoint {
  type: AnchorType;
  x: number; // percent of canvas (0-100)
  y: number; // percent of canvas (0-100)
  depthOffset: number; // px depth
  angle: number; // deg orientation
}

export interface RingMetadata {
  ringType: string;
  settingType: string;
  ringCenter: { x: number; y: number };
  cameraAngle: number;
  perspective: string; // e.g. "3/4 Isometric CAD Perspective"
  bandWidth: number; // mm / px
  stoneSeat: { x: number; y: number };
  seatDiameter: number; // px
  mountHeight: number; // px
  prongCount: number;
  haloRegion: { x: number; y: number; radius: number } | null;
  sideStonePositions: { x: number; y: number; angle: number }[];
  gallery: { depth: number; width: number };
  supportedCuts: StoneKey[];
  supportedStoneSizes: { minCarat: number; maxCarat: number };
  anchors: Record<AnchorType, AnchorPoint>;
}

export interface PlacementCorrection {
  ringType: string;
  settingType: string;
  stoneCut: string;
  cameraView: string;
  offsetX: number;
  offsetY: number;
  scaleCorrection: number;
  rotationCorrection: number;
  depthCorrection: number;
}

export interface ValidationResult {
  isValid: boolean;
  score: number;
  checks: {
    stoneCentered: boolean;
    prongsTouchingGirdle: boolean;
    pavilionInsideSetting: boolean;
    noFloatingGemstone: boolean;
    correctPerspective: boolean;
    correctShadows: boolean;
    correctLighting: boolean;
    realisticMounting: boolean;
  };
  refinementOffset?: { moveX: number; moveY: number; depth: number };
}
