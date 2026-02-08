import React from 'react';
import { Target, Sparkles, CheckCircle, XCircle, AlertOctagon } from 'lucide-react';
import { Report } from '../../types';
import { Card } from '../UI/Card';

interface ReportViewProps {
  report: Report | null;
  onEdit: () => void;
  onNew: () => void;
}

export default function ReportView({ report, onEdit, onNew }: ReportViewProps) {
  if (!report) return null;
  const isApproved = report.score >= 700;

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-slate-400 text-xs uppercase tracking-widest mb-1 flex justify-center items-center gap-2">
          Relatório de Desempenho {report.type === 'ai' && <Sparkles className="w-3 h-3 text-purple-400" />}
        </h2>
        <div className={`text-5xl font-black ${isApproved ? 'text-emerald-400' : 'text-red-400'} drop-shadow-lg transition-all duration-500 transform scale-100`}>
          {report.score}
        </div>
        <p className="text-slate-400 text-sm mt-1">Nota Final</p>
      </div>

      {report.feedback && (
        <Card className="border-l-4 border-l-purple-500">
          <h3 className="font-bold text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Feedback do Instrutor {report.type === 'ai' && "(IA)"}
          </h3>
          <p className="text-slate-300 text-sm italic">"{report.feedback}"</p>
        </Card>
      )}

      {report.violation && (
        <div className="bg-red-900/30 border border-red-600 p-4 rounded-lg flex gap-3 items-start animate-pulse">
          <AlertOctagon className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-red-400 text-sm">VIOLAÇÃO DE DIREITOS HUMANOS</h4>
            <p className="text-xs text-red-200 mt-1">
              Termo detectado: <span className="font-mono bg-red-900 px-1">"{report.violation}"</span>. 
              Nota zerada.
            </p>
          </div>
        </div>
      )}

      <Card>
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-400" />
          Objetivos da Missão
        </h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-xs text-slate-500 uppercase mb-2">Conectivos Interparágrafos</p>
            <div className="space-y-2">
              {report.usedInter && report.usedInter.map((item, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-900/50 p-2 rounded">
                  <span className="text-slate-300 font-mono text-sm">{item.word}</span>
                  {item.used ? 
                    <span className="text-emerald-400 text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Usado</span> : 
                    <span className="text-red-400 text-xs flex items-center gap-1"><XCircle className="w-3 h-3"/> Ausente</span>
                  }
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-slate-900/50 p-2 rounded text-center">
               <p className="text-xs text-slate-500">Parágrafos</p>
               <p className={`font-mono font-bold ${report.paragraphs >= 4 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                  {report.paragraphs}/4
               </p>
            </div>
            <div className="bg-slate-900/50 p-2 rounded text-center">
               <p className="text-xs text-slate-500">Linhas (Est.)</p>
               <p className={`font-mono font-bold ${(report.lineCount || 0) >= 20 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {report.lineCount}/30
               </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <button 
          onClick={onEdit}
          className="flex-1 py-3 rounded-lg border border-slate-600 text-slate-300 font-bold active:scale-95 transition-transform"
        >
          Editar Texto
        </button>
        <button 
          onClick={onNew}
          className="flex-1 py-3 rounded-lg bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-500 active:scale-95 transition-transform"
        >
          Nova Missão
        </button>
      </div>
    </div>
  );
}