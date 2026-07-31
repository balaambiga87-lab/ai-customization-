'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCanvasStore } from '../../../stores/useCanvasStore';
import { useDesignStore } from '../../../stores/useDesignStore';
import { MOCK_MATERIALS, MOCK_GEMSTONES } from '../mocks/customizer.mocks';
import { Tabs, TabList, Tab, TabPanel } from '../../../components/ui/Tabs';
import {
  Sliders, Layers, Gem, DollarSign, History,
  RotateCw, ZoomIn, Lock, Check, ShieldCheck, Sparkles
} from 'lucide-react';

export const PropertyInspector: React.FC = () => {
  const { activeAnchorName } = useCanvasStore();
  const {
    configuration, updateComponent,
    selectedMetalId, selectedGemstoneId,
    setMetal, setGemstone,
    estimatedPrice, priceBreakdown,
  } = useDesignStore();

  const activeAnchorConfig = activeAnchorName ? configuration[activeAnchorName] : null;

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeAnchorName) return;
    updateComponent(activeAnchorName, { scale: parseFloat(e.target.value) }, 0, true);
  };
  const handleScaleRelease = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    if (!activeAnchorName) return;
    updateComponent(activeAnchorName, { scale: parseFloat((e.target as HTMLInputElement).value) }, 0, false);
  };
  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeAnchorName) return;
    updateComponent(activeAnchorName, { rotation: parseInt(e.target.value, 10) }, 0, true);
  };
  const handleRotationRelease = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    if (!activeAnchorName) return;
    updateComponent(activeAnchorName, { rotation: parseInt((e.target as HTMLInputElement).value, 10) }, 0, false);
  };
  const handleAnchorGemstoneChange = (gemId: string) => {
    if (!activeAnchorName) return;
    const oldGemId = configuration[activeAnchorName]?.gemstoneId;
    const oldPrice = oldGemId ? MOCK_GEMSTONES.find((g) => g.id === oldGemId)?.price || 0 : 0;
    const newPrice = MOCK_GEMSTONES.find((g) => g.id === gemId)?.price || 0;
    updateComponent(activeAnchorName, { gemstoneId: gemId }, newPrice - oldPrice);
  };

  const aiCategories = [
    { name: 'Luxury Appeal', score: 92 },
    { name: 'Color Harmony', score: 85 },
    { name: 'Symmetry', score: 95 },
    { name: 'Manufacturing', score: 78 },
    { name: 'Budget Fit', score: 90 },
  ];

  return (
    <div className="w-[320px] bg-white flex flex-col h-full border-l border-gray-100 shadow-sm shrink-0 overflow-hidden">
      <Tabs defaultTab="properties" className="flex flex-col h-full">
        {/* Tab Header */}
        <div className="p-3 border-b border-gray-100">
          <TabList className="grid grid-cols-6">
            <Tab id="properties" icon={<Sliders size={12} />} />
            <Tab id="materials" icon={<Layers size={12} />} />
            <Tab id="gemstones" icon={<Gem size={12} />} />
            <Tab id="pricing" icon={<DollarSign size={12} />} />
            <Tab id="advisor" icon={<Sparkles size={12} />} />
            <Tab id="history" icon={<History size={12} />} />
          </TabList>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4">

          {/* PROPERTIES TAB */}
          <TabPanel id="properties" className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Transform Controls</span>
              {activeAnchorName && (
                <span className="text-[9px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">{activeAnchorName}</span>
              )}
            </div>
            {activeAnchorName ? (
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-3 flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-sm">
                    <Lock size={11} className="text-white" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">{activeAnchorName} Slot</div>
                    <div className="text-[9px] text-slate-400">Scale & Rotation Controls</div>
                  </div>
                </div>

                {/* Scale */}
                <div className="bg-white border border-gray-100 shadow-xs rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-semibold flex items-center gap-1.5"><ZoomIn size={12} className="text-indigo-600" /> Scale</span>
                    <span className="text-indigo-600 font-mono font-bold">{activeAnchorConfig?.scale?.toFixed(1) || '1.0'}x</span>
                  </div>
                  <input type="range" min="0.5" max="2.0" step="0.1"
                    value={activeAnchorConfig?.scale || 1.0}
                    onChange={handleScaleChange} onMouseUp={handleScaleRelease} onTouchEnd={handleScaleRelease}
                    className="w-full accent-indigo-600" />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono"><span>0.5×</span><span>1.0×</span><span>2.0×</span></div>
                </div>

                {/* Rotation */}
                <div className="bg-white border border-gray-100 shadow-xs rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-semibold flex items-center gap-1.5"><RotateCw size={12} className="text-purple-600" /> Rotation</span>
                    <span className="text-purple-600 font-mono font-bold">{activeAnchorConfig?.rotation || 0}°</span>
                  </div>
                  <input type="range" min="-180" max="180" step="5"
                    value={activeAnchorConfig?.rotation || 0}
                    onChange={handleRotationChange} onMouseUp={handleRotationRelease} onTouchEnd={handleRotationRelease}
                    className="w-full accent-purple-600" />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono"><span>-180°</span><span>0°</span><span>180°</span></div>
                </div>

                {activeAnchorName.includes('gem') && (
                  <div className="bg-white border border-gray-100 shadow-xs rounded-2xl p-4 space-y-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Slot Gemstone</span>
                    <div className="grid grid-cols-2 gap-2">
                      {MOCK_GEMSTONES.map((g) => {
                        const isSelected = activeAnchorConfig?.gemstoneId === g.id;
                        return (
                          <button key={g.id} onClick={() => handleAnchorGemstoneChange(g.id)}
                            className={`p-2 rounded-xl text-left border transition-all text-xs ${
                              isSelected ? 'border-indigo-200 bg-indigo-50 shadow-sm' : 'border-gray-100 hover:border-gray-200'
                            }`}>
                            <div className="truncate font-semibold text-gray-900">{g.shape} {g.type}</div>
                            <div className="text-[9px] text-slate-400 font-mono mt-0.5">${g.price}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 border border-gray-100 rounded-2xl p-8 text-center space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400"><Sliders size={18} /></div>
                <p className="text-xs text-slate-400 leading-relaxed">Click any anchor hotspot on the canvas to adjust its properties.</p>
              </div>
            )}
          </TabPanel>

          {/* MATERIALS TAB */}
          <TabPanel id="materials" className="space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">Metal Material</span>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_MATERIALS.map((m) => {
                const isSelected = selectedMetalId === m.id;
                return (
                  <button key={m.id} onClick={() => setMetal(m.id, isSelected ? 0 : 50.0)}
                    className={`rounded-2xl p-3 flex items-center gap-3 transition-all text-left border ${
                      isSelected ? 'border-indigo-200 bg-indigo-50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-xs'
                    }`}>
                    <span className="w-8 h-8 rounded-full border border-white shadow-sm shrink-0 transition-transform hover:scale-110"
                      style={{ backgroundColor: m.colorHex }} />
                    <div className="min-w-0">
                      <div className={`text-xs font-bold truncate ${isSelected ? 'text-indigo-700' : 'text-gray-900'}`}>{m.name}</div>
                      <div className="text-[9px] text-slate-400 font-mono mt-0.5">18K</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </TabPanel>

          {/* GEMSTONES TAB */}
          <TabPanel id="gemstones" className="space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">Center Gemstone</span>
            <div className="space-y-2">
              {MOCK_GEMSTONES.map((g) => {
                const isSelected = selectedGemstoneId === g.id;
                return (
                  <button key={g.id} onClick={() => setGemstone(g.id, isSelected ? 0 : g.price)}
                    className={`w-full rounded-2xl p-3.5 flex items-center justify-between transition-all text-left border ${
                      isSelected ? 'border-purple-200 bg-purple-50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-xs'
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm`}>
                        <Gem size={15} className="text-white" />
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isSelected ? 'text-purple-700' : 'text-gray-900'}`}>{g.type} ({g.shape})</div>
                        <div className="text-[9px] text-slate-400">{g.carat} Carats</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-gradient-primary">+${g.price}</span>
                  </button>
                );
              })}
            </div>
          </TabPanel>

          {/* PRICING TAB */}
          <TabPanel id="pricing" className="space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">Live Price Breakdown</span>
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-px shadow-lg">
              <div className="bg-white rounded-2xl p-5 space-y-4">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block">Total Valuation</span>
                  <div className="text-3xl font-display font-bold text-gradient-primary mt-1">
                    ${priceBreakdown ? priceBreakdown.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }) : estimatedPrice.toLocaleString()}
                    <span className="text-xs font-sans text-slate-400 font-normal ml-2">{priceBreakdown?.currency || 'USD'}</span>
                  </div>
                </div>

                {priceBreakdown && (
                  <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
                    {[
                      { label: 'Base Blueprint', val: priceBreakdown.basePrice },
                      { label: `Metal (${priceBreakdown.estimatedWeight}g)`, val: priceBreakdown.metalPrice },
                      ...(priceBreakdown.gemstonePrice > 0 ? [{ label: `Gemstones (${priceBreakdown.totalCarats}ct)`, val: priceBreakdown.gemstonePrice }] : []),
                      ...(priceBreakdown.assetPrice > 0 ? [{ label: 'Attachments', val: priceBreakdown.assetPrice }] : []),
                      { label: 'Making Charges', val: priceBreakdown.makingCharges },
                      { label: 'Tax (GST 3%)', val: priceBreakdown.tax },
                    ].map(({ label, val }) => (
                      <div key={label} className="flex justify-between text-slate-500">
                        <span>{label}</span>
                        <span className="font-mono font-semibold text-gray-900">${val.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 text-[9px] text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <ShieldCheck size={13} className="shrink-0 text-emerald-600" />
                  Live Bullion Market Index · Certified Authentic
                </div>
              </div>
            </div>
          </TabPanel>

          {/* AI ADVISOR TAB */}
          <TabPanel id="advisor" className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Design Audit</span>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
              </span>
            </div>

            {/* Score Ring */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5 flex items-center gap-5">
              <div className="relative w-16 h-16 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path stroke="#E5E7EB" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path stroke="url(#score-gradient)" strokeDasharray="88, 100" strokeWidth="3.5" strokeLinecap="round" fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <defs>
                    <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4F46E5" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-lg text-gradient-primary">88</div>
              </div>
              <div>
                <h4 className="font-display font-bold text-gray-900 text-sm">Overall Harmony</h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">High luxury aesthetics with strong structural integrity.</p>
              </div>
            </div>

            <div className="space-y-2">
              {aiCategories.map((c) => (
                <div key={c.name} className="bg-white border border-gray-100 shadow-xs rounded-xl p-3 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-700">{c.name}</span>
                    <span className="font-mono font-bold text-indigo-600">{c.score}/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${c.score}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </TabPanel>

          {/* VERSION HISTORY TAB */}
          <TabPanel id="history" className="space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">Version History</span>
            <div className="space-y-2">
              {[
                { v: 'v1.2', title: 'Current Autosave', time: 'Just now' },
                { v: 'v1.1', title: 'Rose Gold Swap', time: '12 mins ago' },
                { v: 'v1.0', title: 'Initial Draft', time: '1 hour ago' },
              ].map((ver) => (
                <div key={ver.v} className="bg-white border border-gray-100 shadow-xs rounded-2xl p-3 flex items-center justify-between hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded-lg">{ver.v}</span>
                    <div>
                      <div className="text-xs font-bold text-gray-900">{ver.title}</div>
                      <div className="text-[9px] text-slate-400">{ver.time}</div>
                    </div>
                  </div>
                  <Check size={13} className="text-emerald-500" strokeWidth={2.5} />
                </div>
              ))}
            </div>
          </TabPanel>

        </div>
      </Tabs>
    </div>
  );
};
export default PropertyInspector;
