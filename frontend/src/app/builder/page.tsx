'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { PricingPanel } from '@/components/builder/PricingPanel';
import { AiAssistantPanel } from '@/components/builder/AiAssistantPanel';

// Lazy load the 3D canvas so it doesn't block initial page render
const BuilderCanvas = dynamic(
  () => import('@/components/builder/BuilderCanvas').then(mod => mod.BuilderCanvas), 
  { ssr: false, loading: () => <div className="w-full h-full bg-stone-100 animate-pulse rounded-lg flex items-center justify-center text-stone-400">Loading 3D Workspace...</div> }
);

export default function BuilderPage() {
  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-10 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto h-[calc(100vh-120px)] flex flex-col md:flex-row gap-6">
        
        {/* Left Column - Tools & Pricing */}
        <div className="w-full md:w-1/4 min-w-[300px] flex flex-col gap-6">
          <div className="flex-1 min-h-[400px]">
             <AiAssistantPanel />
          </div>
          <div className="shrink-0 h-[300px]">
             <PricingPanel />
          </div>
        </div>

        {/* Right Column - 3D Canvas */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-stone-200 p-2 overflow-hidden">
          <BuilderCanvas />
        </div>

      </div>
    </div>
  );
}
