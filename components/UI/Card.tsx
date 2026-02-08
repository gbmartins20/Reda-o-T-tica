import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg ${className}`}>
    {children}
  </div>
);