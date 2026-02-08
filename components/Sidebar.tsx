
import React, { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

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
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 bg-slate-800/50 text-[10px] text-slate-500 text-center uppercase tracking-widest font-bold">
          v1.3.0 • Cloud Integrated
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
