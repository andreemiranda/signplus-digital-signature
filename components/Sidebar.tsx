
import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth0();

  const menuItems = [
    { id: 'dashboard', label: 'Painel de Controle', icon: '📊' },
    { id: 'sign', label: 'Assinar Local (ICP)', icon: '📝' },
    { id: 'assinafy', label: 'Nuvem Assinafy', icon: '☁️' },
    { id: 'documents', label: 'Documentos', icon: '📋' },
    { id: 'certificates', label: 'Certificados', icon: '🔐' },
    { id: 'seals', label: 'Editor de Selos', icon: '🎨' },
    { id: 'validate', label: 'Validar Assinatura', icon: '✅' },
    { id: 'audit', label: 'Auditoria', icon: '📜' },
    { id: 'settings', label: 'Configurações', icon: '⚙️' },
  ];

  const handleNav = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
    // Navegação puramente relativa via hash
    window.location.hash = id;
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 z-[100] flex items-center justify-between px-4 shadow-lg">
        <h1 className="text-lg font-bold text-white">
          <span className="text-blue-500">Sign</span>Plus
        </h1>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-white p-2 rounded-lg bg-slate-800"
          aria-label="Abrir menu"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[110] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-full bg-slate-900 text-white flex flex-col shadow-xl z-[120] transition-all duration-300 ease-in-out
        ${isOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-800 hidden lg:flex items-center justify-between">
          <h1 className="text-xl font-bold">
            <span className="text-blue-500">Sign</span>Plus
          </h1>
        </div>
        
        <div className="lg:hidden p-6 border-b border-slate-800 flex items-center justify-between">
          <span className="font-bold text-blue-500 uppercase tracking-widest text-xs">Navegação</span>
          <button onClick={() => setIsOpen(false)} className="text-slate-500">✕</button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 lg:py-3 transition-all text-left group ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white border-r-4 border-blue-400' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className={`text-xl transition-transform group-hover:scale-110 ${activeTab === item.id ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              <span className="font-bold text-[10px] lg:text-xs uppercase tracking-[0.15em]">
                {item.label}
              </span>
            </button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-slate-800 space-y-4 bg-slate-950/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700 shadow-inner">
               {user?.picture ? <img src={user.picture} className="w-full h-full object-cover" alt="Profile" /> : '👤'}
             </div>
             <div className="flex-1 truncate">
               <p className="text-[10px] font-black text-white truncate">{user?.name}</p>
               <p className="text-[8px] text-slate-500 font-bold uppercase truncate">{user?.email}</p>
             </div>
          </div>
          <button 
            onClick={() => logout()}
            className="w-full py-3 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all shadow-sm active:scale-95"
          >
            Encerrar Sessão
          </button>
          <div className="text-[9px] text-slate-600 text-center uppercase tracking-widest font-bold opacity-50">
            Enterprise v1.5.0
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
