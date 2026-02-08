
import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { Certificate, CertificateType, CertificateSource } from '../types';

interface CertificatesProps {
  notify: (m: string, t?: any) => void;
}

const Certificates: React.FC<CertificatesProps> = ({ notify }) => {
  const [certs, setCerts] = useState<Certificate[]>(storageService.getCertificates());
  const [showModal, setShowModal] = useState(false);

  const addMockCert = (type: CertificateType) => {
    const newCert: Certificate = {
      id: crypto.randomUUID(),
      type,
      source: type === CertificateType.A1 ? CertificateSource.FILE : CertificateSource.TOKEN,
      subjectName: `USUARIO TESTE ${Math.floor(Math.random() * 1000)}:12345678900`,
      issuerName: 'AC SOLUTI Multipla v5',
      serialNumber: Math.random().toString(16).toUpperCase(),
      validFrom: new Date().toISOString().split('T')[0],
      validTo: new Date(Date.now() + 31536000000).toISOString().split('T')[0],
      thumbprint: 'SHA256:' + Math.random().toString(36).substring(7),
      isTest: type === CertificateType.TEST,
      createdAt: new Date().toISOString(),
    };
    storageService.addCertificate(newCert);
    setCerts(storageService.getCertificates());
    setShowModal(false);
    notify("Certificado adicionado com sucesso!");
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Remover o certificado de "${name}"? Esta ação é irreversível.`)) {
      storageService.removeCertificate(id);
      setCerts(storageService.getCertificates());
      notify("Certificado removido", "error");
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Cofre de Certificados</h2>
          <p className="text-slate-500 text-xs md:text-sm font-medium">Gestão de credenciais ICP-Brasil (A1 e A3).</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95"
        >
          + Carga Digital
        </button>
      </header>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {certs.map((cert) => (
          <div key={cert.id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in">
            <div className={`h-2.5 ${cert.isTest ? 'bg-amber-400' : 'bg-blue-600'}`}></div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                  cert.isTest ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                  TIPO {cert.type} • {cert.source}
                </span>
                <button 
                  onClick={() => handleDelete(cert.id, cert.subjectName)}
                  className="w-8 h-8 flex items-center justify-center bg-rose-50 text-rose-400 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
                >
                  🗑️
                </button>
              </div>
              
              <h3 className="font-black text-slate-800 line-clamp-2 min-h-[3rem] text-sm md:text-base leading-tight group-hover:text-indigo-600 transition-colors uppercase">
                {cert.subjectName}
              </h3>
              
              <div className="mt-4 flex items-center gap-2">
                <span className="text-[10px] bg-slate-50 text-slate-400 px-2 py-0.5 rounded-lg font-black tracking-tighter">EMISSOR</span>
                <p className="text-[10px] text-slate-500 font-bold truncate uppercase">{cert.issuerName}</p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-50 space-y-3">
                <div className="flex justify-between text-[10px] uppercase font-black tracking-widest">
                  <span className="text-slate-400">Validade Até</span>
                  <span className="text-slate-800">{new Date(cert.validTo).toLocaleDateString('pt-BR')}</span>
                </div>
                {/* Visual indicator of validity progress */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                  <div className="bg-emerald-500 h-full w-[85%] rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {certs.length === 0 && (
          <div className="col-span-full py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center opacity-40 shadow-inner">
            <span className="text-7xl mb-6 grayscale">🔐</span>
            <p className="font-black text-slate-500 uppercase tracking-[0.3em] text-xs">Cofre de Identidade Vazio</p>
            <p className="text-[10px] text-slate-300 font-bold uppercase mt-2">Clique em "Carga Digital" para iniciar</p>
          </div>
        )}
      </div>

      {/* Upload Modal - Responsive and Scrollable */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[300] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10 backdrop-blur">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Carga de Certificado</h3>
              <button onClick={() => setShowModal(false)} className="text-3xl text-slate-300 hover:text-slate-800 transition-colors">&times;</button>
            </div>
            
            <div className="p-8 grid grid-cols-1 gap-4">
              <button onClick={() => addMockCert(CertificateType.A1)} className="flex items-center gap-5 p-5 border-2 border-slate-50 rounded-[2rem] hover:bg-indigo-50 hover:border-indigo-100 transition-all text-left group active:scale-95 shadow-sm">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg shadow-indigo-100">📁</div>
                <div>
                  <p className="font-black text-slate-800 text-sm uppercase tracking-wider leading-tight">Certificado A1</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Software (.PFX / .P12)</p>
                </div>
              </button>
              
              <button onClick={() => addMockCert(CertificateType.A3)} className="flex items-center gap-5 p-5 border-2 border-slate-50 rounded-[2rem] hover:bg-emerald-50 hover:border-emerald-100 transition-all text-left group active:scale-95 shadow-sm">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg shadow-emerald-100">💳</div>
                <div>
                  <p className="font-black text-slate-800 text-sm uppercase tracking-wider leading-tight">Certificado A3</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Hardware (Token/Card)</p>
                </div>
              </button>
              
              <div className="relative py-6">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                <div className="relative flex justify-center text-[9px] uppercase"><span className="bg-white px-4 text-slate-300 font-black tracking-[0.5em]">Sandbox Mode</span></div>
              </div>
              
              <button onClick={() => addMockCert(CertificateType.TEST)} className="flex items-center gap-5 p-5 border-2 border-slate-50 rounded-[2rem] hover:bg-amber-50 hover:border-amber-100 transition-all text-left group active:scale-95 shadow-sm">
                <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg shadow-amber-100">🛠️</div>
                <div>
                  <p className="font-black text-slate-800 text-sm uppercase tracking-wider leading-tight">Mock Digital</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Gerar para Desenvolvimento</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
