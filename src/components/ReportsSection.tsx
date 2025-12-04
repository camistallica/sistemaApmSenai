import { FileDown, ShoppingCart, DollarSign, Calendar } from 'lucide-react';

export function ReportsSection() {
  const handleExportPurchases = () => {
    const purchasesData = [
      { date: '2024-12-01', supplier: 'Distribuidora ABC', product: 'Caderno Universitário 200 folhas', quantity: 50, unitPrice: 12.50, total: 625.00 },
      { date: '2024-12-01', supplier: 'Distribuidora ABC', product: 'Caneta Azul BIC', quantity: 100, unitPrice: 1.20, total: 120.00 },
      { date: '2024-12-02', supplier: 'Papelaria Central', product: 'Papel A4 Sulfite (resma)', quantity: 40, unitPrice: 22.00, total: 880.00 },
      { date: '2024-12-03', supplier: 'Escritório Total', product: 'Cola Bastão 40g', quantity: 60, unitPrice: 3.50, total: 210.00 },
      { date: '2024-12-05', supplier: 'Distribuidora ABC', product: 'Régua 30cm', quantity: 50, unitPrice: 2.50, total: 125.00 },
    ];

    const csv = [
      ['Data', 'Fornecedor', 'Produto', 'Quantidade', 'Preço Unitário', 'Total'],
      ...purchasesData.map(item => [
        item.date,
        item.supplier,
        item.product,
        item.quantity,
        `R$ ${item.unitPrice.toFixed(2)}`,
        `R$ ${item.total.toFixed(2)}`
      ])
    ].map(row => row.join(';')).join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `compras_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleExportExpenses = () => {
    const expensesData = [
      { date: '2024-12-01', category: 'Papelaria', description: 'Compra de Cadernos', value: 625.00, paymentMethod: 'Transferência' },
      { date: '2024-12-01', category: 'Material de Escrita', description: 'Compra de Canetas', value: 120.00, paymentMethod: 'Transferência' },
      { date: '2024-12-02', category: 'Papelaria', description: 'Compra de Papel A4', value: 880.00, paymentMethod: 'Boleto' },
      { date: '2024-12-03', category: 'Adesivos', description: 'Compra de Cola Bastão', value: 210.00, paymentMethod: 'PIX' },
      { date: '2024-12-05', category: 'Instrumentos', description: 'Compra de Réguas', value: 125.00, paymentMethod: 'Transferência' },
      { date: '2024-12-10', category: 'Serviços', description: 'Frete de Mercadorias', value: 85.00, paymentMethod: 'Dinheiro' },
      { date: '2024-12-15', category: 'Operacional', description: 'Manutenção do Sistema', value: 150.00, paymentMethod: 'PIX' },
    ];

    const csv = [
      ['Data', 'Categoria', 'Descrição', 'Valor', 'Forma de Pagamento'],
      ...expensesData.map(item => [
        item.date,
        item.category,
        item.description,
        `R$ ${item.value.toFixed(2)}`,
        item.paymentMethod
      ])
    ].map(row => row.join(';')).join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `gastos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileDown className="w-5 h-5 text-blue-600" />
        <h2 className="text-slate-900">Relatórios e Exportações</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export Purchases */}
        <div className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-slate-900 mb-1">Relatório de Compras</h3>
              <p className="text-sm text-slate-600">
                Exportar histórico de compras com detalhes de fornecedores, produtos e valores
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Calendar className="w-3 h-3" />
              <span>Últimos 30 dias</span>
            </div>
            <span className="text-sm text-slate-900">5 registros</span>
          </div>
          <button
            onClick={handleExportPurchases}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-colors flex items-center justify-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            Exportar Compras (CSV)
          </button>
        </div>

        {/* Export Expenses */}
        <div className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-slate-900 mb-1">Relatório de Gastos</h3>
              <p className="text-sm text-slate-600">
                Exportar todos os gastos e despesas operacionais do período selecionado
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Calendar className="w-3 h-3" />
              <span>Últimos 30 dias</span>
            </div>
            <span className="text-sm text-slate-900">7 registros</span>
          </div>
          <button
            onClick={handleExportExpenses}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-colors flex items-center justify-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            Exportar Gastos (CSV)
          </button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <span className="font-medium">Dica:</span> Os arquivos CSV podem ser abertos no Excel, Google Sheets ou LibreOffice Calc para análise detalhada dos dados.
        </p>
      </div>
    </div>
  );
}
