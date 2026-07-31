"use client";

import React from "react";
import { Metal, SettingKey } from "@/lib/types";

interface CadSettingProps {
  settingKey: SettingKey;
  metal: Metal;
  layer: "back" | "front";
  size?: number; // default 110px
}

export function CadSetting({ settingKey, metal, layer, size = 110 }: CadSettingProps) {
  // Define metal gradient colors based on metal type
  const metalColors = {
    rose_gold: { main: "#e0a899", hi: "#f7ddd0", lo: "#a8674f", stroke: "#7a3f4e" },
    gold: { main: "#c9a227", hi: "#f0d78c", lo: "#7a5e14", stroke: "#54400a" },
    silver: { main: "#c6cbd3", hi: "#f4f7fa", lo: "#787e88", stroke: "#4a4e56" },
    platinum: { main: "#dce3e6", hi: "#ffffff", lo: "#8b959b", stroke: "#555d62" },
  }[metal] || { main: "#e0a899", hi: "#f7ddd0", lo: "#a8674f", stroke: "#7a3f4e" };

  const isBack = layer === "back";

  if (settingKey === "bezel") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`bezel-grad-${metal}-${layer}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={metalColors.hi} />
            <stop offset="50%" stopColor={metalColors.main} />
            <stop offset="100%" stopColor={metalColors.lo} />
          </linearGradient>
        </defs>

        {isBack ? (
          // Bezel Back Cup & Seat
          <g>
            <ellipse cx="50" cy="54" rx="34" ry="18" fill={`url(#bezel-grad-${metal}-${layer})`} opacity="0.9" />
            <ellipse cx="50" cy="54" rx="28" ry="14" fill="#2a1a20" opacity="0.6" />
          </g>
        ) : (
          // Bezel Front Rim Wrap
          <g>
            <path
              d="M16 54 C16 70 84 70 84 54 C84 46 16 46 16 54 Z"
              fill="none"
              stroke={`url(#bezel-grad-${metal}-${layer})`}
              strokeWidth="5"
            />
          </g>
        )}
      </svg>
    );
  }

  if (settingKey === "halo") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`halo-grad-${metal}-${layer}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={metalColors.hi} />
            <stop offset="50%" stopColor={metalColors.main} />
            <stop offset="100%" stopColor={metalColors.lo} />
          </linearGradient>
        </defs>

        {isBack ? (
          // Halo Platform Base Basket
          <g>
            <ellipse cx="50" cy="55" rx="42" ry="22" fill={`url(#halo-grad-${metal}-${layer})`} />
            <ellipse cx="50" cy="55" rx="32" ry="16" fill="#1f1418" opacity="0.7" />
          </g>
        ) : (
          // Halo Front Micro-Diamonds Rim
          <g>
            <ellipse cx="50" cy="54" rx="41" ry="21" fill="none" stroke={`url(#halo-grad-${metal}-${layer})`} strokeWidth="3" />
            {Array.from({ length: 14 }).map((_, i) => {
              const angle = (i / 14) * Math.PI * 2;
              const cx = 50 + 40 * Math.cos(angle);
              const cy = 54 + 20 * Math.sin(angle);
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r="3.2"
                  fill="#f0f9ff"
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  style={{ filter: "drop-shadow(0 0 2px rgba(255,255,255,0.9))" }}
                />
              );
            })}
          </g>
        )}
      </svg>
    );
  }

  // DEFAULT: Four-Prong Peg Setting (prong)
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`prong-grad-${metal}-${layer}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={metalColors.hi} />
          <stop offset="50%" stopColor={metalColors.main} />
          <stop offset="100%" stopColor={metalColors.lo} />
        </linearGradient>
        <radialGradient id={`gallery-shadow-${layer}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a0d12" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1a0d12" stopOpacity="0" />
        </radialGradient>
      </defs>

      {isBack ? (
        // BACK LAYER: Gallery Wire Ring + 2 Back Prongs
        <g>
          {/* Gallery Wire Ring Ledge */}
          <ellipse cx="50" cy="56" rx="28" ry="13" fill={`url(#gallery-shadow-${layer})`} />
          <ellipse cx="50" cy="56" rx="28" ry="13" fill="none" stroke={`url(#prong-grad-${metal}-${layer})`} strokeWidth="3" />
          
          {/* Wire Gallery Support Struts */}
          <path d="M30 68 L36 56" stroke={`url(#prong-grad-${metal}-${layer})`} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M70 68 L64 56" stroke={`url(#prong-grad-${metal}-${layer})`} strokeWidth="3.5" strokeLinecap="round" />

          {/* Back Left Prong (Pillar) */}
          <path d="M26 56 L24 38" stroke={`url(#prong-grad-${metal}-${layer})`} strokeWidth="4" strokeLinecap="round" />
          <circle cx="24" cy="37" r="2.8" fill={metalColors.hi} stroke={metalColors.stroke} strokeWidth="0.8" />

          {/* Back Right Prong (Pillar) */}
          <path d="M74 56 L76 38" stroke={`url(#prong-grad-${metal}-${layer})`} strokeWidth="4" strokeLinecap="round" />
          <circle cx="76" cy="37" r="2.8" fill={metalColors.hi} stroke={metalColors.stroke} strokeWidth="0.8" />
        </g>
      ) : (
        // FRONT LAYER: 2 Front Prongs with Rounded Claws Overlapping Gemstone Girdle
        <g>
          {/* Front Left Prong & Claw */}
          <path d="M32 68 L28 46" stroke={`url(#prong-grad-${metal}-${layer})`} strokeWidth="4.5" strokeLinecap="round" />
          {/* Claw Tip hights girdle */}
          <path d="M28 46 Q 30 42 34 44" fill="none" stroke={`url(#prong-grad-${metal}-${layer})`} strokeWidth="4" strokeLinecap="round" />
          <circle cx="30" cy="44" r="3" fill={metalColors.hi} stroke={metalColors.stroke} strokeWidth="0.8" />

          {/* Front Right Prong & Claw */}
          <path d="M68 68 L72 46" stroke={`url(#prong-grad-${metal}-${layer})`} strokeWidth="4.5" strokeLinecap="round" />
          {/* Claw Tip hights girdle */}
          <path d="M72 46 Q 70 42 66 44" fill="none" stroke={`url(#prong-grad-${metal}-${layer})`} strokeWidth="4" strokeLinecap="round" />
          <circle cx="70" cy="44" r="3" fill={metalColors.hi} stroke={metalColors.stroke} strokeWidth="0.8" />
        </g>
      )}
    </svg>
  );
}
