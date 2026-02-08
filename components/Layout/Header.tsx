import React from 'react';
import { Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { signOut, user } = useAuth();

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20 pt-safe w-full">
      <div className="px-4 py-4 flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/50">RT</div>
          <h1 className="font-bold text-lg tracking-tight text-white">REDAÇÃO TÁTICA</h1>
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <button
              onClick={signOut}
              className="p-1 text-slate-400 hover:text-red-400 transition-colors"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
          <div className="text-[10px] font-mono text-purple-400 border border-purple-900 px-2 py-1 rounded bg-purple-900/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> AI READY
          </div>
        </div>
      </div>
    </header>
  );
}