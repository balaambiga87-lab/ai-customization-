export interface StructuredDesign {
  productType: string;
  collection?: string;
  metal: {
    type: string;
    karat: string;
  };
  style?: string;
  theme?: string;
  centerStone?: {
    type: string;
    shape: string;
    size: string;
  };
  decorations?: Array<{
    type: string;
    quantity?: number;
  }>;
  engraving?: string | null;
}

export interface MappedAsset {
  anchorName: string;
  assetId: string;
  name: string;
  priceCalculated: number;
}

export interface MappedDesign {
  blueprintId: string;
  blueprintName: string;
  metalMaterialId: string | null;
  centerStoneId: string | null;
  mappedAssets: MappedAsset[];
  customText: string | null;
  estimatedPrice: number;
  confidenceScore: number;
}

export interface SuggestionPayload {
  success: boolean;
  message: string;
  suggestions: {
    unresolvedType: string;
    unresolvedValue: string;
    alternatives: Array<{
      id: string;
      name: string;
      sku: string;
      price?: number;
    }>;
  };
}
