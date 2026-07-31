import React from 'react';

export const Skeleton: React.FC<{ className?: string; rounded?: 'sm' | 'md' | 'lg' | 'full' | 'card' }> = ({
  className = '', rounded = 'md',
}) => {
  const r = { sm: 'rounded', md: 'rounded-lg', lg: 'rounded-xl', full: 'rounded-full', card: 'rounded-2xl' };
  return <div className={`shimmer-light ${r[rounded]} ${className}`} aria-hidden="true" />;
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 ${className}`}>
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10" rounded="lg" />
      <div className="flex-grow flex flex-col gap-2">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-2.5 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-2.5 w-full" />
    <Skeleton className="h-2.5 w-4/5" />
    <Skeleton className="h-2.5 w-2/3" />
  </div>
);
