import { AlertTriangle, AlertCircle } from 'lucide-react';

export function StockAlerts() {
  const alerts = [
    { id: 1, product: 'Caderno Universitário 200 folhas', current: 5, minimum: 20, status: 'critical' },
    { id: 2, product: 'Caneta Azul BIC', current: 15, minimum: 50, status: 'critical' },
    { id: 3, product: 'Papel A4 Sulfite (resma)', current: 8, minimum: 30, status: 'critical' },
    { id: 4, product: 'Lápis HB nº2', current: 25, minimum: 40, status: 'warning' },
    { id: 5, product: 'Borracha Branca', current: 18, minimum: 30, status: 'warning' },
  ];

  const criticalAlerts = alerts.filter(a => a.status === 'critical');
  const warningAlerts = alerts.filter(a => a.status === 'warning');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-amber-600" />
        <h2 className="text-slate-900">Alertas de Estoque Mínimo</h2>
      </div>

      <div className="space-y-3">
        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-700">Crítico - Necessita reposição imediata</p>
            </div>
            <div className="space-y-2">
              {criticalAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">{alert.product}</p>
                    <p className="text-xs text-slate-600">
                      Estoque atual: {alert.current} unidades
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-600">Mínimo: {alert.minimum}</p>
                    <p className="text-xs text-red-700">
                      Faltam {alert.minimum - alert.current} unidades
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warning Alerts */}
        {warningAlerts.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <p className="text-sm text-amber-700">Atenção - Estoque baixo</p>
            </div>
            <div className="space-y-2">
              {warningAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">{alert.product}</p>
                    <p className="text-xs text-slate-600">
                      Estoque atual: {alert.current} unidades
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-600">Mínimo: {alert.minimum}</p>
                    <p className="text-xs text-amber-700">
                      Faltam {alert.minimum - alert.current} unidades
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
