'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Plus, Search, Palette, Copy, Trash2, Clock, Star } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface SavedDesign {
  id: string;
  title: string;
  thumbnailUrl: string;
  status: 'Draft' | 'Completed' | 'Archived';
  isFavorite: boolean;
  price: number;
  lastOpenedAt: string;
  metal: string;
  gemstone: string;
  gradient: string;
}

const MOCK_DESIGNS: SavedDesign[] = [
  {
    id: 'des-01', title: 'Elegant Rose Gold Solitaire',
    thumbnailUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    status: 'Completed', isFavorite: true, price: 3450,
    lastOpenedAt: '2 hours ago', metal: '18K Rose Gold', gemstone: '1.5ct Pear Diamond',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    id: 'des-02', title: 'Emerald Crown Wedding Band',
    thumbnailUrl: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80',
    status: 'Draft', isFavorite: false, price: 2800,
    lastOpenedAt: '1 day ago', metal: 'Platinum', gemstone: '2.0ct Emerald',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'des-03', title: 'Sapphire Pendant Chain',
    thumbnailUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    status: 'Completed', isFavorite: true, price: 4200,
    lastOpenedAt: '3 days ago', metal: '18K Yellow Gold', gemstone: 'Blue Oval Sapphire',
    gradient: 'from-indigo-500 to-blue-600',
  },
  {
    id: 'des-04', title: 'Minimalist Diamond Stud',
    thumbnailUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    status: 'Archived', isFavorite: false, price: 1950,
    lastOpenedAt: '1 week ago', metal: 'White Gold', gemstone: 'Round Diamond',
    gradient: 'from-slate-400 to-slate-600',
  },
  {
    id: 'des-05', title: 'Leaf Engraved Accent Ring',
    thumbnailUrl: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=600&q=80',
    status: 'Draft', isFavorite: true, price: 3100,
    lastOpenedAt: '2 weeks ago', metal: 'Rose Gold', gemstone: 'Marquise Diamond',
    gradient: 'from-amber-400 to-yellow-500',
  },
];

export default function MyDesignsPage() {
  const [designs, setDesigns] = useState<SavedDesign[]>(MOCK_DESIGNS);
  const [filter, setFilter] = useState<'All' | 'Favorites' | 'Draft' | 'Completed' | 'Archived'>('All');
  const [search, setSearch] = useState('');

  const toggleFavorite = (id: string) => setDesigns(ds => ds.map(d => d.id === id ? { ...d, isFavorite: !d.isFavorite } : d));
  const deleteDesign = (id: string) => setDesigns(ds => ds.filter(d => d.id !== id));
  const duplicateDesign = (design: SavedDesign) =>
    setDesigns(ds => [{ ...design, id: `des-${Date.now()}`, title: `${design.title} (Copy)`, lastOpenedAt: 'Just now' }, ...ds]);

  const filtered = designs.filter(d => {
    if (filter === 'Favorites' && !d.isFavorite) return false;
    if (filter !== 'All' && filter !== 'Favorites' && d.status !== filter) return false;
    if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const STATUS_STYLE: Record<string, string> = {
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Draft: 'bg-amber-50 text-amber-700 border-amber-200',
    Archived: 'bg-slate-100 text-slate-500 border-slate-200',
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-indigo-600 text-[11px] font-bold uppercase tracking-[0.3em] mb-1 flex items-center gap-1.5">
            <Sparkles size={12} /> My Workspace
          </p>
          <h1 className="font-display text-4xl font-bold text-gray-900">Jewellery Collection</h1>
          <p className="text-slate-500 text-sm mt-1">Manage, duplicate, edit, and version your saved designs</p>
        </div>
        <Link href="/customizer">
          <Button variant="primary" size="md" className="flex items-center gap-2 shadow-indigo">
            <Plus size={16} /> Create New Design
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-1 bg-white border border-gray-200 rounded-full p-1 shadow-xs">
          {(['All', 'Favorites', 'Draft', 'Completed', 'Archived'] as const).map((tab) => (
            <button key={tab} onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${
                filter === tab ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}>{tab}</button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search designs..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 bg-white border border-gray-200 rounded-full text-xs text-gray-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-300 transition-all shadow-xs" />
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <AnimatePresence>
            {filtered.map((d, i) => (
              <motion.div key={d.id} layout
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.thumbnailUrl} alt={d.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Status Badge */}
                  <span className={`absolute top-3 left-3 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${STATUS_STYLE[d.status]}`}>
                    {d.status}
                  </span>

                  {/* Favorite */}
                  <button onClick={() => toggleFavorite(d.id)}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center shadow-sm transition-transform active:scale-90">
                    <Heart size={12} className={d.isFavorite ? 'fill-pink-500 text-pink-500' : 'text-slate-400'} />
                  </button>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Link href={`/customizer?id=${d.id}`}>
                      <Button variant="primary" size="xs" className="flex items-center gap-1.5 shadow-sm">
                        <Palette size={11} /> Edit
                      </Button>
                    </Link>
                    <button onClick={() => duplicateDesign(d)}
                      className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 shadow-sm hover:border-indigo-300 transition-all">
                      <Copy size={13} />
                    </button>
                    <button onClick={() => deleteDesign(d.id)}
                      className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-500 hover:text-red-500 shadow-sm hover:border-red-200 transition-all">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-2 flex-grow">
                  <div>
                    <h3 className="font-display font-bold text-gray-900 text-base leading-snug truncate">{d.title}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">{d.metal} · {d.gemstone}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-auto">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock size={10} /> {d.lastOpenedAt}
                    </span>
                    <span className="font-display font-bold text-gradient-primary text-sm">${d.price.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center gap-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-px shadow-lg">
            <div className="bg-white rounded-2xl p-12 flex flex-col items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles size={26} className="text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-gray-900">Create Your First Design</h3>
              <p className="text-slate-500 text-sm max-w-xs text-center leading-relaxed">
                No designs match your current filter. Start designing in the Studio Customizer.
              </p>
              <Link href="/customizer">
                <Button variant="primary" size="lg" className="flex items-center gap-2 shadow-indigo">
                  <Plus size={16} /> Open Studio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
