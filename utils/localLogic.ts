import { CONECTIVOS_INTER, CONECTIVOS_INTRA, TEMAS_STATIC, REPERTORIOS_STATIC } from '../constants';
import { ConnectiveSet, Mission, Report } from '../types';

export const getRandomConnectives = (): ConnectiveSet => {
  const inter1 = CONECTIVOS_INTER[Math.floor(Math.random() * CONECTIVOS_INTER.length)];
  let inter2 = CONECTIVOS_INTER[Math.floor(Math.random() * CONECTIVOS_INTER.length)];
  while (inter1 === inter2) inter2 = CONECTIVOS_INTER[Math.floor(Math.random() * CONECTIVOS_INTER.length)];
  
  const intra: string[] = [];
  while (intra.length < 3) {
    const c = CONECTIVOS_INTRA[Math.floor(Math.random() * CONECTIVOS_INTRA.length)];
    if (!intra.includes(c)) intra.push(c);
  }
  return { inter: [inter1, inter2], intra };
};

export const generateMissionStatic = (): Mission => {
    const tema = TEMAS_STATIC[Math.floor(Math.random() * TEMAS_STATIC.length)];
    const repertorio = REPERTORIOS_STATIC[Math.floor(Math.random() * REPERTORIOS_STATIC.length)];
    
    return {
      id: Date.now(),
      type: 'static',
      tema,
      conectivos: getRandomConnectives(),
      repertorio,
      status: 'pending'
    };
}

export const analyzeTextLocal = (text: string, mission: Mission): Report => {
    const lowerText = text.toLowerCase();
    const usedInter = mission.conectivos.inter.map(c => ({ 
        word: c, 
        used: lowerText.includes(c.toLowerCase()) 
    }));
    
    // Simple paragraph detection (double newline)
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    
    let score = 200; // Base score
    score += paragraphs >= 4 ? 200 : 0;
    score += usedInter.filter(i => i.used).length * 100;
    
    // Cap score
    if (score > 1000) score = 1000;

    return {
      score,
      paragraphs,
      usedInter,
      violation: null,
      feedback: "Correção offline básica realizada. Conecte-se para feedback detalhado da IA.",
      checklist_c5: false
    };
};