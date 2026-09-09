import React, { useState } from 'react';
import {
  Plus,
  Copy,
  Check,
  Trash2,
  Calendar,
  Percent,
  DollarSign
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

export const Discounts: React.FC = () => {
  const { promos, addPromo, togglePromoActive, deletePromo, formatCurrency } = useAdminData();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // New promo form state
  const [code, setCode] = useState('');
  const [type, setType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [value, setValue] = useState('15');
  const [minOrder, setMinOrder] = useState('50000');
  const [maxUses, setMaxUses] = useState('100');
  const [expires, setExpires] = useState('2026-12-31');

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addPromo({
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      minOrder: Number(minOrder),
      maxUses: Number(maxUses),
      active: true,
      expires
    });

    setCode('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-[#0b132b]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0b132b] tracking-tight">
            Discounts &amp; Promotions
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Manage promotional coupon codes, VIP perks, and minimum order requirements.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          style={{ backgroundColor: '#0b132b', color: '#ffffff' }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0b132b] hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus size={15} style={{ color: '#ffffff' }} />
          <span style={{ color: '#ffffff' }}>{isAdding ? 'Close' : 'Create Discount'}</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4 text-xs"
        >
          <h3 className="text-sm font-bold text-[#0b132b]">Create Discount Code</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Coupon Code</label>
              <input
                type="text"
                required
                placeholder="e.g. WELCOME10"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 font-mono uppercase text-xs focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Discount Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'PERCENTAGE' | 'FIXED')}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-500"
              >
                <option value="PERCENTAGE">Percentage (%) Discount</option>
                <option value="FIXED">Fixed Amount (₦) Off</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Value</label>
              <input
                type="number"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Minimum Order (₦)</label>
              <input
                type="number"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Maximum Uses</label>
              <input
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Expiration Date</label>
              <input
                type="date"
                value={expires}
                onChange={(e) => setExpires(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ backgroundColor: '#0b132b', color: '#ffffff' }}
              className="px-5 py-2 rounded-lg bg-[#0b132b] hover:bg-black text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
            >
              Save Discount
            </button>
          </div>
        </form>
      )}

      {/* Promos List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promos.map((promo) => {
          const isExpired = new Date(promo.expires) < new Date();

          return (
            <div
              key={promo.id}
              className={`rounded-2xl bg-white border p-5 transition-all shadow-xs flex flex-col justify-between ${
                promo.active && !isExpired
                  ? 'border-stone-200 hover:border-stone-300'
                  : 'border-stone-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-[#0b132b]">
                      {promo.code}
                    </span>
                    <button
                      onClick={() => handleCopy(promo.code)}
                      className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer transition-colors"
                      title="Copy code"
                    >
                      {copiedCode === promo.code ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => togglePromoActive(promo.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border cursor-pointer ${
                        promo.active && !isExpired
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                    >
                      {promo.active && !isExpired ? 'Active' : isExpired ? 'Expired' : 'Paused'}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete discount "${promo.code}"?`)) {
                          deletePromo(promo.id);
                        }
                      }}
                      className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#0b132b]">
                    {promo.type === 'PERCENTAGE' ? `${promo.value}% OFF` : `₦${promo.value.toLocaleString()} OFF`}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-xs text-stone-500 font-light">
                  <p>• Min. order: {promo.minOrder > 0 ? formatCurrency(promo.minOrder) : 'No minimum'}</p>
                  <p>• Redemptions: {promo.usedCount} of {promo.maxUses}</p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  <span>Expires {promo.expires}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Discounts;
