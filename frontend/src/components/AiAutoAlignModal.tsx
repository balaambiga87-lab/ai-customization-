"use client";

import React from "react";
import { AlignRecommendation } from "@/lib/aiAutoAlignEngine";
import { useLayerStore } from "@/stores/useLayerStore";

interface AiAutoAlignModalProps {
  isOpen: boolean;
  recommendation: AlignRecommendation | null;
  onClose: () => void;
}

export function AiAutoAlignModal({ isOpen, recommendation, onClose }: AiAutoAlignModalProps) {
  const { setLayers } = useLayerStore();

  if (!isOpen || !recommendation) return null;

  const handleApply = () => {
    setLayers(recommendation.alignedLayers);
    onClose();
  };

  return (
    <div className="atelier-app">
      <div className="inspector-modal-overlay" onClick={onClose}>
        <div
          className="inspector-modal-content"
          style={{ maxWidth: "580px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span style={{ fontSize: "24px" }}>✨</span>
            <h2 style={{ margin: 0, fontSize: "22px" }}>AI Auto Align Proposal</h2>
          </div>

          <p className="subtitle" style={{ marginBottom: "16px" }}>
            {recommendation.detectedSummary} Review the suggested geometric alignment below before applying.
          </p>

          {/* Side-by-side or Change Log */}
          <div
            style={{
              background: "rgba(214, 83, 122, 0.05)",
              border: "1px solid rgba(214, 83, 122, 0.18)",
              borderRadius: "14px",
              padding: "16px",
              marginBottom: "20px",
            }}
          >
            <h4 style={{ margin: "0 0 10px", fontSize: "13px", color: "var(--berry)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Suggested Adjustments:
            </h4>
            <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "12px", color: "var(--ink)", lineHeight: 1.6 }}>
              {recommendation.changesDescription.map((desc, idx) => (
                <li key={idx} style={{ marginBottom: "4px" }}>
                  {desc}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ fontSize: "11px", color: "var(--ink-dim)", fontStyle: "italic", marginBottom: "20px" }}>
            💡 Your canvas elements will only be repositioned if you click &quot;Apply Alignment&quot;.
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button
              onClick={onClose}
              style={{
                padding: "10px 18px",
                borderRadius: "12px",
                border: "1px solid var(--line)",
                background: "var(--panel-alt)",
                color: "var(--ink)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              style={{
                padding: "10px 22px",
                borderRadius: "12px",
                border: "none",
                background: "var(--berry)",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(214, 83, 122, 0.25)",
              }}
            >
              ✨ Apply AI Alignment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
