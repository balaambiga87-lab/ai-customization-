import React from 'react';
import Link from 'next/link';
import { X, Sparkles, User } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/35 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide Drawer */}
      <div className="relative bg-white max-w-xs w-full h-full p-6 shadow-2xl flex flex-col justify-between z-10 transition-transform">
        <div>
          <div className="flex items-center justify-between mb-8">
            <span className="font-playfair text-lg font-bold tracking-widest text-stone-900">
              CARATLINE
            </span>
            <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded-full">
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-col gap-6 font-medium text-base tracking-wider text-stone-600">
            <Link href="/catalog" onClick={onClose} className="hover:text-teal-700 transition-colors">
              COLLECTIONS
            </Link>
            <Link
              href="/customizer"
              onClick={onClose}
              className="hover:text-teal-700 transition-colors"
            >
              STUDIO BUILDER
            </Link>
            <Link
              href="/ai-assistant"
              onClick={onClose}
              className="hover:text-teal-700 flex items-center gap-1.5 text-teal-700 transition-colors"
            >
              <Sparkles size={16} />
              AI DESIGNER
            </Link>
          </div>
        </div>

        <div className="border-t border-stone-100 pt-6 flex flex-col gap-4 text-sm text-stone-500">
          <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2">
            <User size={16} />
            My Account
          </Link>
        </div>
      </div>
    </div>
  );
};
export default MobileNav;
