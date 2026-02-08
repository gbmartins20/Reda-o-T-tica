import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: "blue" | "green" | "red" | "yellow" | "slate";
}

export const Badge: React.FC<BadgeProps> = ({ children, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-900/50 text-blue-200 border-blue-700",
    green: "bg-emerald-900/50 text-emerald-200 border-emerald-700",
    red: "bg-red-900/50 text-red-200 border-red-700",
    yellow: "bg-yellow-900/50 text-yellow-200 border-yellow-700",
    slate: "bg-slate-700 text-slate-300 border-slate-600"
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-mono border ${colors[color]}`}>
      {children}
    </span>
  );
};