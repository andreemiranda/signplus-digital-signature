
import { GoogleGenAI, Type } from "@google/genai";

export const geminiService = {
  async explainValidation(documentInfo: string, validationResult: any) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Como um especialista em assinaturas digitais ICP-Brasil, explique detalhadamente por que esta assinatura é ${validationResult.isValid ? 'VÁLIDA' : 'INVÁLIDA'}. 
        Dados do documento: ${documentInfo}. 
        Resultado técnico: ${JSON.stringify(validationResult)}.
        Forneça a resposta em Português do Brasil, de forma clara, técnica e didática.`,
      });
      return response.text || "Não foi possível extrair a análise da IA.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Erro ao processar análise assistida. Por favor, verifique os detalhes técnicos manuais.";
    }
  },

  async suggestSealLayout(requirements: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Sugira um layout de selo de assinatura digital para: ${requirements}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              width: { type: Type.NUMBER },
              height: { type: Type.NUMBER },
              primaryColor: { type: Type.STRING },
              fields: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["width", "height", "primaryColor", "fields"]
          }
        }
      });
      const jsonStr = response.text;
      return jsonStr ? JSON.parse(jsonStr) : null;
    } catch (error) {
      console.error("Gemini Suggest Error:", error);
      return null;
    }
  }
};
