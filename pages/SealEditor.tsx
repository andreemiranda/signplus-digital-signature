
import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { SignatureSeal } from '../types';

// Define props to accept notify function
interface SealEditorProps {
  notify?: (m: string, t?: any) => void;
}

const SealEditor: React.FC<SealEditorProps> = ({ notify }) => {
  const [sealName, setSealName] = useState('Novo Selo Personalizado');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [borderColor, setBorderColor] = useState('#2563eb');
  const [width, setWidth] = useState(250);
  const [height, setHeight] = useState(100);

  const handleSave = () => {
    const newSeal: SignatureSeal = {
      id: crypto.randomUUID(),
      name: sealName,
      isNative: false,
      isDefault: false,
      template: {
        width,
        height,
        backgroundColor: bgColor,
        borderColor: borderColor,
        borderWidth: 2,
        borderRadius: 8,
      },
      fields: [], // Simplificado para o MVP
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    storageService.addSeal(newSeal);
    // Use notify function for better UI feedback
    if (notify) {
      notify('Selo salvo com sucesso!', 'success');
    } else {
      alert('Selo salvo com sucesso!');
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Editor de Selos</h2>
        <p className="text-slate-500">Personalize a aparência visual das suas assinaturas nos documentos.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-200 rounded-2xl p-12 flex items-center justify-center min-h-[400px] shadow-inner">
          <div 
            style={{ 
              width: `${width}px`, 
              height: `${height}px`, 
              backgroundColor: bgColor, 
              borderColor: borderColor,
              borderWidth: '2px',
              borderRadius: '8px'
            }}
            className="shadow-2xl flex flex-col p-4 overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Assinado Digitalmente por:</p>
            <p className="text-sm font-bold text-slate-800 truncate">NOME DO SIGNATÁRIO EXEMPLO</p>
            <div className="mt-auto flex justify-between items-end">
              <p className="text-[9px] text-slate-500">Data: {new Date().toLocaleDateString('pt-BR')}</p>
              <div className="w-8 h-8 opacity-20">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              </div>
            </div>
          </div>
        </div>

        <aside className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-800 border-b pb-2">Propriedades</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome do Modelo</label>
              <input 
                type="text" 
                value={sealName}
                onChange={(e) => setSealName(e.target.value)}
                className="w-full bg-white text-slate-900 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Largura (px)</label>
                <input 
                  type="number" 
                  value={width} 
                  onChange={(e) => setWidth(Number(e.target.value))} 
                  className="w-full bg-white text-slate-900 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Altura (px)</label>
                <input 
                  type="number" 
                  value={height} 
                  onChange={(e) => setHeight(Number(e.target.value))} 
                  className="w-full bg-white text-slate-900 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cor de Fundo</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer" />
                  <span className="text-xs font-mono text-slate-600">{bgColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cor da Borda</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer" />
                  <span className="text-xs font-mono text-slate-600">{borderColor}</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md uppercase text-sm tracking-wider"
          >
            Salvar Modelo de Selo
          </button>
        </aside>
      </div>
    </div>
  );
};

export default SealEditor;
