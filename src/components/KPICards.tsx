import { Package, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';

interface KPICardsProps {
  period: string;
}

export function KPICards({ period }: KPICardsProps) {
  const kpis = [
    {
      title: 'Valor Total em Estoque',
      value: 'R$ 45.280,50',
      change: '+12,5%',
      trend: 'up',
      icon: Package,
      color: 'blue',
      description: 'vs. período anterior'
    },
    {
      title: 'Vendas do Período',
      value: 'R$ 18.450,00',
      change: '+8,3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'cyan',
      description: 'vs. período anterior'
    },
    {
      title: 'Gastos com Compras',
      value: 'R$ 12.320,00',
      change: '-5,2%',
      trend: 'down',
      icon: DollarSign,
      color: 'blue',
      description: 'economia vs. anterior'
    },
    {
      title: 'Itens em Alerta',
      value: '8',
      change: '3 críticos',
      trend: 'alert',
      icon: AlertTriangle,
      color: 'amber',
      description: 'abaixo do estoque mínimo'
    }
  ];

  // NOVO: Mapeamento para exibir o nome completo do período
  const periodMap: Record<string, string> = {
    'semana': 'Esta Semana',
    'mes': 'Este Mês',
    'trimestre': 'Este Trimestre',
    'ano': 'Este Ano',
  };
  
  // NOVO: Obtém o texto amigável do período a partir da prop 'period'
  const currentPeriodText = periodMap[period] || 'Período Selecionado'; 

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        const isPositive = kpi.trend === 'up';
        const isAlert = kpi.trend === 'alert';
        
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                kpi.color === 'blue' ? 'bg-blue-100' :
                kpi.color === 'cyan' ? 'bg-cyan-100' :
                'bg-amber-100'
              }`}>
                <Icon className={`w-5 h-5 ${
                  kpi.color === 'blue' ? 'text-blue-600' :
                  kpi.color === 'cyan' ? 'text-cyan-600' :
                  'text-amber-600'
                }`} />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                isAlert ? 'bg-amber-100 text-amber-700' :
                isPositive ? 'bg-emerald-100 text-emerald-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {kpi.change}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">{kpi.title}</p>
              <p className="text-2xl font-semibold text-slate-900 mb-1">{kpi.value}</p> 
              {/* ALTERADO: Adiciona a informação do período selecionado */}
              <p className="text-xs text-slate-500">
                {kpi.description} - Dados de: <span className="font-medium text-slate-700">{currentPeriodText}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}