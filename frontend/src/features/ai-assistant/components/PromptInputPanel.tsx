'use client';

import React, { useState } from 'react';
import { useAiPreviewStore, InterpretedDesign } from '../../../stores/useAiPreviewStore';
import { apiClient } from '../../../services/api-client';
import { Button } from '../../../components/ui/Button';
import { Sparkles, MessageSquare, Compass, Send } from 'lucide-react';

const SUGGESTIONS = [
  'I want a minimalist rose gold engagement ring with a pear-shaped diamond and small leaf accents.',
  'A modern platinum ring with a cushion ruby and 4 prong setting.',
  'A gold pendant necklace with a round diamond and solitaire mount.',
];

export const PromptInputPanel: React.FC = () => {
  const {
    currentPrompt,
    setCurrentPrompt,
    isGenerating,
    setGenerating,
    setInterpretedDesign,
    addPreviewToHistory,
  } = useAiPreviewStore();

  const [charLimit] = useState(500);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= charLimit) {
      setCurrentPrompt(e.target.value);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setCurrentPrompt(suggestion);
  };

  const handleGenerate = async () => {
    if (!currentPrompt.trim()) return;

    setGenerating(true);
    try {
      const response = await apiClient.post<any, any>('/ai/generate-preview', {
        prompt: currentPrompt,
      });

      if (response && response.success) {
        addPreviewToHistory({
          id: response.preview.id,
          imageUrl: response.preview.imageUrl,
          isSaved: response.preview.isSaved,
          promptText: response.preview.promptText,
          createdAt: response.preview.createdAt,
        });

        const details = response.data;
        const explanation = response.designSummary || 'Custom AI Design';

        const interpretationPayload: InterpretedDesign = {
          productType: details.productType || 'Ring',
          occasion: details.occasion || 'Engagement',
          style: details.style || 'Custom',
          metal: {
            type: details.metalMaterialName || 'Rose Gold',
            karat: '18K',
          },
          gemstone: {
            type: details.centerStoneName || 'Diamond',
            shape: 'Pear',
            carat: 1.0,
          },
          customText: details.customText,
          estimatedPrice: details.estimatedPrice || 1200,
          confidenceScore: details.confidenceScore || 0.95,
          explanation,
        };

        setInterpretedDesign(interpretationPayload);
      }
    } catch (err: any) {
      alert(`API generation failed: ${err.message || 'Something went wrong.'}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="w-[340px] bg-panel border-r border-card-border p-6 flex flex-col gap-6 overflow-y-auto h-full shrink-0 shadow-panel">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
          <Sparkles size={18} />
        </div>
        <div>
          <h3 className="font-display font-bold text-white text-base">AI Studio Prompt</h3>
          <p className="text-xs text-ink-300">Describe your dream jewellery</p>
        </div>
      </div>

      {/* Prompt Textarea */}
      <div className="space-y-2 flex-grow flex flex-col">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-ink-300 block">
          Design Description
        </span>
        <div className="relative flex-grow flex flex-col">
          <textarea
            value={currentPrompt}
            onChange={handleTextChange}
            disabled={isGenerating}
            placeholder="E.g., An elegant 18K white gold ring with an oval blue sapphire center stone and micro diamond pavé band..."
            rows={7}
            className="w-full h-full p-4 bg-ink-950/80 border border-card-border rounded-2xl text-white placeholder:text-ink-400 text-xs leading-relaxed resize-none focus:outline-none focus:border-gold-500/40 transition-all"
          />
          <div className="text-[9px] font-mono text-ink-400 text-right mt-1">
            {currentPrompt.length}/{charLimit}
          </div>
        </div>

        <Button
          variant="gold"
          size="lg"
          onClick={handleGenerate}
          disabled={isGenerating || !currentPrompt.trim()}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl shadow-gold"
        >
          <Sparkles size={16} className={isGenerating ? 'animate-spin' : 'animate-pulse'} />
          {isGenerating ? 'Synthesizing Design...' : 'Generate AI Preview'}
        </Button>
      </div>

      {/* Suggestion Chips */}
      <div className="space-y-3 pt-4 border-t border-card-border">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-ink-300 flex items-center gap-1.5">
          <Compass size={13} className="text-gold-400" /> Inspiration Prompts
        </span>
        <div className="space-y-2">
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSuggestion(s)}
              disabled={isGenerating}
              className="w-full text-left text-xs leading-snug p-3 luxury-card bg-ink-950/40 hover:border-gold-500/30 text-ink-300 hover:text-white transition-all group"
            >
              <span className="text-gold-400 mr-1 font-bold group-hover:text-gold-300">✦</span> &quot;{s}&quot;
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default PromptInputPanel;
