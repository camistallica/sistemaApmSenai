import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';

interface RawKPI {
    id: 'estoqueTotal' | 'vendas' | 'gastos' | 'alertas';
    title: string;
    value: string | number; // Valor bruto (pode ser string 'toFixed' ou number)
}

interface KPI {
    id: string;
    title: string;
    value: string;
    change: string; 
    trend: 'up' | 'down' | 'alert';
    icon: React.ElementType; 
    color: string;
    description: string;
}


interface KPICardsProps {
  period: string; // Ex: 'mes', 'ano', 'semana'
}

// Mapeamento de IDs da API para os ícones e cores (metadados)
const kpiMeta: Record<RawKPI['id'], Omit<KPI, 'id' | 'title' | 'value'>> = {
    estoqueTotal: { icon: Package, color: 'blue', trend: 'up', change: '+12.5%', description: 'vs. período anterior' },
    vendas: { icon: TrendingUp, color: 'cyan', trend: 'up', change: '+8.3%', description: 'vs. período anterior' },
    gastos: { icon: DollarSign, color: 'blue', trend: 'down', change: '-5.2%', description: 'economia vs. anterior' },
    alertas: { icon: AlertTriangle, color: 'amber', trend: 'alert', change: '3 críticos', description: 'abaixo do estoque mínimo' },
};

const periodMap: Record<string, string> = {
    'semana': 'Esta Semana',
    'mes': 'Este Mês',
    'trimestre': 'Este Trimestre',
    'ano': 'Este Ano',
};


export function KPICards({ period }: KPICardsProps) {
    const [kpisData, setKpisData] = useState<KPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const currentPeriodText = periodMap[period] || 'Período Selecionado';

    useEffect(() => {
        const fetchKpis = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:3001/api/kpis?period=${period}`);
                const formattedKpis: KPI[] = response.data.kpis.map((kpi: RawKPI) => ({
                    ...kpi,
                    ...kpiMeta[kpi.id], 
                    
                    // Formata valor:
                    value: kpi.id === 'alertas' 
                        ? kpi.value.toString() // Alertas é número puro
                        // Valor monetário: converte para string e formata R$
                        : `R$ ${parseFloat(kpi.value.toString()).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                }));

                setKpisData(formattedKpis);
            } catch (error) {
                console.error("Erro ao buscar KPIs:", error);
                setKpisData([]); 
            } finally {
                setIsLoading(false);
            }
        };

        fetchKpis();
    }, [period]);

    if (isLoading) {
        return <div className="p-4 text-center text-slate-500">Carregando dados do servidor...</div>;
    }
    
    // Opcional: Se não houver dados
    if (kpisData.length === 0) {
        return <div className="p-4 text-center text-red-500">Não foi possível carregar os dados dos KPIs. Verifique o servidor.</div>;
    }


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpisData.map((kpi, index) => {
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