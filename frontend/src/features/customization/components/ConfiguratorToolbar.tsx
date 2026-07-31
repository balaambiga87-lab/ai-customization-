'use client';

import React, { useState } from 'react';
import { useDesignStore } from '../../../stores/useDesignStore';
import { Dialog } from '../../../components/ui/Dialog';
import { Undo2, Redo2, RotateCcw, Save, Sparkles } from 'lucide-react';

export const ConfiguratorToolbar: React.FC = () => {
  const { historyStack, redoStack, undo, redo, resetDesign, activeBlueprintId, estimatedPrice } = useDesignStore();

  const [isSaveDialogOpen, setSaveDialogOpen] = useState(false);
  const [isAiDialogOpen, setAiDialogOpen] = useState(false);

  const canUndo = historyStack.length > 0;
  const canRedo = redoStack.length > 0;

  return (
    <div className="bg-stone-900/80 border-t border-stone-850 px-6 py-3 flex items-center justify-between backdrop-blur-sm">
      {/* History Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={undo}
          disabled={!canUndo}
          title="Undo"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-850 text-stone-500 hover:text-white hover:bg-stone-800 hover:border-stone-750 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          <Undo2 size={14} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          title="Redo"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-850 text-stone-500 hover:text-white hover:bg-stone-800 hover:border-stone-750 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          <Redo2 size={14} />
        </button>
        <div className="w-px h-5 bg-stone-850 mx-1" />
        <button
          onClick={resetDesign}
          disabled={!activeBlueprintId}
          title="Reset Canvas"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-850 text-stone-500 hover:text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          <RotateCcw size={14} />
        </button>

        {/* History counter chip */}
        {canUndo && (
          <span className="text-[8px] font-mono text-stone-600 bg-stone-900 border border-stone-850 px-1.5 py-0.5 rounded ml-1">
            {historyStack.length} steps
          </span>
        )}
      </div>

      {/* Studio Label */}
      <div className="flex flex-col items-center select-none">
        <span className="text-[8px] font-extrabold uppercase tracking-[0.25em] text-stone-600">Caratline</span>
        <span className="text-[7px] font-medium text-stone-700 tracking-widest">Design Studio</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          disabled={!activeBlueprintId}
          onClick={() => activeBlueprintId && setSaveDialogOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-stone-800 text-stone-300 text-[9px] font-extrabold uppercase tracking-wider hover:border-stone-700 hover:bg-stone-800/60 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all"
        >
          <Save size={12} /> Save
        </button>
        <button
          disabled={!activeBlueprintId}
          onClick={() => activeBlueprintId && setAiDialogOpen(true)}
          className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 text-[9px] font-extrabold uppercase tracking-wider disabled:opacity-25 disabled:cursor-not-allowed transition-all shadow-[0_4px_20px_rgba(251,191,36,0.2)] hover:shadow-[0_4px_24px_rgba(251,191,36,0.35)] active:scale-98"
        >
          <Sparkles size={12} className="animate-pulse" /> Generate AI Preview
        </button>
      </div>

      {/* Save Confirmation Dialog */}
      <Dialog isOpen={isSaveDialogOpen} onClose={() => setSaveDialogOpen(false)} title="Design Saved">
        <div className="flex flex-col gap-3 py-2">
          <p className="text-sm text-stone-600">
            Your customized jewellery configuration has been saved successfully to your profile library.
          </p>
          <div className="bg-stone-50 border border-stone-200/60 rounded p-3 text-xs font-mono text-stone-500">
            Design Value: ${estimatedPrice.toFixed(2)}
          </div>
          <button
            onClick={() => setSaveDialogOpen(false)}
            className="mt-2 w-full py-2 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs tracking-wider transition-all"
          >
            Proceed
          </button>
        </div>
      </Dialog>

      {/* AI Preview Dialog */}
      <Dialog isOpen={isAiDialogOpen} onClose={() => setAiDialogOpen(false)} title="Generative AI Render Engine">
        <div className="flex flex-col gap-3 py-2">
          <p className="text-sm text-stone-600">
            This will submit your active customization state to the AI rendering pipeline.
          </p>
          <div className="bg-teal-50/20 border border-teal-100 rounded p-4 text-xs font-serif text-teal-900 leading-normal">
            ✦ Ready to generate a photorealistic catalogue preview based on your configuration.
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setAiDialogOpen(false)}
              className="flex-1 py-2 rounded-lg border border-stone-200 text-stone-600 font-bold text-xs hover:bg-stone-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => setAiDialogOpen(false)}
              className="flex-1 py-2 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs tracking-wider transition-all"
            >
              Confirm Render
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default ConfiguratorToolbar;
