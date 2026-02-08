import React, { useRef, useState } from 'react';
import { PenTool, Sparkles, Loader2, Camera, AlertCircle } from 'lucide-react';
import { transcribeImageAI } from '../../services/geminiService';

interface EditorViewProps {
  text: string;
  setText: (text: string) => void;
  loading: boolean;
  onAnalyze: () => void;
}

export default function EditorView({ text, setText, loading, onAnalyze }: EditorViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [transcribeError, setTranscribeError] = useState<string | null>(null);

  const lineCount = Math.max(text.split('\n').length, Math.ceil(text.length / 65));
  const lineStatus = lineCount < 20 ? "text-red-400" : lineCount > 30 ? "text-yellow-400" : "text-emerald-400";

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setTranscribing(true);
    setTranscribeError(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = (reader.result as string).replace(/^data:image\/[a-z]+;base64,/, "");
        const transcribedText = await transcribeImageAI(base64String);
        setText(transcribedText);
      } catch (error) {
        console.error("Transcription error:", error);
        setTranscribeError("Falha ao ler imagem. Tente novamente.");
      } finally {
        setTranscribing(false);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input so user can select same file again if needed
    event.target.value = '';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="flex justify-between items-center mb-2 px-1">
        <h2 className="font-bold text-white flex items-center gap-2">
          <PenTool className="w-4 h-4 text-emerald-400" />
          Zona de Combate
        </h2>
        <div className={`text-xs font-mono font-bold ${lineStatus} bg-slate-800 px-2 py-1 rounded transition-colors duration-300`}>
          {lineCount} / 30 linhas
        </div>
      </div>

      {loading ? (
        <div className="flex-1 bg-slate-800 rounded-lg flex flex-col items-center justify-center space-y-4 animate-pulse">
           <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
           <p className="text-slate-300 font-mono text-sm">A IA está corrigindo sua redação...</p>
           <p className="text-slate-500 text-xs">Verificando 5 competências...</p>
        </div>
      ) : transcribing ? (
        <div className="flex-1 bg-slate-800 rounded-lg flex flex-col items-center justify-center space-y-4 animate-pulse">
           <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
           <p className="text-slate-300 font-mono text-sm">Transcrevendo manuscrito...</p>
           <p className="text-slate-500 text-xs">A IA está lendo sua letra...</p>
        </div>
      ) : (
        <div className="relative flex-1 flex flex-col gap-2">
           {transcribeError && (
             <div className="bg-red-900/50 text-red-200 text-xs p-2 rounded border border-red-500/50 flex items-center gap-2">
               <AlertCircle className="w-3 h-3"/>
               {transcribeError}
             </div>
           )}
           <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 w-full bg-slate-800 text-slate-100 p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono text-sm leading-relaxed"
            placeholder="Comece sua redação aqui ou escaneie uma foto..."
            spellCheck={false}
          />
          
          <div className="absolute bottom-4 right-4 z-10">
             <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
             />
             <button 
               onClick={() => fileInputRef.current?.click()}
               className="bg-slate-700/80 hover:bg-purple-600/80 backdrop-blur-sm text-white p-3 rounded-full shadow-lg transition-all"
               title="Escanear Manuscrito (IA)"
             >
               <Camera className="w-5 h-5" />
             </button>
          </div>
        </div>
      )}

      <div className="mt-4">
        <button 
          onClick={onAnalyze}
          disabled={text.length < 50 || loading || transcribing}
          className="w-full py-4 rounded-lg bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold shadow-lg flex items-center justify-center gap-2 text-lg active:scale-95 transition-transform"
        >
          {loading ? 'ANALISANDO...' : (
            <>
              <Sparkles className="w-5 h-5" />
              CORREÇÃO TÁTICA (IA)
            </>
          )}
        </button>
      </div>
    </div>
  );
}