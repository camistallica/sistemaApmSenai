import { useState } from 'react';
import { KPICards } from './KPICards';
import { StockAlerts } from './StockAlerts';
import { StockTable } from './StockTable';
import { ReportsSection } from './ReportsSection';
import { Package, LogOut, User } from 'lucide-react';

interface DashboardProps {
  userName: string;
  onLogout: () => void;
}

export function Dashboard({ userName, onLogout }: DashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('mes');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-slate-900">Sistema de Estoque</h1>
                <p className="text-sm text-slate-600">APM SENAI - Gerenciamento Integrado</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-600">Período:</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="semana">Esta Semana</option>
                  <option value="mes">Este Mês</option>
                  <option value="trimestre">Trimestre</option>
                  <option value="ano">Ano</option>
                </select>
              </div>
              <div className="h-8 w-px bg-slate-300"></div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                  <User className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-900">{userName}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sair do sistema"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* KPIs */}
          <KPICards period={selectedPeriod} />

          {/* Alerts */}
          <StockAlerts />

          {/* Stock Table */}
          <StockTable />

          {/* Reports */}
          <ReportsSection />
        </div>
      </main>
    </div>
  );
}
