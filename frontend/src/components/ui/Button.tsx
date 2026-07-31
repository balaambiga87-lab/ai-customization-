import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'gold' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold tracking-wide rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/50 disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.97]';

  const variants: Record<string, string> = {
    primary:
      'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md hover:shadow-indigo hover:-translate-y-0.5',
    secondary:
      'bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 hover:bg-slate-50/80',
    success:
      'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-md hover:-translate-y-0.5',
    danger:
      'bg-red-500 hover:bg-red-600 text-white shadow-sm hover:-translate-y-0.5',
    gold:
      'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-gold hover:-translate-y-0.5',
    outline:
      'border border-slate-300 text-slate-700 hover:bg-slate-100/70 bg-transparent',
    ghost:
      'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-transparent',
  };

  const sizes: Record<string, string> = {
    xs: 'px-3 py-1.5 text-[10px] tracking-widest uppercase',
    sm: 'px-4 py-2 text-xs tracking-wider uppercase',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] ?? variants.primary} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
