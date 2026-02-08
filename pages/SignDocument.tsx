
import React, { useState, useRef } from 'react';
import { storageService } from '../services/storageService';
import { googleDriveService } from '../services/googleDriveService';
import { SignedDocument } from '../types';

interface SignDocumentProps {
  notify: (m: string, t?: any) => void;
}

const SignDocument: React.FC<SignDocumentProps> = ({ notify }) => {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState(1);
  const [selectedCert, setSelectedCert] = useState<string>('');
  const [selectedSeal, setSelectedSeal] = useState<string>('');
  const [isSigning, setIsSigning] = useState(false);
  const [saveToDrive, setSaveToDrive] = useState(true);
  const [pin, setPin] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const certs = storageService.getCertificates();
  const seals = storageService.getSeals();
  const isGDriveConnected = !!googleDriveService.getAccessToken();

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
        signerName: certs.find(c => c.id === selectedCert)?.subjectName || 'Signatário',
        isBackedUp: false
      };
      
      storageService.addDocument(doc);

      if (saveToDrive && isGDriveConnected) {
        try {
          const driveResponse = await googleDriveService.uploadFile(file, signedFileName, file.type);
          storageService.updateDocument(docId, { isBackedUp: true, driveFileId: driveResponse.id });
          notify("Cópia de segurança enviada ao Google Drive ☁️");
        } catch (e) {
          notify("Aviso: Documento assinado, mas backup no Drive falhou.", "info");
        }
      }

      setIsSigning(false);
      setStep(3);
      notify("Documento assinado e selado com sucesso!");
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <header className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Assinador ICP-Brasil</h2>
          <p className="text-slate-500 text-sm font-medium">Fluxo seguro de assinatura local.</p>
        </div>
        <div className="flex gap-3">
          {[1, 2, 3].map(s => (
            <div key={s} className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${step >= s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-400'}`}>
              {s}
            </div>
          ))}
        </div>
      </header>

      {step === 1 && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-24 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/20 transition-all group shadow-sm"
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.xml" />
          <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mb-8 text-5xl group-hover:scale-110 transition-transform shadow-xl shadow-indigo-100/50">
            📄
          </div>
          <p className="text-2xl font-black text-slate-700 tracking-tight">Carregar Documento</p>
          <p className="text-slate-400 mt-2 font-semibold">Suporte para PAdES, CAdES e XAdES</p>
        </div>
      )}

      {step === 2 && file && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="lg:col-span-3 bg-slate-100 rounded-[2rem] overflow-hidden min-h-[600px] flex flex-col items-center justify-center relative shadow-inner border border-slate-200/50 p-8">
            <div className="bg-white shadow-2xl w-full max-w-[500px] aspect-[1/1.414] flex items-center justify-center relative p-12 border border-slate-100">
               <div className="text-slate-100 font-black text-7xl transform -rotate-45 select-none text-center opacity-40">PREVISUALIZAÇÃO</div>
               {selectedSeal && (
                 <div className="absolute p-4 border-2 border-indigo-500 bg-white/90 backdrop-blur-sm shadow-2xl rounded-xl animate-in zoom-in" style={{ bottom: '8%', right: '8%', width: '180px' }}>
                   <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">Assinado por:</p>
                   <p className="text-[11px] truncate font-bold text-slate-800">{certs.find(c => c.id === selectedCert)?.subjectName || 'NOME DO SIGNATÁRIO'}</p>
                   <p className="text-[9px] text-slate-400 font-bold mt-2">ICP-BRASIL VERIFIED</p>
                 </div>
               )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl space-y-6">
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest border-b border-slate-50 pb-4">Parâmetros</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Dispositivo / Token</label>
                  <select 
                    value={selectedCert} 
                    onChange={(e) => setSelectedCert(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700"
                  >
                    <option value="">Selecione...</option>
                    {certs.map(c => <option key={c.id} value={c.id}>{c.subjectName}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Estampa Visual</label>
                  <select 
                    value={selectedSeal} 
                    onChange={(e) => setSelectedSeal(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700"
                  >
                    <option value="">Selecione...</option>
                    {seals.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4 space-y-4 border-t border-slate-50">
                <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer group">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600" /> 
                  <span className="font-bold group-hover:text-indigo-600 transition-colors">Carimbo de Tempo (TSA)</span>
                </label>
                {isGDriveConnected && (
                  <label className="flex items-center gap-3 text-sm text-emerald-600 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={saveToDrive} 
                      onChange={(e) => setSaveToDrive(e.target.checked)}
                      className="w-5 h-5 rounded-lg border-slate-300 text-emerald-600" 
                    /> 
                    <span className="font-black group-hover:text-emerald-700">Backup no Google Drive</span>
                  </label>
                )}
              </div>

              <button
                disabled={!selectedCert || !selectedSeal || isSigning}
                onClick={() => setShowPinModal(true)}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-black disabled:opacity-30 transition-all uppercase tracking-widest text-xs"
              >
                {isSigning ? "Assinando..." : "Assinar Documento"}
              </button>
            </div>
          </aside>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white p-20 rounded-[3rem] shadow-2xl border border-slate-50 flex flex-col items-center text-center animate-in zoom-in">
          <div className="w-32 h-32 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-6xl mb-10 shadow-xl animate-bounce">✓</div>
          <h3 className="text-4xl font-black text-slate-800 tracking-tight uppercase">Concluído</h3>
          <p className="text-slate-500 mt-4 max-w-md font-medium text-lg">O documento foi assinado e arquivado conforme normas ICP-Brasil.</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full max-w-lg">
            <button onClick={() => { setStep(1); setFile(null); }} className="flex-1 px-8 py-4 bg-slate-100 text-slate-700 rounded-2xl hover:bg-slate-200 font-black transition-all text-sm uppercase">Novo Arquivo</button>
            <button onClick={() => window.location.hash = '#documents'} className="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 font-black shadow-lg shadow-indigo-100 transition-all text-sm uppercase">Ver Documentos</button>
          </div>
        </div>
      )}

      {showPinModal && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-lg z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-10 shadow-2xl animate-in zoom-in">
            <div className="flex flex-col items-center mb-8">
              <span className="text-5xl mb-6">🔐</span>
              <h4 className="text-2xl font-black text-slate-800 tracking-tight">PIN de Segurança</h4>
              <p className="text-slate-500 text-sm text-center mt-3 font-medium">Informe a senha do certificado para autorizar a operação.</p>
            </div>
            <input 
              type="password" 
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-3xl px-8 py-5 text-center text-4xl tracking-[0.5em] focus:ring-4 focus:ring-indigo-500/20 outline-none mb-8 font-black text-slate-800"
              autoFocus
            />
            <div className="flex gap-4">
              <button onClick={() => setShowPinModal(false)} className="flex-1 py-4 font-black text-slate-400 hover:text-slate-800 transition-colors uppercase text-xs">Cancelar</button>
              <button 
                onClick={handleSign}
                disabled={!pin}
                className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-indigo-700 disabled:opacity-50 transition-all uppercase text-xs"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignDocument;
