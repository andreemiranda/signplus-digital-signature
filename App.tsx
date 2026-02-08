
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import SignDocument from './pages/SignDocument';
import Documents from './pages/Documents';
import Certificates from './pages/Certificates';
import AuditLogs from './pages/AuditLogs';
import SealEditor from './pages/SealEditor';
import ValidateSignature from './pages/ValidateSignature';
import Settings from './pages/Settings';
import Assinafy from './pages/Assinafy';
import Toast, { ToastType } from './components/Toast';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState<{message: string, type: ToastType} | null>(null);

  const showNotification = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    // Captura o token do Google Drive da URL após o redirecionamento OAuth
    const hash = window.location.hash;
    if (hash.includes('access_token') && hash.includes('state=google_drive_auth')) {
      const params = new URLSearchParams(hash.replace('#', '?'));
      const token = params.get('access_token');
      const expiresIn = params.get('expires_in');
      
      if (token && expiresIn) {
        localStorage.setItem('google_drive_token', token);
        localStorage.setItem('google_drive_token_expiry', (Date.now() + parseInt(expiresIn) * 1000).toString());
        showNotification("Google Drive conectado com sucesso!");
        // Limpa a URL
        window.history.replaceState(null, '', window.location.pathname);
        setActiveTab('settings');
      }
    }
  }, []);

  const tabNames: Record<string, string> = {
    dashboard: 'Painel de Controle',
    sign: 'Assinar Local (ICP)',
    assinafy: 'Nuvem Assinafy',
    documents: 'Meus Documentos',
    certificates: 'Certificados Digitais',
    seals: 'Editor de Selos',
    validate: 'Validação de Assinaturas',
    audit: 'Logs de Auditoria',
    settings: 'Configurações do Sistema'
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard notify={showNotification} />;
      case 'sign': return <SignDocument notify={showNotification} />;
      case 'assinafy': return <Assinafy notify={showNotification} />;
      case 'documents': return <Documents notify={showNotification} />;
      case 'certificates': return <Certificates notify={showNotification} />;
      case 'seals': return <SealEditor notify={showNotification} />;
      case 'validate': return <ValidateSignature notify={showNotification} />;
      case 'audit': return <AuditLogs notify={showNotification} />;
      case 'settings': return <Settings notify={showNotification} />;
      default: return <Dashboard notify={showNotification} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8 transition-all duration-300">
        <header className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-slate-400 font-medium uppercase tracking-widest">
            <span>Administrador</span>
            <span>/</span>
            <span className="text-slate-800">{tabNames[activeTab] || activeTab}</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 text-slate-400 hover:text-blue-600" title="Notificações">🔔</button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">Operador ICP</p>
                <p className="text-[10px] text-emerald-500 font-bold uppercase">Conectado</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                OP
              </div>
            </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {renderContent()}
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <button 
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all z-[100]"
        title="Assistente IA SignPlus"
        onClick={() => showNotification("Assistente IA pronto para ajudar!", "info")}
      >
        ✨
      </button>
    </div>
  );
};

export default App;
