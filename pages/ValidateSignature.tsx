
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';

interface ValidateSignatureProps {
  notify?: (m: string, t?: any) => void;
}

const ValidateSignature: React.FC<ValidateSignatureProps> = ({ notify }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const handleValidate = async () => {
    if (!file) return;
    setIsValidating(true);
    setResult(null);
    setAiExplanation('');
    setProgress(0);

    // Simulação de progresso de validação técnica
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    setTimeout(async () => {
      const mockResult = {
        isValid: Math.random() > 0.15,
        timestamp: new Date().toISOString(),
        signer: "JOAO DA SILVA:12345678900",
        issuer: "AC SOLUTI Multipla v5",
        integrity: true,
        expired: false,
        ocsp: "REVOCATION_CHECK_OK",
        trustChain: "VALID_CHAIN"
      };
      
      setResult(mockResult);
      
      const explanation = await geminiService.explainValidation(
        `Arquivo: ${file.name}, Tamanho: ${file.size} bytes, Tipo: ${file.type}`,
        mockResult
      );
      setAiExplanation(explanation);
      setIsValidating(false);
      
      if (notify) {
        notify(mockResult.isValid ? "Validação completa: Documento íntegro" : "Alerta: Falha na validação técnica", mockResult.isValid ? 'success' : 'error');
      }
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Verificador de Integridade</h2>
        <p className="text-slate-500">Valide assinaturas digitais, carimbos de tempo e cadeias de confiança.</p>
      </header>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
        {!file ? (
          <label className="w-full border-2 border-dashed border-slate-200 rounded-3xl p-16 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all group">
            <input type="file" className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
            <span className="text-6xl mb-6 group-hover:scale-110 transition-transform">🔍</span>
            <p className="text-xl font-black text-slate-700">Upload do Documento Assinado</p>
            <p className="text-sm text-slate-400 mt-2">Arraste arquivos PDF ou XML para verificação ICP-Brasil</p>
          </label>
        ) : (
          <div className="w-full space-y-6">
            <div className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-3xl shadow-lg animate-in slide-in-from-top-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl">📄</span>
                <div>
                  <p className="font-black truncate max-w-[250px]">{file.name}</p>
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Aguardando Análise Técnica</p>
                </div>
              </div>
              <button onClick={() => setFile(null)} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-bold transition-colors">Remover</button>
            </div>

            {!isValidating && !result && (
              <button 
                onClick={handleValidate}
                className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-blue-700 transition-all uppercase tracking-widest"
              >
                Verificar Integridade Agora
              </button>
            )}

            {isValidating && (
              <div className="space-y-4 py-6">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>Analisando Estrutura de Assinatura...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-300 shadow-lg shadow-blue-200" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {result && (
        <div className="animate-in fade-in slide-in-from-top-8 duration-700 space-y-6 pb-12">
          <div className={`p-8 rounded-3xl border shadow-xl flex flex-col md:flex-row items-center gap-8 ${result.isValid ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-inner ${result.isValid ? 'bg-emerald-500 text-white animate-pulse' : 'bg-red-500 text-white'}`}>
              {result.isValid ? '✓' : '!'}
            </div>
            <div className="text-center md:text-left">
              <h3 className={`text-2xl font-black uppercase tracking-tight ${result.isValid ? 'text-emerald-800' : 'text-red-800'}`}>
                {result.isValid ? 'Assinatura Íntegra e Autêntica' : 'Falha na Autenticação'}
              </h3>
              <p className="text-slate-600 font-medium mt-1">Signatário: <span className="font-bold text-slate-800">{result.signer}</span></p>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 p-4 opacity-5 text-[15rem] group-hover:scale-110 transition-transform duration-1000">✨</div>
            <div className="relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-6 flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span> 
                Explicação Assistida por IA (Gemini 3 Flash)
              </h4>
              <div className="prose prose-invert prose-blue max-w-none text-blue-50/90 text-sm leading-relaxed font-medium">
                {aiExplanation || 'Codificando análise semântica...'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center gap-4">
                <span className="text-2xl">🏛️</span>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Autoridade Certificadora</p>
                  <p className="font-bold text-slate-800">{result.issuer}</p>
                </div>
             </div>
             <div className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center gap-4">
                <span className="text-2xl">⏳</span>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Momento da Assinatura</p>
                  <p className="font-bold text-slate-800">{new Date(result.timestamp).toLocaleString('pt-BR')}</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidateSignature;
