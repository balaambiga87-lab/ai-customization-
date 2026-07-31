import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-md text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-400 focus:bg-white transition-colors duration-200 text-sm ${
          error ? 'border-red-400 focus:border-red-400' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};
