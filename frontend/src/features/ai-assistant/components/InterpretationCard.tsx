'use client';

import React from 'react';
import { useAiPreviewStore } from '../../../stores/useAiPreviewStore';
import { Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { Skeleton } from '../../../components/ui/Skeleton';

export const InterpretationCard: React.FC = () => {
  const { interpretedDesign, isGenerating } = useAiPreviewStore();

  if (isGenerating) {
    return (
      <div className="w-[320px] bg-panel border-l border-card-border p-6 flex flex-col items-center justify-center text-center gap-4 h-full shrink-0 shadow-panel">
        <div className="w-8 h-8 rounded-full border-2 border-gold-500/20 border-t-gold-400 animate-spin" />
        <span className="text-xs font-bold uppercase tracking-wider text-ink-400 animate-pulse">
          Parsing Prompt Context...
        </span>
      </div>
    );
  }

  if (!interpretedDesign) {
    return (
      <div className="w-[320px] bg-panel border-l border-card-border p-6 flex flex-col items-center justify-center text-center gap-3 h-full shrink-0 shadow-panel">
        <span className="text-gold-400 text-3xl font-display">✦</span>
        <h4 className="font-display font-bold text-white text-base">Interpretation Summary</h4>
        <p className="text-xs text-ink-300 leading-relaxed max-w-[200px]">
          Extracted structural metadata (metals, gemstones, setting styles) will appear here after AI synthesis.
        </p>
      </div>
    );
  }

  const confidencePct = Math.round(interpretedDesign.confidenceScore * 100);

  return (
    <div className="w-[320px] bg-panel border-l border-card-border p-6 flex flex-col gap-6 overflow-y-auto h-full shrink-0 shadow-panel">
      {/* 1. Styling Summary */}
      <div className="space-y-2 border-b border-card-border pb-5">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold-400 block">
          AI Styling Summary
        </span>
        <h3 className="font-display text-base font-bold text-white leading-snug">
          {interpretedDesign.explanation}
        </h3>
      </div>

      {/* 2. Extracted Variables */}
      <div className="space-y-3">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-ink-300 flex items-center gap-1.5">
          <Compass size={13} className="text-gold-400" /> Extracted Variables
        </span>
        <div className="luxury-card p-4 space-y-3 glass-gold">
          <div className="flex justify-between items-center text-xs">
            <span className="text-ink-400 uppercase font-semibold text-[9px]">Jewellery Type</span>
            <span className="font-bold text-white">{interpretedDesign.productType}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-ink-400 uppercase font-semibold text-[9px]">Occasion Style</span>
            <span className="font-bold text-white">{interpretedDesign.occasion}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-ink-400 uppercase font-semibold text-[9px]">Base Metal</span>
            <span className="font-bold text-gold-400">
              {interpretedDesign.metal.karat} {interpretedDesign.metal.type}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-ink-400 uppercase font-semibold text-[9px]">Center Stone</span>
            <span className="font-bold text-white">
              {interpretedDesign.gemstone.carat}ct {interpretedDesign.gemstone.shape} {interpretedDesign.gemstone.type}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs border-t border-card-border pt-2">
            <span className="text-ink-400 uppercase font-semibold text-[9px]">Est. Base Valuation</span>
            <span className="font-mono font-bold text-gold-gradient text-sm">
              ${interpretedDesign.estimatedPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Confidence Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-ink-300">
          <span>Confidence Match</span>
          <span className="text-gold-400 font-mono">{confidencePct}%</span>
        </div>
        <div className="w-full bg-ink-950 rounded-full h-1.5 overflow-hidden border border-card-border">
          <div
            className="bg-gold-gradient h-full rounded-full transition-all duration-500"
            style={{ width: `${confidencePct}%` }}
          />
        </div>
      </div>

      {/* 4. Recommendations */}
      <div className="space-y-2.5 border-t border-card-border pt-5">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-white flex items-center gap-1.5">
          <Sparkles size={13} className="text-gold-400" /> Mapping Intelligence
        </span>
        <div className="luxury-card p-4 text-xs text-ink-300 leading-relaxed font-serif glass">
          {interpretedDesign.productType.toLowerCase() === 'ring'
            ? '✦ Solitaire setting automatically mapped to 4-prong head with 18K Rose Gold band.'
            : '✦ Pendant mount mapped to gold chain anchor with center diamond setting.'}
        </div>
      </div>
    </div>
  );
};
export default InterpretationCard;
