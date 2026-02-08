
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
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[100] bg-slate-900 text-white p-2 rounded-lg shadow-lg"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[80] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-screen bg-slate-900 text-white flex flex-col shadow-xl z-[90] transition-transform duration-300
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 w-64'}
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="text-blue-500">Sign</span>Plus
          </h1>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors text-left ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white border-r-4 border-blue-400' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium text-xs uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
               {user?.picture ? <img src={user.picture} className="w-full h-full object-cover" /> : '👤'}
             </div>
             <div className="flex-1 truncate">
               <p className="text-[10px] font-black text-white truncate">{user?.name}</p>
               <p className="text-[8px] text-slate-500 font-bold uppercase truncate">{user?.email}</p>
             </div>
          </div>
          <button 
            onClick={() => logout()}
            className="w-full py-3 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
          >
            Encerrar Sessão
          </button>
          <div className="text-[9px] text-slate-600 text-center uppercase tracking-widest font-bold">
            v1.4.0 • Auth0 Enabled
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
