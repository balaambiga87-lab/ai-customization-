export interface MockBlueprintAnchor {
  name: string;
  anchorType: 'GEM_SLOT' | 'BAND_PART' | 'ENGRAVING' | 'PENDANT_HOLDER';
  positionX: number;
  positionY: number;
  allowedAssetCategoryCodes: string[];
}

export interface MockBlueprint {
  id: string;
  name: string;
  category: 'ring' | 'necklace';
  basePrice: number;
  svgPath: string; // Outline vector representations
  anchors: MockBlueprintAnchor[];
}

export interface MockMaterial {
  id: string;
  name: string;
  materialType: string;
  purity: string;
  pricePerGram: number;
  colorHex: string; // Dynamic coloring on canvas
}

export interface MockGemstone {
  id: string;
  name: string;
  type: string;
  shape: string;
  carat: number;
  price: number;
  colorHex: string;
}

export interface MockAsset {
  id: string;
  name: string;
  categoryCode: 'SHANK' | 'HEAD' | 'ACCENT' | 'PENDANT';
  priceModifier: number;
  svgRenderPath?: string; // outline rendering path
}

export const MOCK_BLUEPRINTS: MockBlueprint[] = [
  {
    id: 'bp-ring-01',
    name: 'Classic Custom Ring Setting',
    category: 'ring',
    basePrice: 450.00,
    svgPath: 'M 100,100 m -50,0 a 50,50 0 1,0 100,0 a 50,50 0 1,0 -100,0', // ring circle outline
    anchors: [
      {
        name: 'center_gem_anchor',
        anchorType: 'GEM_SLOT',
        positionX: 100,
        positionY: 46, // Top center
        allowedAssetCategoryCodes: ['HEAD'],
      },
      {
        name: 'left_accent_anchor',
        anchorType: 'ENGRAVING',
        positionX: 62,
        positionY: 65, // Shoulder left
        allowedAssetCategoryCodes: ['ACCENT'],
      },
      {
        name: 'right_accent_anchor',
        anchorType: 'ENGRAVING',
        positionX: 138,
        positionY: 65, // Shoulder right
        allowedAssetCategoryCodes: ['ACCENT'],
      },
    ],
  },
  {
    id: 'bp-necklace-01',
    name: 'Custom Pendant Chain Setting',
    category: 'necklace',
    basePrice: 350.00,
    svgPath: 'M 30,50 C 30,120 170,120 170,50', // chain arc outline
    anchors: [
      {
        name: 'center_pendant_anchor',
        anchorType: 'PENDANT_HOLDER',
        positionX: 100,
        positionY: 100, // Chain lowest midpoint
        allowedAssetCategoryCodes: ['PENDANT'],
      },
    ],
  },
];

export const MOCK_MATERIALS: MockMaterial[] = [
  { id: 'mat-yellow-gold', name: '18K Yellow Gold', materialType: 'gold', purity: '18k', pricePerGram: 65.50, colorHex: '#eab308' },
  { id: 'mat-rose-gold', name: '18K Rose Gold', materialType: 'gold', purity: '18k', pricePerGram: 68.00, colorHex: '#fca5a5' },
  { id: 'mat-platinum', name: 'Platinum 950', materialType: 'platinum', purity: '950', pricePerGram: 45.00, colorHex: '#cbd5e1' },
  { id: 'mat-silver', name: 'Sterling Silver', materialType: 'silver', purity: '925', pricePerGram: 18.00, colorHex: '#94a3b8' },
];

export const MOCK_GEMSTONES: MockGemstone[] = [
  { id: 'gem-diamond', name: '1.0ct Round Brilliant Diamond', type: 'diamond', shape: 'Round', carat: 1.0, price: 5200, colorHex: '#e2e8f0' },
  { id: 'gem-emerald', name: '1.5ct Oval Zambian Emerald', type: 'emerald', shape: 'Oval', carat: 1.5, price: 2900, colorHex: '#10b981' },
  { id: 'gem-sapphire', name: '2.0ct Pear Blue Sapphire', type: 'sapphire', shape: 'Pear', carat: 2.0, price: 3100, colorHex: '#3b82f6' },
  { id: 'gem-ruby', name: '1.2ct Cushion Burmese Ruby', type: 'ruby', shape: 'Cushion', carat: 1.2, price: 3400, colorHex: '#ef4444' },
];

export const MOCK_ASSETS: MockAsset[] = [
  // Ring Shanks
  { id: 'ast-shank-knife', name: 'Knife-Edge Band Shape', categoryCode: 'SHANK', priceModifier: 50.00 },
  { id: 'ast-shank-twig', name: 'Twig Branch Ring Shape', categoryCode: 'SHANK', priceModifier: 95.00 },
  // Setting Heads
  { id: 'ast-head-4prong', name: '4-Prong Classic Setting Head', categoryCode: 'HEAD', priceModifier: 60.00, svgRenderPath: 'M -10,-10 L 10,-10 L 10,10 L -10,10 Z' },
  { id: 'ast-head-6prong', name: '6-Prong Crown Setting Head', categoryCode: 'HEAD', priceModifier: 80.00, svgRenderPath: 'M 0,-12 L 10,-5 L 8,8 L -8,8 L -10,-5 Z' },
  // Accents
  { id: 'ast-accent-leaf', name: 'Leaf Cluster Accent Carvings', categoryCode: 'ACCENT', priceModifier: 40.00, svgRenderPath: 'M -5,-5 Q -10,0 -5,5 Q 0,0 -5,-5 Z' },
  { id: 'ast-accent-blossom', name: 'Blossom Floral Accent Studs', categoryCode: 'ACCENT', priceModifier: 55.00, svgRenderPath: 'M 0,-5 C 5,-5 5,5 0,5 C -5,5 -5,-5 0,-5 Z' },
  // Pendants
  { id: 'ast-pendant-mount', name: 'Solitaire Pendant Mount', categoryCode: 'PENDANT', priceModifier: 85.00, svgRenderPath: 'M -12,-5 L 12,-5 L 0,15 Z' },
];
