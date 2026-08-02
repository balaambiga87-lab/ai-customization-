"use client";

import React, { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { Metal } from "@/lib/types";
import {
  JewelleryType,
  CanvasLayer,
  useLayerStore,
} from "@/stores/useLayerStore";
import {
  JEWELLERY_TYPES,
  CATEGORIES_BY_JEWELLERY_TYPE,
  getAssetLibrary,
  registerCustomAsset,
  classifyUploadedAsset,
  ComponentMeta,
} from "@/lib/jewelryAssetLibrary";
import { renderPartIcon, renderDiamondForCanvas } from "@/lib/partsLibrary";
import { computeAiAutoAlign, AlignRecommendation } from "@/lib/aiAutoAlignEngine";
import { AiAutoAlignModal } from "./AiAutoAlignModal";
import { CadSetting } from "./CadSetting";
import { LuxuryPreviewModal } from "./LuxuryPreviewModal";
import { calculateIndianPricing, formatINR } from "@/lib/indianPricingEngine";
import "@/styles/ring-atelier.css";

// ─────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────
const METAL_LABEL: Record<Metal, string> = {
  rose_gold: "Rose Gold",
  gold: "Yellow Gold",
  silver: "Silver",
  platinum: "Platinum",
};

// ─────────────────────────────────────────────────────────────────
// DRAG STATE TYPES (stored in refs — avoid unnecessary re-renders)
// ─────────────────────────────────────────────────────────────────
interface SidebarDrag {
  item: ComponentMeta;
}
interface LayerDrag {
  layerId: string;
  startX: number;
  startY: number;
  origX: number;
  origY: number;
}
interface ResizeDrag {
  layerId: string;
  origScale: number;
  startDist: number;
  centerX: number;
  centerY: number;
}
interface RotateDrag {
  layerId: string;
  origRotation: number;
  startAngle: number;
  centerX: number;
  centerY: number;
}

// ─────────────────────────────────────────────────────────────────
// COMPONENT: Jewellery Customization Studio
// ─────────────────────────────────────────────────────────────────
export function RingConfigurator() {
  // ── Zustand Layer Store & History ────────────────────────────
  const {
    layers,
    selectedLayerId,
    addLayer,
    updateLayer,
    selectLayer,
    deleteLayer,
    duplicateLayer,
    bringForward,
    sendBack,
    bringToFront,
    sendToBack,
    clearLayers,
    setLayers,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useLayerStore();

  // ── Studio UI State ──────────────────────────────────────────
  const [selectedJewelleryType, setSelectedJewelleryType] = useState<JewelleryType>("ring");
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>("ring_band");
  const [metal, setMetal] = useState<Metal>("rose_gold");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showGuideLines, setShowGuideLines] = useState<boolean>(false);
  const [guideLines, setGuideLines] = useState({ h: false, v: false });
  const [aiStatusMessage, setAiStatusMessage] = useState<string | null>(null);

  // ── Modals State ─────────────────────────────────────────────
  const [aiAlignRecommendation, setAiAlignRecommendation] = useState<AlignRecommendation | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [luxuryModalOpen, setLuxuryModalOpen] = useState<boolean>(false);

  // ── Custom Asset Upload State ────────────────────────────────
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [uploadName, setUploadName] = useState<string>("");
  const [uploadMetaLabel, setUploadMetaLabel] = useState<string>("Custom Upload");
  const [uploadImageUrl, setUploadImageUrl] = useState<string>("");
  const [uploadCategory, setUploadCategory] = useState<string>("ring_band");

  // ── Pointer Drag Feedback State ──────────────────────────────
  const [previewPos, setPreviewPos] = useState<{ x: number; y: number } | null>(null);
  const [previewItem, setPreviewItem] = useState<ComponentMeta | null>(null);
  const [isOverCanvas, setIsOverCanvas] = useState(false);
  const [draggingCardKey, setDraggingCardKey] = useState<string | null>(null);

  // ── Refs ─────────────────────────────────────────────────────
  const canvasTrayRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const sidebarDragRef = useRef<SidebarDrag | null>(null);
  const layerDragRef = useRef<LayerDrag | null>(null);
  const resizeDragRef = useRef<ResizeDrag | null>(null);
  const rotateDragRef = useRef<RotateDrag | null>(null);

  // ── Sync Active Category when Jewellery Type changes ──────────
  useEffect(() => {
    const categories = CATEGORIES_BY_JEWELLERY_TYPE[selectedJewelleryType];
    if (categories && categories.length > 0) {
      setActiveCategoryKey(categories[0].key);
    }
  }, [selectedJewelleryType]);

  // ── Filtered Assets ──────────────────────────────────────────
  const assetLibrary = useMemo(() => getAssetLibrary(), [uploadModalOpen]);
  const currentCategoryAssets = useMemo(() => {
    return assetLibrary.filter(
      (item) =>
        item.jewelleryType === selectedJewelleryType &&
        item.category === activeCategoryKey &&
        (searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [assetLibrary, selectedJewelleryType, activeCategoryKey, searchQuery]);

  // Selected Layer
  const selectedLayer = useMemo(() => {
    return layers.find((l) => l.id === selectedLayerId) || null;
  }, [layers, selectedLayerId]);

  // ── Helper: Canvas Rect ──────────────────────────────────────
  const getCanvasRect = useCallback(() => {
    return canvasTrayRef.current?.getBoundingClientRect() ?? null;
  }, []);

  // ── Create New Layer from Sidebar Drop ───────────────────────
  const createLayerFromDrop = useCallback(
    (item: ComponentMeta, clientX: number, clientY: number) => {
      const rect = getCanvasRect();
      if (!rect) return;

      const rawX = ((clientX - rect.left) / rect.width) * 100;
      const rawY = ((clientY - rect.top) / rect.height) * 100;

      // Free placement: drop exactly where cursor is released
      const dropX = Math.max(5, Math.min(95, rawX));
      const dropY = Math.max(5, Math.min(95, rawY));

      const newLayer: CanvasLayer = {
        id: `${item.category}_${Date.now()}`,
        jewelleryType: item.jewelleryType,
        type: item.category,
        category: item.category,
        key: item.key,
        name: item.name,
        image: item.imageUrl,
        x: Math.round(dropX * 10) / 10,
        y: Math.round(dropY * 10) / 10,
        scale: item.category.includes("band") || item.category.includes("chain") ? 1.0 : 0.9,
        rotation: 0,
        zIndex: layers.length + 1,
        metal,
      };

      addLayer(newLayer);
    },
    [addLayer, getCanvasRect, layers.length, metal]
  );

  // ── Reset Pointer Drag Refs ───────────────────────────────────
  const resetDrag = useCallback(() => {
    sidebarDragRef.current = null;
    layerDragRef.current = null;
    resizeDragRef.current = null;
    rotateDragRef.current = null;
    setPreviewPos(null);
    setPreviewItem(null);
    setIsOverCanvas(false);
    setDraggingCardKey(null);
    setGuideLines({ h: false, v: false });
  }, []);

  // ── Global Pointer Event Listeners ───────────────────────────
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = getCanvasRect();

        // 1. Sidebar Card Dragging
        if (sidebarDragRef.current) {
          setPreviewPos({ x: e.clientX, y: e.clientY });
          if (rect) {
            const over =
              e.clientX >= rect.left &&
              e.clientX <= rect.right &&
              e.clientY >= rect.top &&
              e.clientY <= rect.bottom;
            setIsOverCanvas(over);
          }
          return;
        }

        // 2. Canvas Layer Dragging (Free Canva/Figma movement)
        if (layerDragRef.current && rect) {
          const { layerId, startX, startY, origX, origY } = layerDragRef.current;
          const deltaXPercent = ((e.clientX - startX) / rect.width) * 100;
          const deltaYPercent = ((e.clientY - startY) / rect.height) * 100;

          let newX = Math.max(2, Math.min(98, origX + deltaXPercent));
          let newY = Math.max(2, Math.min(98, origY + deltaYPercent));

          // Center guide lines check
          const nearV = Math.abs(newX - 50) < 1.0;
          const nearH = Math.abs(newY - 50) < 1.0;
          setGuideLines({ h: nearH, v: nearV });

          updateLayer(layerId, {
            x: Math.round(newX * 10) / 10,
            y: Math.round(newY * 10) / 10,
          });
          return;
        }

        // 3. Resize Handle Dragging
        if (resizeDragRef.current) {
          const { layerId, origScale, startDist, centerX, centerY } = resizeDragRef.current;
          const dx = e.clientX - centerX;
          const dy = e.clientY - centerY;
          const currentDist = Math.sqrt(dx * dx + dy * dy);
          const ratio = currentDist / startDist;
          const newScale = Math.max(0.3, Math.min(3.0, Math.round(origScale * ratio * 100) / 100));
          updateLayer(layerId, { scale: newScale });
          return;
        }

        // 4. Rotation Handle Dragging
        if (rotateDragRef.current) {
          const { layerId, origRotation, startAngle, centerX, centerY } = rotateDragRef.current;
          const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
          let delta = currentAngle - startAngle;
          let newRot = Math.round(origRotation + delta);
          newRot = ((newRot % 360) + 360) % 360;
          updateLayer(layerId, { rotation: newRot });
          return;
        }
      });
    };

    const onUp = (e: PointerEvent) => {
      if (sidebarDragRef.current) {
        const item = sidebarDragRef.current.item;
        const rect = getCanvasRect();
        if (
          rect &&
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          createLayerFromDrop(item, e.clientX, e.clientY);
        }
      }
      resetDrag();
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerup", onUp);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, [createLayerFromDrop, getCanvasRect, resetDrag, updateLayer]);

  // ── Keyboard Shortcuts ────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      const id = useLayerStore.getState().selectedLayerId;

      if (e.key === "Delete" || e.key === "Backspace") {
        if (id) deleteLayer(id);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        if (id) duplicateLayer(id);
      }
      if (e.key === "Escape") selectLayer(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [deleteLayer, duplicateLayer, selectLayer, undo, redo]);

  // ── Drag Handlers ─────────────────────────────────────────────
  function handleCardPointerDown(e: React.PointerEvent, item: ComponentMeta) {
    e.preventDefault();
    sidebarDragRef.current = { item };
    setPreviewItem(item);
    setPreviewPos({ x: e.clientX, y: e.clientY });
    setDraggingCardKey(item.key);
  }

  function handleLayerPointerDown(e: React.PointerEvent, layerId: string) {
    e.stopPropagation();
    selectLayer(layerId);
    const layer = useLayerStore.getState().layers.find((l) => l.id === layerId);
    if (!layer) return;

    layerDragRef.current = {
      layerId,
      startX: e.clientX,
      startY: e.clientY,
      origX: layer.x,
      origY: layer.y,
    };
  }

  function handleResizePointerDown(e: React.PointerEvent, layerId: string) {
    e.stopPropagation();
    e.preventDefault();
    const layer = useLayerStore.getState().layers.find((l) => l.id === layerId);
    if (!layer) return;

    const rect = getCanvasRect();
    if (!rect) return;

    const centerX = rect.left + (layer.x / 100) * rect.width;
    const centerY = rect.top + (layer.y / 100) * rect.height;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const startDist = Math.max(Math.sqrt(dx * dx + dy * dy), 8);
    resizeDragRef.current = { layerId, origScale: layer.scale, startDist, centerX, centerY };
  }

  function handleRotatePointerDown(e: React.PointerEvent, layerId: string) {
    e.stopPropagation();
    e.preventDefault();
    const layer = useLayerStore.getState().layers.find((l) => l.id === layerId);
    if (!layer) return;

    const rect = getCanvasRect();
    if (!rect) return;

    const centerX = rect.left + (layer.x / 100) * rect.width;
    const centerY = rect.top + (layer.y / 100) * rect.height;
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    rotateDragRef.current = { layerId, origRotation: layer.rotation, startAngle, centerX, centerY };
  }

  function handleCanvasClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) selectLayer(null);
  }

  // ── Pricing Engine ────────────────────────────────────────────
  const indianPricing = useMemo(() => {
    if (layers.length === 0) return calculateIndianPricing(metal, 0, 0);
    let goldWeightGrams = 0;
    let stoneCarat = 0;
    layers.forEach((l) => {
      if (l.type.includes("band") || l.type.includes("hoop") || l.type.includes("chain")) goldWeightGrams += 2.5;
      if (l.type.includes("stone") || l.type.includes("ornament")) stoneCarat += 1.0;
    });
    return calculateIndianPricing(metal, goldWeightGrams, stoneCarat);
  }, [layers, metal]);

  // ── AI Auto Align Trigger ─────────────────────────────────────
  function handleAiAutoAlign() {
    if (layers.length === 0) {
      alert("Canvas is empty. Drag jewellery components onto the canvas first!");
      return;
    }
    const rec = computeAiAutoAlign(layers);
    if (rec) {
      setAiAlignRecommendation(rec);
      setIsAiModalOpen(true);
    }
  }

  // ── Generate Final Render Trigger ─────────────────────────────
  function handleGenerateFinalJewellery() {
    if (layers.length === 0) {
      alert("Canvas is empty. Add components to build your custom jewellery before generating final render.");
      return;
    }
    setAiStatusMessage("✨ Rendering catalogue-grade 4K studio jewellery image…");
    setTimeout(() => {
      setAiStatusMessage(null);
      setLuxuryModalOpen(true);
    }, 1000);
  }

  // ── Custom Asset Upload Handler with Auto-Classification ──────
  function handleSaveCustomAsset() {
    if (!uploadName || !uploadImageUrl) {
      alert("Please provide asset name and image URL.");
      return;
    }
    // Auto-classify uploaded PNG asset into correct category
    const targetCategory = classifyUploadedAsset(uploadName, selectedJewelleryType);

    registerCustomAsset({
      key: `custom_${Date.now()}`,
      jewelleryType: selectedJewelleryType,
      category: targetCategory,
      name: uploadName,
      metaLabel: uploadMetaLabel || "Custom Upload",
      estimatedPriceINR: 15000,
      imageUrl: uploadImageUrl,
      isCustom: true,
    });
    setUploadModalOpen(false);
    setUploadName("");
    setUploadImageUrl("");
    setAiStatusMessage(`✅ New asset classified as ${targetCategory.replace("_", " ").toUpperCase()}!`);
    setTimeout(() => setAiStatusMessage(null), 3000);
  }

  return (
    <div className="atelier-app" data-metal={metal}>
      {/* ── HEADER ────────────────────────────────────────── */}
      <header>
        <div className="brand">
          <span className="mark">Caratline</span>
          <span className="sub">Jewellery Customization Studio</span>
        </div>

        {/* Metal Switcher */}
        <div className="metal-switch">
          {(["rose_gold", "gold", "silver", "platinum"] as Metal[]).map((m) => (
            <button
              key={m}
              className={metal === m ? "active" : ""}
              onClick={() => setMetal(m)}
            >
              {METAL_LABEL[m]}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={handleAiAutoAlign}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "linear-gradient(135deg, #d6537a, #b83f63)",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(214, 83, 122, 0.3)",
            }}
          >
            ✨ AI Auto Align
          </button>

          <button
            onClick={handleGenerateFinalJewellery}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "#4a2733",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            💎 Generate Final Jewellery
          </button>
        </div>
      </header>

      {/* ── MAIN BODY GRID (3-Column Layout) ───────────────── */}
      <div className="body-grid">
        {/* ── LEFT PANEL: ASSET LIBRARY (~250px) ─────────────── */}
        <aside className="library">
          {/* Top Jewellery Type Tabs (Rings, Earrings, Pendants) */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--line)", background: "var(--panel-alt)" }}>
            {JEWELLERY_TYPES.map((jt) => (
              <button
                key={jt.key}
                onClick={() => setSelectedJewelleryType(jt.key)}
                style={{
                  flex: 1,
                  padding: "10px 4px",
                  fontSize: "11px",
                  fontWeight: selectedJewelleryType === jt.key ? 700 : 500,
                  color: selectedJewelleryType === jt.key ? "var(--berry)" : "var(--ink-dim)",
                  background: selectedJewelleryType === jt.key ? "var(--panel)" : "transparent",
                  border: "none",
                  borderBottom: selectedJewelleryType === jt.key ? "2px solid var(--berry)" : "2px solid transparent",
                  cursor: "pointer",
                }}
              >
                {jt.icon} {jt.label}
              </button>
            ))}
          </div>

          {/* Sub-Category Sub-Tabs */}
          <div className="tabs" style={{ flexWrap: "wrap" }}>
            {CATEGORIES_BY_JEWELLERY_TYPE[selectedJewelleryType].map((cat) => (
              <button
                key={cat.key}
                className={activeCategoryKey === cat.key ? "active" : ""}
                onClick={() => setActiveCategoryKey(cat.key)}
                style={{ fontSize: "9px", padding: "8px 4px" }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search + Extensible Custom Upload Button */}
          <div style={{ padding: "10px 14px 4px", display: "flex", gap: "6px" }}>
            <input
              type="text"
              placeholder="Search components…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: "6px 10px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                fontSize: "11px",
                background: "var(--panel)",
                color: "var(--ink)",
              }}
            />
            <button
              onClick={() => setUploadModalOpen(true)}
              title="Upload custom component asset"
              style={{
                padding: "6px 10px",
                borderRadius: "8px",
                border: "1px solid var(--berry)",
                background: "rgba(214, 83, 122, 0.1)",
                color: "var(--berry)",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + Upload
            </button>
          </div>

          {/* Asset Scroll List (Realistic Component Cards) */}
          <div className="parts-scroll">
            {currentCategoryAssets.map((item) => (
              <div
                key={item.key}
                className="part-card"
                onPointerDown={(e) => handleCardPointerDown(e, item)}
                style={{
                  opacity: draggingCardKey === item.key ? 0.4 : 1,
                  transform: draggingCardKey === item.key ? "scale(0.97)" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px",
                  border: "1px solid var(--line)",
                  borderRadius: "14px",
                  background: "var(--panel-alt)",
                  cursor: "grab",
                  userSelect: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {renderPartIcon(item.category, item.key, 46, metal)}
                  <div className="info">
                    <div className="name" style={{ fontWeight: 700, fontSize: "12px", color: "var(--ink)" }}>
                      {item.name}
                    </div>
                    <div className="meta" style={{ fontSize: "10px", color: "var(--ink-dim)", marginTop: "2px" }}>
                      {item.grams ? `${item.grams} g` : item.metaLabel} · {formatINR(item.estimatedPriceINR)}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "var(--berry)",
                    background: "rgba(214, 83, 122, 0.12)",
                    padding: "3px 6px",
                    borderRadius: "6px",
                    whiteSpace: "nowrap",
                  }}
                >
                  + Drag to Canvas
                </div>
              </div>
            ))}

            {currentCategoryAssets.length === 0 && (
              <div style={{ padding: "20px", textAlign: "center", fontSize: "11px", color: "var(--ink-dim)" }}>
                No components found in this category. Click &quot;+ Upload&quot; to add a custom asset!
              </div>
            )}
          </div>

          <div className="library-hint">
            💡 Drag any component onto the 70% canvas. Every component is an independent layer.
          </div>
        </aside>

        {/* ── CENTER CANVAS AREA (~70% Screen) ──────────────── */}
        <main className="stage" style={{ background: "#f8f9fa", position: "relative" }}>
          {/* Status Message Overlay */}
          {aiStatusMessage && (
            <div
              style={{
                position: "absolute",
                top: "16px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(74, 39, 51, 0.9)",
                color: "#ffffff",
                padding: "8px 18px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 600,
                zIndex: 20,
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              }}
            >
              {aiStatusMessage}
            </div>
          )}

          {/* Canvas Tray (White design canvas) */}
          <div
            ref={canvasTrayRef}
            className={`tray${isOverCanvas ? " canvas-drag-active" : ""}`}
            onClick={handleCanvasClick}
            style={{
              width: "780px",
              height: "780px",
              background: "#ffffff",
              borderRadius: "24px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
              border: "1px solid rgba(112,26,52,0.15)",
              position: "relative",
              transform: `scale(${zoomScale})`,
              transition: "transform 0.15s ease-out, border 0.2s, box-shadow 0.2s",
              touchAction: "none",
              isolation: "isolate",
            }}
          >
            {/* Grid Overlay */}
            {showGrid && <div className="canvas-grid-overlay" />}

            {/* Guide Lines */}
            {showGuideLines && guideLines.v && (
              <div className="centerline show" style={{ left: "50%" }} />
            )}
            {showGuideLines && guideLines.h && (
              <div className="centerline show" style={{ top: "50%", width: "100%", height: "1px" }} />
            )}

            {/* Empty Canvas Prompt */}
            {layers.length === 0 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  opacity: 0.5,
                  textAlign: "center",
                  padding: "40px",
                }}
              >
                <div style={{ fontSize: "36px", marginBottom: "8px" }}>✨</div>
                <div style={{ fontSize: "16px", fontWeight: 700, fontFamily: "serif", color: "#701a34" }}>
                  Drag & Drop components onto the canvas
                </div>
                <div style={{ fontSize: "11px", color: "rgba(74,39,51,0.6)", marginTop: "4px" }}>
                  Select from Rings, Earrings, or Pendants in the left panel. Every component moves freely.
                </div>
              </div>
            )}

            {/* ── CANVAS LAYERS ───────────────────────────────── */}
            <div style={{ width: "100%", height: "100%", position: "relative" }}>
              {[...layers]
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((layer) => {
                  const isSelected = layer.id === selectedLayerId;

                  return (
                    <div
                      key={layer.id}
                      onPointerDown={(e) => handleLayerPointerDown(e, layer.id)}
                      style={{
                        position: "absolute",
                        left: `${layer.x}%`,
                        top: `${layer.y}%`,
                        zIndex: layer.zIndex,
                        transform: `translate(-50%,-50%) rotate(${layer.rotation}deg) scale(${layer.scale})`,
                        filter: "drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.12))",
                        cursor: "grab",
                        userSelect: "none",
                        touchAction: "none",
                      }}
                    >
                      {/* Component Rendering */}
                      {layer.category.includes("center_stone") && layer.jewelleryType === "ring" ? (
                        <div
                          style={{
                            position: "relative",
                            width: 170,
                            height: 170,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {/* Back Prongs */}
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, pointerEvents: "none" }}>
                            <CadSetting settingKey="prong" metal={metal} layer="back" size={170} />
                          </div>

                          {/* Contact Shadow */}
                          <div
                            style={{
                              position: "absolute",
                              bottom: "16%",
                              left: "50%",
                              transform: "translateX(-50%)",
                              width: "56%",
                              height: "10%",
                              borderRadius: "50%",
                              background: "radial-gradient(ellipse, rgba(30,8,16,0.45) 0%, transparent 75%)",
                              zIndex: 2,
                              pointerEvents: "none",
                              filter: "blur(4px)",
                            }}
                          />

                          {/* Diamond Gemstone */}
                          <div
                            style={{
                              position: "relative",
                              zIndex: 3,
                              pointerEvents: "none",
                              clipPath: "polygon(0% 0%, 100% 0%, 100% 70%, 50% 82%, 0% 70%)",
                            }}
                          >
                            {renderDiamondForCanvas(layer.key, 185, metal)}
                          </div>

                          {/* Front Prongs */}
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 4, pointerEvents: "none" }}>
                            <CadSetting settingKey="prong" metal={metal} layer="front" size={170} />
                          </div>
                        </div>
                      ) : layer.category.includes("setting") ? (
                        <CadSetting settingKey={(layer.key as any) || "prong"} metal={metal} layer="front" size={120} />
                      ) : (
                        renderPartIcon(
                          layer.category,
                          layer.key,
                          layer.category.includes("band") || layer.category.includes("chain") ? 380 : 120,
                          metal
                        )
                      )}

                      {/* Selection Box & Resize/Rotate Handles */}
                      {isSelected && (
                        <div className="figma-selection-box">
                          {(["nw", "ne", "sw", "se"] as const).map((h) => (
                            <div
                              key={h}
                              className={`resize-handle ${h}`}
                              onPointerDown={(e) => handleResizePointerDown(e, layer.id)}
                            />
                          ))}

                          <div
                            className="rotate-handle"
                            title="Drag to rotate"
                            onPointerDown={(e) => handleRotatePointerDown(e, layer.id)}
                          >
                            ↻
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Floating Drag Ghost */}
          {sidebarDragRef.current && previewPos && previewItem && (
            <div
              style={{
                position: "fixed",
                left: previewPos.x,
                top: previewPos.y,
                transform: "translate(-50%,-50%) scale(1.1)",
                pointerEvents: "none",
                zIndex: 9999,
                opacity: 0.85,
                filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.25))",
              }}
            >
              {renderPartIcon(previewItem.category, previewItem.key, 80, metal)}
            </div>
          )}

          {/* ── BOTTOM TOOLBAR ────────────────────────────────── */}
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(12px)",
              border: "1px solid var(--line)",
              borderRadius: "999px",
              padding: "6px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              boxShadow: "0 8px 24px rgba(74, 39, 51, 0.15)",
              zIndex: 15,
            }}
          >
            {/* Zoom Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px", borderRight: "1px solid var(--line)", paddingRight: "10px" }}>
              <button
                onClick={() => setZoomScale((z) => Math.max(0.5, Math.round((z - 0.1) * 10) / 10))}
                title="Zoom Out"
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", padding: "4px 8px" }}
              >
                🔍−
              </button>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--ink)", width: "38px", textAlign: "center" }}>
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale((z) => Math.min(2.0, Math.round((z + 0.1) * 10) / 10))}
                title="Zoom In"
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", padding: "4px 8px" }}
              >
                🔍+
              </button>
              <button
                onClick={() => setZoomScale(1.0)}
                title="Reset View"
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "10px", color: "var(--ink-dim)", padding: "4px 6px" }}
              >
                Reset
              </button>
            </div>

            {/* Undo / Redo */}
            <div style={{ display: "flex", gap: "4px", borderRight: "1px solid var(--line)", paddingRight: "10px" }}>
              <button
                onClick={undo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
                style={{
                  background: "none",
                  border: "none",
                  cursor: canUndo ? "pointer" : "not-allowed",
                  opacity: canUndo ? 1 : 0.4,
                  fontSize: "14px",
                  padding: "4px 8px",
                }}
              >
                ↩ Undo
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                title="Redo (Ctrl+Shift+Z)"
                style={{
                  background: "none",
                  border: "none",
                  cursor: canRedo ? "pointer" : "not-allowed",
                  opacity: canRedo ? 1 : 0.4,
                  fontSize: "14px",
                  padding: "4px 8px",
                }}
              >
                ↪ Redo
              </button>
            </div>

            {/* Layer Actions */}
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={() => selectedLayerId && duplicateLayer(selectedLayerId)}
                disabled={!selectedLayerId}
                title="Duplicate Layer"
                style={{
                  background: "none",
                  border: "none",
                  cursor: selectedLayerId ? "pointer" : "not-allowed",
                  opacity: selectedLayerId ? 1 : 0.4,
                  fontSize: "12px",
                  padding: "4px 8px",
                }}
              >
                📋 Duplicate
              </button>
              <button
                onClick={() => selectedLayerId && bringForward(selectedLayerId)}
                disabled={!selectedLayerId}
                title="Bring Forward"
                style={{
                  background: "none",
                  border: "none",
                  cursor: selectedLayerId ? "pointer" : "not-allowed",
                  opacity: selectedLayerId ? 1 : 0.4,
                  fontSize: "12px",
                  padding: "4px 8px",
                }}
              >
                ⬆ Forward
              </button>
              <button
                onClick={() => selectedLayerId && sendBack(selectedLayerId)}
                disabled={!selectedLayerId}
                title="Send Back"
                style={{
                  background: "none",
                  border: "none",
                  cursor: selectedLayerId ? "pointer" : "not-allowed",
                  opacity: selectedLayerId ? 1 : 0.4,
                  fontSize: "12px",
                  padding: "4px 8px",
                }}
              >
                ⬇ Back
              </button>
              <button
                onClick={() => selectedLayerId && deleteLayer(selectedLayerId)}
                disabled={!selectedLayerId}
                title="Delete Layer"
                style={{
                  background: "none",
                  border: "none",
                  cursor: selectedLayerId ? "pointer" : "not-allowed",
                  opacity: selectedLayerId ? 1 : 0.4,
                  color: "#d6537a",
                  fontSize: "12px",
                  padding: "4px 8px",
                }}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        </main>

        {/* ── RIGHT PANEL: LAYER INSPECTOR (~270px) ─────────── */}
        <aside className="docket">
          <h3>Layer Inspector</h3>
          <p style={{ margin: "0 18px 12px", fontSize: "11px", color: "var(--ink-dim)" }}>
            Independent component properties
          </p>

          {/* Active Layer Properties Controls */}
          {selectedLayer ? (
            <div style={{ padding: "0 14px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ background: "var(--panel-alt)", padding: "12px", borderRadius: "12px", border: "1px solid var(--line)" }}>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--ink)" }}>{selectedLayer.name}</div>
                <div style={{ fontSize: "10px", color: "var(--ink-dim)", marginTop: "2px" }}>
                  Type: {selectedLayer.jewelleryType.toUpperCase()} · {selectedLayer.category}
                </div>
              </div>

              {/* Position X Slider */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
                  <span>Position X</span>
                  <span style={{ fontWeight: 600 }}>{selectedLayer.x}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={selectedLayer.x}
                  onChange={(e) => updateLayer(selectedLayer.id, { x: parseFloat(e.target.value) })}
                  style={{ width: "100%" }}
                />
              </div>

              {/* Position Y Slider */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
                  <span>Position Y</span>
                  <span style={{ fontWeight: 600 }}>{selectedLayer.y}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={selectedLayer.y}
                  onChange={(e) => updateLayer(selectedLayer.id, { y: parseFloat(e.target.value) })}
                  style={{ width: "100%" }}
                />
              </div>

              {/* Scale Slider */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
                  <span>Scale</span>
                  <span style={{ fontWeight: 600 }}>{selectedLayer.scale}x</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="2.5"
                  step="0.05"
                  value={selectedLayer.scale}
                  onChange={(e) => updateLayer(selectedLayer.id, { scale: parseFloat(e.target.value) })}
                  style={{ width: "100%" }}
                />
              </div>

              {/* Rotation Slider */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
                  <span>Rotation</span>
                  <span style={{ fontWeight: 600 }}>{selectedLayer.rotation}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={selectedLayer.rotation}
                  onChange={(e) => updateLayer(selectedLayer.id, { rotation: parseInt(e.target.value, 10) })}
                  style={{ width: "100%" }}
                />
              </div>

              {/* Quick Layer Controls */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginTop: "4px" }}>
                <button
                  onClick={() => bringForward(selectedLayer.id)}
                  style={{ padding: "6px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--panel)", fontSize: "11px", cursor: "pointer" }}
                >
                  ⬆ Bring Forward
                </button>
                <button
                  onClick={() => sendBack(selectedLayer.id)}
                  style={{ padding: "6px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--panel)", fontSize: "11px", cursor: "pointer" }}
                >
                  ⬇ Send Back
                </button>
                <button
                  onClick={() => duplicateLayer(selectedLayer.id)}
                  style={{ padding: "6px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--panel)", fontSize: "11px", cursor: "pointer" }}
                >
                  📋 Duplicate
                </button>
                <button
                  onClick={() => deleteLayer(selectedLayer.id)}
                  style={{ padding: "6px", borderRadius: "8px", border: "1px solid var(--line)", background: "rgba(214, 83, 122, 0.1)", color: "var(--berry)", fontSize: "11px", cursor: "pointer" }}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="docket-empty">Select any component on the canvas to inspect its layer properties.</div>
          )}

          {/* Layers Stack List */}
          <div style={{ padding: "0 14px 10px", borderTop: "1px solid var(--line)", paddingTop: "12px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ink-dim)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Layers Stack ({layers.length})
            </div>
            <div className="docket-list" style={{ maxHeight: "200px" }}>
              {[...layers]
                .sort((a, b) => b.zIndex - a.zIndex)
                .map((l) => (
                  <div
                    key={l.id}
                    className="docket-item"
                    onClick={() => selectLayer(l.id)}
                    style={{
                      borderColor: selectedLayerId === l.id ? "var(--berry)" : "var(--line)",
                      background: selectedLayerId === l.id ? "#ffffff" : "var(--panel-alt)",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <div className="n">{l.name}</div>
                      <div className="m">z: {l.zIndex}</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteLayer(l.id); }}>✕</button>
                  </div>
                ))}
            </div>
          </div>

          {/* Pricing Breakdown Footer */}
          <div className="docket-footer" style={{ flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 700, marginBottom: "8px" }}>
              <span>Total Price:</span>
              <span style={{ color: "var(--berry)" }}>{formatINR(indianPricing.grandTotal)}</span>
            </div>
            <button className="primary" onClick={handleGenerateFinalJewellery}>
              Generate Final Jewellery
            </button>
          </div>
        </aside>
      </div>

      {/* ── MODALS ────────────────────────────────────────── */}

      {/* 1. AI Auto Align Confirmation Modal */}
      <AiAutoAlignModal
        isOpen={isAiModalOpen}
        recommendation={aiAlignRecommendation}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* 2. Final Render Luxury Preview Modal */}
      {luxuryModalOpen && (
        <LuxuryPreviewModal
          config={{ band: "classic", stone: "round", setting: "prong", accents: {} }}
          metal={metal}
          layers={layers as any}
          indianPricing={indianPricing}
          onClose={() => setLuxuryModalOpen(false)}
        />
      )}

      {/* 3. Custom Component Upload Modal */}
      {uploadModalOpen && (
        <div className="inspector-modal-overlay" onClick={() => setUploadModalOpen(false)}>
          <div className="inspector-modal-content" style={{ maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setUploadModalOpen(false)}>✕</button>
            <h2 style={{ fontSize: "20px" }}>Upload Custom Component</h2>
            <p className="subtitle">Add a custom jewellery component asset to the studio library.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 600 }}>Component Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vintage Filigree Crown"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid var(--line)", fontSize: "12px", marginTop: "4px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", fontWeight: 600 }}>Jewellery Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid var(--line)", fontSize: "12px", marginTop: "4px" }}
                >
                  {CATEGORIES_BY_JEWELLERY_TYPE[selectedJewelleryType].map((c) => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "11px", fontWeight: 600 }}>Image URL / Asset Path</label>
                <input
                  type="text"
                  placeholder="/images/custom_part.png or https://…"
                  value={uploadImageUrl}
                  onChange={(e) => setUploadImageUrl(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid var(--line)", fontSize: "12px", marginTop: "4px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", fontWeight: 600 }}>Specification Label</label>
                <input
                  type="text"
                  placeholder="e.g. 18K Gold · 1.5g"
                  value={uploadMetaLabel}
                  onChange={(e) => setUploadMetaLabel(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid var(--line)", fontSize: "12px", marginTop: "4px" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "12px" }}>
                <button
                  onClick={() => setUploadModalOpen(false)}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--panel-alt)", fontSize: "12px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCustomAsset}
                  style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: "var(--berry)", color: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                >
                  Save Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
