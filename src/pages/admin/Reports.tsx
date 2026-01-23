import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientStore } from '../../store/clients';
import { useVendorStore } from '../../store/vendors';
import { useProductStore } from '../../store/products';
import { useVisitStore } from '../../store/visits';
import { useSalesStore } from '../../store/sales';
import { ArrowLeft, TrendingUp, Users, ShoppingBag, Calendar, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/currencyFormatter';

function Reports() {
  const navigate = useNavigate();
  const clients = useClientStore(state => state.clients);
  const vendors = useVendorStore(state => state.vendors);
  const products = useProductStore(state => state.products);
  const visits = useVisitStore(state => state.visits);
  const { sales, getSales, getTotalRevenue } = useSalesStore();

  useEffect(() => {
    getSales();
  }, [getSales]);

  const totalRevenue = getTotalRevenue();
  const completedSales = sales.filter(s => s.status === 'completed');
  const averageTicket = completedSales.length > 0 ? totalRevenue / completedSales.length : 0;

  const performanceMetrics = [
    {
      title: 'Total em Vendas',
      value: formatCurrency(totalRevenue),
      growth: '+22%',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(averageTicket),
      growth: '+15%',
      icon: ShoppingBag,
      color: 'bg-blue-500'
    },
    {
      title: 'Clientes Ativos',
      value: clients.length,
      growth: '+18%',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Visitas Realizadas',
      value: visits.length,
      growth: '+25%',
      icon: Calendar,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center">
          <button
            onClick={() => navigate('/admin')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios Gerenciais</h1>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${metric.color} p-3 rounded-full text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-green-600 font-medium">{metric.growth}</span>
                </div>
                <h3 className="text-gray-600 text-sm mb-2">{metric.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Vendors */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vendedores Destaque</h2>
            <div className="space-y-4">
              {vendors
                .sort((a, b) => b.totalSales - a.totalSales)
                .slice(0, 5)
                .map((vendor, index) => (
                  <div key={vendor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full mr-3">
                        <span className="font-semibold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{vendor.name}</p>
                        <p className="text-sm text-gray-500">Nível {vendor.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(vendor.totalSales)}</p>
                      <p className="text-sm text-green-600">+{Math.floor(Math.random() * 30 + 10)}%</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Visit Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status das Visitas</h2>
            <div className="space-y-4">
              {Object.entries(
                visits.reduce((acc, visit) => {
                  acc[visit.status] = (acc[visit.status] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">
                    {status === 'scheduled' ? 'Agendadas' :
                     status === 'in_negotiation' ? 'Em Negociação' :
                     status === 'completed_purchase' ? 'Vendas Concluídas' :
                     status === 'completed_no_purchase' ? 'Sem Venda' :
                     status === 'rescheduled' ? 'Reagendadas' :
                     status === 'absent' ? 'Cliente Ausente' :
                     'Cliente Pensando'}
                  </span>
                  <span className="text-lg font-semibold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Best Selling Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Produtos Mais Vendidos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.slice(0, 4).map((product) => (
                <div key={product.id} className="bg-gray-50 rounded-lg p-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-600">Código: {product.code}</p>
                  <p className="text-lg font-semibold text-green-600 mt-2">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sales History */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Vendas Recentes</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Itens</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {completedSales.slice(0, 10).map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{sale.client.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {sale.items.map(item => item.name).join(', ').substring(0, 30)}
                        {sale.items.map(item => item.name).join(', ').length > 30 && '...'}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">
                        {formatCurrency(sale.total)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(sale.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Concluída
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {completedSales.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma venda realizada ainda
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <p className="text-sm text-green-700 font-medium">Comissões Recebidas</p>
              <p className="text-2xl font-bold text-green-800 mt-2">R$ 0,00</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
              <p className="text-sm text-orange-700 font-medium">Comissões Pendentes</p>
              <p className="text-2xl font-bold text-orange-800 mt-2">R$ 0,00</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <p className="text-sm text-blue-700 font-medium">Total de Vendas Realizadas</p>
              <p className="text-2xl font-bold text-blue-800 mt-2">{completedSales.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;