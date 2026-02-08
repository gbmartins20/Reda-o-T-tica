import React from 'react';
import { HelpCircle, X } from 'lucide-react';
import { HelpContent } from '../../types';

interface HelpModalProps {
  content: HelpContent;
  onClose: () => void;
}

export default function HelpModal({ content, onClose }: HelpModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-4 text-emerald-400">
          <HelpCircle className="w-6 h-6" />
          <h3 className="font-bold text-lg">{content.title}</h3>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">{content.text}</p>
        <button 
          onClick={onClose} 
          className="mt-6 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold text-sm transition-colors"
        >
          ENTENDIDO, SOLDADO
        </button>
      </div>
    </div>
  );
}