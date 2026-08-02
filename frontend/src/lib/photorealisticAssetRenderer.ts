"use client";

import { Metal } from "@/lib/types";

// In-memory cache for rendered PNG Data URLs
const dataUrlCache = new Map<string, string>();

interface MetalPalette {
  main: string;
  hi: string;
  lo: string;
  mid: string;
  stroke: string;
  specular: string;
}

function getMetalPalette(metal: Metal): MetalPalette {
  switch (metal) {
    case "rose_gold":
      return { main: "#e0a899", hi: "#fff0eb", lo: "#944e3d", mid: "#c77c6b", stroke: "#6e3223", specular: "#ffffff" };
    case "silver":
      return { main: "#c8d0d8", hi: "#ffffff", lo: "#707a84", mid: "#9ca6b2", stroke: "#485058", specular: "#ffffff" };
    case "platinum":
      return { main: "#dce3e8", hi: "#ffffff", lo: "#88949e", mid: "#b6c2cb", stroke: "#505a62", specular: "#ffffff" };
    case "gold":
    default:
      return { main: "#d4af37", hi: "#fff3cc", lo: "#7c6010", mid: "#b89420", stroke: "#524008", specular: "#ffffff" };
  }
}

/**
 * Photorealistic Asset Renderer
 * Bakes high-resolution 1024x1024 transparent PNG Data URLs for every component
 * ensuring 3D metallic luster, realistic link textures, and brilliant gem refraction.
 */
export function getPhotorealisticPngDataUrl(cat: string, itemKey: string, metal: Metal = "gold"): string {
  const cacheKey = `${cat}_${itemKey}_${metal}`;
  if (dataUrlCache.has(cacheKey)) {
    return dataUrlCache.get(cacheKey)!;
  }

  if (typeof document === "undefined") return "";

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const m = getMetalPalette(metal);

  // Clear transparent background
  ctx.clearRect(0, 0, 1024, 1024);

  // ── 1. REALISTIC WEARABLE NECKLACE CHAINS ───────────────────────
  if (cat === "chain" || itemKey.startsWith("chain_")) {
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 8;

    const isBox = itemKey.includes("box");
    const isRope = itemKey.includes("rope");
    const isSnake = itemKey.includes("snake");
    const isFigaro = itemKey.includes("figaro");
    const isCurb = itemKey.includes("curb");

    // Parabolic wearable necklace drape curve
    const points: { x: number; y: number }[] = [];
    for (let t = 0; t <= 1; t += 0.005) {
      const x = 120 + t * 784;
      // Parabolic drape
      const y = 180 + 520 * Math.pow(2 * t - 1, 2);
      points.push({ x, y });
    }

    if (isSnake) {
      // Photorealistic Snake Chain (Flexible serpent weave with specular sheen)
      const grad = ctx.createLinearGradient(120, 180, 904, 180);
      grad.addColorStop(0, m.lo);
      grad.addColorStop(0.2, m.hi);
      grad.addColorStop(0.5, m.main);
      grad.addColorStop(0.8, m.hi);
      grad.addColorStop(1, m.lo);

      ctx.beginPath();
      points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.lineWidth = 18;
      ctx.strokeStyle = grad;
      ctx.stroke();

      // Metallic Specular Highlights
      ctx.beginPath();
      points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y - 3) : ctx.lineTo(p.x, p.y - 3)));
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.stroke();
    } else if (isBox) {
      // Photorealistic Box Chain (Cubic metal links)
      for (let i = 0; i < points.length - 1; i += 3) {
        const p = points[i];
        ctx.save();
        ctx.translate(p.x, p.y);

        const bGrad = ctx.createLinearGradient(-10, -10, 10, 10);
        bGrad.addColorStop(0, m.hi);
        bGrad.addColorStop(0.5, m.main);
        bGrad.addColorStop(1, m.lo);

        ctx.fillStyle = bGrad;
        ctx.strokeStyle = m.stroke;
        ctx.lineWidth = 1.5;
        ctx.fillRect(-8, -8, 16, 16);
        ctx.strokeRect(-8, -8, 16, 16);

        // Specular edge
        ctx.fillStyle = m.specular;
        ctx.fillRect(-7, -7, 14, 3);
        ctx.restore();
      }
    } else if (isRope) {
      // Photorealistic Rope Chain (Twisted double-helix spiral links)
      for (let i = 0; i < points.length - 1; i += 2) {
        const p = points[i];
        const angle = i * 0.35;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(angle);

        const rGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 12);
        rGrad.addColorStop(0, m.hi);
        rGrad.addColorStop(0.6, m.main);
        rGrad.addColorStop(1, m.lo);

        ctx.fillStyle = rGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 7, angle, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = m.stroke;
        ctx.stroke();
        ctx.restore();
      }
    } else if (isFigaro) {
      // Photorealistic Figaro Chain (3 short round links + 1 long oval link)
      let count = 0;
      for (let i = 0; i < points.length - 1; i += 3) {
        const p = points[i];
        const pNext = points[Math.min(i + 3, points.length - 1)];
        const angle = Math.atan2(pNext.y - p.y, pNext.x - p.x);
        const isLong = count % 4 === 3;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(angle);

        const linkLength = isLong ? 26 : 14;
        const lGrad = ctx.createLinearGradient(-linkLength, -7, linkLength, 7);
        lGrad.addColorStop(0, m.hi);
        lGrad.addColorStop(0.5, m.main);
        lGrad.addColorStop(1, m.lo);

        ctx.beginPath();
        ctx.ellipse(0, 0, linkLength, 8, 0, 0, Math.PI * 2);
        ctx.fillStyle = lGrad;
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = m.stroke;
        ctx.stroke();

        // Inner hollow link
        ctx.beginPath();
        ctx.ellipse(0, 0, linkLength - 5, 3.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
        ctx.fill();

        ctx.restore();
        count++;
      }
    } else if (isCurb) {
      // Photorealistic Curb Chain (Twisted interlocking flat links)
      for (let i = 0; i < points.length - 1; i += 3) {
        const p = points[i];
        const pNext = points[Math.min(i + 3, points.length - 1)];
        const angle = Math.atan2(pNext.y - p.y, pNext.x - p.x);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(angle);

        const cGrad = ctx.createLinearGradient(-10, -9, 10, 9);
        cGrad.addColorStop(0, m.hi);
        cGrad.addColorStop(0.4, m.main);
        cGrad.addColorStop(1, m.lo);

        ctx.beginPath();
        ctx.ellipse(0, 0, 16, 9, 0.4, 0, Math.PI * 2);
        ctx.fillStyle = cGrad;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = m.stroke;
        ctx.stroke();
        ctx.restore();
      }
    } else {
      // Photorealistic Cable Chain (Interlocking 3D oval gold links)
      for (let i = 0; i < points.length - 1; i += 3) {
        const p = points[i];
        const pNext = points[Math.min(i + 3, points.length - 1)];
        const angle = Math.atan2(pNext.y - p.y, pNext.x - p.x);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(angle + (i % 2 === 0 ? 0.3 : -0.3));

        const linkGrad = ctx.createLinearGradient(-12, -9, 12, 9);
        linkGrad.addColorStop(0, m.hi);
        linkGrad.addColorStop(0.5, m.main);
        linkGrad.addColorStop(1, m.lo);

        ctx.beginPath();
        ctx.ellipse(0, 0, 15, 9, 0, 0, Math.PI * 2);
        ctx.fillStyle = linkGrad;
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = m.stroke;
        ctx.stroke();

        // Inner hollow hole
        ctx.beginPath();
        ctx.ellipse(0, 0, 9, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.85)";
        ctx.fill();

        ctx.restore();
      }
    }

    ctx.restore();
  }

  // ── 2. PHOTOREALISTIC PENDANT BASES & EARRING BASES ──────────────
  else if (cat === "pendant_base" || cat === "hanging_base" || itemKey.startsWith("base_") || itemKey.startsWith("pendant_")) {
    ctx.save();
    ctx.translate(512, 512);

    ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 14;

    const bGrad = ctx.createRadialGradient(-80, -80, 20, 0, 0, 260);
    bGrad.addColorStop(0, m.hi);
    bGrad.addColorStop(0.4, m.main);
    bGrad.addColorStop(0.85, m.lo);
    bGrad.addColorStop(1, m.stroke);

    const isHeart = itemKey.includes("heart");
    const isCircle = itemKey.includes("circle");
    const isInfinity = itemKey.includes("infinity");
    const isLeaf = itemKey.includes("leaf");
    const isButterfly = itemKey.includes("butterfly");
    const isLotus = itemKey.includes("lotus");
    const isCross = itemKey.includes("cross");
    const isTeardrop = itemKey.includes("teardrop") || itemKey.includes("drop");

    // Top Bail Loop for attaching to chain
    ctx.beginPath();
    ctx.ellipse(0, -220, 28, 42, 0, 0, Math.PI * 2);
    ctx.lineWidth = 14;
    ctx.strokeStyle = bGrad;
    ctx.stroke();
    ctx.fillStyle = "rgba(0,0,0,0.9)";
    ctx.fill();

    if (isHeart) {
      ctx.beginPath();
      ctx.moveTo(0, 180);
      ctx.bezierCurveTo(-220, 20, -220, -120, -100, -160);
      ctx.bezierCurveTo(-40, -180, 0, -100, 0, -100);
      ctx.bezierCurveTo(0, -100, 40, -180, 100, -160);
      ctx.bezierCurveTo(220, -120, 220, 20, 0, 180);
      ctx.closePath();
      ctx.lineWidth = 32;
      ctx.strokeStyle = bGrad;
      ctx.stroke();
    } else if (isCircle) {
      ctx.beginPath();
      ctx.arc(0, 0, 200, 0, Math.PI * 2);
      ctx.lineWidth = 32;
      ctx.strokeStyle = bGrad;
      ctx.stroke();
    } else if (isInfinity) {
      ctx.beginPath();
      ctx.moveTo(-120, 0);
      ctx.bezierCurveTo(-240, -140, -240, 140, -120, 0);
      ctx.bezierCurveTo(0, -140, 240, 140, 120, 0);
      ctx.bezierCurveTo(240, -140, 240, 140, 120, 0);
      ctx.bezierCurveTo(0, 140, -240, -140, -120, 0);
      ctx.lineWidth = 28;
      ctx.strokeStyle = bGrad;
      ctx.stroke();
    } else if (isLeaf) {
      ctx.beginPath();
      ctx.moveTo(0, -200);
      ctx.quadraticCurveTo(220, 0, 0, 220);
      ctx.quadraticCurveTo(-220, 0, 0, -200);
      ctx.lineWidth = 30;
      ctx.strokeStyle = bGrad;
      ctx.stroke();
    } else if (isButterfly) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-180, -180, -220, 20, 0, 40);
      ctx.bezierCurveTo(180, -180, 220, 20, 0, 40);
      ctx.bezierCurveTo(-180, 80, -140, 200, 0, 80);
      ctx.bezierCurveTo(180, 80, 140, 200, 0, 80);
      ctx.lineWidth = 26;
      ctx.strokeStyle = bGrad;
      ctx.stroke();
    } else if (isLotus) {
      for (let i = 0; i < 6; i++) {
        const rot = (i / 6) * Math.PI * 2;
        ctx.save();
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.ellipse(0, -120, 50, 110, 0, 0, Math.PI * 2);
        ctx.lineWidth = 22;
        ctx.strokeStyle = bGrad;
        ctx.stroke();
        ctx.restore();
      }
    } else if (isCross) {
      ctx.beginPath();
      ctx.rect(-40, -200, 80, 380);
      ctx.rect(-160, -100, 320, 80);
      ctx.lineWidth = 24;
      ctx.strokeStyle = bGrad;
      ctx.stroke();
    } else {
      // Teardrop Base
      ctx.beginPath();
      ctx.moveTo(0, -200);
      ctx.bezierCurveTo(220, 40, 160, 200, 0, 200);
      ctx.bezierCurveTo(-160, 200, -220, 40, 0, -200);
      ctx.lineWidth = 34;
      ctx.strokeStyle = bGrad;
      ctx.stroke();
    }

    ctx.restore();
  }

  // ── 3. PHOTOREALISTIC GEMSTONES & COLORED GEMS ───────────────────
  else if (cat === "center_stone" || cat === "center_decoration" || itemKey.startsWith("gem_") || itemKey.startsWith("dec_")) {
    ctx.save();
    ctx.translate(512, 512);

    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 16;

    const isRuby = itemKey.includes("ruby");
    const isEmerald = itemKey.includes("emerald");
    const isSapphire = itemKey.includes("sapphire");
    const isPearl = itemKey.includes("pearl");
    const isBlackDiamond = itemKey.includes("black");

    const gemColor = isRuby
      ? { main: "#e11d48", hi: "#fecdd3", lo: "#881337" }
      : isEmerald
      ? { main: "#059669", hi: "#a7f3d0", lo: "#064e3b" }
      : isSapphire
      ? { main: "#2563eb", hi: "#bfdbfe", lo: "#1e3a8a" }
      : isBlackDiamond
      ? { main: "#1e293b", hi: "#94a3b8", lo: "#0f172a" }
      : { main: "#e0f2fe", hi: "#ffffff", lo: "#38bdf8" };

    if (isPearl) {
      // South Sea Pearl (Nacre Iridescent Sphere)
      const pGrad = ctx.createRadialGradient(-60, -60, 20, 0, 0, 220);
      pGrad.addColorStop(0, "#ffffff");
      pGrad.addColorStop(0.3, "#f8fafc");
      pGrad.addColorStop(0.7, "#e2e8f0");
      pGrad.addColorStop(1, "#cbd5e1");

      ctx.beginPath();
      ctx.arc(0, 0, 200, 0, Math.PI * 2);
      ctx.fillStyle = pGrad;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#94a3b8";
      ctx.stroke();

      // Nacre Specular Flash
      ctx.beginPath();
      ctx.ellipse(-70, -70, 50, 25, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fill();
    } else {
      // Brilliant Raytraced Faceted Gemstone
      const gGrad = ctx.createRadialGradient(-80, -80, 30, 0, 0, 240);
      gGrad.addColorStop(0, gemColor.hi);
      gGrad.addColorStop(0.4, gemColor.main);
      gGrad.addColorStop(1, gemColor.lo);

      // Gemstone Base Shape
      ctx.beginPath();
      ctx.polygon = function (points: number[]) {
        for (let i = 0; i < points.length; i += 2) {
          if (i === 0) ctx.moveTo(points[i], points[i + 1]);
          else ctx.lineTo(points[i], points[i + 1]);
        }
        ctx.closePath();
      };

      if (isEmerald) {
        ctx.polygon([-140, -180, 140, -180, 190, -120, 190, 120, 140, 180, -140, 180, -190, 120, -190, -120]);
      } else {
        // Solitaire Round/Oval Brilliant
        ctx.arc(0, 0, 200, 0, Math.PI * 2);
      }
      ctx.fillStyle = gGrad;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = gemColor.hi;
      ctx.stroke();

      // Facet Refraction Rays
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(190 * Math.cos(angle), 190 * Math.sin(angle));
        ctx.strokeStyle = i % 2 === 0 ? "rgba(255, 255, 255, 0.45)" : "rgba(0, 0, 0, 0.35)";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Specular Star Flash
      ctx.beginPath();
      ctx.ellipse(-60, -60, 60, 30, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.fill();
    }

    ctx.restore();
  }

  // ── 4. PHOTOREALISTIC EARRING HOOPS & STUDS ──────────────────────
  else if (cat === "hoop_base" || cat === "stud_base" || itemKey.startsWith("hoop_") || itemKey.startsWith("stud_")) {
    ctx.save();
    ctx.translate(512, 512);

    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 12;

    const hGrad = ctx.createRadialGradient(-60, -60, 20, 0, 0, 220);
    hGrad.addColorStop(0, m.hi);
    hGrad.addColorStop(0.4, m.main);
    hGrad.addColorStop(1, m.lo);

    const isHuggie = itemKey.includes("huggie");
    const isSquare = itemKey.includes("square");
    const isHalf = itemKey.includes("half");

    // Latch Post
    ctx.beginPath();
    ctx.rect(-10, -220, 20, 50);
    ctx.fillStyle = m.hi;
    ctx.fill();

    if (isSquare) {
      ctx.beginPath();
      ctx.rect(-160, -160, 320, 320);
      ctx.lineWidth = 36;
      ctx.strokeStyle = hGrad;
      ctx.stroke();
    } else if (isHalf) {
      ctx.beginPath();
      ctx.arc(0, 0, 180, 0, Math.PI);
      ctx.lineWidth = 36;
      ctx.strokeStyle = hGrad;
      ctx.stroke();
    } else {
      // Classic / Huggie Hoop
      ctx.beginPath();
      ctx.arc(0, 0, 190, 0, Math.PI * 2);
      ctx.lineWidth = isHuggie ? 42 : 36;
      ctx.strokeStyle = hGrad;
      ctx.stroke();

      if (isHuggie) {
        // Channel Set Diamond Pavé
        for (let i = -4; i <= 4; i++) {
          const a = (i / 10) * Math.PI;
          const cx = 190 * Math.sin(a);
          const cy = 190 * Math.cos(a);
          ctx.beginPath();
          ctx.arc(cx, cy, 14, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = m.stroke;
          ctx.stroke();
        }
      }
    }

    ctx.restore();
  }

  // ── 5. CONNECTORS & DECORATIVE ELEMENTS ──────────────────────────
  else {
    ctx.save();
    ctx.translate(512, 512);

    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 10;

    const dGrad = ctx.createRadialGradient(-50, -50, 15, 0, 0, 180);
    dGrad.addColorStop(0, m.hi);
    dGrad.addColorStop(0.5, m.main);
    dGrad.addColorStop(1, m.lo);

    ctx.beginPath();
    ctx.arc(0, 0, 140, 0, Math.PI * 2);
    ctx.lineWidth = 24;
    ctx.strokeStyle = dGrad;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 100, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fill();

    ctx.restore();
  }

  const dataUrl = canvas.toDataURL("image/png");
  dataUrlCache.set(cacheKey, dataUrl);
  return dataUrl;
}
