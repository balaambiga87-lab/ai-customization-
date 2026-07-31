"use client";

import React from "react";
import { ConfigState, Metal, LayerObject } from "@/lib/types";
import { renderPartIcon } from "@/lib/partsLibrary";
import { CadSetting } from "./CadSetting";
import { IndianPricingBreakdown, formatINR } from "@/lib/indianPricingEngine";

interface LuxuryPreviewModalProps {
  config: ConfigState;
  metal: Metal;
  layers: LayerObject[];
  indianPricing: IndianPricingBreakdown;
  onClose: () => void;
}

export function LuxuryPreviewModal({
  config,
  metal,
  layers,
  indianPricing,
  onClose,
}: LuxuryPreviewModalProps) {
  const metalName = {
    rose_gold: "18K Rose Gold",
    gold: "18K Yellow Gold",
    silver: "925 Sterling Silver",
    platinum: "950 Platinum",
  }[metal];

  function handleAddToCart() {
    alert("🛒 Finalized Design added to cart successfully!");
    onClose();
  }

  function handleDownloadRender() {
    alert("📥 Downloading high-resolution 4K studio CAD render...");
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(18, 10, 14, 0.8)",
        backdropFilter: "blur(14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #ffffff, #fff7f9)",
          border: "1px solid rgba(214, 83, 122, 0.25)",
          borderRadius: "28px",
          width: "100%",
          maxWidth: "920px",
          maxHeight: "92vh",
          overflowY: "auto",
          padding: "32px",
          boxShadow: "0 25px 60px rgba(74, 39, 51, 0.4)",
          position: "relative",
        }}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            background: "rgba(112, 26, 52, 0.1)",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            color: "#701a34",
            cursor: "pointer",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
        >
          ✕
        </button>

        {/* HEADER */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#10b981",
            }}
          >
            <span>✅ CONFIRMED FINALISED DESIGN</span>
            <span style={{ color: "#d6537a" }}>· TIFFANY & CO. STUDIO STANDARD</span>
          </div>
          <h2 style={{ fontFamily: "serif", fontStyle: "italic", fontSize: "28px", color: "#701a34", margin: "4px 0 0" }}>
            Finalized Jewellery Studio Luxury Render
          </h2>
          <p style={{ fontSize: "12px", color: "rgba(74, 39, 51, 0.65)", margin: "4px 0 0" }}>
            Your confirmed component assembly rendered with studio softbox key lighting, metallic specular reflections, and diamond fire dispersion.
          </p>
        </div>

        {/* MAIN DISPLAY GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "28px", alignItems: "center" }}>
          
          {/* FINALIZED DESIGN PHOTO CONTAINER */}
          <div
            style={{
              background: "radial-gradient(circle at 50% 40%, #ffffff, #fbe8ee)",
              border: "1px solid rgba(214, 83, 122, 0.2)",
              borderRadius: "24px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "420px",
              position: "relative",
              boxShadow: "inset 0 2px 10px rgba(0,0,0,0.02), 0 16px 40px rgba(112, 26, 52, 0.12)",
            }}
          >
            {/* FINALIZED WATERMARK BADGE */}
            <div
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(8px)",
                border: "1px solid #10b981",
                padding: "4px 12px",
                borderRadius: "999px",
                fontSize: "10px",
                fontWeight: 800,
                color: "#047857",
              }}
            >
              ✅ Finalized Design Photo
            </div>

            {/* HIGH-RES FINALIZED DESIGN ASSEMBLY RENDER */}
            <div style={{ position: "relative", width: "320px", height: "320px" }}>
              {layers
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((layer) => (
                  <div
                    key={layer.id}
                    style={{
                      position: "absolute",
                      left: `${layer.x}%`,
                      top: `${layer.y}%`,
                      zIndex: layer.zIndex,
                      transform: `translate(-50%, -50%) rotate(${layer.rotation}deg) scale(${layer.scale})`,
                      pointerEvents: "none",
                      filter:
                        layer.type === "stone"
                          ? "brightness(1.18) contrast(1.25) drop-shadow(0 0 20px rgba(255,255,255,0.95))"
                          : "drop-shadow(0 12px 28px rgba(112, 26, 52, 0.22))",
                    }}
                  >
                    {layer.type === "setting" ? (
                      <CadSetting settingKey={layer.key as any} metal={metal} layer="front" size={120} />
                    ) : (
                      renderPartIcon(layer.type as any, layer.key, layer.type === "band" ? 420 : 100, metal, "three_quarter")
                    )}
                  </div>
                ))}
            </div>

            <div style={{ fontSize: "11px", color: "rgba(74, 39, 51, 0.6)", marginTop: "14px", fontWeight: 600 }}>
              📷 35mm Macro Lens · f/8 Studio Aperture · Softbox Lighting
            </div>
          </div>

          {/* DOCKET SPECIFICATIONS & PRICE BREAKDOWN */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            {/* SPECIFICATIONS */}
            <div style={{ background: "#ffffff", border: "1px solid rgba(112, 26, 52, 0.15)", borderRadius: "18px", padding: "18px" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "#701a34", marginBottom: "10px" }}>
                💎 Confirmed CAD Specifications
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(74, 39, 51, 0.6)" }}>Precious Metal</span>
                  <strong style={{ color: "#701a34" }}>{metalName}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(74, 39, 51, 0.6)" }}>Components Count</span>
                  <strong style={{ color: "#701a34" }}>{layers.length} Layers</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(74, 39, 51, 0.6)" }}>Gold Weight</span>
                  <strong style={{ fontFamily: "monospace", color: "#701a34" }}>{indianPricing.goldWeightGrams} g</strong>
                </div>
              </div>
            </div>

            {/* INDIAN PRICING DOCKET (₹ INR) */}
            <div style={{ background: "#fff7f9", border: "1px solid rgba(112, 26, 52, 0.15)", borderRadius: "18px", padding: "18px" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "#701a34", marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                <span>FINAL PRICE DOCKET (₹ INR)</span>
                <span style={{ fontSize: "9px", background: "#701a34", color: "#fff", padding: "2px 6px", borderRadius: "4px" }}>3% GST INCL</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "#4a2733" }}>
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
                <div style={{ borderTop: "1.5px dashed rgba(112, 26, 52, 0.2)", paddingTop: "8px", marginTop: "4px", display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: 800, color: "#701a34" }}>
                  <span>Final Total</span>
                  <span style={{ fontFamily: "serif", fontSize: "18px" }}>{formatINR(indianPricing.total)}</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={handleAddToCart}
                style={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "14px",
                  padding: "14px",
                  fontSize: "13px",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(16, 185, 129, 0.3)",
                }}
              >
                🛒 Add Finalized Design to Cart ({formatINR(indianPricing.total)})
              </button>

              <button
                onClick={handleDownloadRender}
                style={{
                  background: "#ffffff",
                  color: "#701a34",
                  border: "1px solid rgba(112, 26, 52, 0.2)",
                  borderRadius: "14px",
                  padding: "12px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                📥 Download High-Res CAD Render (PNG)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
