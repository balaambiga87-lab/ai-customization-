"use client";

import React from "react";
import { Metal, SettingKey } from "@/lib/types";

interface CadSettingProps {
  settingKey: SettingKey;
  metal: Metal;
  layer: "back" | "front";
  size?: number;
}

export function CadSetting({ settingKey, metal, layer, size = 110 }: CadSettingProps) {
  // Metal palette
  const mc: any = ({
    rose_gold: { main: "#e0a899", hi: "#f7ddd0", lo: "#a8674f", mid: "#cc8878", stroke: "#7a3f4e" },
    gold:      { main: "#c9a227", hi: "#f0d78c", lo: "#7a5e14", mid: "#b88e22", stroke: "#54400a" },
    silver:    { main: "#c6cbd3", hi: "#f4f7fa", lo: "#787e88", mid: "#a8adb8", stroke: "#4a4e56" },
    platinum:  { main: "#dce3e6", hi: "#ffffff", lo: "#8b959b", mid: "#bec8cc", stroke: "#555d62" },
  } as Record<string, typeof mc>)[metal] ?? {
    main: "#e0a899", hi: "#f7ddd0", lo: "#a8674f", mid: "#cc8878", stroke: "#7a3f4e",
  };

  // Unique gradient IDs per instance
  const gid  = `cad-${settingKey}-${metal}-${layer}`;
  const shid = `cad-sh-${settingKey}-${metal}-${layer}`;
  const isBack = layer === "back";

  // ─── BEZEL ────────────────────────────────────────────────────
  if (settingKey === "bezel") {
    return (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={mc.hi}   />
            <stop offset="40%"  stopColor={mc.main}  />
            <stop offset="100%" stopColor={mc.lo}    />
          </linearGradient>
        </defs>
        {isBack ? (
          <g>
            <ellipse cx="100" cy="118" rx="64" ry="32" fill={`url(#${gid})`} opacity="0.95" />
            <ellipse cx="100" cy="114" rx="50" ry="23" fill="#1a0d12" opacity="0.55" />
            <ellipse cx="100" cy="136" rx="64" ry="14" fill={mc.lo} opacity="0.45" />
          </g>
        ) : (
          <g>
            <path d="M36 108 C36 148 164 148 164 108 C164 88 36 88 36 108 Z"
              fill="none" stroke={`url(#${gid})`} strokeWidth="10" />
            <path d="M44 106 C44 138 156 138 156 106"
              fill="none" stroke={mc.hi} strokeWidth="2.5" opacity="0.65" />
            <path d="M36 108 C36 148 164 148 164 108"
              fill="none" stroke={mc.lo} strokeWidth="2" opacity="0.45" />
          </g>
        )}
      </svg>
    );
  }

  // ─── HALO ─────────────────────────────────────────────────────
  if (settingKey === "halo") {
    return (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={mc.hi}  />
            <stop offset="50%"  stopColor={mc.main} />
            <stop offset="100%" stopColor={mc.lo}   />
          </linearGradient>
        </defs>
        {isBack ? (
          <g>
            <ellipse cx="100" cy="112" rx="82" ry="42" fill={`url(#${gid})`} />
            <ellipse cx="100" cy="108" rx="64" ry="30" fill="#1f1418" opacity="0.65" />
            <ellipse cx="100" cy="108" rx="80" ry="40" fill="none" stroke={mc.mid} strokeWidth="4" opacity="0.7" />
          </g>
        ) : (
          <g>
            <ellipse cx="100" cy="107" rx="82" ry="41" fill="none" stroke={`url(#${gid})`} strokeWidth="5.5" />
            {Array.from({ length: 18 }).map((_, i) => {
              const angle = (i / 18) * Math.PI * 2;
              const cx = 100 + 82 * Math.cos(angle);
              const cy = 107 + 41 * Math.sin(angle);
              const isTop = cy < 112;
              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="5.5"
                    fill="#e8f6ff" stroke={mc.hi} strokeWidth="1" opacity={isTop ? 1 : 0.45} />
                  <circle cx={cx - 1} cy={cy - 1} r="2"
                    fill="#ffffff" opacity={isTop ? 0.9 : 0.25} />
                </g>
              );
            })}
          </g>
        )}
      </svg>
    );
  }

  // ─── DEFAULT: FOUR-PRONG SOLITAIRE ────────────────────────────
  //
  // The diamond composite box is 200×200 px, diamond image is 220×220
  // (overflow is clipped by clip-path on the diamond layer).
  // The gemstone sits centered at (100, 90) in the 200×200 viewBox.
  // Prong tips grip around y ≈ 80–90, which aligns with the girdle.
  //
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <defs>
        {/* Main metal gradient */}
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={mc.hi}   />
          <stop offset="45%"  stopColor={mc.main}  />
          <stop offset="100%" stopColor={mc.lo}    />
        </linearGradient>
        {/* Prong highlight */}
        <linearGradient id={`${gid}-h`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={mc.hi}  stopOpacity="1"   />
          <stop offset="100%" stopColor={mc.mid} stopOpacity="0.8" />
        </linearGradient>
        {/* Gallery bowl shadow */}
        <radialGradient id={shid} cx="50%" cy="60%" r="50%">
          <stop offset="0%"   stopColor="#0d0608" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#0d0608" stopOpacity="0"    />
        </radialGradient>
      </defs>

      {isBack ? (
        // ── BACK: gallery wire ring + 2 rear prong pillars ─────────
        <g>
          {/* Gallery depth shadow */}
          <ellipse cx="100" cy="126" rx="56" ry="24" fill={`url(#${shid})`} />

          {/* Gallery wire ring */}
          <ellipse cx="100" cy="124" rx="54" ry="22"
            fill="none" stroke={`url(#${gid})`} strokeWidth="6" />
          {/* Inner highlight rim */}
          <ellipse cx="100" cy="121" rx="48" ry="18"
            fill="none" stroke={mc.hi} strokeWidth="1.5" opacity="0.5" />

          {/* Gallery support struts */}
          <path d="M60 144 L70 124" stroke={`url(#${gid})`} strokeWidth="6" strokeLinecap="round" />
          <path d="M140 144 L130 124" stroke={`url(#${gid})`} strokeWidth="6" strokeLinecap="round" />

          {/* Back-left prong */}
          <path d="M52 124 C50 108 48 92 46 76"
            stroke={`url(#${gid})`} strokeWidth="8.5" strokeLinecap="round" />
          <path d="M54 124 C52 108 50 92 48 76"
            stroke={mc.hi} strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
          <circle cx="46" cy="74" r="6.5" fill={mc.hi} stroke={mc.stroke} strokeWidth="1.5" />
          <circle cx="44" cy="72" r="2.2" fill="#ffffff" opacity="0.75" />

          {/* Back-right prong */}
          <path d="M148 124 C150 108 152 92 154 76"
            stroke={`url(#${gid})`} strokeWidth="8.5" strokeLinecap="round" />
          <path d="M150 124 C152 108 154 92 156 76"
            stroke={mc.hi} strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
          <circle cx="154" cy="74" r="6.5" fill={mc.hi} stroke={mc.stroke} strokeWidth="1.5" />
          <circle cx="156" cy="72" r="2.2" fill="#ffffff" opacity="0.75" />
        </g>
      ) : (
        // ── FRONT: 2 front prong pillars gripping the diamond girdle ─
        <g>
          {/* Front-left prong shaft */}
          <path d="M66 148 C62 130 58 110 54 88"
            stroke={`url(#${gid})`} strokeWidth="9.5" strokeLinecap="round" />
          <path d="M68 148 C64 130 60 110 56 88"
            stroke={mc.hi} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
          {/* Claw curl gripping girdle */}
          <path d="M54 88 Q56 78 64 82"
            fill="none" stroke={`url(#${gid})`} strokeWidth="8" strokeLinecap="round" />
          <circle cx="56" cy="84" r="7" fill={mc.hi} stroke={mc.stroke} strokeWidth="1.5" />
          <circle cx="54" cy="82" r="2.5" fill="#ffffff" opacity="0.80" />

          {/* Front-right prong shaft */}
          <path d="M134 148 C138 130 142 110 146 88"
            stroke={`url(#${gid})`} strokeWidth="9.5" strokeLinecap="round" />
          <path d="M136 148 C140 130 144 110 148 88"
            stroke={mc.hi} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
          {/* Claw curl */}
          <path d="M146 88 Q144 78 136 82"
            fill="none" stroke={`url(#${gid})`} strokeWidth="8" strokeLinecap="round" />
          <circle cx="144" cy="84" r="7" fill={mc.hi} stroke={mc.stroke} strokeWidth="1.5" />
          <circle cx="146" cy="82" r="2.5" fill="#ffffff" opacity="0.80" />
        </g>
      )}
    </svg>
  );
}
