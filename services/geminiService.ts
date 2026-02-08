
import { GoogleGenAI } from "@google/genai";

export const geminiService = {
  /**
   * Explica o resultado da validação técnica usando o modelo Gemini 3 Pro.
   * Complex Text Task (advanced reasoning)
   */
  async explainValidation(documentInfo: string, validationResult: any) {
    try {
      // Fix: Use process.env.API_KEY exclusively and create a new instance right before making an API call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Como perito digital especializado em ICP-Brasil, analise o seguinte resultado de validação técnica:
        - Documento: ${documentInfo}
        - Dados Técnicos: ${JSON.stringify(validationResult)}
        
        Explique se o documento possui validade jurídica plena de acordo com a MP 2.200-2/2001 e a Lei 14.063/2020.`,
        config: {
          thinkingConfig: { thinkingBudget: 2000 }
        }
      });
      // Fix: Access the .text property directly instead of calling a method
      return response.text || "Não foi possível gerar a explicação técnica.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Ocorreu um erro na análise de IA. Verifique a conexão.";
    }
  },

  /**
   * Assistente técnico para dúvidas sobre o sistema e assinaturas digitais usando Gemini 3 Flash.
   * Basic Text Task (simple Q&A)
   */
  async askAssistant(userMessage: string, context?: string) {
    try {
      // Fix: Use process.env.API_KEY exclusively and create a new instance right before making an API call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Você é o SignPlus AI, um assistente técnico especialista em assinaturas digitais, criptografia e integração com a API Assinafy.
        
        Contexto Atual:
        - O app utiliza a API v1 da Assinafy.
        - Autenticação via cabeçalho 'X-Api-Key'.
        - Endpoints principais envolvem /accounts/:id/documents e /documents/:id/assignments.
        - O usuário pode estar tendo problemas de 401 (Auth) ou 400 (Payload).
        
        Pergunta do usuário: ${userMessage}`,
      });
      // Fix: Access the .text property directly instead of calling a method
      return response.text || "Peço desculpas, mas não consegui processar sua dúvida agora.";
    } catch (error) {
      console.error("Assistant Error:", error);
      return "Assistente temporariamente indisponível.";
    }
  }
};
