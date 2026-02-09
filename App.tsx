import React, { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import BottomNav from './components/Layout/BottomNav';
import MissionView from './components/Views/MissionView';
import EditorView from './components/Views/EditorView';
import ReportView from './components/Views/ReportView';
import ManualView from './components/Views/ManualView';
import HistoryView from './components/Views/HistoryView';
import HelpModal from './components/Modals/HelpModal';
import { Mission, Report, HistoryItem, HelpContent, Tab } from './types';
import { generateMissionStatic, analyzeTextLocal, getRandomConnectives } from './utils/localLogic';
import { generateMissionAI, analyzeTextAI } from './src/services/geminiService';
import { TEMAS_STATIC, REPERTORIOS_STATIC } from './constants';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import { supabase } from './src/services/supabase';

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

function App() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('mission');
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [text, setText] = useState<string>("");
  const [report, setReport] = useState<Report | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [helpModal, setHelpModal] = useState<HelpContent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize
  useEffect(() => {
    if (!user) return;

    if (!user) return;

    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('redacoes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error);
        // Fallback to local
        const savedHistory = localStorage.getItem('redacao_tactica_history');
        if (savedHistory) {
          try {
            setHistory(JSON.parse(savedHistory));
          } catch (e) {
            console.error("Failed to parse history", e);
          }
        }
      } else if (data) {
        // Map Supabase data to HistoryItem
        const mappedHistory: HistoryItem[] = data.map(item => ({
          mission: item.mission_data,
          result: item.nota,
          text: item.conteudo
        }));
        setHistory(mappedHistory);
      }
    };

    fetchHistory();

    // Start with a static mission if none exists
    if (!currentMission) {
      handleNewMissionStatic();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleNewMissionStatic = () => {
    const tema = TEMAS_STATIC[Math.floor(Math.random() * TEMAS_STATIC.length)];
    const repertorio = REPERTORIOS_STATIC[Math.floor(Math.random() * REPERTORIOS_STATIC.length)];

    const newMission: Mission = {
      id: Date.now(),
      type: 'static',
      tema,
      conectivos: getRandomConnectives(),
      repertorio,
      status: 'pending'
    };

    setCurrentMission(newMission);
    resetState();
  };

  const handleNewMissionAI = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const aiData = await generateMissionAI();

      const newMission: Mission = {
        id: Date.now(),
        type: 'ai',
        tema: {
          eixo: aiData.eixo,
          titulo: aiData.titulo,
          frase: aiData.frase
        },
        conectivos: getRandomConnectives(), // We can keep local connectives logic or ask AI, but local is safer/faster for this specific drill
        repertorio: aiData.repertorio,
        status: 'pending'
      };

      setCurrentMission(newMission);
      resetState();
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";

      // DEBUG: Show which project we are trying to reach
      // @ts-ignore
      const supabaseUrl = supabase['supabaseUrl'] || "unknown";
      const projectId = supabaseUrl.split('.')[0].replace('https://', '');

      setErrorMsg(`Falha (Proj: ${projectId}): ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setText("");
    setReport(null);
    setActiveTab('mission');
  };

  const handleAnalyze = async () => {
    if (!currentMission) return;

    setLoading(true);
    try {
      let result: Report;
      try {
        // Try AI first
        result = await analyzeTextAI(text, currentMission);
        result.type = 'ai';
      } catch (err) {
        console.warn("AI Analysis failed, falling back to local", err);
        // Fallback to local
        result = analyzeTextLocal(text, currentMission);
        result.type = 'local';
      }

      // Add common calculated fields that don't need AI
      result.lineCount = Math.max(text.split('\n').length, Math.ceil(text.length / 65));
      result.date = new Date().toLocaleDateString('pt-BR');

      setReport(result);
      saveToHistory(currentMission, result, text);
      setActiveTab('report');
    } catch (err) {
      console.error("Critical error during analysis", err);
      setErrorMsg("Erro crítico ao analisar o texto.");
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = async (mission: Mission, result: Report, textContent: string) => {
    const newItem: HistoryItem = { mission, result, text: textContent };
    const newHistory = [newItem, ...history];
    setHistory(newHistory);
    localStorage.setItem('redacao_tactica_history', JSON.stringify(newHistory));

    // Persist to Supabase if user is logged in
    if (user) {
      const { error } = await supabase.from('redacoes').insert({
        user_id: user.id,
        titulo: mission.tema.titulo,
        conteudo: textContent,
        nota: result,
        mission_data: mission,
        created_at: new Date().toISOString()
      });
      if (error) console.error('Error saving to Supabase:', error);
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setCurrentMission(item.mission);
    setReport(item.result);
    setText(item.text);
    setActiveTab('report');
  };

  if (authLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-500">Iniciando Sistemas...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 flex flex-col">
        <Header />
        <main className="flex-1 p-4 max-w-md mx-auto w-full flex items-center justify-center">
          <Login />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 flex flex-col">
      <Header />

      <main className="flex-1 p-4 max-w-md mx-auto w-full mb-16 relative">
        {activeTab === 'mission' && (
          <MissionView
            mission={currentMission}
            loading={loading}
            error={errorMsg}
            onNewStatic={handleNewMissionStatic}
            onNewAI={handleNewMissionAI}
            onAccept={() => setActiveTab('editor')}
            onHelp={setHelpModal}
          />
        )}

        {activeTab === 'editor' && (
          <EditorView
            text={text}
            setText={setText}
            loading={loading}
            onAnalyze={handleAnalyze}
          />
        )}

        {activeTab === 'report' && (
          <ReportView
            report={report}
            onEdit={() => setActiveTab('editor')}
            onNew={() => { resetState(); handleNewMissionStatic(); }}
          />
        )}

        {activeTab === 'manual' && <ManualView />}

        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onSelect={loadHistoryItem}
          />
        )}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {helpModal && (
        <HelpModal content={helpModal} onClose={() => setHelpModal(null)} />
      )}
    </div>
  );
}