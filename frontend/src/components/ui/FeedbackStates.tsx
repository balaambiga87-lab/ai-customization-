import React from 'react';

// Spinner / Loader
export const Loading: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12 gap-3 w-full">
    <div className="w-8 h-8 border-2 border-teal-700/20 border-t-teal-700 rounded-full animate-spin" />
    <span className="text-xs text-stone-500 font-medium tracking-wide">Loading catalogue...</span>
  </div>
);

// Clean Empty State
export const EmptyState: React.FC<{ message?: string }> = ({
  message = 'No jewellery items found.',
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-stone-200 rounded-lg p-6 bg-stone-50/40">
    <span className="text-stone-400 text-3xl mb-3">✦</span>
    <p className="text-sm text-stone-600 font-playfair font-medium">{message}</p>
  </div>
);

// Error alert state
export const ErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({
  message = 'Failed to load details. Please try again.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center p-6 bg-red-50/30 border border-red-100/60 rounded-lg max-w-sm mx-auto">
    <span className="text-red-400 text-2xl mb-2">⚠</span>
    <p className="text-sm text-red-700 mb-4 font-medium">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-1.5 bg-red-700 text-white rounded text-xs hover:bg-red-800 transition-colors"
      >
        Retry
      </button>
    )}
  </div>
);
export default Loading;
