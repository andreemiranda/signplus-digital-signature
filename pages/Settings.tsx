
import React, { useState, useEffect } from 'react';
import { googleDriveService } from '../services/googleDriveService';

interface SettingsProps {
  notify?: (m: string, t?: any) => void;
}

const Settings: React.FC<SettingsProps> = ({ notify }) => {
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

  useEffect(() => {
    if (!localStorage.getItem('assinafy_account_id')) {
      localStorage.setItem('assinafy_account_id', DEFAULT_ACCOUNT_ID);
    }
    if (!localStorage.getItem('assinafy_api_key')) {
      localStorage.setItem('assinafy_api_key', DEFAULT_API_KEY);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('assinafy_account_id', assinafyId);
    localStorage.setItem('assinafy_api_key', assinafyKey);
    if (notify) {
      notify("Configurações atualizadas com sucesso!", "success");
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
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Configurações</h2>
        <p className="text-slate-500 font-medium">Controle de credenciais e integrações de nuvem.</p>
      </header>

      {/* Assinafy Integration Section */}
      <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-indigo-50/30 flex items-center justify-between">
          <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
            <span className="text-indigo-600">☁️</span> Console Assinafy Cloud
          </h3>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[9px] font-black uppercase">API v1.0</span>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Account ID (Ambiente)</label>
              <input 
                type="text" 
                placeholder="ID da Conta Assinafy"
                value={assinafyId}
                onChange={(e) => setAssinafyId(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm text-slate-700"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">API Key (Segredo)</label>
              <input 
                type="password" 
                placeholder="Insira sua chave de acesso"
                value={assinafyKey}
                onChange={(e) => setAssinafyKey(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm text-slate-700"
              />
            </div>
          </div>
          <p className="text-[10px] text-amber-600 bg-amber-50 p-3 rounded-xl font-bold flex items-center gap-2">
            <span>⚠️</span> Se você estiver recebendo "Credenciais Inválidas", certifique-se de que a API Key pertence ao Account ID informado.
          </p>
        </div>
      </section>

      {/* Google Drive Section */}
      <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-emerald-50/30">
          <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
            <span className="text-emerald-600">📂</span> Google Drive Mirroring
          </h3>
        </div>
        <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <p className="font-bold text-slate-800">Cópia Automática para o Drive</p>
            <p className="text-sm text-slate-500 mt-1">
              {isGDriveConnected 
                ? `Conectado como ${gdriveUser?.name || 'usuário Google'}.` 
                : 'Conecte sua conta para habilitar o backup automático de documentos assinados.'}
            </p>
          </div>
          <button 
            onClick={handleGDriveToggle}
            className={`px-8 py-3 rounded-2xl font-black transition-all shadow-lg text-xs uppercase tracking-widest ${
              isGDriveConnected 
              ? 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100' 
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'
            }`}
          >
            {isGDriveConnected ? 'Desconectar' : 'Conectar Drive'}
          </button>
        </div>
      </section>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          className="px-12 py-4 bg-slate-900 text-white rounded-2xl hover:bg-black font-black shadow-2xl transition-all uppercase text-xs tracking-[0.2em]"
        >
          Aplicar Configurações
        </button>
      </div>
    </div>
  );
};

export default Settings;
