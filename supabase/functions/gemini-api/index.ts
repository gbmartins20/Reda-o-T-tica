import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

        // Helper to call Gemini API via REST
        const callGemini = async (model: string, body: any) => {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
            }

            return await response.json();
        };

        let result;

        if (action === 'generateMission') {
            const prompt = `Gere um tema de redação inédito e de alto nível de complexidade, voltado para concursos de carreiras policiais. O tema deve focar obrigatoriamente em dilemas éticos, problemas sociológicos ou segurança pública tangível. Retorne APENAS um objeto JSON.`;

            const requestBody = {
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            eixo: { type: "STRING" },
                            titulo: { type: "STRING" },
                            frase: { type: "STRING" },
                            repertorio: {
                                type: "OBJECT",
                                properties: {
                                    fonte: { type: "STRING" },
                                    texto: { type: "STRING" }
                                }
                            }
                        }
                    }
                }
            };

            const data = await callGemini('gemini-1.5-flash', requestBody);
            // Parse the JSON string from the response text
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
                const text = data.candidates[0].content.parts[0].text;
                result = JSON.parse(text);
            } else {
                throw new Error('Invalid response format from Gemini');
            }

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

            const requestBody = {
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            score: { type: "NUMBER" },
                            usedInter: {
                                type: "ARRAY",
                                items: {
                                    type: "OBJECT",
                                    properties: {
                                        word: { type: "STRING" },
                                        used: { type: "BOOLEAN" }
                                    }
                                }
                            },
                            paragraphs: { type: "NUMBER" },
                            violation: { type: "STRING", nullable: true },
                            feedback: { type: "STRING" },
                            checklist_c5: { type: "BOOLEAN" }
                        }
                    }
                }
            };

            const data = await callGemini('gemini-1.5-pro', requestBody);
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
                const text = data.candidates[0].content.parts[0].text;
                result = JSON.parse(text);
            } else {
                throw new Error('Invalid response format from Gemini');
            }

        } else if (action === 'transcribeImage') {
            const { base64Image } = payload;
            const prompt = "Transcreva este texto manuscrito exatamente como ele aparece. Se houver partes ilegíveis, marque como [ilegível]. Mantenha a pontuação e estrutura de parágrafos original.";

            // Extract base64 part if it contains data URI scheme
            const base64Data = base64Image.includes('base64,') ? base64Image.split('base64,')[1] : base64Image;

            const requestBody = {
                contents: [{
                    parts: [
                        { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
                        { text: prompt }
                    ]
                }]
            };

            const data = await callGemini('gemini-1.5-pro', requestBody);
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
                result = data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Invalid response format from Gemini');
            }
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
