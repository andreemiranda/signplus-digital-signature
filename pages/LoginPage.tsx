
import React from 'react';
import { useSignPlusAuth } from '../hooks/useSignPlusAuth';

const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, loginWithMicrosoft, loginDev, isLoading } = useSignPlusAuth();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-10 md:p-12 shadow-2xl flex flex-col items-center text-center">
          <div className="mb-10 group">
            <h1 className="text-5xl font-black text-white tracking-tighter transition-all group-hover:scale-105">
              <span className="text-blue-500">Sign</span>Plus
            </h1>
            <div className="h-1 w-12 bg-blue-500 mx-auto mt-2 rounded-full"></div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-4">Enterprise Identity Portal</p>
          </div>

          <div className="w-full space-y-4">
            <button 
              onClick={login}
              disabled={isLoading}
              className="w-full py-5 bg-white text-slate-950 font-black rounded-2xl shadow-xl hover:bg-slate-100 transition-all uppercase text-[10px] tracking-widest active:scale-95 disabled:opacity-50"
            >
              Entrar com Email
            </button>

            <div className="flex items-center gap-4 py-4">
              <div className="h-px bg-white/10 flex-1"></div>
              <span className="text-slate-500 text-[9px] font-black uppercase">SSO Corporativo</span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={loginWithGoogle}
                disabled={isLoading}
                className="py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                title="Google Cloud Identity"
              >
                <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-4 h-4" alt="Google" />
                <span className="text-[9px] font-black uppercase tracking-widest">Google</span>
              </button>

              <button 
                onClick={loginWithMicrosoft}
                disabled={isLoading}
                className="py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                title="Azure Active Directory"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" className="w-3 h-3" alt="Microsoft" />
                <span className="text-[9px] font-black uppercase tracking-widest">Microsoft</span>
              </button>
            </div>
          </div>

          <div className="mt-12 space-y-6 w-full">
            <p className="text-[9px] text-slate-500 font-medium leading-relaxed px-6">
              Assinaturas digitais em conformidade com MP 2.200-2/2001 e normas do ITI.
            </p>
            
            <div className="pt-4 border-t border-white/5">
              <button 
                onClick={loginDev}
                className="text-slate-500 hover:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Acesso Desenvolvedor (Mock)
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center flex items-center justify-center gap-4 opacity-20 hover:opacity-100 transition-opacity">
           <span className="text-white text-[9px] font-black uppercase tracking-[0.2em]">Auth0 v2.2</span>
           <div className="h-px w-6 bg-white/20"></div>
           <span className="text-white text-[9px] font-black uppercase tracking-[0.2em]">ICP-Brasil Compliant</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
