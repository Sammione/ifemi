import React from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  Plus
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import SalesChart from '../components/SalesChart';
import OrderStatusChart from '../components/OrderStatusChart';
import { useAdminData } from '../context/AdminDataContext';

export const Dashboard: React.FC = () => {
  const { orders, products, customers, formatCurrency, adjustStock } = useAdminData();

  // Metrics calculations
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.paymentStatus === 'PAID' ? (o.totalAmount || (o as any).total || 0) : 0),
    0
  );
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const lowStockProducts = products.filter((p) => p.stock <= p.threshold);
  const topProducts = [...products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, 4);
  const recentOrders = [...orders].slice(0, 5);

  return (
    <div className="space-y-8 pb-12">
      {/* Clean Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0b132b] tracking-tight">
            Store Overview
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Real-time performance across orders, inventory, and revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="px-4 py-2.5 rounded-lg bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 text-xs font-semibold transition-colors shadow-xs"
          >
            Manage Orders
          </Link>
          <Link
            to="/products"
            className="px-4 py-2.5 rounded-lg bg-[#0b132b] text-white hover:bg-black text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={15} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          subValue="+14.2%"
          trend="vs last month"
          trendUp={true}
          icon={DollarSign}
          color="emerald"
          sparkline={[42, 55, 48, 70, 65, 88, 102]}
        />
        <MetricCard
          title="Orders"
          value={String(totalOrdersCount)}
          subValue="orders placed"
          trend="96% fulfilled"
          trendUp={true}
          icon={ShoppingBag}
          color="blue"
          sparkline={[12, 18, 15, 24, 21, 30, 36]}
        />
        <MetricCard
          title="Customers"
          value={String(customers.length)}
          subValue="active clients"
          trend="+8 this week"
          trendUp={true}
          icon={Users}
          color="purple"
          sparkline={[5, 8, 9, 12, 15, 20, 25]}
        />
        <MetricCard
          title="Average Order Value"
          value={formatCurrency(avgOrderValue)}
          subValue="per transaction"
          trend="+5.3% growth"
          trendUp={true}
          icon={CreditCard}
          color="gold"
          sparkline={[38, 40, 42, 39, 44, 46, 48]}
        />
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div className="lg:col-span-1">
          <OrderStatusChart />
        </div>
      </div>

      {/* Operational Stream & Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 rounded-xl bg-white border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0b132b]">Recent Orders</h3>
              <p className="text-xs text-stone-500 mt-0.5">Latest transactions and fulfillment states</p>
            </div>
            <Link
              to="/orders"
              className="text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50/80 text-stone-500 uppercase tracking-wider text-[10px] font-semibold border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-6 text-center text-stone-400">
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord) => {
                    const statusColors: Record<string, string> = {
                      DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                      SHIPPED: 'bg-sky-50 text-sky-700 border-sky-200',
                      PROCESSING: 'bg-purple-50 text-purple-700 border-purple-200',
                      CONFIRMED: 'bg-amber-50 text-amber-700 border-amber-200',
                      PENDING: 'bg-rose-50 text-rose-700 border-rose-200',
                      CANCELLED: 'bg-stone-100 text-stone-600 border-stone-200'
                    };

                    const locationText = ord.shippingAddress?.city
                      ? `${ord.shippingAddress.city}, ${ord.shippingRegion || 'NG'}`
                      : `${ord.city || 'Lagos'}, ${ord.country || 'Nigeria'}`;

                    return (
                      <tr key={ord.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-stone-700 font-medium">
                          {ord.orderNumber}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-stone-900">{ord.customerName}</div>
                          <div className="text-[11px] text-stone-400">{ord.email}</div>
                        </td>
                        <td className="px-5 py-3.5 text-stone-600">
                          {locationText}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${statusColors[ord.orderStatus] || 'bg-stone-100 text-stone-700'}`}
                          >
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold text-stone-900">
                          {formatCurrency(ord.totalAmount || (ord as any).total || 0)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products & Low Stock Alerts (1 col) */}
        <div className="space-y-6">
          {/* Top Selling Products */}
          <div className="rounded-xl bg-white border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-sm font-bold text-[#0b132b]">Top Products</h3>
              <Link to="/products" className="text-xs text-stone-500 hover:text-stone-900 transition-colors">
                Catalog
              </Link>
            </div>

            <div className="mt-3.5 space-y-3">
              {topProducts.map((prod, idx) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-4 font-mono text-xs text-stone-400 font-medium">
                      {idx + 1}
                    </span>
                    <div className="w-9 h-10 rounded bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-semibold text-stone-900 truncate max-w-[130px]">
                        {prod.name}
                      </h4>
                      <p className="text-[10px] text-stone-500">{prod.category}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-semibold text-stone-900">
                      {formatCurrency(prod.price)}
                    </p>
                    <p className="text-[10px] text-stone-400">
                      {prod.salesCount || 0} sold
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="rounded-xl bg-white border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <AlertTriangle size={15} className="text-amber-600" />
                <h3 className="text-sm font-bold text-[#0b132b]">Low Stock Alerts</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                {lowStockProducts.length} items
              </span>
            </div>

            <div className="mt-3.5 space-y-2.5">
              {lowStockProducts.length === 0 ? (
                <p className="text-xs text-stone-400 italic py-2 text-center">
                  All inventory levels are sufficient.
                </p>
              ) : (
                lowStockProducts.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-stone-900">{item.name}</h4>
                      <p className="text-[10px] text-stone-500 font-mono">
                        {item.stock} left (threshold: {item.threshold})
                      </p>
                    </div>

                    <button
                      onClick={() => adjustStock(item.id, 5)}
                      className="px-2 py-1 rounded bg-white hover:bg-stone-100 text-stone-800 text-[10px] font-medium border border-stone-300 transition-colors cursor-pointer shadow-xs"
                    >
                      +5 Restock
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
