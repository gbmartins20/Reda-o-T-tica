import React from 'react';
import { BookOpen } from 'lucide-react';
import { MANUAL_CONECTIVOS } from '../../constants';

export default function ManualView() {
  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-emerald-400" />
        Manual de Operações
      </h2>
      {Object.entries(MANUAL_CONECTIVOS).map(([category, items]) => (
        <div key={category} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-md">
          <div className="bg-slate-700/50 px-4 py-3 font-bold text-emerald-400 text-sm uppercase tracking-wider border-b border-slate-700">
            {category}
          </div>
          <div className="p-4 grid grid-cols-2 gap-2">
            {items.map(item => <div key={item} className="text-slate-300 text-sm font-mono flex items-center gap-2">
              <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
              {item}
            </div>)}
          </div>
        </div>
      ))}
    </div>
  );
}