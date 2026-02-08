
import React, { useMemo } from 'react';
import { storageService } from '../services/storageService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  notify?: (m: string, t?: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ notify }) => {
  const docs = storageService.getDocuments();
  const certs = storageService.getCertificates();
  const logs = storageService.getAuditLogs();

  // Alertas de certificados vencendo
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
    { label: 'Logs de Auditoria', value: logs.length, color: 'bg-slate-700', icon: '📜' },
    { label: 'Alertas Ativos', value: expiringCerts.length, color: expiringCerts.length > 0 ? 'bg-red-500' : 'bg-slate-400', icon: '⚠️' },
  ], [docs, certs, logs, expiringCerts]);

  const chartData = [
    { name: 'Seg', docs: 4 },
    { name: 'Ter', docs: 7 },
    { name: 'Qua', docs: 5 },
    { name: 'Qui', docs: 12 },
    { name: 'Sex', docs: 8 },
    { name: 'Sáb', docs: 2 },
    { name: 'Dom', docs: 1 },
  ];

  const pieData = [
    { name: 'PDF', value: docs.filter(d => d.fileType === 'PDF').length || 1 },
    { name: 'XML', value: docs.filter(d => d.fileType === 'XML').length || 0 },
  ];

  const COLORS = ['#2563eb', '#10b981'];

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Painel Operacional</h2>
          <p className="text-slate-500">Gestão centralizada de conformidade digital.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">Gerar Relatório</button>
        </div>
      </header>

      {expiringCerts.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-center justify-between animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏰</span>
            <div>
              <p className="text-amber-800 font-bold">Alerta de Vencimento</p>
              <p className="text-amber-700 text-sm">Você possui {expiringCerts.length} certificado(s) que expiram nos próximos 30 dias.</p>
            </div>
          </div>
          <button className="text-amber-800 font-bold text-xs hover:underline uppercase tracking-widest">Renovar Agora</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-3xl font-black text-slate-900">{stat.value}</span>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{stat.label}</span>
            <div className={`absolute bottom-0 left-0 h-1 transition-all group-hover:w-full w-12 ${stat.color}`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="text-blue-500">📈</span> Atividade Semanal
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Bar dataKey="docs" name="Documentos" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6">Ações Rápidas</h3>
          <div className="space-y-3 flex-1">
            <button className="w-full p-4 bg-slate-50 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all text-left flex items-center gap-4 group">
              <span className="text-xl bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">🖋️</span>
              <div className="text-sm font-bold">Novo Documento</div>
            </button>
            <button className="w-full p-4 bg-slate-50 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-all text-left flex items-center gap-4 group">
              <span className="text-xl bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">✅</span>
              <div className="text-sm font-bold">Validar Assinatura</div>
            </button>
            <button className="w-full p-4 bg-slate-50 rounded-xl hover:bg-amber-50 hover:text-amber-700 transition-all text-left flex items-center gap-4 group">
              <span className="text-xl bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">🔐</span>
              <div className="text-sm font-bold">Renovar Certificado</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
