
import React, { useState, useEffect } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { useSignPlusAuth } from './hooks/useSignPlusAuth';
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
import LoginPage from './pages/LoginPage';
import Toast, { ToastType } from './components/Toast';
import AIAssistantModal from './components/AIAssistantModal';
import IntroOverlay from './components/IntroOverlay';
import LoadingSpinner from './components/LoadingSpinner';

const AUTH0_DOMAIN = 'dev-xnsnqu63ecslm3eo.us.auth0.com';
const AUTH0_CLIENT_ID = 'JH8vM3WWZFCRSFdyyjn7W4odBNkInLYH';
const AUTH0_AUDIENCE = 'https://signplus-api.com';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useSignPlusAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState<{message: string, type: ToastType} | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    const visited = sessionStorage.getItem('signplus_intro_seen');
    return visited !== 'true';
  });

  const showNotification = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

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

  useEffect(() => {
    const handleHashNav = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && tabNames[hash]) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashNav);
    handleHashNav();
    return () => window.removeEventListener('hashchange', handleHashNav);
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('signplus_intro_seen', 'true');
    setShowIntro(false);
  };

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <LoginPage />;

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
      {showIntro && <IntroOverlay onComplete={handleIntroComplete} />}

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] lg:text-sm text-slate-400 font-black uppercase tracking-widest">
            <span>Administrador</span>
            <span className="opacity-30">/</span>
            <span className="text-slate-800">{tabNames[activeTab] || activeTab}</span>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <button className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-blue-600 transition-colors" title="Notificações">🔔</button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-800">{user?.name || 'Operador ICP'}</p>
                <button onClick={() => logout()} className="text-[9px] text-rose-500 font-black uppercase hover:underline">Sair do Sistema</button>
              </div>
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg overflow-hidden">
                {user?.picture ? <img src={user.picture} alt="Avatar" className="w-full h-full object-cover" /> : user?.name?.substring(0, 2).toUpperCase()}
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
        className="fixed bottom-6 right-6 w-16 h-16 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center text-3xl hover:scale-110 active:scale-95 transition-all z-[100] border-t border-slate-700"
        title="Assistente IA SignPlus"
        onClick={() => setIsAIModalOpen(true)}
      >
        ✨
      </button>

      <AIAssistantModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
      />
    </div>
  );
};

const App: React.FC = () => {
  // Garantimos que a URL de redirecionamento termine sempre com barra para bater com a configuração do dashboard
  const origin = window.location.origin;
  const redirectUri = origin.endsWith('/') ? origin : `${origin}/`;

  // Fix: Explicitly move Auth0 configuration to a spreadable object to resolve TypeScript "Property 'domain' does not exist" error
  const auth0Config = {
    domain: AUTH0_DOMAIN,
    clientId: AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: redirectUri,
      audience: AUTH0_AUDIENCE,
      scope: 'openid profile email read:documents write:documents sign:documents manage:signatures verify:signatures'
    },
    cacheLocation: 'memory' as const,
    useRefreshTokens: true,
    useRefreshTokensFallback: true
  };

  return (
    <Auth0Provider {...(auth0Config as any)}>
      <AppContent />
    </Auth0Provider>
  );
};

export default App;
