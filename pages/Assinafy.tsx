
import React, { useState, useEffect } from 'react';
import { assinafyService } from '../services/assinafyService';

interface AssinafyProps {
  notify: (m: string, t?: any) => void;
}

const Assinafy: React.FC<AssinafyProps> = ({ notify }) => {
  const [accountId, setAccountId] = useState(localStorage.getItem('assinafy_account_id') || '');
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Signatários states
  const [showSignerModal, setShowSignerModal] = useState(false);
  const [signerData, setSignerData] = useState({ fullName: '', email: '', whatsapp: '' });
  const [targetDocId, setTargetDocId] = useState('');

  useEffect(() => {
    // Sincroniza o ID da conta se ele mudar no localStorage (via Settings)
    const interval = setInterval(() => {
      const currentId = localStorage.getItem('assinafy_account_id') || '';
      if (currentId !== accountId) setAccountId(currentId);
    }, 1000);
    return () => clearInterval(interval);
  }, [accountId]);

  useEffect(() => {
    if (accountId) {
      loadDocs();
    }
  }, [accountId]);

  const loadDocs = async () => {
    if (!accountId) return;
    setLoading(true);
    try {
      const result = await assinafyService.listDocuments(accountId);
      setDocuments(result.data || []);
    } catch (err: any) {
      console.error("LoadDocs Error:", err.message);
      notify(err.message, 'error');
      setDocuments([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !accountId) return;
    setIsUploading(true);
    try {
      await assinafyService.uploadDocument(accountId, selectedFile);
      notify("Documento enviado para Assinafy Cloud!");
      setShowUpload(false);
      setSelectedFile(null);
      loadDocs();
    } catch (err: any) {
      notify(err.message, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateSignerAndAssign = async () => {
    if (!accountId || !targetDocId) return;
    setLoading(true);
    try {
      // 1. Cria o signatário
      const signerResult = await assinafyService.createSigner(accountId, signerData);
      const signerId = signerResult.data.id;
      
      // 2. Solicita assinatura
      await assinafyService.createAssignment(targetDocId, [signerId], "Assinatura solicitada via SignPlus Cloud.");
      
      notify("Convite enviado com sucesso!");
      setShowSignerModal(false);
      setSignerData({ fullName: '', email: '', whatsapp: '' });
      loadDocs();
    } catch (err: any) {
      notify(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToSettings = () => {
    window.location.hash = 'settings';
  };

  if (!accountId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 lg:py-48 text-center space-y-10 animate-in fade-in zoom-in duration-700">
        <div className="relative">
          <div className="w-32 h-32 bg-indigo-50 rounded-[3rem] flex items-center justify-center text-6xl shadow-inner border border-indigo-100/50 animate-pulse">
            ☁️
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-2xl shadow-xl border border-slate-100 text-2xl">
            🔑
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Configuração Necessária</h2>
          <p className="text-slate-500 max-w-sm font-medium leading-relaxed">
            Para gerenciar documentos na nuvem, você precisa vincular seu <strong>Account ID</strong> e <strong>API Key</strong> da Assinafy nas configurações.
          </p>
        </div>
        <button 
          onClick={handleGoToSettings} 
          className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black shadow-2xl hover:bg-black transition-all transform hover:-translate-y-1 active:scale-95 uppercase text-[10px] tracking-[0.2em]"
        >
          Configurar Credenciais
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Nuvem Assinafy</h2>
          <p className="text-slate-500 text-sm font-medium">Assinaturas remotas com validade jurídica garantida.</p>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={loadDocs}
            disabled={loading}
            className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all shadow-sm flex items-center justify-center w-14 h-14"
            title="Sincronizar"
          >
            <span className={loading ? "animate-spin inline-block" : ""}>{loading ? "⏳" : "🔄"}</span>
          </button>
          <button 
            onClick={() => setShowUpload(true)}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 font-black text-xs uppercase tracking-widest transition-all"
          >
            + Novo na Nuvem
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center px-8">
          <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Console de Documentos</h3>
          <span className="text-[10px] bg-white border border-slate-200 text-slate-400 px-3 py-1 rounded-full font-mono font-bold">Workspace: {accountId.substring(0, 12)}...</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-50">
                <th className="px-8 py-6">Arquivo</th>
                <th className="px-8 py-6">Status Cloud</th>
                <th className="px-8 py-6">Criado em</th>
                <th className="px-8 py-6 text-right">Ação Remota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{doc.name}</span>
                      <span className="text-[9px] text-slate-300 font-mono mt-1">UUID: {doc.id}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      doc.status === 'certificated' ? 'bg-emerald-100 text-emerald-700' : 
                      doc.status === 'pending_signature' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {doc.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-slate-400 font-medium">
                    {doc.created_at ? new Date(doc.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      disabled={doc.status === 'certificated' || loading}
                      onClick={() => { setTargetDocId(doc.id); setShowSignerModal(true); }}
                      className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all disabled:opacity-20"
                    >
                      {doc.status === 'certificated' ? 'Concluído' : 'Solicitar Link'}
                    </button>
                  </td>
                </tr>
              ))}
              {documents.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl mb-4 grayscale opacity-20">📂</span>
                      <p className="text-slate-400 font-bold italic">Nenhum documento encontrado para este ambiente.</p>
                      <button onClick={loadDocs} className="mt-4 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline">Tentar Sincronizar</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Upload */}
      {showUpload && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in">
            <h3 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">Upload para Nuvem</h3>
            <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center space-y-4 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer relative">
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
              <div className="text-5xl">☁️</div>
              <p className="font-black text-slate-700 text-center px-4">{selectedFile ? selectedFile.name : "Selecionar Arquivo PDF"}</p>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Limite: 25MB por arquivo</p>
            </div>
            <div className="flex gap-4 mt-10">
              <button onClick={() => setShowUpload(false)} className="flex-1 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-800 transition-colors">Cancelar</button>
              <button 
                disabled={!selectedFile || isUploading}
                onClick={handleUpload}
                className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-indigo-700 disabled:opacity-50 uppercase text-[10px] tracking-widest transition-all"
              >
                {isUploading ? "Transferindo..." : "Iniciar Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Signer */}
      {showSignerModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in">
            <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Novo Signatário</h3>
            <p className="text-slate-400 text-xs font-medium mb-8 leading-relaxed">O convite de assinatura será disparado via e-mail e opcionalmente WhatsApp através do gateway Assinafy.</p>
            
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <input 
                  type="text" 
                  placeholder="Ex: João da Silva"
                  value={signerData.fullName}
                  onChange={(e) => setSignerData({...signerData, fullName: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 mt-1"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                <input 
                  type="email" 
                  placeholder="joao@empresa.com.br"
                  value={signerData.email}
                  onChange={(e) => setSignerData({...signerData, email: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 mt-1"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp (Opcional)</label>
                <input 
                  type="tel" 
                  placeholder="+55 48 99999-0000"
                  value={signerData.whatsapp}
                  onChange={(e) => setSignerData({...signerData, whatsapp: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 mt-1"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={() => setShowSignerModal(false)} className="flex-1 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-800 transition-colors">Voltar</button>
              <button 
                disabled={!signerData.fullName || !signerData.email || loading}
                onClick={handleCreateSignerAndAssign}
                className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-indigo-700 disabled:opacity-50 uppercase text-[10px] tracking-widest transition-all"
              >
                {loading ? "Criando..." : "Enviar Convite"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assinafy;
