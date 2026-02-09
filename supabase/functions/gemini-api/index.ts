import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI, SchemaType } from "https://esm.sh/@google/generative-ai@0.12.0";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const API_KEY = Deno.env.get('GEMINI_API_KEY');
        if (!API_KEY) {
            throw new Error('GEMINI_API_KEY is not set');
        }

        const { action, payload } = await req.json();
        const genAI = new GoogleGenerativeAI(API_KEY);

        let result;

        if (action === 'generateMission') {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Gere um tema de redação inédito e de alto nível de complexidade, voltado para concursos de carreiras policiais. O tema deve focar obrigatoriamente em dilemas éticos, problemas sociológicos ou segurança pública tangível. Retorne APENAS um objeto JSON.`;

            // Using JSON mode with correct schema setup for the new SDK
            const generationConfig = {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        eixo: { type: SchemaType.STRING },
                        titulo: { type: SchemaType.STRING },
                        frase: { type: SchemaType.STRING },
                        repertorio: {
                            type: SchemaType.OBJECT,
                            properties: {
                                fonte: { type: SchemaType.STRING },
                                texto: { type: SchemaType.STRING }
                            }
                        }
                    }
                }
            };

            const resultGen = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig
            });
            result = JSON.parse(resultGen.response.text());

        } else if (action === 'analyzeText') {
            const { text, mission } = payload;
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

            const prompt = `Você é um corretor rigoroso de redação para concursos (PMRJ/ENEM).
      Analise a seguinte redação com base no tema: "${mission.tema.titulo}".
      
      Verifique:
      1. Uso dos conectivos obrigatórios: ${mission.conectivos.inter.join(', ')} (interparágrafos) e ${mission.conectivos.intra.join(', ')} (intraparágrafos).
      2. Estrutura dissertativa (Introdução, D1, D2, Conclusão).
      3. Respeito aos Direitos Humanos (violações zeram a nota).
      4. Qualidade argumentativa.
    
      Texto do aluno:
      "${text}"`;

            const generationConfig = {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        score: { type: SchemaType.NUMBER },
                        usedInter: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    word: { type: SchemaType.STRING },
                                    used: { type: SchemaType.BOOLEAN }
                                }
                            }
                        },
                        paragraphs: { type: SchemaType.NUMBER },
                        violation: { type: SchemaType.STRING, nullable: true },
                        feedback: { type: SchemaType.STRING },
                        checklist_c5: { type: SchemaType.BOOLEAN }
                    }
                }
            };

            const resultGen = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig
            });
            result = JSON.parse(resultGen.response.text());

        } else if (action === 'transcribeImage') {
            const { base64Image } = payload;
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            const prompt = "Transcreva este texto manuscrito exatamente como ele aparece. Se houver partes ilegíveis, marque como [ilegível]. Mantenha a pontuação e estrutura de parágrafos original.";

            // Extract base64 part if it contains data URI scheme
            const base64Data = base64Image.includes('base64,') ? base64Image.split('base64,')[1] : base64Image;

            const resultGen = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: "image/jpeg",
                    },
                },
            ]);
            result = resultGen.response.text();
        } else {
            throw new Error('Invalid action');
        }

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
