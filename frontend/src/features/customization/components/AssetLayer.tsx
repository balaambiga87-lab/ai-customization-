import React from 'react';
import { useDesignStore } from '../../../stores/useDesignStore';
import { MockBlueprint, MOCK_ASSETS, MOCK_GEMSTONES } from '../mocks/customizer.mocks';

interface AssetLayerProps {
  blueprint: MockBlueprint;
}

export const AssetLayer: React.FC<AssetLayerProps> = ({ blueprint }) => {
  const { configuration } = useDesignStore();

  return (
    <g>
      {blueprint.anchors.map((anchor) => {
        const anchorConfig = configuration[anchor.name];
        if (!anchorConfig) return null;

        const { assetId, gemstoneId, scale, rotation } = anchorConfig;

        const asset = MOCK_ASSETS.find((a) => a.id === assetId);
        const gemstone = MOCK_GEMSTONES.find((g) => g.id === gemstoneId);

        // Gem shape paths (centered relative to coordinate 0,0)
        const getGemstoneSvgPath = (shape: string) => {
          const s = shape.toLowerCase();
          if (s === 'pear') {
            return 'M 0,-6 C -5,0 -5,5 0,8 C 5,5 5,0 0,-6 Z';
          }
          if (s === 'oval') {
            return 'M 0,-7 C -4.5,-7 -4.5,7 0,7 C 4.5,7 4.5,-7 0,-7 Z';
          }
          if (s === 'cushion') {
            return 'M -5,-5 C -2,-7 2,-7 5,-5 C 7,-2 7,2 5,5 C 2,7 -2,7 -5,5 C -7,2 -7,-2 -5,-5 Z';
          }
          // Default Round
          return 'M 0,-6 A 6,6 0 1,1 0,6 A 6,6 0 1,1 0,-6 Z';
        };

        return (
          <g
            key={`rendered-anchor-${anchor.name}`}
            transform={`translate(${anchor.positionX}, ${anchor.positionY}) rotate(${rotation}) scale(${scale})`}
          >
            {/* 1. Render Setting Head/Charm Asset Vector */}
            {asset && asset.svgRenderPath && (
              <path
                d={asset.svgRenderPath}
                fill="none"
                stroke="#475569"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-xs"
              />
            )}

            {/* 2. Render Gemstone Crystal Vector */}
            {gemstone && (
              <g className="drop-shadow-sm transition-all duration-300">
                {/* Gem stone body */}
                <path
                  d={getGemstoneSvgPath(gemstone.shape)}
                  fill={gemstone.colorHex}
                  fillOpacity="0.85"
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  className="animate-pulse"
                  style={{ animationDuration: '4s' }}
                />
                {/* Internal facet reflection lines for visual shine */}
                <path
                  d="M 0,-3 L 0,3 M -3,0 L 3,0"
                  stroke="#ffffff"
                  strokeWidth="0.4"
                  strokeOpacity="0.6"
                />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};
export default AssetLayer;
