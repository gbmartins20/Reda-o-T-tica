import { supabase } from './supabase';
import { Mission, Report } from '../../types';

export const generateMissionAI = async (): Promise<{
  eixo: string;
  titulo: string;
  frase: string;
  repertorio: { fonte: string; texto: string };
}> => {
  const { data, error } = await supabase.functions.invoke('gemini-api', {
    body: { action: 'generateMission' }
  });

  if (error) throw new Error(error.message || 'Erro ao gerar missão via IA');
  return data;
};

export const analyzeTextAI = async (text: string, mission: Mission): Promise<Report> => {
  const { data, error } = await supabase.functions.invoke('gemini-api', {
    body: {
      action: 'analyzeText',
      payload: { text, mission }
    }
  });

  if (error) throw new Error(error.message || 'Erro ao analisar texto via IA');
  return data;
};

export const transcribeImageAI = async (base64Image: string): Promise<string> => {
  const { data, error } = await supabase.functions.invoke('gemini-api', {
    body: {
      action: 'transcribeImage',
      payload: { base64Image }
    }
  });

  if (error) throw new Error(error.message || 'Erro ao transcrever imagem via IA');
  return data;
}