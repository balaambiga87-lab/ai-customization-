"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

interface AnchorEditorProps {
  assetName: string;
  initialAnchor: { x: number; y: number }; // percentage format e.g. { x: 0.50, y: 0.27 }
  onSaveAnchor: (anchor: { x: number; y: number }) => void;
  onClose: () => void;
}

export function AnchorEditor({ assetName, initialAnchor, onSaveAnchor, onClose }: AnchorEditorProps) {
  const [anchor, setAnchor] = useState<{ x: number; y: number }>(initialAnchor);
  const [isSaved, setIsSaved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handlePointerDown(e: React.PointerEvent) {
    setIsDragging(true);
    updateAnchorFromEvent(e);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging) return;
    updateAnchorFromEvent(e);
  }

  function handlePointerUp() {
    setIsDragging(false);
  }

  function updateAnchorFromEvent(e: React.PointerEvent) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rawX = (e.clientX - rect.left) / rect.width;
    const rawY = (e.clientY - rect.top) / rect.height;

    // Clamp between 0.05 and 0.95 and round to 2 decimal places (percentages e.g. 0.50, 0.27)
    const clampedX = Math.min(0.95, Math.max(0.05, Number(rawX.toFixed(2))));
    const clampedY = Math.min(0.95, Math.max(0.05, Number(rawY.toFixed(2))));

    setAnchor({ x: clampedX, y: clampedY });
    setIsSaved(false);
  }

  function handleSave() {
    onSaveAnchor(anchor);
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        cursor: isDragging ? "grabbing" : "crosshair",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {/* HUD OVERLAY HEADER */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(255, 251, 248, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(107, 44, 61, 0.2)",
          borderRadius: "16px",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          boxShadow: "0 8px 24px rgba(107, 44, 61, 0.15)",
          zIndex: 60,
        }}
      >
        <div>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#d6537a" }}>
            📐 CAD Anchor Editor — {assetName}
          </div>
          <div style={{ fontSize: "11px", fontFamily: "monospace", color: "#4a2733", marginTop: "2px" }}>
            Anchor JSON: &#123; "x": {anchor.x.toFixed(2)}, "y": {anchor.y.toFixed(2)} &#125;
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{
            background: isSaved ? "#10b981" : "#d6537a",
            color: "#fff",
            border: "none",
            borderRadius: "999px",
            padding: "8px 16px",
            fontSize: "11px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(214, 83, 122, 0.25)",
            transition: "all 0.2s ease",
          }}
        >
          {isSaved ? "✓ Saved to JSON!" : "💾 Save Anchor"}
        </button>

        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#888",
            fontSize: "16px",
            cursor: "pointer",
            padding: "0 4px",
          }}
        >
          ✕
        </button>
      </div>

      {/* VISUAL DRAGGABLE ANCHOR MARKER */}
      <motion.div
        animate={{
          left: `${anchor.x * 100}%`,
          top: `${anchor.y * 100}%`,
        }}
        transition={{ type: "spring", stiffness: 450, damping: 28 }}
        style={{
          position: "absolute",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 55,
        }}
      >
        {/* Outer glowing target ring */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "2px solid #ef4444",
            boxShadow: "0 0 16px rgba(239, 68, 68, 0.8), inset 0 0 8px rgba(239, 68, 68, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Inner red dot */}
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} />
          {/* Crosshair lines */}
          <div style={{ position: "absolute", top: "-8px", bottom: "-8px", left: "50%", width: "1px", background: "#ef4444" }} />
          <div style={{ position: "absolute", left: "-8px", right: "-8px", top: "50%", height: "1px", background: "#ef4444" }} />
        </div>

        {/* Position coordinate badge below marker */}
        <div
          style={{
            position: "absolute",
            top: "42px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#ef4444",
            color: "#fff",
            fontSize: "10px",
            fontWeight: 700,
            fontFamily: "monospace",
            padding: "2px 8px",
            borderRadius: "999px",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
          }}
        >
          x: {anchor.x.toFixed(2)}, y: {anchor.y.toFixed(2)}
        </div>
      </motion.div>

      {/* FOOTER INSTRUCTION BANNER */}
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(74, 39, 51, 0.85)",
          color: "#fff",
          fontSize: "11px",
          padding: "6px 16px",
          borderRadius: "999px",
          pointerEvents: "none",
        }}
      >
        Drag the red marker or click anywhere on the ring to position the CAD anchor point.
      </div>
    </div>
  );
}
