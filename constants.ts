import { HelpContent, ManualConnectives } from './types';

export const CONECTIVOS_INTER = ["Ademais", "Outrossim", "Além disso", "Portanto", "Logo", "Dessa forma", "Nesse contexto", "Diante disso", "Sob essa ótica"];
export const CONECTIVOS_INTRA = ["Visto que", "Já que", "Uma vez que", "Por conseguinte", "Consequentemente", "Todavia", "Contudo", "Entretanto", "Embora"];

export const TEMAS_STATIC = [
  { eixo: "Segurança Pública", titulo: "O desafio da segurança pública no Brasil", frase: "Com base na realidade brasileira, discuta os principais desafios para garantir a segurança da população e proponha medidas para enfrentá-los." },
  { eixo: "Tecnologia", titulo: "O impacto da IA no mercado de trabalho", frase: "Analise os efeitos da automação e inteligência artificial nas relações trabalhistas contemporâneas." }
];

export const REPERTORIOS_STATIC = [
  { fonte: "CF/88", texto: "Art. 144: A segurança pública é dever do Estado e direito e responsabilidade de todos." },
  { fonte: "Zygmunt Bauman", texto: "Vivemos tempos líquidos, onde nada é feito para durar." }
];

export const MANUAL_CONECTIVOS: ManualConnectives = {
  "Prioridade": ["Em primeiro lugar", "Primordialmente", "Sobretudo"],
  "Adição": ["Ademais", "Além disso", "Outrossim"],
  "Oposição": ["Todavia", "Contudo", "Entretanto", "No entanto"],
  "Conclusão": ["Portanto", "Logo", "Dessa forma", "Assim"],
  "Causa": ["Visto que", "Já que", "Porquanto"],
  "Consequência": ["Consequentemente", "De modo que", "Por conseguinte"]
};

export const HELP_DATA: { [key: string]: HelpContent } = {
  tema: {
    title: "Eixo Temático",
    text: "O 'Tema' é o assunto geral, mas a 'Frase Temática' é o seu alvo real. Para não zerar por fuga ao tema ou perder pontos por tangenciamento, você deve usar as palavras-chave da frase no seu texto."
  },
  conectivos: {
    title: "Munição de Coesão (C4)",
    text: "Essenciais para a Competência 4. 'Interparágrafos' ligam um parágrafo ao outro (obrigatório usar pelo menos 2). 'Intraparágrafos' ligam as orações dentro do mesmo parágrafo."
  },
  repertorio: {
    title: "Repertório Legitimado (C2)",
    text: "Para atingir nota máxima na Competência 2, você precisa de um repertório 'legitimado' (com autor conhecido) e 'produtivo' (conectado à discussão)."
  }
};