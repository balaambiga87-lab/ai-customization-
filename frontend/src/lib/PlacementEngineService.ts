import { BandKey, SettingKey, StoneKey } from "./types";
import {
  getBandMetadata,
  getSettingMetadata,
  getGemstoneMetadata,
  BandAssetMetadata,
  SettingAssetMetadata,
  GemstoneAssetMetadata,
} from "./assetMetadataLoader";

export interface PlacementEngineResult {
  x: number;        // percentage coordinate (e.g. 0.50 = 50%)
  y: number;        // percentage coordinate (e.g. 0.246 = 24.6%)
  scale: number;    // scale factor derived from setting.recommendedScale
  rotation: number; // rotation in degrees equal to setting.rotation
}

/**
 * Deterministic PlacementEngine Service.
 *
 * Workflow:
 * 1. User selects a band.
 * 2. Load the band's metadata.
 * 3. Place the selected setting at the band's anchor.
 * 4. Load the setting metadata.
 * 5. Place the gemstone at the setting anchor.
 * 6. Scale the gemstone using setting.recommendedScale.
 * 7. Keep rotation equal to setting.rotation.
 *
 * Returns { x, y, scale, rotation }
 * Zero image detection. Zero estimated coordinates. Always metadata driven.
 */
export class PlacementEngineService {
  /**
   * Computes exact placement coordinates, scale, and rotation from JSON metadata.
   */
  public calculatePlacement(
    bandKey: BandKey | null,
    settingKey: SettingKey | null,
    stoneKey: StoneKey | null
  ): PlacementEngineResult {
    // 1. User selects a band -> 2. Load the band's metadata
    const bandMeta: BandAssetMetadata = getBandMetadata(bandKey);

    // 3. Place the selected setting at the band's anchor
    const bandAnchor = bandMeta.anchor; // { x, y }

    // 4. Load the setting metadata
    const settingMeta: SettingAssetMetadata = getSettingMetadata(settingKey);
    const gemMeta: GemstoneAssetMetadata = getGemstoneMetadata(stoneKey);

    // 5. Place the gemstone at the setting anchor (anchored to band mount point)
    const x = bandAnchor.x;
    const y = bandAnchor.y;

    // 6. Scale the gemstone using setting.recommendedScale (adjusted for gemstone diameter)
    const gemScaleRatio = gemMeta ? gemMeta.diameter / 6.5 : 1.0;
    const scale = settingMeta.recommendedScale * gemScaleRatio;

    // 7. Keep rotation equal to the setting rotation
    const rotation = settingMeta.rotation ?? 0;

    return {
      x,
      y,
      scale,
      rotation,
    };
  }
}

export const PlacementEngine = new PlacementEngineService();
