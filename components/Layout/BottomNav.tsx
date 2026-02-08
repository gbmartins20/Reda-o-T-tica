import React from 'react';
import { Target, PenTool, BookOpen, History } from 'lucide-react';
import { Tab } from '../../types';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const navItems = [
    { id: 'mission', icon: Target, label: 'MISSÃO' },
    { id: 'editor', icon: PenTool, label: 'ESCREVER' },
    { id: 'manual', icon: BookOpen, label: 'MANUAL' },
    { id: 'history', icon: History, label: 'HISTÓRICO' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur border-t border-slate-800 pb-safe z-30">
      <div className="flex justify-around items-center max-w-md mx-auto h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as Tab)}
            className={`flex flex-col items-center gap-1 w-16 transition-colors ${
              activeTab === item.id || (activeTab === 'report' && item.id === 'mission') 
                ? 'text-emerald-400' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}