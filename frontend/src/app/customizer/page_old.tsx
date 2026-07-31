'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesignStore } from '../../stores/useDesignStore';
import { CategorySelector } from '../../features/customization/components/CategorySelector';
import { CustomizerCanvas } from '../../features/customization/components/CustomizerCanvas';
import { PropertyInspector } from '../../features/customization/components/PropertyInspector';
import { apiClient } from '../../services/api-client';
import { Cloud, CloudOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function CustomizerPage() {
  const {
    activeSavedDesignId, setSavedDesignId,
    activeBlueprintId, selectedMetalId, selectedGemstoneId,
    configuration, estimatedPrice,
    setPriceBreakdown, setPriceStatus, priceStatus,
  } = useDesignStore();

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState('');

  useEffect(() => {
    if (!activeBlueprintId || !selectedMetalId) return;
    setPriceStatus('updating');
    const t = setTimeout(async () => {
      try {
        const res = await apiClient.post<any, any>('/pricing/calculate', {
          blueprintId: activeBlueprintId, selectedMetalId, selectedGemstoneId, configuration, currency: 'INR',
        });
        if (res?.success && res.breakdown) setPriceBreakdown(res.breakdown);
        else setPriceStatus('error');
      } catch { setPriceStatus('error'); }
    }, 400);
    return () => clearTimeout(t);
  }, [configuration, activeBlueprintId, selectedMetalId, selectedGemstoneId, setPriceBreakdown, setPriceStatus]);

  useEffect(() => {
    if (!activeBlueprintId) { setSaveStatus('idle'); return; }
    setSaveStatus('saving');
    const t = setTimeout(async () => {
      try {
        const payload = {
          blueprintId: activeBlueprintId,
          name: `Draft Design - ${activeBlueprintId.substring(0, 5)}`,
          configuration: { selectedMetalId, selectedGemstoneId, components: configuration },
          totalPrice: estimatedPrice,
        };
        if (activeSavedDesignId) {
          await apiClient.put(`/designs/${activeSavedDesignId}`, payload);
        } else {
          const res = await apiClient.post<any, any>('/designs', payload);
          if (res?.success && res.data) setSavedDesignId(res.data.id);
        }
        setSaveStatus('saved');
        setLastSavedTime(new Date().toLocaleTimeString());
      } catch { setSaveStatus('failed'); }
    }, 1000);
    return () => clearTimeout(t);
  }, [configuration, activeBlueprintId, selectedMetalId, selectedGemstoneId, estimatedPrice, activeSavedDesignId, setSavedDesignId]);

  return (
    <div className="flex flex-col h-[calc(100vh-72px)] bg-slate-50 overflow-hidden">
      {/* Slim Status Bar */}
      <div className="h-9 bg-white border-b border-gray-100 flex items-center justify-between px-5 shadow-xs shrink-0">
        <div className="flex items-center gap-2 text-[11px]">
          <AnimatePresence mode="wait">
            {saveStatus === 'saving' && (
              <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-slate-500">
                <Loader2 size={11} className="animate-spin" /> Syncing...
              </motion.span>
            )}
            {saveStatus === 'saved' && (
              <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <CheckCircle2 size={11} /> Saved {lastSavedTime && `· ${lastSavedTime}`}
              </motion.span>
            )}
            {saveStatus === 'failed' && (
              <motion.span key="failed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-red-500 font-semibold">
                <CloudOff size={11} /> Save Failed
              </motion.span>
            )}
            {saveStatus === 'idle' && <span className="text-slate-400">Studio Ready</span>}
          </AnimatePresence>
          {activeBlueprintId && <>
            <span className="text-slate-200">·</span>
            {priceStatus === 'updating' && <span className="text-amber-500 animate-pulse font-medium">Pricing...</span>}
            {priceStatus === 'updated' && <span className="text-emerald-600 font-medium">Price synced</span>}
            {priceStatus === 'error' && <span className="flex items-center gap-1 text-red-500"><AlertCircle size={10} /> Pricing error</span>}
          </>}
        </div>
        {activeSavedDesignId && (
          <span className="font-mono text-[9px] text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
            ID {activeSavedDesignId.slice(0, 8).toUpperCase()}
          </span>
        )}
      </div>

      {/* 3-Column Layout */}
      <div className="flex flex-grow overflow-hidden">
        <CategorySelector />
        <CustomizerCanvas />
        <PropertyInspector />
      </div>
    </div>
  );
}
