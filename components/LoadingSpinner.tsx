
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-slate-950 z-[600] flex flex-col items-center justify-center">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-blue-600/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-8 text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Sincronizando Identidade...</p>
    </div>
  );
};

export default LoadingSpinner;
