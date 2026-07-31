import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, onClick }) => (
  <div
    onClick={onClick}
    className={[
      'bg-white rounded-2xl border border-gray-100 shadow-sm',
      hover ? 'hover:shadow-xl hover:-translate-y-0.5 cursor-pointer transition-all duration-300' : 'transition-shadow duration-200',
      className,
    ].filter(Boolean).join(' ')}
  >
    {children}
  </div>
);

export const GradientCard: React.FC<{ children: React.ReactNode; className?: string; gradient?: string }> = ({
  children, className = '', gradient = 'from-indigo-500 to-purple-600',
}) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-px shadow-lg ${className}`}>
    <div className="bg-white rounded-2xl h-full w-full">{children}</div>
  </div>
);
