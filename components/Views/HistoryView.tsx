import React from 'react';
import { History, Sparkles } from 'lucide-react';
import { HistoryItem } from '../../types';

interface HistoryViewProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export default function HistoryView({ history, onSelect }: HistoryViewProps) {
  return (
    <div className="space-y-4 pb-20 animate-fade-in">
       <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <History className="w-6 h-6 text-emerald-400" />
        Histórico de Combate
      </h2>
      {history.length === 0 ? (
        <div className="text-center py-20 text-slate-500 bg-slate-800/50 rounded-lg border border-slate-800">
          <p>Nenhuma missão registrada, soldado.</p>
        </div>
      ) : (
        history.map((item, idx) => (
          <div 
            key={idx} 
            onClick={() => onSelect(item)} 
            className="bg-slate-800 p-4 rounded-lg border border-slate-700 active:bg-slate-700 transition-colors cursor-pointer hover:border-emerald-500/50 shadow-md"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-white text-sm line-clamp-1 flex-1 pr-2">{item.mission.tema.titulo}</h3>
              <div className="flex gap-1 items-center">
                 {item.result.type === 'ai' && <Sparkles className="w-3 h-3 text-purple-400" />}
                 <span className={`text-xs font-bold px-2 py-1 rounded ml-2 min-w-[3rem] text-center ${item.result.score >= 700 ? 'bg-emerald-900 text-emerald-400 border border-emerald-800' : 'bg-red-900 text-red-400 border border-red-800'}`}>
                  {item.result.score}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-slate-500">{item.result.date || "Data desconhecida"}</p>
              <p className="text-xs text-slate-600 font-mono">ID: #{item.mission.id.toString().slice(-4)}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}