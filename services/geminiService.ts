
import { GoogleGenAI } from "@google/genai";
import { logger } from "../utils/logger";

export const geminiService = {
  /**
   * Explica o resultado da validação técnica usando o modelo Gemini 3 Pro.
   */
  async explainValidation(documentInfo: string, validationResult: any) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analise como perito forense ICP-Brasil:
        Doc: ${documentInfo}
        Resultado: ${JSON.stringify(validationResult)}
        
        Explique a validade jurídica (MP 2.200-2/2001) e integridade criptográfica.`,
        config: {
          thinkingConfig: { thinkingBudget: 4000 }
        }
      });
      return response.text || "Análise técnica indisponível no momento.";
    } catch (error) {
      logger.error("Falha na IA Forense", error);
      return "Erro na análise de IA. Verifique as credenciais da API Gemini.";
    }
  },

  /**
   * Assistente técnico usando Gemini 3 Flash para Q&A rápido.
   */
  async askAssistant(userMessage: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Você é o SignPlus AI. Ajude o usuário com: ${userMessage}. 
        Contexto: Plataforma de assinatura digital ICP-Brasil e Nuvem Assinafy.`,
      });
      return response.text || "Não consegui processar sua dúvida.";
    } catch (error) {
      logger.error("Falha no Assistente AI", error);
      return "Assistente offline.";
    }
  }
};
