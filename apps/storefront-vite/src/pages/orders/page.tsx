import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageCircle,
  MapPin,
  Calendar,
  ChevronRight,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

interface OrderData {
  id: string;
  orderNumber: string;
  createdAt: string;
  date?: string;
  totalAmount?: number;
  total?: number;
  subtotal?: number;
  deliveryFee?: number;
  currency?: string;
  orderStatus: string;
  deliveryStatus?: string;
  courier?: string;
  trackingNumber?: string;
  customerName?: string;
  items?: OrderItem[];
  shippingRegion?: string;
  shippingAddress?: {
    fullName?: string;
    address?: string;
    city?: string;
    state?: string;
    phone?: string;
    country?: string;
  };
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders: clientOrders } = useAuth();
  const { currency: siteCurrency } = useCurrency();

  const [ordersList, setOrdersList] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lookupQuery, setLookupQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [lookupError, setLookupError] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const apiOrders: OrderData[] = await res.json();
          // Merge API orders with any local client orders (avoiding duplicates)
          const seen = new Set<string>();
          const merged: OrderData[] = [];

          // Add client orders first
          clientOrders.forEach((co) => {
            const num = co.orderNumber.toUpperCase();
            if (!seen.has(num)) {
              seen.add(num);
              merged.push({
                id: co.id,
                orderNumber: co.orderNumber,
                createdAt: co.createdAt,
                totalAmount: co.totalAmount,
                currency: 'NGN',
                orderStatus: co.orderStatus,
                deliveryStatus: co.deliveryStatus,
                items: co.items,
                shippingAddress: co.shippingAddress
              });
            }
          });

          // Add backend API orders
          apiOrders.forEach((ao) => {
            const num = (ao.orderNumber || ao.id).toUpperCase();
            if (!seen.has(num)) {
              seen.add(num);
              merged.push(ao);
            }
          });

          setOrdersList(merged);
        } else {
          // Fallback to client orders
          setOrdersList(clientOrders as any);
        }
      } catch (err) {
        setOrdersList(clientOrders as any);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [clientOrders]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const query = lookupQuery.trim();
    if (!query) return;

    // Check if query matches any order
    const found = ordersList.find(
      (o) =>
        o.orderNumber.toLowerCase() === query.toLowerCase() ||
        o.id.toLowerCase() === query.toLowerCase() ||
        (o.trackingNumber && o.trackingNumber.toLowerCase() === query.toLowerCase())
    );

    if (found) {
      setLookupError('');
      navigate(`/order/${found.orderNumber || found.id}`);
    } else {
      // Still try navigating to /order/query directly as it fetches by ID
      navigate(`/order/${encodeURIComponent(query)}`);
    }
  };

  const formatOrderPrice = (amount?: number, curr?: string) => {
    if (amount === undefined || amount === null) return '—';
    const c = (curr || 'NGN').toUpperCase();
    if (c === 'GBP') {
      return `£${amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `₦${amount.toLocaleString('en-NG')}`;
  };

  const filteredOrders = ordersList.filter((order) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'TRANSIT') {
      return order.orderStatus === 'SHIPPED' || order.orderStatus === 'PROCESSING';
    }
    return order.orderStatus === statusFilter;
  });

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#0B132B] pt-28 px-4 md:px-12 lg:px-24 pb-24">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Breadcrumb & Title */}
        <header className="border-b border-stone-200 pb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 mb-2">
            <Link to="/" className="hover:text-[#0B132B] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#4B2E83] font-semibold">Orders &amp; Tracking</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#4B2E83] font-bold block mb-1">
                Client Portal
              </span>
              <h1 className="font-playfair text-3xl md:text-5xl text-[#0B132B] tracking-tight">
                Order Tracking &amp; History
              </h1>
              <p className="text-xs md:text-sm text-stone-600 font-light mt-2 max-w-xl">
                Monitor real-time dispatch progress for your luxury pieces across Nigeria and the United Kingdom.
              </p>
            </div>

            <Link
              to="/account"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:text-[#0B132B] hover:border-stone-300 transition-colors shadow-xs"
            >
              <span>View Account Dashboard</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </header>

        {/* Order Quick Lookup Banner */}
        <section className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 shadow-xs">
          <div className="max-w-3xl">
            <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block mb-1">
              Real-Time Tracking
            </span>
            <h2 className="font-playfair text-xl md:text-2xl text-[#0B132B] font-semibold mb-2">
              Track Any Order Instantly
            </h2>
            <p className="text-xs text-stone-500 font-light mb-6">
              Enter your Order Reference Number (e.g. <strong className="font-mono text-stone-800">IFEMI-NG-84920</strong> or <strong className="font-mono text-stone-800">IFEMI-UK-55192</strong>) or courier tracking number.
            </p>

            <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  value={lookupQuery}
                  onChange={(e) => {
                    setLookupQuery(e.target.value);
                    if (lookupError) setLookupError('');
                  }}
                  placeholder="e.g. IFEMI-NG-84920"
                  className="w-full h-12 bg-stone-50 border border-stone-200 rounded-xl pl-12 pr-4 text-xs md:text-sm font-mono text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#0B132B] focus:bg-white transition-colors"
                />
              </div>
              <button
                type="submit"
                className="h-12 px-7 rounded-xl bg-[#0B132B] text-white text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors cursor-pointer shrink-0 flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Track Package</span>
                <ArrowRight size={14} />
              </button>
            </form>

            {lookupError && (
              <p className="text-xs text-rose-600 mt-2 font-medium">{lookupError}</p>
            )}
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {[
              { id: 'ALL', label: 'All Orders' },
              { id: 'TRANSIT', label: 'In Transit / Dispatched' },
              { id: 'CONFIRMED', label: 'Confirmed' },
              { id: 'DELIVERED', label: 'Delivered' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-stone-500 font-medium">
            Showing <strong className="text-stone-900">{filteredOrders.length}</strong> record{filteredOrders.length === 1 ? '' : 's'}
          </div>
        </section>

        {/* Orders Cards List */}
        <section className="space-y-6">
          {loading ? (
            <div className="py-20 text-center text-stone-400 text-xs">
              Loading orders record...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center shadow-xs">
              <Package size={40} className="mx-auto text-stone-300 mb-4" />
              <h3 className="font-playfair text-xl text-stone-800 font-semibold mb-2">
                No Orders Found
              </h3>
              <p className="text-xs text-stone-500 font-light max-w-md mx-auto mb-6">
                You haven't placed an order matching this criteria yet, or you may track a specific order using your receipt number above.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B132B] text-white text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors"
              >
                Explore Luxury Catalog
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusBadges: Record<string, { bg: string; text: string; border: string }> = {
                DELIVERED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
                SHIPPED: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
                PROCESSING: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
                CONFIRMED: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
                PENDING: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' }
              };

              const badge = statusBadges[order.orderStatus] || statusBadges.CONFIRMED;
              const dateDisplay = order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent');
              const totalVal = order.totalAmount || order.total || 0;
              const locationDisplay = order.shippingAddress?.city
                ? `${order.shippingAddress.city}, ${order.shippingAddress.country || (order.shippingRegion === 'UK' ? 'United Kingdom' : 'Nigeria')}`
                : order.shippingRegion === 'UK'
                ? 'London, United Kingdom'
                : 'Lagos, Nigeria';

              return (
                <div
                  key={order.id || order.orderNumber}
                  className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:border-stone-300 transition-all"
                >
                  {/* Card Header */}
                  <div className="p-5 md:p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-50/50">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-base font-bold text-[#0B132B]">
                        {order.orderNumber}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border}`}>
                        {order.orderStatus}
                      </span>
                      <span className="text-xs text-stone-500 font-light flex items-center gap-1.5">
                        <Calendar size={13} className="text-stone-400" />
                        {dateDisplay}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                        Total Amount
                      </span>
                      <span className="font-mono text-base font-bold text-[#0B132B]">
                        {formatOrderPrice(totalVal, order.currency)}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Items preview */}
                    <div className="lg:col-span-6 space-y-3">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block">
                        Ordered Items ({order.items?.length || 1})
                      </span>
                      <div className="space-y-2">
                        {(order.items && order.items.length > 0
                          ? order.items
                          : [{ name: 'Luxury Tailored Garment', quantity: 1, price: totalVal }]
                        ).map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs text-stone-700">
                            <span className="font-medium text-stone-900">
                              {item.name} <span className="text-stone-400 font-normal">× {item.quantity}</span>
                              {item.size && <span className="text-stone-400 text-[11px] block">Size: {item.size}</span>}
                            </span>
                            <span className="font-mono text-stone-800">
                              {formatOrderPrice(item.price * item.quantity, order.currency)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping & Courier */}
                    <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-stone-100 pt-4 lg:pt-0 lg:pl-6 space-y-2">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block">
                        Delivery Destination
                      </span>
                      <div className="flex items-start gap-2 text-xs text-stone-700">
                        <MapPin size={14} className="text-stone-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-stone-900">{locationDisplay}</p>
                          <p className="text-stone-500 text-[11px]">
                            {order.courier ? `Courier: ${order.courier}` : 'Standard Luxury Courier'}
                          </p>
                          {order.trackingNumber && (
                            <p className="text-stone-500 text-[10px] font-mono mt-0.5">
                              Waybill: {order.trackingNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-3 flex flex-col gap-2.5 border-t lg:border-t-0 lg:border-l border-stone-100 pt-4 lg:pt-0 lg:pl-6">
                      <Link
                        to={`/order/${order.orderNumber}`}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#0B132B] text-white hover:bg-black text-xs uppercase tracking-widest font-semibold text-center transition-colors shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <span>Live Tracking</span>
                        <ChevronRight size={14} />
                      </Link>

                      <a
                        href={`https://wa.me/2348028299093?text=Hello%20Ifemi%20Concierge,%20inquiring%20about%20Order%20${encodeURIComponent(order.orderNumber)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle size={13} className="text-emerald-600" />
                        <span>WhatsApp Concierge</span>
                      </a>
                    </div>
                  </div>

                  {/* Dispatch footer note */}
                  <div className="px-5 py-3 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="flex items-center gap-1.5">
                      <Truck size={13} className="text-[#4B2E83]" />
                      <span>{order.deliveryStatus || 'Packaging in Atelier'}</span>
                    </span>
                    <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">
                      Verified Dispatch
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* Global Delivery Hubs & Concierge Assistance Box */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#4B2E83] font-bold block">
              Nigeria Dispatch Hub
            </span>
            <h3 className="font-playfair text-lg text-[#0B132B] font-semibold">
              Lagos Flagship Atelier
            </h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              3/5 Ilaka Street, Off Coker Road, Ilupeju, Lagos, Nigeria<br />
              Direct Support: <strong className="text-stone-900">+234 802 829 9093</strong>
            </p>
            <p className="text-[11px] text-stone-400">
              Same-day delivery across Lagos Island &amp; Mainland. 24–48hr nationwide express delivery via GIG Logistics.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#4B2E83] font-bold block">
              United Kingdom Hub
            </span>
            <h3 className="font-playfair text-lg text-[#0B132B] font-semibold">
              London Fulfillment Suite
            </h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              1654 Great Cambridge Road, Enfield, Middlesex, EN1 4TA, UK<br />
              Direct Support: <strong className="text-stone-900">+44 7729 412585</strong>
            </p>
            <p className="text-[11px] text-stone-400">
              Dispatched with Royal Mail Tracked 24/48 and DPD Express. International shipping available.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
