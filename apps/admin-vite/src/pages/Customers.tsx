import React, { useState } from 'react';
import {
  Users,
  Search,
  Crown,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { CustomerRecord } from '../data/mockData';

export const Customers: React.FC = () => {
  const { customers, formatCurrency } = useAdminData();
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('ALL');

  const filtered = customers.filter((c) => {
    const matchesTier = tierFilter === 'ALL' || c.tier === tierFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const vipCount = customers.filter((c) => c.tier.includes('VIP')).length;
  const totalClientSpend = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-[#0b132b]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0b132b] tracking-tight">
            Customers
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Customer directory, order history, and VIP contact details.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-stone-700 bg-white border border-stone-200 px-3 py-1.5 rounded-lg shadow-xs">
            {customers.length} Total Customers
          </span>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Total Customers</span>
          <p className="text-2xl font-bold text-[#0b132b] font-mono mt-1">{customers.length}</p>
          <span className="text-[11px] text-stone-400 mt-1 block">Registered store accounts</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Top Tier Customers</span>
          <p className="text-2xl font-bold text-[#4B2E83] font-mono mt-1">
            {Math.round((vipCount / (customers.length || 1)) * 100)}%
          </p>
          <span className="text-[11px] text-stone-400 mt-1 block">VIP Platinum &amp; Gold tier</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">Total Customer Spend</span>
          <p className="text-2xl font-bold text-emerald-700 font-mono mt-1">{formatCurrency(totalClientSpend)}</p>
          <span className="text-[11px] text-stone-400 mt-1 block">Lifetime verified gross</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search customer name, email, phone, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-10 pr-4 py-2 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['ALL', 'VIP Platinum', 'VIP Gold', 'Client'].map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs whitespace-nowrap transition-colors cursor-pointer ${
                tierFilter === tier
                  ? 'bg-[#0b132b] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl bg-white border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 text-stone-500 uppercase tracking-wider text-[10px] font-semibold border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Tier</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5">Orders</th>
                <th className="px-5 py-3.5">Lifetime Spend</th>
                <th className="px-5 py-3.5">Member Since</th>
                <th className="px-5 py-3.5 text-right">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((client) => {
                const tierStyles = {
                  'VIP Platinum': 'bg-purple-50 text-purple-700 border-purple-200',
                  'VIP Gold': 'bg-amber-50 text-amber-700 border-amber-200',
                  Client: 'bg-stone-100 text-stone-600 border-stone-200'
                }[client.tier] || 'bg-stone-100 text-stone-600 border-stone-200';

                return (
                  <tr key={client.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0b132b] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                          {client.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-stone-900 text-xs">{client.name}</p>
                          <p className="text-[11px] text-stone-500">{client.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${tierStyles}`}>
                        {client.tier}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-stone-700">
                        <MapPin size={13} className="text-stone-400 shrink-0" />
                        <span>{client.location}</span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 font-mono text-stone-700">
                      {client.totalOrders} orders
                    </td>

                    <td className="px-5 py-3.5 font-mono font-bold text-stone-900">
                      {formatCurrency(client.totalSpent)}
                    </td>

                    <td className="px-5 py-3.5 text-stone-500 font-mono text-[11px]">
                      {client.joinedDate}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                          title="WhatsApp Chat"
                        >
                          <MessageCircle size={14} />
                        </a>
                        <a
                          href={`mailto:${client.email}`}
                          className="p-1.5 rounded-lg bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200 border border-stone-200 transition-colors"
                          title="Send Email"
                        >
                          <Mail size={14} />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
