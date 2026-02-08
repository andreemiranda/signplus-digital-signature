
import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { SignedDocument } from '../types';

interface DocumentsProps {
  notify: (m: string, t?: any) => void;
}

const Documents: React.FC<DocumentsProps> = ({ notify }) => {
  const [docs, setDocs] = useState<SignedDocument[]>(storageService.getDocuments());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<SignedDocument | null>(null);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Remover o documento "${name}"?`)) {
      storageService.removeDocument(id);
      setDocs(storageService.getDocuments());
      notify("Documento removido");
    }
  };

  const filteredDocs = docs.filter(doc => 
    doc.originalFileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.signerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm gap-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Repositório Digital</h2>
          <p className="text-slate-500 text-xs md:text-sm font-medium">Histórico de arquivos selados com ICP-Brasil.</p>
        </div>
        <div className="relative w-full lg:w-80 group">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">🔍</span>
          <input 
            type="text" 
            placeholder="Buscar por nome ou signatário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-xs focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-700 transition-all placeholder:text-slate-300"
          />
        </div>
      </header>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        {/* Table Container - Essential for Responsiveness */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm min-w-[800px] lg:min-w-full">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-50">
                <th className="px-8 py-6">Arquivo</th>
                <th className="px-8 py-6">Titular da Assinatura</th>
                <th className="px-8 py-6">Data / Integração</th>
                <th className="px-8 py-6 text-right">Controle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 flex items-center justify-center rounded-xl text-[10px] font-black text-white shadow-md group-hover:scale-110 transition-transform ${doc.fileType === 'PDF' ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                        {doc.fileType}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-black text-slate-800 truncate max-w-[200px] md:max-w-[300px] group-hover:text-indigo-600 transition-colors">{doc.signedFileName}</span>
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{(doc.fileSize / 1024).toFixed(1)} KB • Local Safe</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-700 text-xs truncate max-w-[200px]">{doc.signerName}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-slate-500 font-bold text-xs">{new Date(doc.signedAt).toLocaleDateString('pt-BR')}</span>
                      {doc.isBackedUp && (
                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter flex items-center gap-1 border border-emerald-100">
                          <span className="text-xs">☁️</span> Backup OK
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => setSelectedDoc(doc)} 
                        className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-90"
                        title="Ver Protocolo"
                      >
                        👁️
                      </button>
                      <button 
                        onClick={() => handleDelete(doc.id, doc.signedFileName)} 
                        className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-90"
                        title="Remover"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center opacity-30 grayscale">
                      <span className="text-6xl mb-4">🗂️</span>
                      <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Nenhum registro encontrado</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Protocol Modal - Responsive Height */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-lg z-[300] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300 max-h-[95vh] overflow-y-auto custom-scrollbar">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center sticky top-0 z-10">
              <div>
                <h3 className="font-black text-xl tracking-tight uppercase">Protocolo de Assinatura</h3>
                <p className="text-[9px] text-blue-400 uppercase font-black tracking-[0.3em] mt-1">Status: Conformidade Total</p>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-3xl opacity-50 hover:opacity-100 transition-opacity">&times;</button>
            </div>
            
            <div className="p-8 md:p-10 space-y-10">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[1.5rem] flex items-center justify-center text-4xl mb-6 shadow-inner animate-pulse">✅</div>
                <h4 className="text-2xl font-black text-slate-800 tracking-tight">Assinatura Válida</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">HASH: {selectedDoc.id.substring(0, 12)}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm border-y border-slate-50 py-10">
                <div className="space-y-1">
                  <p className="text-slate-400 uppercase font-black text-[9px] tracking-widest">Signatário</p>
                  <p className="font-black text-slate-800 leading-tight">{selectedDoc.signerName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400 uppercase font-black text-[9px] tracking-widest">Data e Hora</p>
                  <p className="font-black text-slate-800">{new Date(selectedDoc.signedAt).toLocaleString('pt-BR')}</p>
                </div>
                <div className="space-y-1 col-span-1 sm:col-span-2">
                  <p className="text-slate-400 uppercase font-black text-[9px] tracking-widest">Backup Cloud</p>
                  <p className={`font-black uppercase text-[10px] flex items-center gap-2 ${selectedDoc.isBackedUp ? 'text-emerald-600' : 'text-amber-500'}`}>
                    <span className="w-2 h-2 rounded-full bg-current"></span>
                    {selectedDoc.isBackedUp ? 'Sincronizado com Google Drive' : 'Pendente de sincronização cloud'}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase text-[10px] tracking-widest active:scale-95">Download PDF</button>
                <button onClick={() => setSelectedDoc(null)} className="flex-1 bg-slate-100 text-slate-500 font-black py-4 rounded-2xl hover:bg-slate-200 transition-all uppercase text-[10px] tracking-widest active:scale-95">Fechar Protocolo</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
