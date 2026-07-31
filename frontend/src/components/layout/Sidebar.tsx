import React from 'react';
import { X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-55 flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-stone-900/30 backdrop-blur-xs" onClick={onClose} />

      {/* Drawer */}
      <div className="relative bg-white border-l border-stone-200 w-80 max-w-full h-full p-6 shadow-2xl z-10 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-stone-800">
              {title}
            </h4>
            <button
              onClick={onClose}
              className="p-1 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-140px)] pr-1">{children}</div>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
