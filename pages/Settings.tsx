
import React, { useState, useEffect } from 'react';
import { googleDriveService } from '../services/googleDriveService';
import { useSignPlusAuth } from '../hooks/useSignPlusAuth';

interface SettingsProps {
  notify?: (m: string, t?: any) => void;
}

const Settings: React.FC<SettingsProps> = ({ notify }) => {
  const { accessToken } = useSignPlusAuth();
  const DEFAULT_ACCOUNT_ID = '100760b1eff565953622066c0721';
  const DEFAULT_API_KEY = 'WdVdS-JOtwm1iSr9c5gXsj-eflYe56lU3JCMdR0uXZTD9x5HRaux4nS7eMREjPI';

  const [assinafyId, setAssinafyId] = useState(localStorage.getItem('assinafy_account_id') || DEFAULT_ACCOUNT_ID);
  const [assinafyKey, setAssinafyKey] = useState(localStorage.getItem('assinafy_api_key') || DEFAULT_API_KEY);
  
  const [isGDriveConnected, setIsGDriveConnected] = useState(!!googleDriveService.getAccessToken());
  const [gdriveUser, setGdriveUser] = useState<any>(null);

  useEffect(() => {
    if (isGDriveConnected) {
      googleDriveService.getUserInfo().then(setGdriveUser);
    }
  }, [isGDriveConnected]);

  const handleSave = () => {
    localStorage.setItem('assinafy_account_id', assinafyId.trim());
    localStorage.setItem('assinafy_api_key', assinafyKey.trim());
    if (notify) {
      notify("Credenciais Assinafy atualizadas!", "success");
    }
  };

  const handleGDriveToggle = () => {
    if (isGDriveConnected) {
      googleDriveService.disconnect();
      setIsGDriveConnected(false);
      setGdriveUser(null);
      if (notify) notify("Google Drive desconectado", "info");
    } else {
      googleDriveService.connect();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Configurações de Integração</h2>
        <p className="text-slate-500 font-medium">Gerencie sua conexão com a nuvem Assinafy e Google Drive.</p>
      </header>

      {/* Auth0 JWT Section */}
      <section className="bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4">
        <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <h3 className="font-black text-white flex items-center gap-2 uppercase text-xs tracking-widest">
            <span className="text-blue-500">🛡️</span> Auth0 JWT Session
          </h3>
          <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[9px] font-black uppercase">Bearer Active</span>
        </div>
        <div className="p-8 space-y-4">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Access Token (JWT)</label>
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-[10px] text-blue-300 break-all leading-relaxed shadow-inner max-h-32 overflow-y-auto custom-scrollbar">
            {accessToken || "Modo Desenvolvedor Ativo - Token Não Disponível"}
          </div>
          <p className="text-[9px] text-slate-600 font-medium italic">
            * Este token identifica sua sessão segura e pode ser usado para validar chamadas em APIs protegidas.
          </p>
        </div>
      </section>

      <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-indigo-50/30 flex items-center justify-between">
          <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
            <span className="text-indigo-600">☁️</span> Assinafy Cloud API
          </h3>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[9px] font-black uppercase">v1.0 Ready</span>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Workspace Account ID</label>
              <input 
                type="text" 
                placeholder="Ex: 631606b068..."
                value={assinafyId}
                onChange={(e) => setAssinafyId(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm text-slate-700"
              />
              <p className="text-[9px] text-slate-400 mt-2 font-medium italic">* Disponível na aba 'Workspaces' do seu perfil Assinafy.</p>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Permanent API Key</label>
              <input 
                type="password" 
                placeholder="Sua chave secreta"
                value={assinafyKey}
                onChange={(e) => setAssinafyKey(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm text-slate-700"
              />
              <p className="text-[9px] text-slate-400 mt-2 font-medium italic">* Gerada na aba 'API' em configurações de conta.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-emerald-50/30">
          <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
            <span className="text-emerald-600">📂</span> Google Drive Backup
          </h3>
        </div>
        <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <p className="font-bold text-slate-800">Espelhamento em Nuvem</p>
            <p className="text-sm text-slate-500 mt-1">
              {isGDriveConnected 
                ? `Conectado como ${gdriveUser?.name || 'usuário Google'}.` 
                : 'Habilite o backup automático para salvar todos os protocolos assinados localmente.'}
            </p>
          </div>
          <button 
            onClick={handleGDriveToggle}
            className={`px-8 py-3 rounded-2xl font-black transition-all shadow-lg text-xs uppercase tracking-widest ${
              isGDriveConnected 
              ? 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100' 
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isGDriveConnected ? 'Desconectar' : 'Conectar Google'}
          </button>
        </div>
      </section>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          className="px-12 py-4 bg-slate-900 text-white rounded-2xl hover:bg-black font-black shadow-2xl transition-all uppercase text-xs tracking-[0.2em]"
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default Settings;
