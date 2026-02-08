
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
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Meus Certificados</h2>
          <p className="text-slate-500">Gerencie seus certificados ICP-Brasil A1 e A3.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md font-medium transition-all hover:scale-105 active:scale-95"
        >
          + Adicionar Certificado
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certs.map((cert) => (
          <div key={cert.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-lg transition-all animate-in fade-in zoom-in duration-300">
            <div className={`h-2 ${cert.isTest ? 'bg-amber-400' : 'bg-blue-500'}`}></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${cert.isTest ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                  {cert.type} - {cert.source}
                </span>
                <button 
                  onClick={() => handleDelete(cert.id, cert.subjectName)}
                  className="text-slate-300 hover:text-red-500 transition-colors p-1"
                >
                  🗑️
                </button>
              </div>
              <h3 className="font-bold text-slate-800 line-clamp-2 min-h-[3rem] text-sm">{cert.subjectName}</h3>
              <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold">Emissor: {cert.issuerName}</p>
              
              <div className="mt-6 pt-4 border-t border-slate-50 space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold">
                  <span className="text-slate-400 tracking-tighter">Expira em</span>
                  <span className="text-slate-800">{new Date(cert.validTo).toLocaleDateString()}</span>
                </div>
                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[80%]"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {certs.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center opacity-60">
            <span className="text-5xl mb-4">🔐</span>
            <p className="font-bold text-slate-400">Nenhum certificado carregado.</p>
            <p className="text-sm text-slate-300">Adicione um certificado para começar a assinar.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Carga de Certificado</h3>
              <button onClick={() => setShowModal(false)} className="text-2xl text-slate-400 hover:text-slate-800">&times;</button>
            </div>
            <div className="p-6 grid grid-cols-1 gap-3">
              <button onClick={() => addMockCert(CertificateType.A1)} className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-blue-50 hover:border-blue-200 transition-all text-left group">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📁</div>
                <div>
                  <p className="font-bold text-slate-800">Certificado A1</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Arquivo (.pfx / .p12)</p>
                </div>
              </button>
              <button onClick={() => addMockCert(CertificateType.A3)} className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-emerald-50 hover:border-emerald-200 transition-all text-left group">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">💳</div>
                <div>
                  <p className="font-bold text-slate-800">Certificado A3</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Token ou Smartcard</p>
                </div>
              </button>
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-300 font-bold">Desenvolvimento</span></div>
              </div>
              <button onClick={() => addMockCert(CertificateType.TEST)} className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-amber-50 hover:border-amber-200 transition-all text-left group">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🛠️</div>
                <div>
                  <p className="font-bold text-slate-800">Certificado de Teste</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Gerar Autoassinado</p>
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
