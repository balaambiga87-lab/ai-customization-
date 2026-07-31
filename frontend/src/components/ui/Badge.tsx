import React from 'react';

interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'info';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  children,
}) => {
  const styles = {
    primary: 'bg-stone-100 text-stone-700 border border-stone-200',
    success: 'bg-teal-50 text-teal-700 border border-teal-200/60',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    info: 'bg-blue-50 text-blue-700 border border-blue-200/60',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${styles[variant]}`}
    >
      {children}
    </span>
  );
};
