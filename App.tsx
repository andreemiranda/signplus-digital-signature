
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { useSignPlusAuth } from './hooks/useSignPlusAuth';
import { validateEnv, getRedirectUri } from './utils/envValidator';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import Toast, { ToastType } from './components/Toast';
import LoadingSpinner from './components/LoadingSpinner';
import AIAssistantModal from './components/AIAssistantModal';

// Lazy Loading de Páginas para performance de produção
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SignDocument = lazy(() => import('./pages/SignDocument'));
const Documents = lazy(() => import('./pages/Documents'));
const Certificates = lazy(() => import('./pages/Certificates'));
const AuditLogs = lazy(() => import('./pages/AuditLogs'));
const SealEditor = lazy(() => import('./pages/SealEditor'));
const ValidateSignature = lazy(() => import('./pages/ValidateSignature'));
const Settings = lazy(() => import('./pages/Settings'));
const Assinafy = lazy(() => import('./pages/Assinafy'));

// Configurações de Produção via Vite Env
// Fix: Use process.env instead of import.meta.env to resolve TypeScript errors
const AUTH0_DOMAIN = process.env.VITE_AUTH0_DOMAIN || 'dev-xnsnqu63ecslm3eo.us.auth0.com';
const AUTH0_CLIENT_ID = process.env.VITE_AUTH0_CLIENT_ID || 'JH8vM3WWZFCRSFdyyjn7W4odBNkInLYH';
const AUTH0_AUDIENCE = process.env.VITE_AUTH0_AUDIENCE || 'https://signplus-api.com';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useSignPlusAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState<{message: string, type: ToastType} | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  useEffect(() => {
    validateEnv();
    const handleHashNav = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setActiveTab(hash);
    };
    window.addEventListener('hashchange', handleHashNav);
    handleHashNav();
    return () => window.removeEventListener('hashchange', handleHashNav);
  }, []);

  const showNotification = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <LoginPage />;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-black uppercase tracking-widest">
            <span>ADMIN</span>
            <span className="opacity-30">/</span>
            <span className="text-slate-800">{activeTab}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-800">{user?.name}</p>
              <button onClick={logout} className="text-[10px] text-rose-500 font-black uppercase hover:underline">Sair</button>
            </div>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">
              {user?.name?.substring(0, 1).toUpperCase()}
            </div>
          </div>
        </header>

        <Suspense fallback={<LoadingSpinner />}>
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {activeTab === 'dashboard' && <Dashboard notify={showNotification} />}
            {activeTab === 'sign' && <SignDocument notify={showNotification} />}
            {activeTab === 'assinafy' && <Assinafy notify={showNotification} />}
            {activeTab === 'documents' && <Documents notify={showNotification} />}
            {activeTab === 'certificates' && <Certificates notify={showNotification} />}
            {activeTab === 'seals' && <SealEditor notify={showNotification} />}
            {activeTab === 'validate' && <ValidateSignature notify={showNotification} />}
            {activeTab === 'audit' && <AuditLogs notify={showNotification} />}
            {activeTab === 'settings' && <Settings notify={showNotification} />}
          </div>
        </Suspense>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <button onClick={() => setIsAIModalOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-all z-[100]">✨</button>
      <AIAssistantModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: getRedirectUri(),
        audience: AUTH0_AUDIENCE,
        scope: 'openid profile email read:documents write:documents sign:documents'
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <AppContent />
    </Auth0Provider>
  );
};

export default App;
