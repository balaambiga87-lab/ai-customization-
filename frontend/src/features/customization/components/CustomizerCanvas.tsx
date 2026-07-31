'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCanvasStore } from '../../../stores/useCanvasStore';
import { useDesignStore } from '../../../stores/useDesignStore';
import { useBlueprints, useBlueprintAnchors } from '../../../hooks/useCustomizerQueries';
import { MOCK_MATERIALS } from '../mocks/customizer.mocks';
import { AssetLayer } from './AssetLayer';
import {
  ZoomIn, ZoomOut, RotateCcw, Undo2, Redo2, Save,
  Grid3X3, Download, RotateCw, Move, Maximize2
} from 'lucide-react';

const ToolButton: React.FC<{
  icon: React.ReactNode; label: string; active?: boolean;
  onClick?: () => void; disabled?: boolean; variant?: 'default' | 'save'
}> = ({ icon, label, active = false, onClick, disabled, variant = 'default' }) => (
  <button onClick={onClick} disabled={disabled} title={label} aria-label={label}
    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium ${
      variant === 'save'
        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm hover:shadow-indigo hover:-translate-y-0.5'
        : active
          ? 'bg-indigo-100 text-indigo-700 shadow-sm'
          : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 shadow-xs border border-gray-200 hover:border-gray-300'
    }`}>
    {icon}
  </button>
);

export const CustomizerCanvas: React.FC = () => {
  const { activeAnchorName, setActiveAnchor, cameraZoom, setCameraZoom } = useCanvasStore();
  const { activeBlueprintId, selectedMetalId, historyStack, redoStack, undo, redo, estimatedPrice } = useDesignStore();
  const { data: blueprints, isLoading: isLoadingBP } = useBlueprints();
  const { data: anchors, isLoading: isLoadingAnchors } = useBlueprintAnchors(activeBlueprintId);

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);

  const blueprint = blueprints?.find((b) => b.id === activeBlueprintId);
  const metal = MOCK_MATERIALS.find((m) => m.id === selectedMetalId);
  const metalColor = metal?.colorHex ?? '#94a3b8';

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'canvas-bg') {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
  };
  const handleMouseUp = () => setIsPanning(false);
  const resetViewport = () => { setPan({ x: 0, y: 0 }); setCameraZoom(1.0); setActiveAnchor(null); };

  const isLoading = isLoadingBP || isLoadingAnchors;

  return (
    <div className="flex-grow flex flex-col bg-slate-50 relative overflow-hidden">
      {/* Floating Pill Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 glass-light rounded-full px-3 py-2 shadow-md border border-gray-200/80">
        <ToolButton icon={<Undo2 size={14} />} label="Undo" onClick={undo} disabled={historyStack.length === 0} />
        <ToolButton icon={<Redo2 size={14} />} label="Redo" onClick={redo} disabled={redoStack.length === 0} />
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolButton icon={<ZoomIn size={14} />} label="Zoom In" onClick={() => setCameraZoom(Math.min(3, cameraZoom + 0.2))} />
        <ToolButton icon={<ZoomOut size={14} />} label="Zoom Out" onClick={() => setCameraZoom(Math.max(0.5, cameraZoom - 0.2))} />
        <ToolButton icon={<RotateCcw size={14} />} label="Reset View" onClick={resetViewport} />
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolButton icon={<Grid3X3 size={14} />} label="Toggle Grid" active={showGrid} onClick={() => setShowGrid(!showGrid)} />
        <ToolButton icon={<Move size={14} />} label="Pan Mode" />
        <ToolButton icon={<RotateCw size={14} />} label="Rotate 90°" />
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolButton icon={<Download size={14} />} label="Export" />
        <ToolButton icon={<Save size={14} />} label="Save Design" disabled={!activeBlueprintId} variant="save" />
      </div>

      {/* Canvas Body */}
      <div className="flex-grow relative flex items-center justify-center overflow-hidden">
        {showGrid && (
          <div className="absolute inset-0 dot-grid-light opacity-100" />
        )}

        {isLoading ? (
          <div className="flex flex-col items-center gap-5 z-10">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-purple-200 border-b-purple-600 animate-spin [animation-direction:reverse]" />
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading Studio...</p>
          </div>
        ) : !blueprint ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-xl p-12 max-w-sm text-center flex flex-col items-center gap-5 z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Maximize2 size={28} className="text-white" />
            </div>
            <h3 className="font-display text-2xl font-bold text-gray-900">Design Studio</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Select a base blueprint from the left sidebar to initialize the jewellery workspace.
            </p>
            <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              Choose Blueprint to Begin
            </div>
          </motion.div>
        ) : (
          <div className="w-full h-full relative">
            <svg
              className="w-full h-full cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              viewBox="0 0 200 200"
            >
              <rect id="canvas-bg" width="100%" height="100%" fill="none" />
              <g transform={`translate(${100 + pan.x}, ${100 + pan.y}) scale(${cameraZoom}) translate(-100, -100)`}>
                {/* Blueprint Path */}
                <path
                  d={(blueprint.metadata as any)?.svgPath || 'M 100,100 m -50,0 a 50,50 0 1,0 100,0 a 50,50 0 1,0 -100,0'}
                  fill="none"
                  stroke={metalColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="transition-colors duration-500"
                  style={{ filter: `drop-shadow(0 0 4px ${metalColor}66)` }}
                />
                <AssetLayer blueprint={blueprint as any} />

                {/* Anchor Nodes */}
                {anchors?.map((anchor) => {
                  const isSelected = activeAnchorName === anchor.name;
                  return (
                    <g key={anchor.id} transform={`translate(${anchor.positionX}, ${anchor.positionY})`}
                      onClick={() => setActiveAnchor(anchor.name)} className="cursor-pointer">
                      <circle r="10"
                        fill={isSelected ? 'rgba(79,70,229,0.1)' : 'rgba(79,70,229,0.04)'}
                        stroke={isSelected ? '#4F46E5' : '#4F46E560'}
                        strokeWidth={isSelected ? '1.5' : '1'}
                        strokeDasharray={isSelected ? 'none' : '3 2'}
                        style={{ filter: isSelected ? 'drop-shadow(0 0 4px rgba(79,70,229,0.5))' : 'none' }}
                      />
                      <circle r="4"
                        fill={isSelected ? '#4F46E5' : '#7C3AED88'}
                        style={{ filter: isSelected ? 'drop-shadow(0 0 4px rgba(79,70,229,0.8))' : 'none' }}
                      />
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        )}
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="glass-light rounded-full px-3 py-1.5 text-[9px] font-mono text-slate-500 border border-gray-200 shadow-sm">
          {cameraZoom.toFixed(1)}× · ({Math.round(pan.x)}, {Math.round(pan.y)})
        </div>
        {blueprint && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-light rounded-full px-4 py-2 border border-indigo-200 shadow-sm flex items-center gap-2">
            <span className="text-[9px] text-slate-500 font-semibold">Estimated</span>
            <span className="font-display font-bold text-gradient-primary text-sm">${estimatedPrice.toLocaleString()}</span>
          </motion.div>
        )}
        {activeAnchorName && (
          <div className="glass-light rounded-full px-3 py-1.5 text-[9px] font-mono text-indigo-600 border border-indigo-200 shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            {activeAnchorName}
          </div>
        )}
      </div>
    </div>
  );
};
export default CustomizerCanvas;
