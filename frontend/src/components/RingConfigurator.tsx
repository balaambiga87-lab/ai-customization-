"use client";

import React, { useState, useRef, useMemo } from "react";
import {
  Category,
  ConfigState,
  DragPayload,
  Metal,
  PartKey,
  BandKey,
  SettingKey,
  StoneKey,
  LayerObject,
  DesignJSON,
} from "@/lib/types";
import { PART_LIBRARY, findPart, renderPartIcon } from "@/lib/partsLibrary";
import "@/styles/ring-atelier.css";
import { CadSetting } from "./CadSetting";
import { AnchorEditor } from "./AnchorEditor";
import { LuxuryPreviewModal } from "./LuxuryPreviewModal";
import { getBandMetadata, saveBandAnchorMetadata } from "@/lib/assetMetadataLoader";
import { checkCompatibility } from "@/lib/compatibilityEngine";

const CATEGORIES: Category[] = ["band", "setting", "stone", "accent"];
const CATEGORY_LABEL: Record<Category, string> = {
  band: "Ring Bands",
  setting: "Settings",
  stone: "Gemstones",
  accent: "Side Stones",
};

const METAL_LABEL: Record<Metal, string> = {
  rose_gold: "Rose Gold",
  gold: "Yellow Gold",
  silver: "Silver",
  platinum: "Platinum",
};

const METAL_MULTIPLIER: Record<Metal, number> = {
  silver: 1.0,
  gold: 1.25,
  rose_gold: 1.2,
  platinum: 1.6,
};

const BASE_PRICES: Record<string, number> = {
  classic: 450,
  twist: 580,
  pave: 720,
  round: 850,
  oval: 920,
  princess: 780,
  emerald: 950,
  marquise: 680,
  prong: 180,
  bezel: 240,
  halo: 380,
  accent: 120,
};

import { calculateIndianPricing, formatINR } from "@/lib/indianPricingEngine";

export function RingConfigurator() {
  const [metal, setMetal] = useState<Metal>("rose_gold");
  const [activeTab, setActiveTab] = useState<Category>("band");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [config, setConfig] = useState<ConfigState>({ band: null, stone: null, setting: null, accents: {} });

  // -------------------------------------------------------------
  // EMPTY INITIAL CANVAS LAYER ENGINE STATE (Zero Presets)
  // -------------------------------------------------------------
  const [layers, setLayers] = useState<LayerObject[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showGuideLines, setShowGuideLines] = useState<boolean>(false);
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);

  // DRAG OVERLAY & TRANSLUCENT PREVIEW CURSOR STATE
  const [activeDragPayload, setActiveDragPayload] = useState<DragPayload | null>(null);
  const [isCanvasDragOver, setIsCanvasDragOver] = useState<boolean>(false);
  const [dragCursorPos, setDragCursorPos] = useState<{ x: number; y: number } | null>(null);

  // Modals & Banners & Confirm Design State
  const [anchorEditorOpen, setAnchorEditorOpen] = useState(false);
  const [luxuryModalOpen, setLuxuryModalOpen] = useState(false);
  const [isDesignConfirmed, setIsDesignConfirmed] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState<string | null>(null);
  const [compatAlert, setCompatAlert] = useState<{ message: string; suggestedLabels: string[] } | null>(null);

  const canvasInnerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleConfirmDesign() {
    if (layers.length === 0) {
      alert("Canvas is empty. Drag ring components onto the canvas before confirming your design.");
      return;
    }
    setIsDesignConfirmed(true);
    setAiStatusMessage("✅ Finalized Design Confirmed! Ready for Luxury AI Studio Preview.");
    setTimeout(() => setAiStatusMessage(null), 3000);
  }

  function handleClearCanvas() {
    setLayers([]);
    setSelectedLayerId(null);
    setIsDesignConfirmed(false);
    setAiStatusMessage("🧹 Canvas cleared. Estimate restored to ₹0.");
    setTimeout(() => setAiStatusMessage(null), 2500);
  }

  // -------------------------------------------------------------
  // INDIAN JEWELLERY PRICING ENGINE (₹ INR)
  // -------------------------------------------------------------
  const indianPricing = useMemo(() => {
    if (layers.length === 0) {
      return calculateIndianPricing(metal, 0, 0);
    }

    let goldWeightGrams = 0;
    let stoneCarat = 0;

    const bandLayers = layers.filter((l) => l.type === "band");
    const settingLayers = layers.filter((l) => l.type === "setting");
    const stoneLayers = layers.filter((l) => l.type === "stone");

    bandLayers.forEach((l) => {
      const bandWeights: Record<string, number> = { classic: 2.6, twist: 3.1, pave: 2.9 };
      goldWeightGrams += bandWeights[l.key] || 2.8;
    });

    settingLayers.forEach(() => {
      goldWeightGrams += 0.4;
    });

    if (bandLayers.length === 0 && settingLayers.length === 0 && layers.length > 0) {
      goldWeightGrams = 2.5; // fallback gold weight if only stone or accent added
    }

    if (stoneLayers.length > 0) {
      const caratMap: Record<string, number> = {
        round: 1.20,
        oval: 1.15,
        princess: 1.05,
        emerald: 1.30,
        marquise: 0.95,
      };
      stoneLayers.forEach((l) => {
        stoneCarat += caratMap[l.key] || 1.00;
      });
    }

    return calculateIndianPricing(metal, goldWeightGrams, stoneCarat);
  }, [layers, metal]);

  // -------------------------------------------------------------
  // LAYER CONTROLS (Figma standard)
  // -------------------------------------------------------------
  function bringForward(layerId: string) {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, zIndex: l.zIndex + 1 } : l))
    );
  }

  function sendBack(layerId: string) {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, zIndex: Math.max(1, l.zIndex - 1) } : l))
    );
  }

  function duplicateLayer(layerId: string) {
    setLayers((prev) => {
      const target = prev.find((l) => l.id === layerId);
      if (!target) return prev;
      const cloned: LayerObject = {
        ...target,
        id: `${target.type}_${Date.now()}`,
        x: Math.min(92, target.x + 4),
        y: Math.min(92, target.y + 4),
        zIndex: prev.length + 1,
      };
      setSelectedLayerId(cloned.id);
      return [...prev, cloned];
    });
  }

  function deleteLayer(layerId: string) {
    setLayers((prev) => prev.filter((l) => l.id !== layerId));
    if (selectedLayerId === layerId) setSelectedLayerId(null);
  }

  function updateLayerProperty(layerId: string, prop: keyof LayerObject, value: any) {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, [prop]: value } : l))
    );
  }

  // -------------------------------------------------------------
  // ADVANCED DRAG & DROP WITH TRANSLUCENT CURSOR PREVIEW
  // -------------------------------------------------------------
  function handleCanvasDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsCanvasDragOver(true);

    if (canvasInnerRef.current) {
      const rect = canvasInnerRef.current.getBoundingClientRect();
      const xPct = Number((((e.clientX - rect.left) / rect.width) * 100).toFixed(1));
      const yPct = Number((((e.clientY - rect.top) / rect.height) * 100).toFixed(1));
      setDragCursorPos({ x: Math.max(5, Math.min(95, xPct)), y: Math.max(5, Math.min(95, yPct)) });
    }
  }

  function handleCanvasDragLeave() {
    setIsCanvasDragOver(false);
    setDragCursorPos(null);
  }

  function handleTrayDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsCanvasDragOver(false);
    setDragCursorPos(null);

    let raw = e.dataTransfer.getData("application/json") || e.dataTransfer.getData("text/plain");
    if (!raw && activeDragPayload) {
      raw = JSON.stringify(activeDragPayload);
    }
    if (!raw) return;
    const payload: DragPayload = JSON.parse(raw);
    const { cat, key } = payload;

    if (!canvasInnerRef.current) return;
    const rect = canvasInnerRef.current.getBoundingClientRect();
    const xPct = Number((((e.clientX - rect.left) / rect.width) * 100).toFixed(1));
    const yPct = Number((((e.clientY - rect.top) / rect.height) * 100).toFixed(1));

    if (cat === "stone") {
      const comp = checkCompatibility(config.setting, key as StoneKey);
      if (!comp.isCompatible) {
        setCompatAlert({
          message: comp.message || "This gemstone is not compatible with the selected setting.",
          suggestedLabels: comp.suggestedGemstoneLabels,
        });
        return;
      }
      setCompatAlert(null);
    }

    const partInfo = findPart(cat as Category, key);
    const newLayer: LayerObject = {
      id: `${cat}_${Date.now()}`,
      type: cat,
      key,
      name: partInfo.name,
      x: Math.max(8, Math.min(92, xPct)),
      y: Math.max(8, Math.min(92, yPct)),
      scale: cat === "band" ? 1.0 : 0.82,
      rotation: 0,
      zIndex: layers.length + 1,
    };

    setConfig((prev) => {
      if (cat === "band") return { ...prev, band: key as BandKey };
      if (cat === "setting") return { ...prev, setting: key as SettingKey };
      if (cat === "stone") return { ...prev, stone: key as StoneKey };
      return prev;
    });

    setLayers((prev) => [...prev, newLayer]);

    // IMMEDIATELY SELECT NEW LAYER & SHOW FIGMA HANDLES
    setSelectedLayerId(newLayer.id);

    setAiStatusMessage(`✨ Placed ${partInfo.name} at (${newLayer.x}%, ${newLayer.y}%). Handles active.`);
    setTimeout(() => setAiStatusMessage(null), 2500);
  }

  function handleLayerPointerDown(e: React.PointerEvent, id: string) {
    e.stopPropagation();
    setSelectedLayerId(id);
    setDraggingLayerId(id);
  }

  function handleCanvasPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggingLayerId || !canvasInnerRef.current) return;
    const rect = canvasInnerRef.current.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Number(Math.max(5, Math.min(95, rawX)).toFixed(1));
    const clampedY = Number(Math.max(5, Math.min(95, rawY)).toFixed(1));

    const nearCenterX = Math.abs(clampedX - 50) < 1.5;
    const nearCenterY = Math.abs(clampedY - 50) < 1.5;
    setShowGuideLines(nearCenterX || nearCenterY);

    setLayers((prev) =>
      prev.map((l) => (l.id === draggingLayerId ? { ...l, x: clampedX, y: clampedY } : l))
    );
  }

  function handleCanvasPointerUp() {
    setDraggingLayerId(null);
    setShowGuideLines(false);
  }

  // JSON Save & Open
  function saveDesignJSON() {
    if (layers.length === 0) {
      alert("Canvas is empty. Drag a Ring Band onto the canvas before saving.");
      return;
    }
    const designData: DesignJSON = {
      id: `design_${Date.now()}`,
      name: "Custom Jewellery Design",
      metal,
      createdAt: new Date().toISOString(),
      zoom: zoomScale,
      layers,
    };
    const jsonStr = JSON.stringify(designData, null, 2);
    localStorage.setItem("caratline_saved_design", jsonStr);

    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jewellery_design_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setAiStatusMessage("💾 Saved Design to JSON!");
    setTimeout(() => setAiStatusMessage(null), 3000);
  }

  function loadDesignFromJSON(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data: DesignJSON = JSON.parse(event.target?.result as string);
        if (data && Array.isArray(data.layers)) {
          setLayers(data.layers);
          if (data.zoom) setZoomScale(data.zoom);
          if (data.metal) setMetal(data.metal);
          if (data.layers.length > 0) setSelectedLayerId(data.layers[0].id);
          setAiStatusMessage(`✅ Restored ${data.layers.length} components!`);
          setTimeout(() => setAiStatusMessage(null), 3500);
        }
      } catch (err) {
        alert("Invalid design JSON file format.");
      }
    };
    reader.readAsText(file);
  }

  function handleGenerateLuxuryPreview() {
    if (layers.length === 0) {
      alert("Canvas is empty. Drag a Ring Band onto the canvas before generating a luxury preview.");
      return;
    }
    setAiStatusMessage("✨ Collecting CAD metadata & rendering luxury studio preview...");
    setTimeout(() => {
      setAiStatusMessage(null);
      setLuxuryModalOpen(true);
    }, 1200);
  }

  const filteredParts = PART_LIBRARY[activeTab].filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedLayer = layers.find((l) => l.id === selectedLayerId);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw", overflow: "hidden", background: "#f8fafc" }} className="atelier-app">
      
      {/* 1. TOP HEADER NAVIGATION BAR (Fixed height 60px) */}
      <header
        style={{
          height: "60px",
          background: "#ffffff",
          borderBottom: "1px solid rgba(112, 26, 52, 0.15)",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 40,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* BRAND LOGO & TITLE */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #701a34, #d6537a)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", boxShadow: "0 4px 12px rgba(112, 26, 52, 0.2)" }}>
            💎
          </div>
          <div>
            <div style={{ fontFamily: "serif", fontStyle: "italic", fontSize: "20px", fontWeight: 700, color: "#701a34", lineHeight: 1 }}>
              Caratline Studio
            </div>
            <div style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(112, 26, 52, 0.6)", marginTop: "2px" }}>
              Manual Drag-and-Drop Workspace
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div style={{ width: "280px" }}>
          <input
            type="text"
            placeholder="🔍 Search assets (e.g. Round, Classic)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              background: "#f1f5f9",
              border: "1px solid rgba(112, 26, 52, 0.15)",
              borderRadius: "999px",
              padding: "6px 14px",
              fontSize: "11px",
              outline: "none",
              color: "#4a2733",
            }}
          />
        </div>

        {/* ACTIONS */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={handleConfirmDesign}
            style={{
              background: isDesignConfirmed ? "linear-gradient(135deg, #059669, #10b981)" : "linear-gradient(135deg, #701a34, #b83f63)",
              color: "#ffffff",
              border: "none",
              padding: "6px 18px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(112, 26, 52, 0.2)",
            }}
          >
            {isDesignConfirmed ? "✅ Design Finalized" : "✅ Confirm Design"}
          </button>
          <button onClick={handleClearCanvas} style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid rgba(220, 38, 38, 0.2)", padding: "6px 14px", borderRadius: "999px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>
            🧹 Clear Canvas
          </button>
          <button onClick={saveDesignJSON} style={{ background: "#f1f5f9", color: "#4a2733", border: "1px solid rgba(112, 26, 52, 0.15)", padding: "6px 14px", borderRadius: "999px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>
            💾 Save JSON
          </button>
          <button onClick={() => fileInputRef.current?.click()} style={{ background: "#f1f5f9", color: "#4a2733", border: "1px solid rgba(112, 26, 52, 0.15)", padding: "6px 14px", borderRadius: "999px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>
            📂 Open JSON
          </button>
          <input type="file" ref={fileInputRef} accept=".json" onChange={loadDesignFromJSON} style={{ display: "none" }} />
        </div>
      </header>

      {/* 2. MAIN WORKSPACE (Starts top-aligned with sidebar, full height calc(100vh - 60px)) */}
      <div style={{ display: "flex", flex: 1, height: "calc(100vh - 60px)", width: "100%", overflow: "hidden" }}>
        
        {/* LEFT SIDEBAR (Width: 380px, Scrollable) */}
        <aside style={{ width: "380px", height: "100%", background: "#ffffff", borderRight: "1px solid rgba(112, 26, 52, 0.15)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          
          {/* METAL SELECTOR */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(112, 26, 52, 0.1)" }}>
            <label style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#701a34", display: "block", marginBottom: "10px" }}>
              SELECT PRECIOUS METAL
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {(["rose_gold", "gold", "silver", "platinum"] as Metal[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMetal(m)}
                  style={{
                    background: metal === m ? "linear-gradient(135deg, #701a34, #b83f63)" : "#fff7f9",
                    color: metal === m ? "#ffffff" : "#4a2733",
                    border: metal === m ? "none" : "1px solid rgba(112, 26, 52, 0.15)",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: metal === m ? "0 4px 12px rgba(112, 26, 52, 0.2)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {METAL_LABEL[m]}
                </button>
              ))}
            </div>
          </div>

          {/* CATEGORY TABS */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(112, 26, 52, 0.1)" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  borderBottom: activeTab === cat ? "2.5px solid #701a34" : "2.5px solid transparent",
                  color: activeTab === cat ? "#701a34" : "rgba(74, 39, 51, 0.5)",
                  fontSize: "11px",
                  fontWeight: activeTab === cat ? 800 : 600,
                  padding: "12px 4px",
                  cursor: "pointer",
                }}
              >
                {CATEGORY_LABEL[cat]}
              </button>
            ))}
          </div>

          {/* ASSET LIBRARY GRID */}
          <div style={{ padding: "16px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredParts.map((part) => (
              <div
                key={part.key}
                draggable
                onDragStart={(e) => {
                  const payload: DragPayload = { cat: activeTab, key: part.key };
                  e.dataTransfer.setData("application/json", JSON.stringify(payload));
                  e.dataTransfer.setData("text/plain", JSON.stringify(payload));
                  setActiveDragPayload(payload);
                }}
                onDragEnd={() => {
                  setActiveDragPayload(null);
                  setIsCanvasDragOver(false);
                  setDragCursorPos(null);
                }}
                style={{
                  background: "linear-gradient(135deg, #ffffff, #fff7f9)",
                  border: "1px solid rgba(112, 26, 52, 0.15)",
                  borderRadius: "16px",
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  cursor: "grab",
                  userSelect: "none",
                  boxShadow: "0 4px 12px rgba(112, 26, 52, 0.04)",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "14px",
                    background: "radial-gradient(circle at 50% 50%, #ffffff, #fbe8ee)",
                    border: "1px solid rgba(214, 83, 122, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    pointerEvents: "none",
                  }}
                >
                  {renderPartIcon(activeTab, part.key, 52, metal, "three_quarter")}
                </div>
                <div style={{ flex: 1, pointerEvents: "none" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#4a2733" }}>{part.name}</div>
                  <div style={{ fontSize: "11px", color: "#d6537a", fontWeight: 600, marginTop: "2px" }}>{part.metaLabel}</div>
                  <div style={{ fontSize: "9px", color: "rgba(74, 39, 51, 0.5)", marginTop: "3px" }}>+ Drag onto Canvas</div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* RIGHT WORKSPACE AREA (Checkerboard background, centered canvas, bottom toolbar) */}
        <main
          className="checkerboard-bg"
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
          style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", overflow: "hidden" }}
        >

          {/* COMPATIBILITY ALERT BANNER */}
          {compatAlert && (
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 45,
                width: "90%",
                maxWidth: "540px",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "#ffffff",
                padding: "10px 16px",
                borderRadius: "14px",
                boxShadow: "0 8px 24px rgba(245, 158, 11, 0.35)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "22px" }}>⚠️</span>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontWeight: 800, fontSize: "12px" }}>{compatAlert.message}</div>
                <div style={{ fontSize: "11px", opacity: 0.95, marginTop: "2px" }}>
                  Suggested compatible gemstones: {compatAlert.suggestedLabels.join(", ")}
                </div>
              </div>
              <button onClick={() => setCompatAlert(null)} style={{ background: "rgba(0,0,0,0.2)", border: "none", color: "#fff", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer" }}>✕</button>
            </div>
          )}

          {/* CENTERED CANVAS CONTAINER (Starts EMPTY with placeholder "Drag a Ring Band here to begin designing.") */}
          <div
            className={`tray ${isCanvasDragOver ? "canvas-drag-active" : ""}`}
            onDragOver={handleCanvasDragOver}
            onDragLeave={handleCanvasDragLeave}
            onDrop={handleTrayDrop}
            style={{
              width: "780px",
              height: "780px",
              background: "#ffffff",
              borderRadius: "24px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.12)",
              border: "1px solid rgba(112, 26, 52, 0.15)",
              position: "relative",
              transform: `scale(${zoomScale})`,
              transition: "transform 0.15s ease-out, border 0.2s, box-shadow 0.2s",
            }}
          >
            {showGrid && <div className="canvas-grid-overlay" />}

            {/* ALIGNMENT CENTERLINES */}
            {showGuideLines && (
              <>
                <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: "1px", background: "#ef4444", zIndex: 40, pointerEvents: "none" }} />
                <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: "1px", background: "#ef4444", zIndex: 40, pointerEvents: "none" }} />
              </>
            )}

            {/* EMPTY PLACEHOLDER ("Drag a Ring Band here to begin designing.") */}
            {layers.length === 0 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  color: "rgba(112, 26, 52, 0.5)",
                  pointerEvents: "none",
                }}
              >
                <div style={{ fontSize: "44px" }}>💍</div>
                <div style={{ fontSize: "17px", fontWeight: 700, fontFamily: "serif", fontStyle: "italic", color: "#701a34" }}>
                  Drag a Ring Band here to begin designing.
                </div>
                <div style={{ fontSize: "11px", color: "rgba(74, 39, 51, 0.45)" }}>
                  Select a metal from the left panel and drag ring bands, settings, or gemstones onto this canvas.
                </div>
              </div>
            )}

            {/* TRANSLUCENT CURSOR PREVIEW FOLLOWING MOUSE WHILE DRAGGING */}
            {isCanvasDragOver && dragCursorPos && activeDragPayload && (
              <div
                className="drag-cursor-preview"
                style={{
                  left: `${dragCursorPos.x}%`,
                  top: `${dragCursorPos.y}%`,
                }}
              >
                {renderPartIcon(
                  activeDragPayload.cat,
                  activeDragPayload.key,
                  activeDragPayload.cat === "band" ? 380 : 90,
                  metal,
                  "three_quarter"
                )}
              </div>
            )}

            {/* CANVAS DRAWING INNER LAYERS */}
            <div className="canvas-inner" ref={canvasInnerRef} style={{ width: "100%", height: "100%", position: "relative" }}>
              {layers
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((layer) => {
                  const isSelected = selectedLayerId === layer.id;
                  return (
                    <div
                      key={layer.id}
                      className={`free-layer ${isSelected ? "selected" : ""}`}
                      onPointerDown={(e) => handleLayerPointerDown(e, layer.id)}
                      style={{
                        position: "absolute",
                        left: `${layer.x}%`,
                        top: `${layer.y}%`,
                        zIndex: layer.zIndex,
                        transform: `translate(-50%, -50%) rotate(${layer.rotation}deg) scale(${layer.scale})`,
                        cursor: "grab",
                        userSelect: "none",
                        touchAction: "none",
                      }}
                    >
                      {layer.type === "setting" ? (
                        <CadSetting settingKey={layer.key as SettingKey} metal={metal} layer="front" size={110} />
                      ) : (
                        renderPartIcon(layer.type as Category, layer.key, layer.type === "band" ? 400 : 90, metal, "three_quarter")
                      )}

                      {isSelected && (
                        <div className="figma-selection-box">
                          <div className="resize-handle nw" />
                          <div className="resize-handle ne" />
                          <div className="resize-handle sw" />
                          <div className="resize-handle se" />

                          <div
                            className="rotate-handle"
                            title="Rotate layer"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateLayerProperty(layer.id, "rotation", (layer.rotation + 45) % 360);
                            }}
                          >
                            🔄
                          </div>

                          <div className="layer-floating-toolbar">
                            <button title="Bring Forward" onClick={() => bringForward(layer.id)}>⬆️</button>
                            <button title="Send Back" onClick={() => sendBack(layer.id)}>⬇️</button>
                            <button title="Duplicate" onClick={() => duplicateLayer(layer.id)}>📋</button>
                            <button title="Delete" onClick={() => deleteLayer(layer.id)}>🗑️</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 3. BOTTOM CONTROLS BAR (Zoom, Reset View, Live Price Estimate, Generate Luxury Preview) */}
          <div
            style={{
              marginTop: "20px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(112, 26, 52, 0.15)",
              borderRadius: "999px",
              padding: "8px 24px",
              display: "flex",
              alignItems: "center",
              gap: "24px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
              zIndex: 30,
            }}
          >
            {/* ZOOM CONTROLS */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
              <span style={{ fontSize: "10px", fontWeight: 800, color: "#701a34", textTransform: "uppercase" }}>ZOOM:</span>
              <button onClick={() => setZoomScale((z) => Math.max(0.5, Number((z - 0.1).toFixed(1))))} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 800, color: "#701a34", fontSize: "14px" }}>-</button>
              <span style={{ fontWeight: 700, fontFamily: "monospace", color: "#4a2733" }}>{Math.round(zoomScale * 100)}%</span>
              <button onClick={() => setZoomScale((z) => Math.min(2.5, Number((z + 0.1).toFixed(1))))} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 800, color: "#701a34", fontSize: "14px" }}>+</button>
              <button onClick={() => setZoomScale(1.0)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "11px", color: "rgba(74,39,51,0.6)", textDecoration: "underline" }}>Reset View</button>
            </div>

            <span style={{ opacity: 0.2 }}>|</span>

            {/* LIVE INDIAN TOTAL PRICE READOUT */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ fontSize: "10px", fontWeight: 800, color: "rgba(74,39,51,0.6)", textTransform: "uppercase" }}>TOTAL ESTIMATE:</span>
              <span style={{ fontSize: "18px", fontWeight: 800, color: "#701a34", fontFamily: "serif" }}>{formatINR(indianPricing.total)}</span>
            </div>

            <span style={{ opacity: 0.2 }}>|</span>

            {/* GENERATE PREVIEW BUTTON */}
            <button
              onClick={handleGenerateLuxuryPreview}
              style={{
                background: "linear-gradient(135deg, #701a34, #d6537a)",
                color: "#ffffff",
                border: "none",
                padding: "8px 20px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(112, 26, 52, 0.3)",
              }}
            >
              ✨ Generate Luxury Preview
            </button>
          </div>
        </main>

        {/* RIGHT INSPECTOR SIDEBAR */}
        <aside style={{ width: "300px", height: "100%", background: "#ffffff", borderLeft: "1px solid rgba(112, 26, 52, 0.15)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(112, 26, 52, 0.1)" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#701a34", margin: 0 }}>Layer Inspector</h3>
            <div style={{ fontSize: "10px", color: "rgba(74, 39, 51, 0.6)", marginTop: "2px" }}>Exact Positioning & Layer Order</div>
          </div>

          {selectedLayer ? (
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px", flex: 1, overflowY: "auto" }}>
              <div style={{ background: "#fff7f9", border: "1px solid rgba(112, 26, 52, 0.15)", borderRadius: "14px", padding: "12px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#701a34" }}>{selectedLayer.name}</div>
                <div style={{ fontSize: "10px", fontFamily: "monospace", color: "rgba(74,39,51,0.6)", marginTop: "3px" }}>
                  Type: {selectedLayer.type.toUpperCase()}
                </div>
              </div>

              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#4a2733" }}>Position X ({selectedLayer.x}%):</label>
                <input
                  type="range"
                  min="5"
                  max="95"
                  step="0.5"
                  value={selectedLayer.x}
                  onChange={(e) => updateLayerProperty(selectedLayer.id, "x", parseFloat(e.target.value))}
                  style={{ width: "100%", marginTop: "4px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#4a2733" }}>Position Y ({selectedLayer.y}%):</label>
                <input
                  type="range"
                  min="5"
                  max="95"
                  step="0.5"
                  value={selectedLayer.y}
                  onChange={(e) => updateLayerProperty(selectedLayer.id, "y", parseFloat(e.target.value))}
                  style={{ width: "100%", marginTop: "4px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#4a2733" }}>Scale ({selectedLayer.scale.toFixed(2)}x):</label>
                <input
                  type="range"
                  min="0.3"
                  max="2.5"
                  step="0.05"
                  value={selectedLayer.scale}
                  onChange={(e) => updateLayerProperty(selectedLayer.id, "scale", parseFloat(e.target.value))}
                  style={{ width: "100%", marginTop: "4px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#4a2733" }}>Rotation ({selectedLayer.rotation}°):</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  value={selectedLayer.rotation}
                  onChange={(e) => updateLayerProperty(selectedLayer.id, "rotation", parseInt(e.target.value))}
                  style={{ width: "100%", marginTop: "4px" }}
                />
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <button onClick={() => bringForward(selectedLayer.id)} style={{ flex: 1, background: "#f1f5f9", border: "1px solid rgba(112, 26, 52, 0.15)", borderRadius: "8px", padding: "6px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>
                  ⬆️ Bring Fwd
                </button>
                <button onClick={() => sendBack(selectedLayer.id)} style={{ flex: 1, background: "#f1f5f9", border: "1px solid rgba(112, 26, 52, 0.15)", borderRadius: "8px", padding: "6px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>
                  ⬇️ Send Back
                </button>
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <button onClick={() => duplicateLayer(selectedLayer.id)} style={{ flex: 1, background: "#3b82f6", color: "#fff", border: "none", borderRadius: "10px", padding: "8px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>
                  📋 Duplicate
                </button>
                <button onClick={() => deleteLayer(selectedLayer.id)} style={{ flex: 1, background: "#ef4444", color: "#fff", border: "none", borderRadius: "10px", padding: "8px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: "20px", fontSize: "12px", color: "rgba(74, 39, 51, 0.6)", textAlign: "center" }}>
              Click any component on the canvas to inspect layer properties.
            </div>
          )}

          <div style={{ borderTop: "1px solid rgba(112, 26, 52, 0.1)", padding: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "#701a34", marginBottom: "8px" }}>
              Layers Stack ({layers.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "140px", overflowY: "auto" }}>
              {layers
                .sort((a, b) => b.zIndex - a.zIndex)
                .map((l) => (
                  <div
                    key={l.id}
                    onClick={() => setSelectedLayerId(l.id)}
                    style={{
                      background: selectedLayerId === l.id ? "#fff7f9" : "#ffffff",
                      border: selectedLayerId === l.id ? "1.5px solid #701a34" : "1px solid rgba(112, 26, 52, 0.15)",
                      borderRadius: "8px",
                      padding: "6px 10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      fontSize: "11px",
                    }}
                  >
                    <div>
                      <strong>{l.name}</strong> <span style={{ opacity: 0.6 }}>({l.type})</span>
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#701a34" }}>z: {l.zIndex}</div>
                  </div>
                ))}
            </div>
          </div>

          {/* INDIAN JEWELLERY PRICE BREAKDOWN CARD (₹ INR) */}
          <div style={{ borderTop: "1px solid rgba(112, 26, 52, 0.15)", padding: "16px", background: "#fff7f9" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "#701a34", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>PRICE BREAKDOWN (₹ INR)</span>
              <span style={{ fontSize: "9px", background: "#701a34", color: "#fff", padding: "2px 6px", borderRadius: "4px" }}>GST 3% INCL</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "11px", color: "#4a2733" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Gold Weight</span>
                <strong style={{ fontFamily: "monospace" }}>{indianPricing.goldWeightGrams} g</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Gold Cost</span>
                <strong style={{ fontFamily: "monospace" }}>{formatINR(indianPricing.goldCost)}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Diamond Cost</span>
                <strong style={{ fontFamily: "monospace" }}>{formatINR(indianPricing.diamondCost)}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Making Charges (12%)</span>
                <strong style={{ fontFamily: "monospace" }}>{formatINR(indianPricing.makingCharges)}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>GST (3%)</span>
                <strong style={{ fontFamily: "monospace" }}>{formatINR(indianPricing.gst)}</strong>
              </div>

              <div style={{ borderTop: "1.5px dashed rgba(112, 26, 52, 0.2)", paddingTop: "6px", marginTop: "4px", display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 800, color: "#701a34" }}>
                <span>Total</span>
                <span style={{ fontFamily: "serif", fontSize: "16px" }}>{formatINR(indianPricing.total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {aiStatusMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(26, 26, 26, 0.92)",
            color: "#ffffff",
            padding: "8px 20px",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: 600,
            zIndex: 60,
          }}
        >
          {aiStatusMessage}
        </div>
      )}

      {luxuryModalOpen && (
        <LuxuryPreviewModal
          config={config}
          metal={metal}
          layers={layers}
          indianPricing={indianPricing}
          onClose={() => setLuxuryModalOpen(false)}
        />
      )}
    </div>
  );
}
