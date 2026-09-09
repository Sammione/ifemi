import React from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { Package, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';

export const OrderStatusChart: React.FC = () => {
  const { orders } = useAdminData();

  const counts = {
    DELIVERED: orders.filter((o) => o.orderStatus === 'DELIVERED').length,
    SHIPPED: orders.filter((o) => o.orderStatus === 'SHIPPED').length,
    PROCESSING: orders.filter((o) => o.orderStatus === 'PROCESSING').length,
    CONFIRMED: orders.filter((o) => o.orderStatus === 'CONFIRMED').length,
    PENDING: orders.filter((o) => o.orderStatus === 'PENDING').length,
    CANCELLED: orders.filter((o) => o.orderStatus === 'CANCELLED').length
  };

  const total = orders.length || 1;

  const categories = [
    { label: 'Delivered', count: counts.DELIVERED, color: 'bg-emerald-500', text: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
    { label: 'Shipped', count: counts.SHIPPED, color: 'bg-sky-500', text: 'text-sky-700 bg-sky-50 border-sky-200', icon: Truck },
    { label: 'Processing', count: counts.PROCESSING, color: 'bg-indigo-500', text: 'text-indigo-700 bg-indigo-50 border-indigo-200', icon: Package },
    { label: 'Confirmed', count: counts.CONFIRMED, color: 'bg-amber-500', text: 'text-amber-700 bg-amber-50 border-amber-200', icon: Clock },
    { label: 'Pending', count: counts.PENDING, color: 'bg-rose-500', text: 'text-rose-700 bg-rose-50 border-rose-200', icon: AlertCircle }
  ];

  return (
    <div className="rounded-xl bg-white border border-stone-200 p-5 flex flex-col justify-between h-full shadow-xs">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <h2 className="text-sm font-bold text-[#0b132b]">Order Status</h2>
            <p className="text-xs text-stone-500 mt-0.5">Live fulfillment breakdown</p>
          </div>
          <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
            {orders.length} Total
          </span>
        </div>

        {/* Multi-segment progress bar */}
        <div className="mt-5">
          <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden flex gap-0.5">
            {categories.map((cat) => {
              const widthPct = (cat.count / total) * 100;
              if (widthPct === 0) return null;
              return (
                <div
                  key={cat.label}
                  className={`${cat.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${widthPct}%` }}
                  title={`${cat.label}: ${cat.count} (${widthPct.toFixed(0)}%)`}
                />
              );
            })}
          </div>
        </div>

        {/* List Breakdown */}
        <div className="mt-5 space-y-2.5">
          {categories.map((cat) => {
            const pct = ((cat.count / total) * 100).toFixed(0);
            const Icon = cat.icon;
            return (
              <div
                key={cat.label}
                className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50/70 border border-stone-200/80 hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-md border ${cat.text}`}>
                    <Icon size={14} />
                  </div>
                  <span className="text-xs font-medium text-stone-800">{cat.label}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-stone-900 font-mono">{cat.count}</span>
                  <span className="text-[11px] text-stone-400 font-mono w-8 text-right">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <span>Courier sync: <strong className="text-emerald-700 font-semibold">Active</strong></span>
        <span>Avg fulfillment: <strong className="text-stone-800 font-semibold">18.4 hrs</strong></span>
      </div>
    </div>
  );
};

export default OrderStatusChart;
