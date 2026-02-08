
import React, { useMemo } from 'react';
import { storageService } from '../services/storageService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  notify?: (m: string, t?: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ notify }) => {
  const docs = storageService.getDocuments();
  const certs = storageService.getCertificates();
  const logs = storageService.getAuditLogs();

  const expiringCerts = useMemo(() => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    return certs.filter(c => {
      const expDate = new Date(c.validTo);
      return expDate <= thirtyDaysFromNow && expDate >= today;
    });
  }, [certs]);

  const stats = useMemo(() => [
    { label: 'Documentos', value: docs.length, color: 'bg-blue-600', icon: '📄' },
    { label: 'Certificados', value: certs.length, color: 'bg-emerald-600', icon: '🔐' },
    { label: 'Logs Auditoria', value: logs.length, color: 'bg-slate-700', icon: '📜' },
    { label: 'Alertas Ativos', value: expiringCerts.length, color: expiringCerts.length > 0 ? 'bg-red-500' : 'bg-slate-400', icon: '⚠️' },
  ], [docs, certs, logs, expiringCerts]);

  const chartData = [
    { name: 'Seg', docs: 4 }, { name: 'Ter', docs: 7 }, { name: 'Qua', docs: 5 },
    { name: 'Qui', docs: 12 }, { name: 'Sex', docs: 8 }, { name: 'Sáb', docs: 2 }, { name: 'Dom', docs: 1 },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Painel Operacional</h2>
          <p className="text-slate-500 text-xs md:text-sm font-medium">Gestão centralizada de conformidade digital.</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <button className="flex-1 md:flex-none bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-50 transition-all uppercase tracking-widest shadow-sm active:scale-95">Gerar Relatório</button>
        </div>
      </header>

      {expiringCerts.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 md:p-6 rounded-r-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-left-4 duration-500 shadow-sm">
          <div className="flex items-center gap-4 w-full">
            <span className="text-3xl bg-white w-12 h-12 flex items-center justify-center rounded-xl shadow-sm">⏰</span>
            <div>
              <p className="text-amber-800 font-black text-sm uppercase tracking-wider">Alerta de Vencimento</p>
              <p className="text-amber-700 text-xs font-medium">Você possui {expiringCerts.length} certificado(s) que expiram nos próximos 30 dias.</p>
            </div>
          </div>
          <button className="w-full md:w-auto bg-amber-600 text-white px-6 py-3 rounded-xl font-black text-[10px] hover:bg-amber-700 transition-all uppercase tracking-widest shadow-lg shadow-amber-200">Renovar Agora</button>
        </div>
      )}

      {/* Stats Grid - Responsive Column Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl font-black text-slate-900">{stat.value}</span>
              <span className="text-2xl bg-slate-50 w-10 h-10 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">{stat.icon}</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">{stat.label}</span>
            <div className={`absolute bottom-0 left-0 h-1.5 transition-all group-hover:w-full w-12 ${stat.color}`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Container - Adapts height for mobile */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="font-black text-slate-800 mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.2em]">
            <span className="text-blue-500">📈</span> Atividade Semanal
          </h3>
          <div className="h-[250px] md:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px', fontWeight: 'bold' }}
                />
                <Bar dataKey="docs" name="Documentos" fill="#2563eb" radius={[8, 8, 0, 0]} barSize={window.innerWidth < 768 ? 20 : 40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions - Stacks on mobile */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-black text-slate-800 mb-8 text-xs uppercase tracking-[0.2em]">Ações Rápidas</h3>
          <div className="space-y-4 flex-1">
            {[
              { label: 'Novo Documento', icon: '🖋️', color: 'blue', tab: 'sign' },
              { label: 'Validar Assinatura', icon: '✅', color: 'emerald', tab: 'validate' },
              { label: 'Renovar Certificado', icon: '🔐', color: 'amber', tab: 'certificates' },
              { label: 'Logs de Auditoria', icon: '📜', color: 'slate', tab: 'audit' }
            ].map((action, i) => (
              <button 
                key={i}
                onClick={() => window.location.hash = action.tab}
                className={`w-full p-4 md:p-5 bg-slate-50 rounded-2xl hover:bg-${action.color}-50 hover:text-${action.color}-700 transition-all text-left flex items-center gap-5 group shadow-sm active:scale-95`}
              >
                <span className="text-xl bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all">
                  {action.icon}
                </span>
                <div className="text-xs md:text-sm font-black uppercase tracking-widest">{action.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
