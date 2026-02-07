
import { GoogleGenAI, Type } from "@google/genai";
import { Expense } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (expenses: Expense[]) => {
  const expenseSummary = expenses.map(e => `${e.date}: ${e.description} (${e.category}) - R$ ${e.amount}`).join('\n');

  const prompt = `
    Como um consultor financeiro doméstico experiente e amigável chamado EcoFin, analise as despesas abaixo e forneça 3 insights estratégicos em português para ajudar o usuário a poupar e gerenciar melhor seu dinheiro.
    
    Seja específico, mencione categorias se necessário e dê dicas práticas (ex: "vi que gastou muito em lazer este mês, tente trocar por atividades gratuitas").
    
    Despesas atuais:
    ${expenseSummary}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "Você é o EcoFin, um consultor financeiro inteligente. Suas respostas devem ser curtas, impactantes e exclusivamente em formato JSON, seguindo rigorosamente o esquema definido.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Um título curto e chamativo para o conselho' },
              content: { type: Type.STRING, description: 'Uma explicação detalhada mas concisa de no máximo 200 caracteres' },
              severity: { type: Type.STRING, enum: ['low', 'medium', 'high'], description: 'A urgência ou importância do conselho' }
            },
            required: ['title', 'content', 'severity']
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Erro ao obter conselhos da IA:", error);
    return [{
      title: "IA Temporariamente Indisponível",
      content: "Continue registrando seus gastos. Em breve poderei te dar novas dicas!",
      severity: "low"
    }];
  }
};
