
import React, { useState, useRef } from 'react';
import { storageService } from '../services/storageService';
import { SignatureSeal } from '../types';

interface SealEditorProps {
  notify?: (m: string, t?: any) => void;
}

const SealEditor: React.FC<SealEditorProps> = ({ notify }) => {
  const [sealName, setSealName] = useState('Selo Premium');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [borderColor, setBorderColor] = useState('#2563eb');
  const [width, setWidth] = useState(250);
  const [height, setHeight] = useState(100);
  const [useCustomImage, setUseCustomImage] = useState(false);
  const [watermark, setWatermark] = useState<string | undefined>(undefined);
  const [customSeal, setCustomSeal] = useState<string | undefined>(undefined);
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.2);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const newSeal: SignatureSeal = {
      id: crypto.randomUUID(),
      name: sealName,
      isNative: false,
      isDefault: false,
      useCustomImageOnly: useCustomImage,
      customSealImage: customSeal,
      watermarkImage: watermark,
      watermarkOpacity: watermarkOpacity,
      template: {
        width,
        height,
        backgroundColor: bgColor,
        borderColor: borderColor,
        borderWidth: 2,
        borderRadius: 8,
      },
      fields: [], 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    storageService.addSeal(newSeal);
    if (notify) notify('Design de selo arquivado com sucesso!', 'success');
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Estúdio de Design de Selos</h2>
          <p className="text-slate-500 text-sm font-medium">Personalização avançada de estampas visuais.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-100 border-2 border-dashed border-slate-200 rounded-[3rem] p-12 flex items-center justify-center min-h-[500px] shadow-inner relative overflow-hidden">
          {/* Preview Canvas */}
          <div 
            style={{ 
              width: `${width}px`, 
              height: `${height}px`, 
              backgroundColor: useCustomImage ? 'transparent' : bgColor, 
              borderColor: useCustomImage ? 'transparent' : borderColor,
              borderWidth: useCustomImage ? '0' : '2px',
              borderRadius: '8px',
              backgroundImage: useCustomImage && customSeal ? `url(${customSeal})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            className="shadow-2xl flex flex-col p-4 overflow-hidden relative bg-white transition-all duration-500"
          >
            {!useCustomImage && (
              <>
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
                
                {/* Watermark layer */}
                {watermark && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ opacity: watermarkOpacity }}
                  >
                    <img src={watermark} alt="Watermark" className="max-w-[70%] max-h-[70%] object-contain" />
                  </div>
                )}

                <div className="relative z-10 flex flex-col h-full">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Assinado por:</p>
                  <p className="text-sm font-black text-slate-800 leading-tight">NOME DO SIGNATÁRIO EXEMPLO</p>
                  <p className="text-[10px] text-slate-500 font-bold mt-1">CPF: ***.456.***-**</p>
                  
                  <div className="mt-auto flex justify-between items-end border-t border-slate-100 pt-2">
                    <div>
                      <p className="text-[8px] text-slate-400 font-bold uppercase">Data da Assinatura</p>
                      <p className="text-[10px] text-slate-600 font-bold">{new Date().toLocaleString()}</p>
                    </div>
                    <div className="w-8 h-8 opacity-20 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                      ✓
                    </div>
                  </div>
                </div>
              </>
            )}
            {useCustomImage && !customSeal && (
              <div className="flex flex-col items-center justify-center h-full text-slate-300">
                <span className="text-4xl">🖼️</span>
                <p className="text-[10px] font-black uppercase tracking-widest mt-2">Aguardando Imagem</p>
              </div>
            )}
          </div>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>Visualização em Escala Real</span>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-8">
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-[0.2em] border-b border-slate-50 pb-4">Configurações</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Modo do Selo</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 rounded-2xl">
                  <button 
                    onClick={() => setUseCustomImage(false)}
                    className={`py-2 text-[10px] font-black uppercase rounded-xl transition-all ${!useCustomImage ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                  >
                    Gerado
                  </button>
                  <button 
                    onClick={() => setUseCustomImage(true)}
                    className={`py-2 text-[10px] font-black uppercase rounded-xl transition-all ${useCustomImage ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                  >
                    Imagem
                  </button>
                </div>
              </div>

              {!useCustomImage ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Fundo</label>
                      <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded-xl border-none cursor-pointer bg-slate-50 p-1" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Borda</label>
                      <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="w-full h-10 rounded-xl border-none cursor-pointer bg-slate-50 p-1" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Marca D'água</label>
                    <button 
                      onClick={() => watermarkInputRef.current?.click()}
                      className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 hover:bg-slate-50 transition-all uppercase"
                    >
                      {watermark ? "Alterar Marca D'água" : "+ Upload Logotipo"}
                    </button>
                    <input type="file" ref={watermarkInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setWatermark)} />
                    
                    {watermark && (
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                          <span>Opacidade</span>
                          <span>{Math.round(watermarkOpacity * 100)}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="1" step="0.05" 
                          value={watermarkOpacity} 
                          onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                          className="w-full accent-blue-600"
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Upload de Selo Pronto</label>
                  <p className="text-[9px] text-slate-400 mb-4 font-bold uppercase italic">Recomendado: 500x200px (PNG)</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-12 border-2 border-dashed border-indigo-100 bg-indigo-50/20 rounded-3xl flex flex-col items-center justify-center gap-3 group hover:bg-indigo-50 transition-all"
                  >
                    <span className="text-3xl group-hover:scale-110 transition-transform">🖼️</span>
                    <span className="text-[10px] font-black text-indigo-400 uppercase">Selecionar Imagem</span>
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setCustomSeal)} />
                </div>
              )}

              <div className="pt-4 border-t border-slate-50">
                <button 
                  onClick={handleSave}
                  className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-black transition-all uppercase text-xs tracking-widest"
                >
                  Confirmar Design
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SealEditor;
