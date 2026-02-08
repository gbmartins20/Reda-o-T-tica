import { GoogleGenAI, Type } from "@google/genai";
import { Mission, Report } from '../types';

const getAI = () => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const generateMissionAI = async (): Promise<{
  eixo: string;
  titulo: string;
  frase: string;
  repertorio: { fonte: string; texto: string };
}> => {
  const ai = getAI();
  const prompt = `Gere um tema de redação inédito e desafiador para um concurso público de carreiras policiais ou ENEM.
  Retorne APENAS um objeto JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          eixo: { type: Type.STRING },
          titulo: { type: Type.STRING },
          frase: { type: Type.STRING },
          repertorio: {
            type: Type.OBJECT,
            properties: {
              fonte: { type: Type.STRING },
              texto: { type: Type.STRING }
            }
          }
        }
      }
    }
  });

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(response.text);
};

export const analyzeTextAI = async (text: string, mission: Mission): Promise<Report> => {
  const ai = getAI();
  const prompt = `Você é um corretor rigoroso de redação para concursos (PMRJ/ENEM).
  Analise a seguinte redação com base no tema: "${mission.tema.titulo}".
  
  Verifique:
  1. Uso dos conectivos obrigatórios: ${mission.conectivos.inter.join(', ')} (interparágrafos) e ${mission.conectivos.intra.join(', ')} (intraparágrafos).
  2. Estrutura dissertativa (Introdução, D1, D2, Conclusão).
  3. Respeito aos Direitos Humanos (violações zeram a nota).
  4. Qualidade argumentativa.

  Texto do aluno:
  "${text}"`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', // Pro model for better reasoning
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          usedInter: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                used: { type: Type.BOOLEAN }
              }
            }
          },
          paragraphs: { type: Type.NUMBER },
          violation: { type: Type.STRING, nullable: true },
          feedback: { type: Type.STRING },
          checklist_c5: { type: Type.BOOLEAN }
        }
      }
    }
  });

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(response.text);
};

export const transcribeImageAI = async (base64Image: string): Promise<string> => {
  const ai = getAI();
  const prompt = "Transcreva este texto manuscrito exatamente como ele aparece. Se houver partes ilegíveis, marque como [ilegível]. Mantenha a pontuação e estrutura de parágrafos original.";

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        },
        { text: prompt }
      ]
    }
  });

  if (!response.text) throw new Error("Failed to transcribe image");
  return response.text;
}