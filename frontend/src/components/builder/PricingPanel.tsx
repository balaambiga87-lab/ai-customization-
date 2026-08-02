import React, { useMemo } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { ShoppingBag, ChevronRight } from 'lucide-react';

export function PricingPanel() {
  const { chain, chainPrice, pendants, metalMultiplier } = useBuilderStore();

  const basePrice = useMemo(() => {
    const pendantsTotal = pendants.reduce((acc, p) => acc + (p.price || 0), 0);
    return (chainPrice + pendantsTotal) * metalMultiplier;
  }, [chainPrice, pendants, metalMultiplier]);

  const makingCharges = basePrice * 0.15; // 15% making charge
  const gst = (basePrice + makingCharges) * 0.03; // 3% GST
  const finalTotal = basePrice + makingCharges + gst;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (!chain && pendants.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 text-center text-stone-500 text-sm">
        Add items to canvas to see pricing
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden flex flex-col h-full">
      <div className="p-4 bg-stone-50 border-b border-stone-200">
        <h3 className="font-semibold font-playfair tracking-wide text-lg text-stone-900">Price Estimate</h3>
      </div>
      
      <div className="p-5 flex-1 space-y-4 text-sm text-stone-600">
        <div className="flex justify-between items-center">
          <span>Base Value</span>
          <span className="font-medium text-stone-900">{formatPrice(basePrice)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Making Charges (15%)</span>
          <span className="font-medium text-stone-900">{formatPrice(makingCharges)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>GST (3%)</span>
          <span className="font-medium text-stone-900">{formatPrice(gst)}</span>
        </div>
        
        <div className="pt-4 mt-4 border-t border-stone-200 flex justify-between items-end">
          <span className="font-medium text-stone-900">Final Total</span>
          <span className="text-2xl font-semibold text-amber-700">{formatPrice(finalTotal)}</span>
        </div>
      </div>

      <div className="p-4 bg-stone-50 border-t border-stone-200">
        <button className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
          <ShoppingBag size={18} />
          <span>Save Design</span>
        </button>
      </div>
    </div>
  );
}
