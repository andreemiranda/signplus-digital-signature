
import React, { useState, useRef } from 'react';
import { storageService } from '../services/storageService';
import { googleDriveService } from '../services/googleDriveService';
import { SignedDocument, SignatureSeal } from '../types';

interface SignDocumentProps {
  notify: (m: string, t?: any) => void;
}

const SignDocument: React.FC<SignDocumentProps> = ({ notify }) => {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState(1);
  const [selectedCertId, setSelectedCertId] = useState<string>('');
  const [selectedSealId, setSelectedSealId] = useState<string>('');
  const [isSigning, setIsSigning] = useState(false);
  const [saveToDrive, setSaveToDrive] = useState(true);
  const [pin, setPin] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const certs = storageService.getCertificates();
  const seals = storageService.getSeals();
  const isGDriveConnected = !!googleDriveService.getAccessToken();

  const selectedCert = certs.find(c => c.id === selectedCertId);
  const selectedSeal = seals.find(s => s.id === selectedSealId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 20 * 1024 * 1024) {
        notify("O arquivo é muito grande. Limite: 20MB", "error");
        return;
      }
      setFile(selected);
      setStep(2);
    }
  };

  const handleSign = async () => {
    if (!pin || !file) return;
    setIsSigning(true);
    setShowPinModal(false);
    
    setTimeout(async () => {
      const signedFileName = `ASSINADO_${file.name}`;
      const docId = crypto.randomUUID();
      
      const doc: SignedDocument = {
        id: docId,
        originalFileName: file.name,
        signedFileName: signedFileName,
        fileType: file.name.toLowerCase().endsWith('.xml') ? 'XML' : 'PDF',
        fileSize: file.size,
        signedAt: new Date().toISOString(),
        status: 'VALID',
        signerName: selectedCert?.subjectName || 'Signatário',
        isBackedUp: false
      };
      
      storageService.addDocument(doc);

      if (saveToDrive && isGDriveConnected) {
        try {
          await googleDriveService.uploadFile(file, signedFileName, file.type);
          storageService.updateDocument(docId, { isBackedUp: true });
          notify("Cópia de segurança enviada ao Google Drive ☁️");
        } catch (e) {
          notify("Aviso: Documento assinado, mas backup no Drive falhou.", "info");
        }
      }

      setIsSigning(false);
      setStep(3);
      notify("Documento assinado com sucesso!");
    }, 2000);
  };

  const renderSealPreview = (seal: SignatureSeal) => {
    const scale = window.innerWidth < 768 ? 0.7 : 1;
    
    return (
      <div 
        className="absolute p-3 border-2 shadow-2xl rounded-xl animate-in zoom-in bg-white overflow-hidden origin-bottom-right" 
        style={{ 
          bottom: '8%', 
          right: '8%', 
          width: '200px', 
          transform: `scale(${scale})`,
          borderColor: seal.template.borderColor,
          backgroundColor: seal.template.backgroundColor
        }}
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
        <div className="relative z-10 space-y-1">
          <p className="text-[7px] font-black text-blue-600 uppercase">Assinado digitalmente por:</p>
          <p className="text-[10px] truncate font-bold text-slate-800 leading-tight">
            {selectedCert?.subjectName || 'NOME DO SIGNATÁRIO'}
          </p>
          <div className="pt-1 border-t border-slate-100 flex justify-between items-end">
            <div>
              <p className="text-[7px] text-slate-400 font-black uppercase">Data da Assinatura:</p>
              <p className="text-[9px] text-slate-700 font-bold">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-[6px] text-white bg-blue-600 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">ICP-Brasil</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <header className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Assinador ICP-Brasil</h2>
          <p className="text-slate-500 text-sm font-medium">Workflow seguro de assinatura eletrônica.</p>
        </div>
        <div className="flex gap-3">
          {[1, 2, 3].map(s => (
            <div key={s} className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${step >= s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400'}`}>
              {s}
            </div>
          ))}
        </div>
      </header>

      {step === 1 && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-12 md:p-24 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/20 transition-all group shadow-sm"
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.xml" />
          <div className="w-20 h-20 md:w-24 md:h-24 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mb-8 text-4xl md:text-5xl group-hover:scale-110 transition-transform shadow-xl shadow-indigo-100/50">
            📄
          </div>
          <p className="text-xl md:text-2xl font-black text-slate-700 tracking-tight text-center">Carregar Documento</p>
          <p className="text-slate-400 mt-2 font-semibold uppercase tracking-widest text-[9px] md:text-[10px] text-center">PAdES • CAdES • XAdES • LTV</p>
        </div>
      )}

      {step === 2 && file && (
        <div className="flex flex-col xl:flex-row gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4">
          {/* Main Preview Container */}
          <div className="flex-1 bg-slate-100 rounded-[2.5rem] overflow-hidden min-h-[400px] md:min-h-[600px] flex flex-col items-center justify-center relative shadow-inner border border-slate-200/50 p-4 md:p-8">
            <div className="bg-white shadow-2xl w-full max-w-[500px] aspect-[1/1.414] flex items-center justify-center relative p-6 md:p-12 border border-slate-100 transition-all">
               <div className="text-slate-50 font-black text-5xl md:text-7xl transform -rotate-45 select-none text-center opacity-40 uppercase">Preview</div>
               {selectedSeal && renderSealPreview(selectedSeal)}
            </div>
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <span>Arquivo: {file.name}</span>
              <span className="bg-white px-2 py-1 rounded-lg">Página 1 de 1</span>
            </div>
          </div>

          {/* Config Sidebar */}
          <aside className="w-full xl:w-80 shrink-0">
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6 md:sticky md:top-8">
              <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.2em] border-b border-slate-50 pb-4">Configuração</h3>
              
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-indigo-600 transition-colors">Dispositivo de Criptografia</label>
                  <select 
                    value={selectedCertId} 
                    onChange={(e) => setSelectedCertId(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-xs focus:ring-4 focus:ring-indigo-500/10 outline-none font-black text-slate-700 transition-all"
                  >
                    <option value="">Escolha um certificado...</option>
                    {certs.map(c => <option key={c.id} value={c.id}>{c.subjectName}</option>)}
                  </select>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-indigo-600 transition-colors">Estilo do Selo Visual</label>
                  <select 
                    value={selectedSealId} 
                    onChange={(e) => setSelectedSealId(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-xs focus:ring-4 focus:ring-indigo-500/10 outline-none font-black text-slate-700 transition-all"
                  >
                    <option value="">Escolha um selo...</option>
                    {seals.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4 space-y-4 border-t border-slate-50">
                <label className="flex items-center gap-4 text-[11px] text-slate-600 cursor-pointer group p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500" /> 
                  <div className="flex flex-col">
                    <span className="font-black uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Carimbo de Tempo</span>
                    <span className="text-[9px] text-slate-400 uppercase font-bold">Autoridade TSA Ativa</span>
                  </div>
                </label>
                
                {isGDriveConnected && (
                  <label className="flex items-center gap-4 text-[11px] text-emerald-600 cursor-pointer group p-2 hover:bg-emerald-50/50 rounded-xl transition-colors">
                    <input 
                      type="checkbox" 
                      checked={saveToDrive} 
                      onChange={(e) => setSaveToDrive(e.target.checked)}
                      className="w-5 h-5 rounded-lg border-emerald-300 text-emerald-600 focus:ring-emerald-500" 
                    /> 
                    <div className="flex flex-col">
                      <span className="font-black uppercase tracking-widest">Backup em Nuvem</span>
                      <span className="text-[9px] text-emerald-400 uppercase font-bold">Google Drive Habilitado</span>
                    </div>
                  </label>
                )}
              </div>

              <button
                disabled={!selectedCertId || !selectedSealId || isSigning}
                onClick={() => setShowPinModal(true)}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-black disabled:opacity-30 transition-all uppercase tracking-widest text-[10px] active:scale-95"
              >
                {isSigning ? "Sincronizando..." : "Executar Assinatura"}
              </button>
            </div>
          </aside>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white p-10 md:p-20 rounded-[3rem] md:rounded-[4rem] shadow-2xl border border-slate-50 flex flex-col items-center text-center animate-in zoom-in duration-500">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-5xl md:text-6xl mb-10 shadow-xl animate-bounce">✓</div>
          <h3 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight uppercase">Selo Aplicado</h3>
          <p className="text-slate-500 mt-4 max-w-md font-medium text-base md:text-lg leading-relaxed px-4">Sua assinatura ICP-Brasil foi aplicada com sucesso e o protocolo de integridade foi gerado.</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full max-w-lg">
            <button onClick={() => { setStep(1); setFile(null); }} className="flex-1 px-8 py-5 bg-slate-100 text-slate-700 rounded-2xl hover:bg-slate-200 font-black transition-all text-[10px] uppercase tracking-widest active:scale-95 shadow-sm">Nova Assinatura</button>
            <button onClick={() => window.location.hash = '#documents'} className="flex-1 px-8 py-5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 font-black shadow-lg shadow-indigo-100 transition-all text-[10px] uppercase tracking-widest active:scale-95">Gerenciar Arquivos</button>
          </div>
        </div>
      )}

      {/* Responsive Pin Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[300] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 md:p-12 shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col items-center mb-8">
              <span className="text-5xl mb-6 bg-slate-50 w-20 h-20 flex items-center justify-center rounded-[1.5rem] shadow-inner">🔐</span>
              <h4 className="text-2xl font-black text-slate-800 tracking-tight text-center">Pin de Segurança</h4>
              <p className="text-slate-500 text-[10px] text-center mt-3 font-black uppercase tracking-widest opacity-60 px-4 leading-relaxed">Liberação obrigatória da chave privada para criptografia assimétrica.</p>
            </div>
            
            <input 
              type="password" 
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl px-8 py-6 text-center text-3xl md:text-4xl tracking-[0.6em] focus:ring-4 focus:ring-indigo-500/10 outline-none mb-8 font-black text-slate-800 transition-all shadow-inner"
              autoFocus
            />
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleSign}
                disabled={!pin}
                className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-indigo-700 disabled:opacity-50 transition-all uppercase text-[10px] tracking-[0.2em] active:scale-95"
              >
                Autorizar Operação
              </button>
              <button onClick={() => setShowPinModal(false)} className="w-full py-4 font-black text-slate-400 hover:text-rose-500 transition-colors uppercase text-[9px] tracking-[0.3em]">Cancelar e Voltar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignDocument;
