'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAiPreviewStore } from '../../../stores/useAiPreviewStore';
import { useDesignStore } from '../../../stores/useDesignStore';
import { apiClient } from '../../../services/api-client';
import { Button } from '../../../components/ui/Button';
import { Sparkles, RefreshCw, CheckCircle, ArrowRight, Layers } from 'lucide-react';
import { Skeleton } from '../../../components/ui/Skeleton';

export const PreviewContainer: React.FC = () => {
  const router = useRouter();
  const {
    activePreview,
    isGenerating,
    setGenerating,
    interpretedDesign,
    addPreviewToHistory,
  } = useAiPreviewStore();

  const [isAccepting, setAccepting] = useState(false);

  const handleRegenerate = async () => {
    if (!activePreview) return;

    setGenerating(true);
    try {
      const promptHistoryId = (activePreview as any).promptHistoryId || activePreview.id;
      const response = await apiClient.post<any, any>('/ai/regenerate-preview', {
        promptHistoryId,
      });

      if (response && response.success) {
        addPreviewToHistory({
          id: response.preview.id,
          imageUrl: response.preview.imageUrl,
          isSaved: response.preview.isSaved,
          promptText: response.preview.promptText,
          createdAt: response.preview.createdAt,
        });
      }
    } catch (err: any) {
      alert(`Regeneration failed: ${err.message || 'Error occurred.'}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleAccept = async () => {
    if (!activePreview || !interpretedDesign) return;

    setAccepting(true);
    try {
      const response = await apiClient.post<any, any>('/ai/accept-preview', {
        previewId: activePreview.id,
      });

      if (response && response.success) {
        const designStore = useDesignStore.getState();
        const isNecklace = interpretedDesign.productType.toLowerCase() === 'necklace';

        if (isNecklace) {
          designStore.setBlueprint('bp-necklace-01', 'Custom Pendant Chain Setting', 350.00);
          designStore.setMetal('mat-yellow-gold', 50.00);
          designStore.setGemstone('gem-diamond', 5200.00);

          designStore.updateComponent(
            'center_pendant_anchor',
            {
              assetId: 'ast-pendant-mount',
              gemstoneId: 'gem-diamond',
              scale: 1.0,
              rotation: 0,
            },
            85.00,
          );
        } else {
          designStore.setBlueprint('bp-ring-01', 'Classic Custom Ring Setting', 450.00);
          designStore.setMetal('mat-rose-gold', 50.00);
          designStore.setGemstone('gem-diamond', 5200.00);

          designStore.updateComponent(
            'center_gem_anchor',
            {
              assetId: 'ast-head-4prong',
              gemstoneId: 'gem-diamond',
              scale: 1.0,
              rotation: 0,
            },
            60.00,
          );
        }

        router.push('/customizer');
      }
    } catch (err: any) {
      alert(`Could not accept preview design setting: ${err.message || 'API error.'}`);
    } finally {
      setAccepting(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="flex-grow bg-ink-950 flex flex-col items-center justify-center p-8 relative">
        <div className="absolute inset-0 dot-grid opacity-[0.06]" />
        <div className="luxury-card p-10 max-w-md text-center glass-gold space-y-6">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-gold-500/20 border-t-gold-400 animate-spin" />
            <div className="absolute inset-2 rounded-full border-2 border-rose-gold-400/20 border-b-rose-gold-400 animate-spin [animation-direction:reverse]" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-xl font-bold text-white">Synthesizing Visual Render</h3>
            <p className="text-xs text-ink-300 leading-relaxed">
              Our generative AI pipeline is rendering a high-resolution photorealistic jewellery visualization based on your specification.
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <Skeleton className="h-40 w-full" rounded="card" />
          </div>
        </div>
      </div>
    );
  }

  if (!activePreview) {
    return (
      <div className="flex-grow bg-ink-950 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-[0.06]" />
        <div className="absolute inset-0 bg-glow-radial" />
        <div className="relative max-w-sm luxury-card p-10 glass-gold flex flex-col items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-card border border-card-border flex items-center justify-center text-gold-400 shadow-gold">
            <Sparkles size={24} />
          </div>
          <h3 className="font-display text-2xl font-bold text-white">AI Viewport Canvas</h3>
          <p className="text-xs text-ink-300 leading-relaxed">
            Enter a prompt or select an inspiration template on the left to initialize generative synthesis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-ink-950 p-6 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-[0.06]" />
      <div className="absolute inset-0 bg-glow-radial" />

      {/* Render Display Card */}
      <div className="relative flex-grow flex items-center justify-center p-4">
        <div className="luxury-card p-6 glass-gold border-gold-500/20 max-w-lg w-full flex flex-col items-center gap-4 shadow-panel">
          <div className="relative w-full aspect-square max-h-[380px] rounded-2xl overflow-hidden bg-ink-900 border border-card-border flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activePreview.imageUrl}
              alt={activePreview.promptText}
              className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-105"
            />
          </div>
          <p className="text-xs text-ink-300 font-serif italic text-center px-4 leading-relaxed">
            &quot;{activePreview.promptText}&quot;
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 flex items-center justify-center gap-4 py-2">
        <Button
          variant="outline"
          size="md"
          onClick={handleRegenerate}
          disabled={isAccepting}
          className="flex items-center gap-2 rounded-xl"
        >
          <RefreshCw size={15} /> Regenerate
        </Button>
        <Button
          variant="gold"
          size="md"
          onClick={handleAccept}
          disabled={isAccepting}
          className="flex items-center gap-2 rounded-xl shadow-gold"
        >
          <CheckCircle size={15} />
          {isAccepting ? 'Accepting...' : 'Customize in Studio'}
          <ArrowRight size={15} />
        </Button>
      </div>
    </div>
  );
};
export default PreviewContainer;
