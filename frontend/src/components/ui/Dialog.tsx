import React from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="bg-white border border-stone-200 rounded-lg max-w-md w-full p-6 shadow-2xl relative z-10 transition-transform duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors text-sm"
        >
          ✕
        </button>
        {title && (
          <h3 className="text-lg font-playfair font-semibold text-stone-900 mb-4 tracking-wide">
            {title}
          </h3>
        )}
        <div className="text-stone-600 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
