
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
    <div className="space-y-6">
      <header className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Meus Documentos</h2>
          <p className="text-slate-500 text-sm font-medium">Repositório seguro de arquivos assinados.</p>
        </div>
        <div className="relative w-72">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input 
            type="text" 
            placeholder="Filtrar arquivos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>
      </header>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                <th className="px-8 py-5">Documento</th>
                <th className="px-8 py-5">Signatário</th>
                <th className="px-8 py-5">Data / Nuvem</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl text-[10px] font-black text-white shadow-sm ${doc.fileType === 'PDF' ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                        {doc.fileType}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 truncate max-w-[240px]">{doc.signedFileName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{(doc.fileSize / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-700">{doc.signerName}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-medium">{new Date(doc.signedAt).toLocaleDateString('pt-BR')}</span>
                      {doc.isBackedUp && (
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase flex items-center gap-1">
                          <span className="text-xs">☁️</span> Drive
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setSelectedDoc(doc)} className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-colors" title="Ver Detalhes">👁️</button>
                      <button onClick={() => handleDelete(doc.id, doc.signedFileName)} className="p-2 hover:bg-rose-50 text-rose-600 rounded-xl transition-colors" title="Excluir">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium italic">Nenhum documento encontrado no banco local.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="font-black text-xl tracking-tight">Protocolo Digital</h3>
                <p className="text-[10px] text-indigo-400 uppercase font-black tracking-widest mt-1">Status: Conforme ICP-Brasil</p>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-3xl opacity-50 hover:opacity-100">&times;</button>
            </div>
            <div className="p-10 space-y-8">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">✅</div>
                <h4 className="text-2xl font-black text-slate-800 tracking-tight">Assinatura Válida</h4>
                <p className="text-[10px] text-slate-400 font-mono mt-2 bg-slate-50 px-3 py-1 rounded-full">DOC_ID: {selectedDoc.id.substring(0, 16)}...</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 text-sm border-y border-slate-100 py-8">
                <div>
                  <p className="text-slate-400 uppercase font-black text-[9px] mb-1">Signatário</p>
                  <p className="font-bold text-slate-800">{selectedDoc.signerName}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase font-black text-[9px] mb-1">Data e Hora</p>
                  <p className="font-bold text-slate-800">{new Date(selectedDoc.signedAt).toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400 uppercase font-black text-[9px] mb-1">Backup Cloud</p>
                  <p className={`font-bold ${selectedDoc.isBackedUp ? 'text-emerald-600' : 'text-amber-500'}`}>
                    {selectedDoc.isBackedUp ? 'Disponível no Google Drive' : 'Somente Armazenamento Local'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-indigo-700 transition-all uppercase text-xs">Baixar PDF</button>
                <button onClick={() => setSelectedDoc(null)} className="flex-1 bg-slate-100 text-slate-500 font-black py-4 rounded-2xl hover:bg-slate-200 transition-all uppercase text-xs">Fechar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
