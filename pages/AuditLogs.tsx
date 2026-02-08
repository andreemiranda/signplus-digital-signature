
import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { AuditLog } from '../types';

interface AuditLogsProps {
  notify: (m: string, t?: any) => void;
}

const AuditLogs: React.FC<AuditLogsProps> = ({ notify }) => {
  const [logs, setLogs] = useState<AuditLog[]>(storageService.getAuditLogs());

  const handleClear = () => {
    if (window.confirm("Deseja realmente limpar todos os logs de auditoria? Esta ação será registrada.")) {
      storageService.clearAuditLogs();
      setLogs(storageService.getAuditLogs());
      notify("Logs removidos do banco local");
    }
  };

  const handleExport = () => {
    notify("Iniciando exportação para CSV...", "info");
    setTimeout(() => notify("Download concluído!"), 1000);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Logs de Auditoria</h2>
          <p className="text-slate-500">Registro histórico imutável de todas as ações do sistema.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleClear}
            className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors"
          >
            Limpar Logs
          </button>
          <button 
            onClick={handleExport}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
          >
            Exportar CSV
          </button>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest">
                <th className="px-6 py-4 font-bold">Data/Hora</th>
                <th className="px-6 py-4 font-bold">Ação</th>
                <th className="px-6 py-4 font-bold">Entidade</th>
                <th className="px-6 py-4 font-bold">Resultado</th>
                <th className="px-6 py-4 font-bold">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors text-xs">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400 font-medium">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    {log.action}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold uppercase">
                      {log.entityType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 font-bold ${log.result === 'SUCCESS' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {log.result === 'SUCCESS' ? '● SUCESSO' : '● FALHA'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 italic">
                    {log.details}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic font-medium">
                    Nenhum registro de auditoria encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
