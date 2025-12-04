import { useState } from 'react';
import { Search, ArrowUpDown, Package } from 'lucide-react';

interface StockItem {
  id: number;
  code: string;
  name: string;
  category: string;
  quantity: number;
  minimum: number;
  unitPrice: number;
  salePrice: number;
  totalValue: number;
  status: 'ok' | 'warning' | 'critical';
}

export function StockTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof StockItem>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const stockData: StockItem[] = [
    { id: 1, code: 'CAD-001', name: 'Caderno Universitário 200 folhas', category: 'Papelaria', quantity: 5, minimum: 20, unitPrice: 12.50, salePrice: 18.00, totalValue: 90.00, status: 'critical' },
    { id: 2, code: 'CAN-001', name: 'Caneta Azul BIC', category: 'Escrita', quantity: 15, minimum: 50, unitPrice: 1.20, salePrice: 2.00, totalValue: 30.00, status: 'critical' },
    { id: 3, code: 'PAP-001', name: 'Papel A4 Sulfite (resma)', category: 'Papelaria', quantity: 8, minimum: 30, unitPrice: 22.00, salePrice: 35.00, totalValue: 280.00, status: 'critical' },
    { id: 4, code: 'LAP-001', name: 'Lápis HB nº2', category: 'Escrita', quantity: 25, minimum: 40, unitPrice: 0.80, salePrice: 1.50, totalValue: 37.50, status: 'warning' },
    { id: 5, code: 'BOR-001', name: 'Borracha Branca', category: 'Escrita', quantity: 18, minimum: 30, unitPrice: 0.60, salePrice: 1.20, totalValue: 21.60, status: 'warning' },
    { id: 6, code: 'REG-001', name: 'Régua 30cm', category: 'Instrumentos', quantity: 45, minimum: 25, unitPrice: 2.50, salePrice: 4.50, totalValue: 202.50, status: 'ok' },
    { id: 7, code: 'CAD-002', name: 'Caderno Brochura 48 folhas', category: 'Papelaria', quantity: 60, minimum: 30, unitPrice: 3.20, salePrice: 5.50, totalValue: 330.00, status: 'ok' },
    { id: 8, code: 'CAN-002', name: 'Caneta Preta BIC', category: 'Escrita', quantity: 38, minimum: 50, unitPrice: 1.20, salePrice: 2.00, totalValue: 76.00, status: 'warning' },
    { id: 9, code: 'TEI-001', name: 'Tesoura sem ponta', category: 'Instrumentos', quantity: 22, minimum: 15, unitPrice: 5.80, salePrice: 9.50, totalValue: 209.00, status: 'ok' },
    { id: 10, code: 'COL-001', name: 'Cola Bastão 40g', category: 'Adesivos', quantity: 55, minimum: 35, unitPrice: 3.50, salePrice: 6.00, totalValue: 330.00, status: 'ok' },
    { id: 11, code: 'MAR-001', name: 'Marcador de Texto Amarelo', category: 'Escrita', quantity: 28, minimum: 20, unitPrice: 2.80, salePrice: 5.00, totalValue: 140.00, status: 'ok' },
    { id: 12, code: 'CAD-003', name: 'Caderno Desenho A4', category: 'Papelaria', quantity: 12, minimum: 15, unitPrice: 8.50, salePrice: 14.00, totalValue: 168.00, status: 'warning' },
  ];

  const filteredData = stockData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const modifier = sortDirection === 'asc' ? 1 : -1;
    return aValue > bValue ? modifier : -modifier;
  });

  const handleSort = (field: keyof StockItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      ok: { text: 'Normal', class: 'bg-emerald-100 text-emerald-700' },
      warning: { text: 'Baixo', class: 'bg-amber-100 text-amber-700' },
      critical: { text: 'Crítico', class: 'bg-red-100 text-red-700' }
    };
    const badge = badges[status as keyof typeof badges];
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${badge.class}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <h2 className="text-slate-900">Inventário de Estoque</h2>
          </div>
          <div className="text-sm text-slate-600">
            Total de itens: <span className="text-slate-900">{stockData.length}</span>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome, código ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-slate-600">
                <button
                  onClick={() => handleSort('code')}
                  className="flex items-center gap-1 hover:text-slate-900"
                >
                  Código
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs text-slate-600">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 hover:text-slate-900"
                >
                  Produto
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs text-slate-600">
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center gap-1 hover:text-slate-900"
                >
                  Categoria
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-right text-xs text-slate-600">
                <button
                  onClick={() => handleSort('quantity')}
                  className="flex items-center gap-1 hover:text-slate-900 ml-auto"
                >
                  Qtd. em Estoque
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-right text-xs text-slate-600">
                Estoque Mínimo
              </th>
              <th className="px-6 py-3 text-right text-xs text-slate-600">
                <button
                  onClick={() => handleSort('salePrice')}
                  className="flex items-center gap-1 hover:text-slate-900 ml-auto"
                >
                  Valor de Venda
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-right text-xs text-slate-600">
                <button
                  onClick={() => handleSort('totalValue')}
                  className="flex items-center gap-1 hover:text-slate-900 ml-auto"
                >
                  Valor Total
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-center text-xs text-slate-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sortedData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-600">
                  {item.code}
                </td>
                <td className="px-6 py-4 text-sm text-slate-900">
                  {item.name}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {item.category}
                </td>
                <td className="px-6 py-4 text-sm text-slate-900 text-right">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 text-right">
                  {item.minimum}
                </td>
                <td className="px-6 py-4 text-sm text-slate-900 text-right">
                  R$ {item.salePrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-900 text-right">
                  R$ {item.totalValue.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center">
                  {getStatusBadge(item.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedData.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-slate-600">Nenhum item encontrado</p>
        </div>
      )}
    </div>
  );
}
