"use client";

import React from "react";
import { Metal } from "@/lib/types";

interface JewelryAssetSvgProps {
  cat: string;
  itemKey: string;
  metal?: Metal;
  size?: number;
}

// ─── Metal Palettes ─────────────────────────────────────────────────────────
type MetalColors = {
  main: string; hi: string; lo: string; mid: string; stroke: string; shimmer: string;
};

function getMetalColors(metal: string): MetalColors {
  const palettes: Record<string, MetalColors> = {
    rose_gold: { main: "#d4856a", hi: "#f9ddd0", lo: "#8a3a28", mid: "#c0664c", stroke: "#6e2d1c", shimmer: "#ffe8df" },
    gold:      { main: "#c9922a", hi: "#f5e08a", lo: "#7a5210", mid: "#b07e20", stroke: "#54370a", shimmer: "#fff3cc" },
    silver:    { main: "#b8c4cc", hi: "#f0f4f8", lo: "#6a7880", mid: "#98a8b0", stroke: "#404850", shimmer: "#ffffff" },
    platinum:  { main: "#ccd6de", hi: "#f8fbff", lo: "#7a8c98", mid: "#aabcc8", stroke: "#4a5862", shimmer: "#ffffff" },
  };
  return palettes[metal] ?? palettes.gold;
}

// ─── Parabolic necklace drape ─────────────────────────────────────────────
// Returns (x, y) in SVG viewBox coords for t ∈ [0,1]
// The chain hangs from left shoulder (lx,ly) to right shoulder (rx,ry) dipping to (cx,cy)
function drapePoint(t: number, W: number, H: number, dip: number) {
  const x = 8 + t * (W - 16);
  const y = H * 0.18 + dip * Math.pow(2 * t - 1, 2);
  return { x, y };
}

// ─── Link angle along drape curve ────────────────────────────────────────
function drapeAngle(t: number, W: number, H: number, dip: number): number {
  const eps = 0.005;
  const t1 = Math.min(1, t + eps);
  const t0 = Math.max(0, t - eps);
  const p1 = drapePoint(t1, W, H, dip);
  const p0 = drapePoint(t0, W, H, dip);
  return Math.atan2(p1.y - p0.y, p1.x - p0.x) * (180 / Math.PI);
}

export function JewelryAssetSvg({ cat, itemKey, metal = "gold", size = 80 }: JewelryAssetSvgProps) {
  const mc = getMetalColors(metal);
  const uid = `jsvg-${cat}-${itemKey}-${metal}-${size}`.replace(/[^a-z0-9-]/gi, "_");

  // ══════════════════════════════════════════════════════════════════════════
  // 1. REALISTIC WEARABLE NECKLACE CHAINS
  // ══════════════════════════════════════════════════════════════════════════
  if (cat === "chain" || itemKey.startsWith("chain_")) {
    const W = 200;
    const H = 200;
    const dip = 70; // how far the centre of the chain dips
    const steps = 48; // number of links

    const isBox    = itemKey.includes("box");
    const isRope   = itemKey.includes("rope");
    const isSnake  = itemKey.includes("snake");
    const isFigaro = itemKey.includes("figaro");
    const isCurb   = itemKey.includes("curb");

    // Build gradient defs — one per link would be too heavy; we use 3 shared ones
    const gradId   = `${uid}_g`;
    const gradId2  = `${uid}_g2`;
    const gradIdHi = `${uid}_ghi`;

    const links: React.ReactNode[] = [];

    if (isSnake) {
      // Snake chain: smooth serpent tube with varying width and specular stripe
      const pathD = Array.from({ length: steps + 1 }, (_, i) => {
        const { x, y } = drapePoint(i / steps, W, H, dip);
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      }).join(" ");

      links.push(
        <path key="snake-body" d={pathD} stroke={`url(#${gradId})`} strokeWidth="10" strokeLinecap="round" fill="none" />,
        // Specular highlight stripe
        <path key="snake-hi" d={pathD} stroke={`url(#${gradIdHi})`} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
      );
    } else if (isBox) {
      // Box chain: square faceted links
      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const { x, y } = drapePoint(t + 0.5 / steps, W, H, dip);
        const angle = drapeAngle(t + 0.5 / steps, W, H, dip);
        const lw = 7; const lh = 6;
        links.push(
          <g key={i} transform={`translate(${x.toFixed(2)},${y.toFixed(2)}) rotate(${angle.toFixed(1)})`}>
            {/* Box link body */}
            <rect x={-lw/2} y={-lh/2} width={lw} height={lh} fill={`url(#${gradId})`} stroke={mc.stroke} strokeWidth="0.5" rx="0.5" />
            {/* Top bevel highlight */}
            <rect x={-lw/2} y={-lh/2} width={lw} height={lh*0.35} fill={mc.hi} opacity="0.55" rx="0.5" />
            {/* Inner shadow */}
            <rect x={-lw/2+1.5} y={-lh/2+1.5} width={lw-3} height={lh-3} fill="none" stroke={mc.lo} strokeWidth="0.5" opacity="0.6" />
          </g>
        );
      }
    } else if (isRope) {
      // Rope chain: twisted elliptical links rotating as they progress
      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const { x, y } = drapePoint(t + 0.5 / steps, W, H, dip);
        const angleAlong = drapeAngle(t + 0.5 / steps, W, H, dip);
        const twist = (i * 22) % 180; // rotation of the ellipse for rope twist
        links.push(
          <g key={i} transform={`translate(${x.toFixed(2)},${y.toFixed(2)}) rotate(${angleAlong.toFixed(1)})`}>
            <ellipse cx="0" cy="0" rx="5.5" ry="3.5" fill={`url(#${gradId})`} stroke={mc.stroke} strokeWidth="0.6"
              transform={`rotate(${twist})`} />
            <ellipse cx="0" cy="0" rx="3" ry="1.5" fill={mc.hi} opacity="0.45" transform={`rotate(${twist})`} />
          </g>
        );
      }
    } else if (isFigaro) {
      // Figaro: pattern of 3 small round + 1 long oval link
      let linkCount = 0;
      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const { x, y } = drapePoint(t + 0.5 / steps, W, H, dip);
        const angle = drapeAngle(t + 0.5 / steps, W, H, dip);
        const isLong = linkCount % 4 === 3;
        const rx = isLong ? 7 : 4;
        const ry = 3;
        links.push(
          <g key={i} transform={`translate(${x.toFixed(2)},${y.toFixed(2)}) rotate(${angle.toFixed(1)})`}>
            {/* Outer link frame */}
            <ellipse cx="0" cy="0" rx={rx} ry={ry} fill={`url(#${gradId})`} stroke={mc.stroke} strokeWidth="0.6" />
            {/* Inner hollow hole */}
            <ellipse cx="0" cy="0" rx={Math.max(1, rx - 2.5)} ry={Math.max(0.5, ry - 1.8)} fill="rgba(0,0,0,0.85)" />
            {/* Specular */}
            <ellipse cx={-rx * 0.3} cy={-ry * 0.3} rx={rx * 0.35} ry={ry * 0.35} fill={mc.hi} opacity="0.5" />
          </g>
        );
        linkCount++;
      }
    } else if (isCurb) {
      // Curb chain: flat wide interlocked links alternating horizontal/vertical
      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const { x, y } = drapePoint(t + 0.5 / steps, W, H, dip);
        const angle = drapeAngle(t + 0.5 / steps, W, H, dip);
        const tiltExtra = i % 2 === 0 ? 35 : -35; // interlocking tilt
        links.push(
          <g key={i} transform={`translate(${x.toFixed(2)},${y.toFixed(2)}) rotate(${angle.toFixed(1)})`}>
            <ellipse cx="0" cy="0" rx="6" ry="3.5" fill={`url(#${gradId})`} stroke={mc.stroke} strokeWidth="0.6"
              transform={`rotate(${tiltExtra})`} />
            <ellipse cx="0" cy="0" rx="3.5" ry="1.5" fill="rgba(0,0,0,0.8)" transform={`rotate(${tiltExtra})`} />
            <ellipse cx="-1.5" cy="-1" rx="2" ry="1" fill={mc.hi} opacity="0.55" transform={`rotate(${tiltExtra})`} />
          </g>
        );
      }
    } else {
      // Cable chain (default): classic oval interlocking links alternating orientation
      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const { x, y } = drapePoint(t + 0.5 / steps, W, H, dip);
        const angle = drapeAngle(t + 0.5 / steps, W, H, dip);
        // Every other link is perpendicular (interlocking)
        const perpTilt = i % 2 === 0 ? 0 : 90;
        links.push(
          <g key={i} transform={`translate(${x.toFixed(2)},${y.toFixed(2)}) rotate(${angle.toFixed(1)})`}>
            {/* Link outer ring */}
            <ellipse cx="0" cy="0" rx="5.5" ry="3.2" fill={`url(#${gradId})`} stroke={mc.stroke} strokeWidth="0.7"
              transform={`rotate(${perpTilt})`} />
            {/* Inner hollow cutout */}
            <ellipse cx="0" cy="0" rx="3" ry="1.4" fill="rgba(0,0,0,0.82)" transform={`rotate(${perpTilt})`} />
            {/* Specular crescent highlight */}
            <ellipse cx="-1.5" cy="-1" rx="2" ry="1" fill={mc.hi} opacity="0.6" transform={`rotate(${perpTilt})`} />
          </g>
        );
      }
    }

    // Lobster clasp at right end
    const { x: cx, y: cy } = drapePoint(1, W, H, dip);
    const clasp = (
      <g key="clasp" transform={`translate(${cx.toFixed(2)},${cy.toFixed(2)})`}>
        <rect x="-4" y="-3.5" width="8" height="7" rx="2" fill={`url(#${gradId2})`} stroke={mc.stroke} strokeWidth="0.7" />
        <rect x="-2.5" y="-2" width="5" height="4" rx="1" fill="rgba(0,0,0,0.7)" />
      </g>
    );

    // Ring ends (jump rings connecting clasp + chain)
    const { x: lx, y: ly } = drapePoint(0, W, H, dip);
    const jumpRings = (
      <>
        <ellipse key="jr-l" cx={lx} cy={ly} rx="3.5" ry="3.5" fill="none" stroke={`url(#${gradId})`} strokeWidth="1.5" />
        <ellipse key="jr-r" cx={cx} cy={cy} rx="3.5" ry="3.5" fill="none" stroke={`url(#${gradId})`} strokeWidth="1.5" />
      </>
    );

    return (
      <svg width={size} height={size} viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Main metal gradient (along chain direction) */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor={mc.hi}   />
            <stop offset="30%"  stopColor={mc.main}  />
            <stop offset="70%"  stopColor={mc.mid}   />
            <stop offset="100%" stopColor={mc.lo}    />
          </linearGradient>
          {/* Secondary gradient for clasp */}
          <linearGradient id={gradId2} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={mc.hi}   />
            <stop offset="50%"  stopColor={mc.main}  />
            <stop offset="100%" stopColor={mc.lo}    />
          </linearGradient>
          {/* Shimmer highlight for snake chain */}
          <linearGradient id={gradIdHi} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor={mc.shimmer} stopOpacity="0.9" />
            <stop offset="50%"  stopColor={mc.hi}       stopOpacity="0.5" />
            <stop offset="100%" stopColor={mc.shimmer}  stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Drop shadow under entire chain */}
        <ellipse cx={W / 2} cy={H * 0.18 + dip + 10} rx={W * 0.38} ry="5"
          fill="rgba(0,0,0,0.12)" filter="url(#blur)" />

        {links}
        {jumpRings}
        {clasp}
      </svg>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 2. PENDANT BASES & HANGING EARRING BASES (with 3D frame + bail loop)
  // ══════════════════════════════════════════════════════════════════════════
  if (cat === "pendant_base" || cat === "hanging_base" || itemKey.startsWith("pendant_") && !itemKey.includes("stone") && !itemKey.includes("diamond") && !itemKey.includes("emerald") && !itemKey.includes("ruby") && !itemKey.includes("sapphire") && !itemKey.includes("pearl") && !itemKey.includes("black")) {
    const W = 120; const H = 130;
    const gradId = `${uid}_pb`;
    const gradIdEdge = `${uid}_pbe`;
    const gradIdBail = `${uid}_bail`;

    const isHeart    = itemKey.includes("heart");
    const isCircle   = itemKey.includes("circle");
    const isOval     = itemKey.includes("oval");
    const isInfinity = itemKey.includes("infinity");
    const isLeaf     = itemKey.includes("leaf");
    const isButterfly= itemKey.includes("butterfly");
    const isLotus    = itemKey.includes("lotus");
    const isFloral   = itemKey.includes("floral");
    const isCross    = itemKey.includes("cross");
    // default: teardrop / geometric

    const sw = 8; // stroke width for frame (3D look)

    let frameShape: React.ReactNode;

    if (isHeart) {
      frameShape = (
        <path d="M60 102 C18 68 18 34 36 28 C48 24 60 38 60 38 C60 38 72 24 84 28 C102 34 102 68 60 102 Z"
          stroke={`url(#${gradId})`} strokeWidth={sw} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      );
    } else if (isCircle) {
      frameShape = (
        <circle cx="60" cy="72" r="34" stroke={`url(#${gradId})`} strokeWidth={sw} fill="none" />
      );
    } else if (isOval) {
      frameShape = (
        <ellipse cx="60" cy="75" rx="28" ry="38" stroke={`url(#${gradId})`} strokeWidth={sw} fill="none" />
      );
    } else if (isInfinity) {
      frameShape = (
        <path d="M32 72 C16 52 16 92 32 92 C48 92 60 52 72 52 C88 52 88 92 72 92 C56 92 48 52 32 72 Z"
          stroke={`url(#${gradId})`} strokeWidth={sw} fill="none" strokeLinejoin="round" />
      );
    } else if (isLeaf) {
      frameShape = (
        <path d="M60 24 Q100 62 60 106 Q20 62 60 24 Z"
          stroke={`url(#${gradId})`} strokeWidth={sw} fill="none" strokeLinejoin="round" />
      );
    } else if (isButterfly) {
      frameShape = (
        <g stroke={`url(#${gradId})`} strokeWidth={sw - 1} fill="none" strokeLinejoin="round">
          <path d="M60 64 C26 34 18 58 44 70 C22 82 26 102 58 82" />
          <path d="M60 64 C94 34 102 58 76 70 C98 82 94 102 62 82" />
          <circle cx="60" cy="70" r="4" fill={mc.mid} stroke={mc.stroke} strokeWidth="0.5" />
        </g>
      );
    } else if (isLotus || isFloral) {
      frameShape = (
        <g stroke={`url(#${gradId})`} strokeWidth={sw - 2} fill="none" strokeLinejoin="round">
          {Array.from({ length: 6 }, (_, i) => {
            const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const px = 60 + 28 * Math.cos(a);
            const py = 72 + 28 * Math.sin(a);
            const cp1x = 60 + 8 * Math.cos(a - 0.8);
            const cp1y = 72 + 8 * Math.sin(a - 0.8);
            const cp2x = px - 8 * Math.cos(a - 0.8);
            const cp2y = py - 8 * Math.sin(a - 0.8);
            return <path key={i}
              d={`M60,72 C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${px.toFixed(1)},${py.toFixed(1)}`}
            />;
          })}
          <circle cx="60" cy="72" r="10" stroke={`url(#${gradId})`} strokeWidth={sw - 1} fill="none" />
        </g>
      );
    } else if (isCross) {
      frameShape = (
        <path d="M52 24 H68 V52 H96 V68 H68 V106 H52 V68 H24 V52 H52 Z"
          stroke={`url(#${gradId})`} strokeWidth="2" fill={`url(#${gradIdEdge})`} />
      );
    } else {
      // Teardrop / Default
      frameShape = (
        <path d="M60 24 Q98 62 60 108 Q22 62 60 24 Z"
          stroke={`url(#${gradId})`} strokeWidth={sw} fill="none" strokeLinejoin="round" />
      );
    }

    return (
      <svg width={size} height={size} viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Frame 3D gradient (side-lit) */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={mc.hi}   />
            <stop offset="25%"  stopColor={mc.main}  />
            <stop offset="60%"  stopColor={mc.mid}   />
            <stop offset="100%" stopColor={mc.lo}    />
          </linearGradient>
          {/* Edge fill for cross */}
          <linearGradient id={gradIdEdge} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={mc.hi}  stopOpacity="0.9" />
            <stop offset="50%"  stopColor={mc.main} />
            <stop offset="100%" stopColor={mc.lo}   />
          </linearGradient>
          {/* Bail ring gradient */}
          <linearGradient id={gradIdBail} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={mc.shimmer} />
            <stop offset="50%"  stopColor={mc.main}     />
            <stop offset="100%" stopColor={mc.lo}       />
          </linearGradient>
        </defs>

        {/* Drop shadow */}
        <ellipse cx="60" cy="115" rx="28" ry="5"
          fill="rgba(0,0,0,0.10)" />

        {/* ── BAIL LOOP (ring at top for chain attachment) ── */}
        <ellipse cx="60" cy="12" rx="7" ry="9"
          stroke={`url(#${gradIdBail})`} strokeWidth="4" fill="none" />
        {/* Bail connector stem */}
        <line x1="60" y1="20" x2="60" y2="26"
          stroke={`url(#${gradIdBail})`} strokeWidth="3" strokeLinecap="round" />

        {/* ── FRAME BODY ── */}
        {/* Outer 3D shadow-stroke (depth) */}
        <g filter="url(#shadowBlur)" opacity="0.35">
          {frameShape}
        </g>
        {/* Main frame */}
        {frameShape}
        {/* Inner highlight edge */}
        <g opacity="0.5" style={{ filter: "blur(0.5px)" }}>
          {frameShape}
        </g>
      </svg>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 3. HOOP BASES (EARRINGS) — 3D metallic hoops with latch post
  // ══════════════════════════════════════════════════════════════════════════
  if (cat === "hoop_base" || itemKey.startsWith("hoop_")) {
    const isHalf   = itemKey.includes("half");
    const isOval   = itemKey.includes("oval");
    const isHuggie = itemKey.includes("huggie");
    const isSquare = itemKey.includes("square");
    const gid = `${uid}_hoop`;
    const gidPavé = `${uid}_pave`;

    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={mc.hi}   />
            <stop offset="35%"  stopColor={mc.main}  />
            <stop offset="70%"  stopColor={mc.mid}   />
            <stop offset="100%" stopColor={mc.lo}    />
          </linearGradient>
          <radialGradient id={gidPavé} cx="40%" cy="40%" r="60%">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="40%"  stopColor="#e8f4ff" />
            <stop offset="100%" stopColor="#b0d0f0" />
          </radialGradient>
        </defs>

        {/* Latch post */}
        <rect x="46.5" y="6" width="7" height="18" rx="3.5" fill={`url(#${gid})`} />
        <rect x="46.5" y="6" width="7" height="6" rx="3" fill={mc.shimmer} opacity="0.7" />

        {isSquare ? (
          <g>
            <rect x="22" y="22" width="56" height="56" rx="10" stroke={`url(#${gid})`} strokeWidth="9" fill="none" />
            <rect x="22" y="22" width="56" height="9" rx="5" fill={mc.hi} opacity="0.45" />
          </g>
        ) : isHalf ? (
          <g>
            <path d="M18 28 C18 72 82 72 82 28" stroke={`url(#${gid})`} strokeWidth="9" strokeLinecap="round" fill="none" />
            <path d="M18 28 C18 42 82 42 82 28" stroke={mc.hi} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
          </g>
        ) : isOval ? (
          <g>
            <ellipse cx="50" cy="57" rx="26" ry="36" stroke={`url(#${gid})`} strokeWidth="9" fill="none" />
            <ellipse cx="50" cy="57" rx="26" ry="7" stroke={mc.hi} strokeWidth="3" fill="none" opacity="0.4" />
          </g>
        ) : isHuggie ? (
          <g>
            <circle cx="50" cy="55" r="30" stroke={`url(#${gid})`} strokeWidth="12" fill="none" />
            {/* Channel-set pavé diamonds on front face */}
            {Array.from({ length: 7 }, (_, i) => {
              const a = Math.PI * (0.3 + (i / 6) * 0.4); // arc from 45° to 135° bottom
              const px = 50 + 30 * Math.cos(a);
              const py = 55 + 30 * Math.sin(a);
              return (
                <g key={i} transform={`translate(${px.toFixed(1)},${py.toFixed(1)})`}>
                  <circle r="3.5" fill={`url(#${gidPavé})`} stroke={mc.stroke} strokeWidth="0.5" />
                  <circle r="1.5" cx="-0.8" cy="-0.8" fill="white" opacity="0.9" />
                </g>
              );
            })}
            {/* Huggie specular top-arc */}
            <circle cx="50" cy="55" r="30" stroke={mc.hi} strokeWidth="3" fill="none"
              strokeDasharray="20 100" strokeDashoffset="-38" opacity="0.55" />
          </g>
        ) : (
          /* Classic Hoop */
          <g>
            <circle cx="50" cy="55" r="31" stroke={`url(#${gid})`} strokeWidth="9" fill="none" />
            {/* Specular arc highlight */}
            <circle cx="50" cy="55" r="31" stroke={mc.hi} strokeWidth="3" fill="none"
              strokeDasharray="22 100" strokeDashoffset="-35" opacity="0.55" />
          </g>
        )}
      </svg>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 4. STUD BASES (EARRINGS)
  // ══════════════════════════════════════════════════════════════════════════
  if (cat === "stud_base" || itemKey.startsWith("stud_")) {
    const isPrincess = itemKey.includes("princess");
    const isFloral   = itemKey.includes("floral");
    const isPear     = itemKey.includes("pear");
    const gid = `${uid}_stud`;
    const gidGem = `${uid}_sg`;

    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={mc.hi}   />
            <stop offset="50%"  stopColor={mc.main}  />
            <stop offset="100%" stopColor={mc.lo}    />
          </linearGradient>
          <radialGradient id={gidGem} cx="35%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#ffffff"  stopOpacity="0.9" />
            <stop offset="40%"  stopColor="#dff0ff"  />
            <stop offset="100%" stopColor="#7fb8e8"  />
          </radialGradient>
        </defs>

        {isPrincess ? (
          <g>
            {/* Prong corners */}
            {[[-1,-1],[1,-1],[-1,1],[1,1]].map(([sx,sy],i)=>(
              <rect key={i} x={50+sx*17-2} y={50+sy*17-2} width="5" height="5"
                fill={`url(#${gid})`} rx="1" />
            ))}
            {/* Setting */}
            <rect x="30" y="30" width="40" height="40" rx="5" stroke={`url(#${gid})`} strokeWidth="4" fill="none" />
            {/* Gem face */}
            <rect x="34" y="34" width="32" height="32" fill={`url(#${gidGem})`} rx="2" />
            {/* Facet lines */}
            <line x1="34" y1="34" x2="66" y2="66" stroke="white" strokeWidth="0.7" opacity="0.5" />
            <line x1="66" y1="34" x2="34" y2="66" stroke="white" strokeWidth="0.7" opacity="0.5" />
            <rect x="42" y="42" width="16" height="16" stroke="white" strokeWidth="0.7" fill="none" opacity="0.4" />
          </g>
        ) : isFloral ? (
          <g>
            {Array.from({ length: 6 }, (_, i) => {
              const a = (i / 6) * Math.PI * 2;
              return <ellipse key={i} cx={50 + 18 * Math.cos(a)} cy={50 + 18 * Math.sin(a)}
                rx="9" ry="7" fill={`url(#${gid})`} stroke={mc.stroke} strokeWidth="0.5"
                transform={`rotate(${i * 60},${50 + 18 * Math.cos(a)},${50 + 18 * Math.sin(a)})`} />;
            })}
            <circle cx="50" cy="50" r="10" fill={`url(#${gidGem})`} stroke={mc.hi} strokeWidth="1" />
            <circle cx="46" cy="46" r="4" fill="white" opacity="0.7" />
          </g>
        ) : isPear ? (
          <g>
            <path d="M50 22 Q70 50 50 80 Q30 50 50 22 Z" stroke={`url(#${gid})`} strokeWidth="4" fill="none" />
            <path d="M50 28 Q66 52 50 74 Q34 52 50 28 Z" fill={`url(#${gidGem})`} />
            <ellipse cx="44" cy="36" rx="5" ry="3" fill="white" opacity="0.6" transform="rotate(-30,44,36)" />
          </g>
        ) : (
          /* Round Stud */
          <g>
            {/* Outer setting bezel */}
            <circle cx="50" cy="50" r="28" fill={`url(#${gid})`} />
            {/* Gem seat */}
            <circle cx="50" cy="50" r="22" fill={`url(#${gidGem})`} />
            {/* Facet star */}
            {Array.from({length: 8}, (_,i) => {
              const a = (i/8)*Math.PI*2;
              return <line key={i} x1="50" y1="50"
                x2={(50+20*Math.cos(a)).toFixed(1)} y2={(50+20*Math.sin(a)).toFixed(1)}
                stroke="white" strokeWidth="0.8" opacity="0.45" />;
            })}
            {/* Specular */}
            <ellipse cx="42" cy="42" rx="7" ry="4" fill="white" opacity="0.75" transform="rotate(-35,42,42)" />
          </g>
        )}
      </svg>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 5. CONNECTORS (EARRINGS)
  // ══════════════════════════════════════════════════════════════════════════
  if (cat === "connector" || itemKey.startsWith("conn_")) {
    const isDiamond = itemKey.includes("diamond");
    const isPear    = itemKey.includes("pear");
    const gid = `${uid}_conn`;
    const gidGem = `${uid}_cg`;

    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={mc.hi}  />
            <stop offset="50%" stopColor={mc.main}/>
            <stop offset="100%" stopColor={mc.lo} />
          </linearGradient>
          <radialGradient id={gidGem} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
            <stop offset="40%" stopColor="#e0f0ff"/>
            <stop offset="100%" stopColor="#80b8e8"/>
          </radialGradient>
        </defs>

        {/* Top ring */}
        <circle cx="50" cy="16" r="7" stroke={`url(#${gid})`} strokeWidth="3" fill="none" />
        {/* Connector rod */}
        <rect x="47.5" y="22" width="5" height="56" rx="2.5" fill={`url(#${gid})`} />
        {/* Bottom ring */}
        <circle cx="50" cy="84" r="7" stroke={`url(#${gid})`} strokeWidth="3" fill="none" />
        {/* Specular on rod */}
        <rect x="48" y="24" width="2.5" height="52" rx="1.25" fill={mc.hi} opacity="0.5" />

        {isDiamond && (
          <g transform="translate(50,50)">
            <polygon points="0,-14 14,0 0,14 -14,0" fill={`url(#${gidGem})`} stroke={mc.hi} strokeWidth="1" />
            <polygon points="0,-14 8,-4 0,0 -8,-4" fill="white" opacity="0.4" />
            <polygon points="0,14 8,4 0,0 -8,4" fill={mc.lo} opacity="0.3" />
          </g>
        )}
        {isPear && (
          <g transform="translate(50,50)">
            <path d="M0,-14 Q12,0 0,14 Q-12,0 0,-14 Z" fill={`url(#${gidGem})`} stroke={mc.hi} strokeWidth="1" />
            <ellipse cx="-3" cy="-6" rx="4" ry="2.5" fill="white" opacity="0.65" transform="rotate(-30,-3,-6)" />
          </g>
        )}
      </svg>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 6. CENTER STONES & COLORED GEMSTONES (Rings + Pendants + Earrings)
  // ══════════════════════════════════════════════════════════════════════════
  if (
    cat === "center_stone" ||
    cat === "center_decoration" ||
    itemKey === "ruby" || itemKey === "emerald" || itemKey === "sapphire" ||
    itemKey === "emerald_gem" ||
    itemKey.startsWith("pendant_emerald") || itemKey.startsWith("pendant_ruby") ||
    itemKey.startsWith("pendant_sapphire") || itemKey.startsWith("pendant_pearl") ||
    itemKey.startsWith("pendant_black") || itemKey.startsWith("dec_")
  ) {
    const isRuby       = itemKey.includes("ruby");
    const isEmeraldGem = itemKey.includes("emerald");
    const isSapphire   = itemKey.includes("sapphire");
    const isPearl      = itemKey.includes("pearl");
    const isBlack      = itemKey.includes("black");
    const isCluster    = itemKey.includes("cluster") || itemKey.includes("flower");
    const isEmeraldCut = (cat === "center_stone") && itemKey === "emerald"; // emerald cut diamond (baguette shape)

    // Gem color palette
    const gemColor = isRuby    ? { body: "#b91c44", hi: "#fda4af", lo: "#7f1d1d", mid: "#e11d48", glow: "#f43f5e" }
      : isEmeraldGem           ? { body: "#047857", hi: "#6ee7b7", lo: "#064e3b", mid: "#059669", glow: "#10b981" }
      : isSapphire             ? { body: "#1d4ed8", hi: "#93c5fd", lo: "#1e3a8a", mid: "#2563eb", glow: "#60a5fa" }
      : isBlack                ? { body: "#1e293b", hi: "#94a3b8", lo: "#0f172a", mid: "#334155", glow: "#475569" }
      :                          { body: "#c8e8ff", hi: "#ffffff", lo: "#4ca8e8", mid: "#90c8f0", glow: "#e0f4ff" };

    const gidGem = `${uid}_gem`;
    const gidGem2 = `${uid}_gem2`;

    if (isPearl) {
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={gidGem} cx="38%" cy="32%" r="65%">
              <stop offset="0%"  stopColor="#ffffff" />
              <stop offset="35%" stopColor="#f1f5f9" />
              <stop offset="70%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1"/>
            </radialGradient>
            <radialGradient id={gidGem2} cx="30%" cy="25%" r="55%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95"/>
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
            </radialGradient>
          </defs>
          {/* Shadow */}
          <ellipse cx="50" cy="86" rx="22" ry="5" fill="rgba(0,0,0,0.12)" />
          {/* Pearl body */}
          <circle cx="50" cy="50" r="34" fill={`url(#${gidGem})`} />
          {/* Nacre iridescent overlay */}
          <circle cx="50" cy="50" r="34" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.5" />
          {/* Specular highlight */}
          <ellipse cx="36" cy="32" rx="12" ry="7" fill={`url(#${gidGem2})`} transform="rotate(-30,36,32)" />
          {/* Secondary soft glow */}
          <ellipse cx="62" cy="66" rx="8" ry="5" fill="rgba(220,240,255,0.45)" transform="rotate(20,62,66)" />
        </svg>
      );
    }

    if (isCluster) {
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={gidGem} cx="35%" cy="35%" r="65%">
              <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="40%" stopColor={gemColor.mid} />
              <stop offset="100%" stopColor={gemColor.lo}  />
            </radialGradient>
          </defs>
          {Array.from({ length: 6 }, (_, i) => {
            const a = (i / 6) * Math.PI * 2;
            const px = 50 + 18 * Math.cos(a);
            const py = 50 + 18 * Math.sin(a);
            return (
              <g key={i}>
                <circle cx={px} cy={py} r="10" fill={`url(#${gidGem})`} stroke={mc.hi} strokeWidth="1" />
                <circle cx={px - 3} cy={py - 3} r="3.5" fill="white" opacity="0.7" />
              </g>
            );
          })}
          <circle cx="50" cy="50" r="11" fill={`url(#${gidGem})`} stroke={mc.hi} strokeWidth="1.5" />
          <circle cx="46" cy="46" r="4" fill="white" opacity="0.8" />
        </svg>
      );
    }

    // Brilliant faceted gemstone (round, oval, emerald-cut, pear)
    const isEmeraldShape = isEmeraldCut || (isEmeraldGem && !isCluster);
    const isPearShape = itemKey.includes("pear");

    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={gidGem} cx="35%" cy="30%" r="70%">
            <stop offset="0%"   stopColor="#ffffff"       stopOpacity="0.95" />
            <stop offset="20%"  stopColor={gemColor.hi}   />
            <stop offset="55%"  stopColor={gemColor.body} />
            <stop offset="100%" stopColor={gemColor.lo}   />
          </radialGradient>
          <radialGradient id={gidGem2} cx="30%" cy="25%" r="50%">
            <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Drop shadow */}
        <ellipse cx="50" cy="88" rx="26" ry="5" fill="rgba(0,0,0,0.15)" />

        {isEmeraldShape ? (
          /* Emerald-cut shape */
          <g>
            <polygon points="30,20 70,20 82,32 82,68 70,80 30,80 18,68 18,32"
              fill={`url(#${gidGem})`} stroke={gemColor.hi} strokeWidth="1.5" />
            {/* Table facet */}
            <polygon points="34,26 66,26 76,36 76,64 66,74 34,74 24,64 24,36"
              fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            {/* Crown facets */}
            {[[30,20,34,26],[70,20,66,26],[82,32,76,36],[82,68,76,64],
              [70,80,66,74],[30,80,34,74],[18,68,24,64],[18,32,24,36]].map(([x1,y1,x2,y2], i)=>(
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
            ))}
            {/* Specular */}
            <ellipse cx="38" cy="32" rx="14" ry="7" fill={`url(#${gidGem2})`} transform="rotate(-15,38,32)" />
          </g>
        ) : isPearShape ? (
          /* Pear shape */
          <g>
            <path d="M50 18 Q76 44 50 82 Q24 44 50 18 Z" fill={`url(#${gidGem})`} stroke={gemColor.hi} strokeWidth="1.5" />
            {Array.from({length: 8}, (_,i) => {
              const a = (i/8)*Math.PI*2 - Math.PI/2;
              const r = 24;
              return <line key={i} x1="50" y1="50"
                x2={(50+r*Math.cos(a)).toFixed(1)} y2={(50+r*Math.sin(a)).toFixed(1)}
                stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />;
            })}
            <ellipse cx="42" cy="30" rx="9" ry="5" fill={`url(#${gidGem2})`} transform="rotate(-25,42,30)" />
          </g>
        ) : (
          /* Round brilliant (default for all colored gems + diamonds) */
          <g>
            <circle cx="50" cy="50" r="34" fill={`url(#${gidGem})`} stroke={gemColor.hi} strokeWidth="1.5" />
            {/* 8 crown facet lines */}
            {Array.from({length: 8}, (_,i) => {
              const a = (i/8)*Math.PI*2;
              return <line key={i} x1="50" y1="50"
                x2={(50+34*Math.cos(a)).toFixed(1)} y2={(50+34*Math.sin(a)).toFixed(1)}
                stroke="rgba(255,255,255,0.35)" strokeWidth="1" />;
            })}
            {/* Table octagon */}
            <polygon
              points={Array.from({length:8}, (_,i) => {
                const a = (i/8)*Math.PI*2;
                return `${(50+18*Math.cos(a)).toFixed(1)},${(50+18*Math.sin(a)).toFixed(1)}`;
              }).join(" ")}
              fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            {/* Specular star highlight */}
            <ellipse cx="37" cy="33" rx="11" ry="6" fill={`url(#${gidGem2})`} transform="rotate(-35,37,33)" />
            {/* Secondary small flash */}
            <circle cx="58" cy="38" r="3.5" fill="white" opacity="0.6" />
          </g>
        )}
      </svg>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 7. DECORATIVE ELEMENTS (Pendants) — crowns, halos, stars, ornaments
  // ══════════════════════════════════════════════════════════════════════════
  if (cat === "decorative") {
    const isCrown   = itemKey.includes("crown");
    const isStar    = itemKey.includes("star");
    const isLeaf    = itemKey.includes("leaf");
    const isHalo    = itemKey.includes("halo");
    const isBorder  = itemKey.includes("border");
    const isInfinity= itemKey.includes("infinity");
    const gid = `${uid}_dec`;
    const gidGem = `${uid}_dg`;

    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={mc.hi}   />
            <stop offset="40%"  stopColor={mc.main}  />
            <stop offset="100%" stopColor={mc.lo}    />
          </linearGradient>
          <radialGradient id={gidGem} cx="35%" cy="35%" r="60%">
            <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#d0eaff"/>
            <stop offset="100%" stopColor="#70b0e8"/>
          </radialGradient>
        </defs>

        {isCrown ? (
          <g>
            {/* Crown base */}
            <path d="M22 68 L22 40 L36 54 L50 24 L64 54 L78 40 L78 68 Z"
              fill={`url(#${gid})`} stroke={mc.stroke} strokeWidth="1.5" strokeLinejoin="round" />
            {/* Bevel top */}
            <path d="M22 68 L22 40 L36 54 L50 24 L64 54 L78 40 L78 68"
              fill="none" stroke={mc.hi} strokeWidth="1.5" opacity="0.6" />
            {/* Crown bottom bar */}
            <rect x="22" y="65" width="56" height="10" rx="2" fill={`url(#${gid})`} />
            {/* Gem tips */}
            {[36,50,64].map((cx, i) => (
              <circle key={i} cx={cx} cy={i===1?26:i===0?55:55} r="4.5" fill={`url(#${gidGem})`} stroke={mc.hi} strokeWidth="0.8" />
            ))}
          </g>
        ) : isStar ? (
          <g>
            <polygon
              points="50,14 56,36 80,36 62,50 68,72 50,58 32,72 38,50 20,36 44,36"
              fill={`url(#${gid})`} stroke={mc.stroke} strokeWidth="1.5" strokeLinejoin="round" />
            {/* Star specular */}
            <polygon points="50,14 56,36 50,30 44,36" fill={mc.hi} opacity="0.55" />
            {/* Center gem */}
            <circle cx="50" cy="50" r="8" fill={`url(#${gidGem})`} stroke={mc.hi} strokeWidth="1" />
          </g>
        ) : isLeaf ? (
          <g>
            <path d="M50 18 Q82 48 50 84 Q18 48 50 18 Z"
              fill={`url(#${gid})`} stroke={mc.stroke} strokeWidth="1.5" />
            {/* Vein lines */}
            <line x1="50" y1="22" x2="50" y2="80" stroke={mc.hi} strokeWidth="1" opacity="0.5" />
            {[-20,-12,0,12,20].map((dx, i) => (
              <path key={i} d={`M50,${38+i*8} Q${50+dx},${42+i*8} ${50+dx*1.6},${44+i*8}`}
                stroke={mc.hi} strokeWidth="0.7" fill="none" opacity="0.45" />
            ))}
          </g>
        ) : isHalo || isBorder ? (
          <g>
            {/* Halo ring (pavé diamonds) */}
            <circle cx="50" cy="50" r="32" stroke={`url(#${gid})`} strokeWidth="6" fill="none" />
            {Array.from({length: 16}, (_, i) => {
              const a = (i/16)*Math.PI*2;
              return (
                <circle key={i}
                  cx={(50+32*Math.cos(a)).toFixed(1)} cy={(50+32*Math.sin(a)).toFixed(1)}
                  r="3" fill={`url(#${gidGem})`} stroke={mc.hi} strokeWidth="0.5" />
              );
            })}
            {/* Center opening */}
            <circle cx="50" cy="50" r="20" fill="none" stroke={mc.mid} strokeWidth="0.5" strokeDasharray="3 3" />
          </g>
        ) : isInfinity ? (
          <g>
            <path d="M32 52 C18 38 18 66 32 66 C46 66 54 38 68 38 C82 38 82 66 68 66 C54 66 46 38 32 52 Z"
              stroke={`url(#${gid})`} strokeWidth="7" fill="none" strokeLinejoin="round" />
            {/* Highlight */}
            <path d="M32 52 C18 38 18 66 32 66 C46 66 54 38 68 38 C82 38 82 66 68 66 C54 66 46 38 32 52 Z"
              stroke={mc.hi} strokeWidth="2" fill="none" opacity="0.4" />
            {/* Center gems */}
            <circle cx="32" cy="52" r="5" fill={`url(#${gidGem})`} stroke={mc.hi} strokeWidth="0.8" />
            <circle cx="68" cy="52" r="5" fill={`url(#${gidGem})`} stroke={mc.hi} strokeWidth="0.8" />
          </g>
        ) : (
          /* Default: Diamond Bail / generic decorative */
          <g>
            <circle cx="50" cy="50" r="28" stroke={`url(#${gid})`} strokeWidth="6" fill="none" />
            {Array.from({length: 12}, (_, i) => {
              const a = (i/12)*Math.PI*2;
              return (
                <circle key={i}
                  cx={(50+28*Math.cos(a)).toFixed(1)} cy={(50+28*Math.sin(a)).toFixed(1)}
                  r="3.5" fill={`url(#${gidGem})`} stroke={mc.hi} strokeWidth="0.5" />
              );
            })}
          </g>
        )}
      </svg>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 8. SIDE STONES (accent stones for all jewellery types)
  // ══════════════════════════════════════════════════════════════════════════
  if (cat === "side_stone" || cat === "accent_stone") {
    const isBaguette = itemKey.includes("baguette");
    const isPear     = itemKey.includes("pear");
    const isEmerald  = itemKey.includes("emerald");
    const gidGem = `${uid}_ss`;
    const gemFill = isEmerald ? "#047857" : "#c8e8ff";
    const gemHi   = isEmerald ? "#6ee7b7" : "#ffffff";
    const gemLo   = isEmerald ? "#064e3b" : "#4ca8e8";

    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={gidGem} cx="35%" cy="32%" r="65%">
            <stop offset="0%"  stopColor={gemHi}   stopOpacity="0.95" />
            <stop offset="40%" stopColor={gemFill}  />
            <stop offset="100%" stopColor={gemLo}   />
          </radialGradient>
        </defs>

        {/* 5 small gems arranged in an arc */}
        {Array.from({ length: 5 }, (_, i) => {
          const t = i / 4;
          const x = 18 + t * 64;
          const y = 50 + 10 * Math.sin(t * Math.PI) - 5;
          return (
            <g key={i} transform={`translate(${x},${y})`}>
              {isBaguette ? (
                <>
                  <rect x="-7" y="-5" width="14" height="10" rx="1.5"
                    fill={`url(#${gidGem})`} stroke={gemHi} strokeWidth="0.8" />
                  <line x1="-7" y1="-5" x2="7" y2="5" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
                </>
              ) : isPear ? (
                <>
                  <path d="M0,-10 Q9,0 0,10 Q-9,0 0,-10 Z"
                    fill={`url(#${gidGem})`} stroke={gemHi} strokeWidth="0.8" />
                  <ellipse cx="-2" cy="-4" rx="3" ry="1.8" fill="white" opacity="0.65" transform="rotate(-30,-2,-4)" />
                </>
              ) : (
                <>
                  <circle r="9" fill={`url(#${gidGem})`} stroke={gemHi} strokeWidth="0.8" />
                  <circle cx="-3" cy="-3" r="3.5" fill="white" opacity="0.7" />
                </>
              )}
            </g>
          );
        })}
      </svg>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Fallback — generic circle gem
  // ══════════════════════════════════════════════════════════════════════════
  const gidFB = `${uid}_fb`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={gidFB} cx="35%" cy="32%" r="65%">
          <stop offset="0%"  stopColor={mc.hi}  />
          <stop offset="50%" stopColor={mc.main} />
          <stop offset="100%" stopColor={mc.lo} />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="28" fill={`url(#${gidFB})`} stroke={mc.stroke} strokeWidth="1.5" />
      <circle cx="42" cy="42" r="8" fill="white" opacity="0.55" />
    </svg>
  );
}
