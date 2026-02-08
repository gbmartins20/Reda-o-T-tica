import React from 'react';
import { Target, Shield, BookOpen, RefreshCw, Sparkles, PenTool, HelpCircle, Loader2 } from 'lucide-react';
import { Mission, HelpContent } from '../../types';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { HELP_DATA } from '../../constants';

interface MissionViewProps {
  mission: Mission | null;
  loading: boolean;
  error: string | null;
  onNewStatic: () => void;
  onNewAI: () => void;
  onAccept: () => void;
  onHelp: (content: HelpContent) => void;
}

export default function MissionView({ 
  mission, 
  loading, 
  error, 
  onNewStatic, 
  onNewAI, 
  onAccept,
  onHelp 
}: MissionViewProps) {
  
  return (
    <div className="space-y-6 pb-20 animate-fade-in relative">
      <div className="text-center space-y-2">
        <h2 className="text-emerald-400 font-mono text-sm tracking-widest uppercase flex justify-center items-center gap-2 h-6">
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Nova Missão Disponível"}
        </h2>
        <h1 className="text-2xl font-bold text-white leading-tight">
          {loading ? "Recebendo Instruções..." : "Briefing Operacional"}
        </h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
          <p className="text-slate-400 text-sm animate-pulse">O QG está gerando uma missão exclusiva...</p>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-900/50 border border-red-500 p-3 rounded text-red-200 text-xs mb-4">
              {error}
            </div>
          )}
          
          <Card className="border-l-4 border-l-emerald-500 bg-slate-800/80 backdrop-blur">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <Target className="w-5 h-5" />
                <span className="font-bold text-sm tracking-wider">
                  {mission?.type === 'ai' ? 'EIXO TEMÁTICO (IA ✨)' : 'EIXO TEMÁTICO'}
                </span>
              </div>
              <button onClick={() => onHelp(HELP_DATA.tema)} className="text-slate-500 hover:text-emerald-400 transition-colors">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{mission?.tema.titulo}</h3>
            <p className="text-slate-400 text-sm italic">"{mission?.tema.frase}"</p>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 text-blue-400">
                  <Shield className="w-5 h-5" />
                  <span className="font-bold text-sm tracking-wider">CONECTIVOS OBRIGATÓRIOS</span>
                </div>
                <button onClick={() => onHelp(HELP_DATA.conectivos)} className="text-slate-500 hover:text-blue-400 transition-colors">
                  <HelpCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase mb-1">Interparágrafos (Início de §)</p>
                  <div className="flex flex-wrap gap-2">
                    {mission?.conectivos.inter.map((c, i) => (
                      <Badge key={i} color="blue">{c}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase mb-1">Intraparágrafos (Meio de §)</p>
                  <div className="flex flex-wrap gap-2">
                    {mission?.conectivos.intra.map((c, i) => (
                      <Badge key={i} color="slate">{c}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-yellow-400">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-bold text-sm tracking-wider">REPERTÓRIO DE APOIO</span>
                </div>
                <button onClick={() => onHelp(HELP_DATA.repertorio)} className="text-slate-500 hover:text-yellow-400 transition-colors">
                  <HelpCircle className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-300 text-sm font-serif border-l-2 border-slate-600 pl-3 italic">
                "{mission?.repertorio.texto}"
              </p>
              <p className="text-right text-xs text-slate-500 mt-2">— {mission?.repertorio.fonte}</p>
            </Card>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              onClick={onNewStatic}
              className="flex-1 flex flex-col items-center justify-center py-3 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold active:scale-95 transition-all text-xs"
            >
              <RefreshCw className="w-4 h-4 mb-1" />
              Sorteio Padrão
            </button>
            <button 
              onClick={onNewAI}
              className="flex-1 flex flex-col items-center justify-center py-3 rounded-lg border border-purple-500/50 bg-purple-900/20 hover:bg-purple-900/30 text-purple-300 font-bold active:scale-95 transition-all text-xs"
            >
              <Sparkles className="w-4 h-4 mb-1" />
              Gerar com IA
            </button>
          </div>
            
          <button 
            onClick={onAccept}
            className="w-full py-4 mt-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/50 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <PenTool className="w-5 h-5" />
            ACEITAR MISSÃO
          </button>
        </>
      )}
    </div>
  );
}