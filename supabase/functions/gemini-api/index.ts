import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI, Type } from "https://esm.sh/@google/genai@0.1.1";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const API_KEY = Deno.env.get('GEMINI_API_KEY');
        if (!API_KEY) {
            throw new Error('GEMINI_API_KEY is not set');
        }

        const { action, payload } = await req.json();
        const genAI = new GoogleGenAI({ apiKey: API_KEY });

        let result;
        const modelId = 'gemini-1.5-flash'; // Usando modelo estável compatível

        if (action === 'generateMission') {
            const prompt = `Gere um tema de redação inédito e de alto nível de complexidade, voltado para concursos de carreiras policiais. O tema deve focar obrigatoriamente em dilemas éticos, problemas sociológicos ou segurança pública tangível. Retorne APENAS um objeto JSON.`;

            const response = await genAI.models.generateContent({
                model: modelId,
                contents: { role: 'user', parts: [{ text: prompt }] },
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
            result = JSON.parse(response.text());

        } else if (action === 'analyzeText') {
            const { text, mission } = payload;
            const prompt = `Você é um corretor rigoroso de redação para concursos (PMRJ/ENEM).
      Analise a seguinte redação com base no tema: "${mission.tema.titulo}".
      
      Verifique:
      1. Uso dos conectivos obrigatórios: ${mission.conectivos.inter.join(', ')} (interparágrafos) e ${mission.conectivos.intra.join(', ')} (intraparágrafos).
      2. Estrutura dissertativa (Introdução, D1, D2, Conclusão).
      3. Respeito aos Direitos Humanos (violações zeram a nota).
      4. Qualidade argumentativa.
    
      Texto do aluno:
      "${text}"`;

            const response = await genAI.models.generateContent({
                model: 'gemini-1.5-pro', // Usando modelo Pro para análise
                contents: { role: 'user', parts: [{ text: prompt }] },
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
            result = JSON.parse(response.text());

        } else if (action === 'transcribeImage') {
            const { base64Image } = payload;
            const prompt = "Transcreva este texto manuscrito exatamente como ele aparece. Se houver partes ilegíveis, marque como [ilegível]. Mantenha a pontuação e estrutura de parágrafos original.";

            const response = await genAI.models.generateContent({
                model: 'gemini-1.5-pro',
                contents: {
                    parts: [
                        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                        { text: prompt }
                    ]
                }
            });
            result = response.text();
        } else {
            throw new Error('Invalid action');
        }

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
