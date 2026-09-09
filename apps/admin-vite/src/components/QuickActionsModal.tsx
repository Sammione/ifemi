import React, { useState } from 'react';
import { X, Plus, Tag, Boxes, FileDown, CheckCircle2 } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';

interface QuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProductDrawer?: () => void;
}

export const QuickActionsModal: React.FC<QuickActionsModalProps> = ({
  isOpen,
  onClose,
  onOpenProductDrawer
}) => {
  const { addPromo } = useAdminData();
  const [activeTab, setActiveTab] = useState<'ACTIONS' | 'PROMO'>('ACTIONS');

  // Quick Promo State
  const [promoCode, setPromoCode] = useState('');
  const [promoType, setPromoType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [promoVal, setPromoVal] = useState('15');
  const [minSpend, setMinSpend] = useState('50000');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    addPromo({
      code: promoCode.trim().toUpperCase(),
      type: promoType,
      value: Number(promoVal),
      minOrder: Number(minSpend),
      maxUses: 100,
      active: true,
      expires: '2026-12-31'
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
      setPromoCode('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-xl bg-[#0f172a] border border-[#1e293b] p-6 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-[#1e293b]">
          <div>
            <h3 className="text-base font-semibold text-white">Quick Actions</h3>
            <p className="text-xs text-slate-400 mt-0.5">Shortcuts for common store tasks</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="mt-4 flex gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('ACTIONS')}
            className={`flex-1 py-1.5 font-medium rounded-md transition-colors ${
              activeTab === 'ACTIONS'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Actions
          </button>
          <button
            onClick={() => setActiveTab('PROMO')}
            className={`flex-1 py-1.5 font-medium rounded-md transition-colors ${
              activeTab === 'PROMO'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Discount Code
          </button>
        </div>

        {activeTab === 'ACTIONS' ? (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                onClose();
                if (onOpenProductDrawer) onOpenProductDrawer();
              }}
              className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-slate-600 transition-colors text-left group"
            >
              <div className="p-2 rounded-lg bg-slate-700/60 text-white shrink-0">
                <Plus size={16} />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Add Product</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Create a new product listing
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('PROMO')}
              className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-slate-600 transition-colors text-left group"
            >
              <div className="p-2 rounded-lg bg-slate-700/60 text-white shrink-0">
                <Tag size={16} />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Create Coupon</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Issue a promo code or discount
                </span>
              </div>
            </button>

            <a
              href="/inventory"
              onClick={onClose}
              className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-slate-600 transition-colors text-left group"
            >
              <div className="p-2 rounded-lg bg-slate-700/60 text-white shrink-0">
                <Boxes size={16} />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Check Inventory</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Review stock levels & alerts
                </span>
              </div>
            </a>

            <button
              onClick={() => {
                alert('Exporting orders CSV...');
                onClose();
              }}
              className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-slate-600 transition-colors text-left group"
            >
              <div className="p-2 rounded-lg bg-slate-700/60 text-white shrink-0">
                <FileDown size={16} />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Export Orders</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Download orders as CSV
                </span>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreatePromo} className="mt-5 space-y-4 text-xs">
            {savedSuccess ? (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center gap-2">
                <CheckCircle2 size={16} />
                <span className="font-medium">Discount code created successfully!</span>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WELCOME15"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono uppercase tracking-wider focus:outline-none focus:border-slate-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Discount Type</label>
                    <select
                      value={promoType}
                      onChange={(e) => setPromoType(e.target.value as 'PERCENTAGE' | 'FIXED')}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-slate-500"
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Fixed Amount (₦)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Value</label>
                    <input
                      type="number"
                      required
                      value={promoVal}
                      onChange={(e) => setPromoVal(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Minimum Order Amount (₦)</label>
                  <input
                    type="number"
                    value={minSpend}
                    onChange={(e) => setMinSpend(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-slate-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('ACTIONS')}
                    className="px-3.5 py-2 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors"
                  >
                    Save Code
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default QuickActionsModal;

