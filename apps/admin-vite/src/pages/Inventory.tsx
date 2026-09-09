import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  FileDown,
  Plus,
  Minus,
  Search
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

export const Inventory: React.FC = () => {
  const { products, updateProduct, adjustStock, formatCurrency } = useAdminData();
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState<'ALL' | 'LOW' | 'OUT'>('ALL');

  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockItems = products.filter((p) => p.stock <= p.threshold && p.stock > 0);
  const outOfStockItems = products.filter((p) => p.stock === 0);
  const inventoryValuation = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());

    if (filterState === 'LOW') return matchesSearch && p.stock <= p.threshold && p.stock > 0;
    if (filterState === 'OUT') return matchesSearch && p.stock === 0;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-[#0b132b]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0b132b] tracking-tight">
            Inventory
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Track stock levels, reorder thresholds, and warehouse valuation.
          </p>
        </div>

        <button
          onClick={() => alert(`Exporting inventory data (${products.length} items).`)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-semibold self-start sm:self-auto transition-colors cursor-pointer shadow-xs"
        >
          <FileDown size={14} className="text-stone-500" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Total Units in Stock</span>
          <p className="text-2xl font-bold text-[#0b132b] font-mono mt-1">{totalUnits}</p>
          <span className="text-[11px] text-stone-400 mt-1 block">Across all categories</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs text-amber-600 font-semibold uppercase tracking-wider">Low Stock Watch</span>
          <p className="text-2xl font-bold text-amber-600 font-mono mt-1">{lowStockItems.length}</p>
          <span className="text-[11px] text-stone-400 mt-1 block">At or below reorder level</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs text-rose-600 font-semibold uppercase tracking-wider">Out of Stock</span>
          <p className="text-2xl font-bold text-rose-600 font-mono mt-1">{outOfStockItems.length}</p>
          <span className="text-[11px] text-stone-400 mt-1 block">Zero inventory available</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Total Stock Value</span>
          <p className="text-2xl font-bold text-[#0b132b] font-mono mt-1">{formatCurrency(inventoryValuation)}</p>
          <span className="text-[11px] text-stone-400 mt-1 block">Current retail value</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search product title or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-10 pr-4 py-2 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto">
          {(['ALL', 'LOW', 'OUT'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterState(mode)}
              className={`px-3.5 py-1.5 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                filterState === mode
                  ? 'bg-[#0b132b] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {mode === 'ALL' ? 'All Stock' : mode === 'LOW' ? 'Low Stock' : 'Out of Stock'}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl bg-white border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 text-stone-500 uppercase tracking-wider text-[10px] font-semibold border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5">Product &amp; SKU</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Current Stock</th>
                <th className="px-5 py-3.5">Reorder Level</th>
                <th className="px-5 py-3.5">Stock Valuation</th>
                <th className="px-5 py-3.5 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((item) => {
                const isLow = item.stock <= item.threshold && item.stock > 0;
                const isOut = item.stock === 0;

                return (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-stone-900 text-xs">{item.name}</p>
                          <p className="font-mono text-[11px] text-stone-400 mt-0.5">{item.sku}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-stone-700 font-medium">
                      {item.category}
                    </td>

                    <td className="px-5 py-3.5 font-mono font-bold text-stone-900">
                      {formatCurrency(item.price)}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-stone-100 rounded-lg border border-stone-200 p-0.5">
                          <button
                            onClick={() => adjustStock(item.id, -1)}
                            disabled={item.stock <= 0}
                            className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded disabled:opacity-30 cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span
                            className={`px-2 font-mono font-bold text-xs ${
                              isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-emerald-700'
                            }`}
                          >
                            {item.stock}
                          </span>
                          <button
                            onClick={() => adjustStock(item.id, 1)}
                            className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <input
                        type="number"
                        min="1"
                        value={item.threshold}
                        onChange={(e) => updateProduct(item.id, { threshold: Number(e.target.value) })}
                        className="w-16 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-center text-stone-900 font-mono text-xs focus:outline-none focus:border-stone-500"
                      />
                    </td>

                    <td className="px-5 py-3.5 font-mono font-medium text-stone-700">
                      {formatCurrency(item.price * item.stock)}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => adjustStock(item.id, 5)}
                          className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-[#0b132b] text-stone-700 hover:text-white border border-stone-200 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => adjustStock(item.id, 10)}
                          className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-[#0b132b] text-stone-700 hover:text-white border border-stone-200 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          +10
                        </button>
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

export default Inventory;
