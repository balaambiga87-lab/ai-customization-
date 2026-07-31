'use client';

import React, { useState, useEffect } from 'react';
import { useDesignStore } from '../../../stores/useDesignStore';
import { getAiReview, improveDesign, AiReviewResponse } from '../ai-advisor.api';
import { Sparkles, Brain, Check, RefreshCw, X, Info, ChevronRight, CheckCircle2, Award, Zap, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface AdvisorPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvisorPanel: React.FC<AdvisorPanelProps> = ({ isOpen, onClose }) => {
  const {
    activeBlueprintId,
    selectedMetalId,
    selectedGemstoneId,
    configuration,
    estimatedPrice,
    updateComponent,
  } = useDesignStore();

  const [isLoading, setLoading] = useState(false);
  const [review, setReview] = useState<AiReviewResponse | null>(null);
  const [ignoredSuggestions, setIgnoredSuggestions] = useState<string[]>([]);
  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([]);
  const [animateProgress, setAnimateProgress] = useState(false);

  // Trigger score radial animation when review details load
  useEffect(() => {
    if (review) {
      setAnimateProgress(false);
      const timer = setTimeout(() => setAnimateProgress(true), 100);
      return () => clearTimeout(timer);
    }
  }, [review]);

  if (!isOpen) return null;

  const handleAudit = async () => {
    if (!activeBlueprintId) return;
    setLoading(true);
    setIgnoredSuggestions([]);
    setAppliedSuggestions([]);
    try {
      const data = await getAiReview({
        blueprintId: activeBlueprintId,
        selectedMetalId,
        selectedGemstoneId,
        configuration,
        estimatedPrice,
      });
      setReview(data);
    } catch (err: any) {
      alert(`AI Design Audit failed: ${err.message || 'Something went wrong.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySuggestion = (sug: any) => {
    try {
      if (sug.target === 'metal') {
        useDesignStore.setState({ selectedMetalId: sug.replacementValue });
      } else if (sug.target === 'gemstone') {
        useDesignStore.setState({ selectedGemstoneId: sug.replacementValue });
      } else {
        // Component configuration anchors
        try {
          const parsed = JSON.parse(sug.replacementValue);
          updateComponent(sug.target, parsed, 0, false);
        } catch {
          updateComponent(sug.target, { assetId: sug.replacementValue }, 0, false);
        }
      }
      setAppliedSuggestions((prev) => [...prev, sug.title]);
    } catch (err) {
      console.error('Error applying suggestion:', err);
    }
  };

  const handleImproveDesign = async () => {
    if (!activeBlueprintId || !review) return;
    setLoading(true);
    try {
      const activeSuggestions = review.suggestions.filter(
        (s) => !ignoredSuggestions.includes(s.title) && !appliedSuggestions.includes(s.title)
      );

      const res = await improveDesign({
        blueprintId: activeBlueprintId,
        selectedMetalId,
        selectedGemstoneId,
        configuration,
        estimatedPrice,
        suggestions: activeSuggestions,
      });

      if (res && res.success && res.data) {
        useDesignStore.setState({
          selectedMetalId: res.data.selectedMetalId,
          selectedGemstoneId: res.data.selectedGemstoneId,
          configuration: res.data.components,
        });
        setReview(null);
        alert('AI design optimization applied successfully!');
      }
    } catch (err: any) {
      alert(`AI Design optimization failed: ${err.message || 'Error occurred.'}`);
    } finally {
      setLoading(false);
    }
  };

  // Radial progress calculations
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const targetScore = review ? review.score : 0;
  const strokeDashoffset = animateProgress
    ? circumference - (targetScore / 100) * circumference
    : circumference;

  const getScoreVerdict = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-emerald-500 bg-emerald-950/20 border-emerald-800/30' };
    if (score >= 75) return { label: 'Good Harmony', color: 'text-teal-400 bg-teal-950/20 border-teal-800/30' };
    if (score >= 50) return { label: 'Fair Setting', color: 'text-amber-400 bg-amber-950/20 border-amber-800/30' };
    return { label: 'Aesthetic Mismatch', color: 'text-rose-400 bg-rose-950/20 border-rose-800/30' };
  };

  return (
    <div className="w-[410px] bg-stone-950 border-l border-stone-850 flex flex-col h-full shadow-[0_0_50px_rgba(0,0,0,0.8)] relative z-30 transition-all duration-300 text-stone-100">
      
      {/* Luxury Metallic Dark Header */}
      <div className="p-5 border-b border-stone-850 flex items-center justify-between bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Brain size={18} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-playfair font-bold text-white text-base tracking-wide flex items-center gap-1.5">
              Caratline Advisor <span className="text-[9px] font-sans font-extrabold uppercase bg-amber-400 text-stone-950 px-1.5 py-0.5 rounded-sm">AI</span>
            </h3>
            <p className="text-[9px] text-stone-400 font-semibold tracking-widest uppercase">Luxury Jewellery Evaluator</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 text-stone-500 hover:text-white hover:bg-stone-800/60 rounded-full transition-all">
          <X size={16} />
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="flex-grow overflow-y-auto p-5 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent">
        
        {!review && !isLoading && (
          <div className="flex-grow flex flex-col items-center justify-center text-center py-16 px-6 bg-stone-900/30 border border-dashed border-stone-800 rounded-2xl relative overflow-hidden group">
            <div className="absolute -inset-px bg-gradient-to-br from-amber-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
            <div className="w-14 h-14 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400 mb-4 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
              <Sparkles size={24} className="animate-pulse" />
            </div>
            <h4 className="font-playfair font-semibold text-white text-base">Aesthetic Audit Ready</h4>
            <p className="text-xxs text-stone-400 max-w-xs mt-2 leading-relaxed">
              Unlock professional style harmony, metal-stone color coordinates, symmetry ratings, and luxury appeal metrics.
            </p>
            <button
              onClick={handleAudit}
              className="mt-8 px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xxs tracking-widest uppercase transition-all shadow-[0_4px_20px_rgba(245,158,11,0.25)] hover:shadow-[0_6px_24px_rgba(245,158,11,0.4)] active:scale-98"
            >
              ✦ AUDIT DESIGN
            </button>
          </div>
        )}

        {isLoading && (
          <div className="flex-grow flex flex-col items-center justify-center text-center py-16">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/10 border-t-amber-400 animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-teal-500/10 border-b-teal-400 animate-spin [animation-direction:reverse]" />
            </div>
            <h4 className="font-playfair font-semibold text-white text-sm">Evaluating Jewellery Setting</h4>
            <p className="text-xxs text-stone-400 max-w-xs mt-2 leading-relaxed">
              Analyzing light-reflection properties, mounting symmetry, gold karat balance, and catalogue rules...
            </p>
          </div>
        )}

        {review && !isLoading && (
          <>
            {/* Score & Summary Card */}
            <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-850 rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden shadow-lg">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-stone-850/50 pb-4">
                <div className="flex flex-col gap-1 max-w-[65%]">
                  <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                    <Award size={10} /> Certified Evaluation
                  </span>
                  <h4 className="font-playfair text-sm font-bold text-white leading-snug">{review.designSummary}</h4>
                </div>
                
                {/* Stunning Radial Score */}
                <div className="relative w-20 h-20 flex items-center justify-center select-none">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      className="stroke-stone-800"
                      strokeWidth="4"
                      fill="transparent"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      className="stroke-amber-400 transition-all duration-1000 ease-out shadow-md"
                      strokeWidth="4.5"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-white font-serif tracking-tighter leading-none">{review.score}</span>
                    <span className="text-[6.5px] text-stone-400 font-extrabold uppercase tracking-widest mt-0.5">SCORE</span>
                  </div>
                </div>
              </div>

              {/* Score Verdict Badge */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-stone-400 font-medium">AI Harmony Status</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getScoreVerdict(review.score).color}`}>
                  {getScoreVerdict(review.score).label}
                </span>
              </div>

              {/* Progress Ratings Grid */}
              <div className="grid grid-cols-2 gap-3 mt-2 border-t border-stone-850/50 pt-4">
                {Object.entries(review.ratings).map(([key, val]) => (
                  <div key={key} className="flex flex-col gap-1.5 bg-stone-900/40 border border-stone-850 p-2.5 rounded-xl">
                    <span className="text-[9px] text-stone-400 font-semibold tracking-wide capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex-grow bg-stone-800 rounded-full h-1 relative overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            val >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : val >= 50 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-rose-500 to-rose-400'
                          }`}
                          style={{ width: animateProgress ? `${val}%` : '0%' }}
                        />
                      </div>
                      <span className="text-[9px] font-bold text-white font-mono">{val}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions Section */}
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                <Info size={12} className="text-amber-400" /> Recommendation Feed
              </h4>

              {review.suggestions.length === 0 ? (
                <div className="p-5 text-center border border-emerald-800/30 bg-emerald-950/20 text-emerald-300 rounded-2xl text-xxs font-medium flex flex-col items-center justify-center gap-2 shadow-inner">
                  <ShieldCheck size={28} className="text-emerald-400 mb-1" />
                  <span>Your setting details are in absolute harmony. No suggestions needed!</span>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {review.suggestions.map((sug) => {
                    const isIgnored = ignoredSuggestions.includes(sug.title);
                    const isApplied = appliedSuggestions.includes(sug.title);

                    if (isIgnored) return null;

                    return (
                      <div
                        key={sug.title}
                        className={`border rounded-2xl p-4 flex flex-col gap-3.5 transition-all duration-300 relative overflow-hidden ${
                          isApplied
                            ? 'bg-emerald-950/10 border-emerald-900/50 opacity-60'
                            : 'bg-gradient-to-b from-stone-900 to-stone-950 border-stone-850 hover:border-stone-800 shadow-md'
                        }`}
                      >
                        {/* Glow indicator */}
                        <div className={`absolute top-0 left-0 w-1 h-full ${
                          sug.type === 'luxury' ? 'bg-amber-400' : 'bg-teal-500'
                        }`} />

                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-stone-800 text-stone-200 border border-stone-750">
                                {sug.type}
                              </span>
                              {sug.priceImpact !== 0 && (
                                <span className={`text-[9px] font-bold ${sug.priceImpact > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                  {sug.priceImpact > 0 ? `+$${sug.priceImpact}` : `-$${Math.abs(sug.priceImpact)}`}
                                </span>
                              )}
                            </div>
                            <h5 className="font-playfair font-bold text-white text-xs mt-1 leading-snug">{sug.title}</h5>
                            <p className="text-[10px] text-stone-400 leading-relaxed mt-0.5">{sug.description}</p>
                          </div>
                        </div>

                        {!isApplied && (
                          <div className="flex items-center justify-end gap-2 border-t border-stone-850/60 pt-3">
                            <button
                              onClick={() => setIgnoredSuggestions((prev) => [...prev, sug.title])}
                              className="text-[9px] font-bold tracking-wider text-stone-400 hover:text-white px-3 py-1 rounded transition-colors uppercase"
                            >
                              Ignore
                            </button>
                            <button
                              onClick={() => handleApplySuggestion(sug)}
                              className="text-[9px] font-bold tracking-widest text-stone-950 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 px-4 py-1.5 rounded-md transition-all uppercase flex items-center gap-1 shadow-sm shadow-teal-500/10 hover:shadow-teal-500/20 active:scale-97"
                            >
                              <Check size={11} strokeWidth={3} /> Apply
                            </button>
                          </div>
                        )}

                        {isApplied && (
                          <div className="text-[9px] font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
                            <CheckCircle2 size={12} /> Applied to Design
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Actions Panel */}
            <div className="flex flex-col gap-2.5 mt-4 border-t border-stone-850 pt-5">
              <button
                onClick={handleImproveDesign}
                disabled={review.suggestions.filter(s => !ignoredSuggestions.includes(s.title) && !appliedSuggestions.includes(s.title)).length === 0}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 disabled:from-stone-800 disabled:to-stone-850 text-stone-950 disabled:text-stone-500 font-bold text-xxs tracking-widest uppercase transition-all shadow-[0_4px_20px_rgba(245,158,11,0.15)] disabled:shadow-none flex items-center justify-center gap-1.5 active:scale-98"
              >
                <Sparkles size={13} /> Optimize Complete Design
              </button>
              <button
                onClick={handleAudit}
                className="w-full py-2.5 rounded-lg border border-stone-850 hover:bg-stone-900 text-stone-300 font-bold text-xxs tracking-widest uppercase transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={12} /> Refresh Design Audit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default AdvisorPanel;
