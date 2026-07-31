'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesignStore } from '../../../stores/useDesignStore';
import { useCanvasStore } from '../../../stores/useCanvasStore';
import { useBlueprints, useBlueprintAnchors, useAssets } from '../../../hooks/useCustomizerQueries';
import { MOCK_ASSETS } from '../mocks/customizer.mocks';
import {
  Search, Layers, LayoutGrid, Check, ChevronRight,
  Sparkles, Star, Clock, Heart, Lock
} from 'lucide-react';

const CATEGORIES = [
  { name: 'All', code: '' },
  { name: 'Bands', code: 'SHANK' },
  { name: 'Settings', code: 'HEAD' },
  { name: 'Accents', code: 'ACCENT' },
  { name: 'Pendants', code: 'PENDANT' },
];

interface SectionProps {
  id?: string;
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string | number;
  accentColor?: string;
}

const Section: React.FC<SectionProps> = ({ icon, label, children, defaultOpen = false, badge, accentColor = 'bg-indigo-500' }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors group">
        <span className={`w-6 h-6 rounded-lg ${accentColor} bg-opacity-10 flex items-center justify-center shrink-0`}>
          {icon}
        </span>
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-700 flex-grow group-hover:text-gray-900 transition-colors">{label}</span>
        {badge !== undefined && (
          <span className="text-[9px] font-bold bg-indigo-50 border border-indigo-200 text-indigo-600 px-1.5 py-0.5 rounded-full">{badge}</span>
        )}
        <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }} className="text-slate-400 shrink-0">
          <ChevronRight size={13} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
            <div className="px-3 pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const CategorySelector: React.FC = () => {
  const { activeBlueprintId, setBlueprint, updateComponent, configuration } = useDesignStore();
  const { activeAnchorName } = useCanvasStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategoryCode, setSelectedCategoryCode] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(searchQuery); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const { data: blueprints, isLoading: loadingBP } = useBlueprints();
  const { data: anchors } = useBlueprintAnchors(activeBlueprintId);

  const activeAnchor = anchors?.find((a) => a.name === activeAnchorName);
  const targetCategoryCode = activeAnchor
    ? (activeAnchor.allowedAssetCategoryIds[0] as string) || selectedCategoryCode
    : selectedCategoryCode;

  const { data: assetData, isLoading: loadingAssets } = useAssets({
    page, limit: 5, search: debouncedSearch,
    categoryCode: targetCategoryCode || undefined,
  });

  const handleSelectBlueprint = (bp: any) => setBlueprint(bp.id, bp.name, parseFloat(bp.basePrice));

  const handlePlaceAsset = (asset: any) => {
    if (!activeAnchorName) { alert('Click an anchor hotspot on the canvas first.'); return; }
    const currentConfig = configuration[activeAnchorName] || { scale: 1.0, rotation: 0 };
    const oldAssetId = currentConfig.assetId;
    const oldPrice = oldAssetId ? MOCK_ASSETS.find((a) => a.id === oldAssetId)?.priceModifier || 0 : 0;
    updateComponent(activeAnchorName, { assetId: asset.id }, parseFloat(asset.priceModifier) - oldPrice);
  };

  return (
    <div className="w-[256px] bg-white flex flex-col h-full overflow-hidden border-r border-gray-100 shadow-sm shrink-0">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
            <LayoutGrid size={15} className="text-white" />
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-gray-900">Studio Library</p>
            <p className="text-[9px] text-slate-400 mt-0.5">Blueprints · Inventory</p>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        {/* Blueprints */}
        <Section id="blueprints" icon={<Layers size={12} className="text-indigo-600" />} label="Blueprints"
          accentColor="bg-indigo-500" defaultOpen badge={blueprints?.length ?? 0}>
          {loadingBP ? (
            <div className="flex flex-col gap-2 py-2">{[...Array(3)].map((_, i) => <div key={i} className="shimmer-light h-12 rounded-xl" />)}</div>
          ) : (
            <div className="flex flex-col gap-1.5 pt-1">
              {blueprints?.map((bp) => {
                const isSelected = activeBlueprintId === bp.id;
                return (
                  <button key={bp.id} onClick={() => handleSelectBlueprint(bp)}
                    className={`w-full p-3 rounded-xl text-left transition-all duration-200 border ${
                      isSelected
                        ? 'border-indigo-200 bg-indigo-50 shadow-sm'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-slate-50'
                    }`}>
                    {isSelected && <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full" />}
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-xs text-gray-900 leading-snug">{bp.name}</div>
                      {isSelected && <Check size={12} className="text-indigo-600 shrink-0" strokeWidth={3} />}
                    </div>
                    <div className="text-[9px] font-mono text-indigo-600 font-bold mt-1">${parseFloat(bp.basePrice).toFixed(0)}</div>
                  </button>
                );
              })}
            </div>
          )}
        </Section>

        {/* Inventory */}
        <Section id="inventory" icon={<Sparkles size={12} className="text-purple-600" />} label="Inventory"
          accentColor="bg-purple-500" defaultOpen>
          {activeBlueprintId ? (
            <div className="flex flex-col gap-2 pt-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={11} />
                <input type="text" placeholder="Search parts..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-gray-200 rounded-full text-[10px] text-gray-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-300 transition-all" />
              </div>

              {!activeAnchorName && (
                <div className="flex flex-wrap gap-1">
                  {CATEGORIES.map((c) => (
                    <button key={c.code} onClick={() => { setSelectedCategoryCode(c.code); setPage(1); }}
                      className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide rounded-full transition-all border ${
                        selectedCategoryCode === c.code
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-sm'
                          : 'bg-white border-gray-200 text-slate-500 hover:border-slate-300'
                      }`}>{c.name}</button>
                  ))}
                </div>
              )}

              {activeAnchorName && (
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1.5 rounded-full">
                  <Lock size={9} /> Compatible parts only
                </div>
              )}

              {loadingAssets ? (
                <div className="flex flex-col gap-1.5">{[...Array(4)].map((_, i) => <div key={i} className="shimmer-light h-12 rounded-xl" />)}</div>
              ) : assetData?.items?.length ? (
                <div className="flex flex-col gap-1.5">
                  {assetData.items.map((asset) => {
                    const attached = activeAnchorName && configuration[activeAnchorName]?.assetId === asset.id;
                    return (
                      <div key={asset.id} className={`rounded-xl p-3 flex items-center justify-between transition-all border ${
                        attached ? 'border-indigo-200 bg-indigo-50' : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-slate-50'
                      }`}>
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold text-gray-900 truncate">{asset.name}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] font-mono font-bold text-indigo-600">+${parseFloat(asset.priceModifier).toFixed(0)}</span>
                            <span className="text-[8px] text-slate-400">{asset.sku}</span>
                          </div>
                        </div>
                        <button onClick={() => handlePlaceAsset(asset)}
                          className={`ml-2 w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                            attached
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-transparent text-white shadow-sm'
                              : 'border-gray-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'
                          }`}>
                          {attached ? <Check size={10} strokeWidth={3} /> : <span className="text-xs leading-none">+</span>}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-[10px] text-slate-400 border border-dashed border-gray-200 rounded-xl">No matching parts found</div>
              )}

              {assetData?.meta && assetData.meta.totalPages > 1 && (
                <div className="flex items-center justify-between pt-1">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                    className="text-[9px] text-slate-500 hover:text-indigo-600 disabled:opacity-30 transition-colors px-2 py-1">← Prev</button>
                  <span className="text-[8px] font-mono text-slate-400">{page}/{assetData.meta.totalPages}</span>
                  <button onClick={() => setPage(p => p + 1)} disabled={page >= assetData.meta.totalPages}
                    className="text-[9px] text-slate-500 hover:text-indigo-600 disabled:opacity-30 transition-colors px-2 py-1">Next →</button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-gray-200 flex items-center justify-center mx-auto mb-3">
                <Layers size={16} className="text-slate-400" />
              </div>
              <p className="text-[9px] text-slate-400 leading-relaxed">Choose a blueprint above to unlock the inventory</p>
            </div>
          )}
        </Section>

        <Section id="favorites" icon={<Heart size={12} className="text-pink-500" />} label="Favorites" accentColor="bg-pink-500" badge={0}>
          <div className="py-6 text-center text-[9px] text-slate-400">No saved favorites yet</div>
        </Section>

        <Section id="recent" icon={<Clock size={12} className="text-amber-500" />} label="Recent Designs" accentColor="bg-amber-500" badge={0}>
          <div className="py-6 text-center text-[9px] text-slate-400">No recent designs</div>
        </Section>

        <Section id="templates" icon={<Star size={12} className="text-emerald-500" />} label="Templates" accentColor="bg-emerald-500">
          <div className="py-6 text-center text-[9px] text-slate-400">Coming soon</div>
        </Section>
      </div>
    </div>
  );
};
export default CategorySelector;
