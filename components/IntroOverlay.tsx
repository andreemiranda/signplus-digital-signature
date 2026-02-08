
import React from 'react';

interface IntroOverlayProps {
  onComplete: () => void;
}

const IntroOverlay: React.FC<IntroOverlayProps> = ({ onComplete }) => {
  return (
    <div className="fixed inset-0 z-[500] bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse delay-1000"></div>

      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center">
        {/* Logo Section */}
        <div className="mb-16 animate-in fade-in zoom-in duration-1000">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter">
            <span className="text-blue-500 inline-block hover:scale-105 transition-transform cursor-default">Sign</span>Plus
          </h1>
          <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Pillars Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 w-full">
          {[
            { icon: '🔐', title: 'ICP-Brasil', desc: 'Conformidade jurídica total com padrões A1 e A3.' },
            { icon: '☁️', title: 'Hybrid Cloud', desc: 'Integração nativa com Assinafy e Google Drive.' },
            { icon: '✨', title: 'Gemini AI', desc: 'Análise inteligente de assinaturas e auditoria.' }
          ].map((item, i) => (
            <div 
              key={i} 
              className={`bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all duration-500 group animate-in slide-in-from-bottom-8 fill-mode-both`}
              style={{ animationDelay: `${(i + 1) * 200}ms` }}
            >
              <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-500">{item.icon}</div>
              <h3 className="text-white font-black text-sm uppercase tracking-widest mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button 
          onClick={onComplete}
          className="group relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-1000 fill-mode-both"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative px-12 py-5 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all hover:bg-slate-50 active:scale-95 shadow-2xl">
            Começar Agora
          </div>
        </button>

        <p className="mt-10 text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] animate-in fade-in duration-1000 delay-[1500ms]">
          Enterprise Digital Signature Platform
        </p>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 flex items-center gap-4 opacity-20 hover:opacity-100 transition-opacity">
        <span className="text-white text-[10px] font-black uppercase tracking-widest">Powered by Google Gemini 3</span>
        <div className="h-px w-8 bg-white"></div>
        <span className="text-white text-[10px] font-black uppercase tracking-widest">Assinafy Cloud</span>
      </div>
    </div>
  );
};

export default IntroOverlay;
