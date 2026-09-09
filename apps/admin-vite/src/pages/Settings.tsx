import React, { useState } from 'react';
import {
  CheckCircle2,
  Building,
  Truck,
  CreditCard,
  Save
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { StoreSettings } from '../data/mockData';

export const Settings: React.FC = () => {
  const { settings, updateSettings, formatCurrency } = useAdminData();
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [savedBanner, setSavedBanner] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl animate-fadeIn text-[#0b132b]">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0b132b] tracking-tight">
          Store Settings
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Configure store profile, Nigerian &amp; UK fulfillment hubs, shipping fees, and payment keys.
        </p>
      </div>

      {savedBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 text-xs font-semibold shadow-xs">
          <CheckCircle2 size={16} />
          <span>Settings saved and synchronized successfully across atelier services.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* 1. Store Profile */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Building size={16} className="text-[#4B2E83]" />
            <h3 className="text-sm font-bold text-[#0b132b]">
              Store Profile &amp; Contact Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Store Name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Support Email</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Nigeria Phone / WhatsApp</label>
              <input
                type="text"
                value={formData.supportPhone || '+234 802 829 9093'}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value, conciergeWhatsApp: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 font-mono text-xs focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Nigeria Office Address</label>
              <input
                type="text"
                value={formData.showroomAddress || '3/5 Ilaka Street, Off Coker Road, Ilupeju, Lagos, Nigeria'}
                onChange={(e) => setFormData({ ...formData, showroomAddress: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">UK Phone</label>
              <input
                type="text"
                value={formData.ukPhone || '+44 7729 412585'}
                onChange={(e) => setFormData({ ...formData, ukPhone: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 font-mono text-xs focus:outline-none focus:border-stone-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-stone-700 font-semibold mb-1">UK Office Address</label>
              <input
                type="text"
                value={formData.ukAddress || '1654 Great Cambridge Road, Enfield Middlesex, EN1 4TA'}
                onChange={(e) => setFormData({ ...formData, ukAddress: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-500"
              />
            </div>
          </div>
        </div>

        {/* 2. Shipping & Delivery Rates */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Truck size={16} className="text-[#4B2E83]" />
            <h3 className="text-sm font-bold text-[#0b132b]">
              Shipping &amp; Delivery Rates
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Lagos Delivery Fee (₦)</label>
              <input
                type="number"
                value={formData.lagosDeliveryFee}
                onChange={(e) => setFormData({ ...formData, lagosDeliveryFee: Number(e.target.value) })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Nationwide Delivery Fee (₦)</label>
              <input
                type="number"
                value={formData.nationwideDeliveryFee}
                onChange={(e) => setFormData({ ...formData, nationwideDeliveryFee: Number(e.target.value) })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">UK Delivery Fee (£)</label>
              <input
                type="number"
                value={formData.ukDeliveryFeeGBP}
                onChange={(e) => setFormData({ ...formData, ukDeliveryFeeGBP: Number(e.target.value) })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Free Delivery Minimum (₦)</label>
              <input
                type="number"
                value={formData.freeDeliveryThreshold}
                onChange={(e) => setFormData({ ...formData, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Payment Gateway (Paystack) */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <CreditCard size={16} className="text-[#4B2E83]" />
            <h3 className="text-sm font-bold text-[#0b132b]">
              Payment Gateway Credentials
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Paystack Public Key</label>
              <input
                type="text"
                value={formData.paystackPublicKey}
                onChange={(e) => setFormData({ ...formData, paystackPublicKey: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 font-mono text-xs focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Paystack Secret Key</label>
              <input
                type="password"
                value={formData.paystackSecretKey}
                onChange={(e) => setFormData({ ...formData, paystackSecretKey: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 font-mono text-xs focus:outline-none focus:border-stone-500"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-stone-700 font-medium">
                <input
                  type="checkbox"
                  checked={formData.enableTestMode}
                  onChange={(e) => setFormData({ ...formData, enableTestMode: e.target.checked })}
                  className="rounded border-stone-300 text-[#0b132b] focus:ring-0"
                />
                <span>Enable Test Mode (Mock checkout transactions without live card charges)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            style={{ backgroundColor: '#0b132b', color: '#ffffff' }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0b132b] hover:bg-black text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
          >
            <Save size={14} style={{ color: '#ffffff' }} />
            <span style={{ color: '#ffffff' }}>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
