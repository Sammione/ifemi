import React, { useState } from 'react';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  X,
  Printer,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Calendar
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { OrderRecord } from '../data/mockData';

export const Orders: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderTracking, formatCurrency } = useAdminData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [courierInput, setCourierInput] = useState('');
  const [trackingInput, setTrackingInput] = useState('');

  const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === 'ALL' || o.orderStatus === statusFilter;
    const orderNum = (o.orderNumber || '').toLowerCase();
    const custName = (o.customerName || '').toLowerCase();
    const dest = (o.destination || o.shippingAddress?.address || o.shippingAddress?.city || o.city || '').toLowerCase();
    const emailStr = (o.email || '').toLowerCase();
    const q = search.toLowerCase();

    const matchesSearch =
      orderNum.includes(q) ||
      custName.includes(q) ||
      dest.includes(q) ||
      emailStr.includes(q);

    return matchesStatus && matchesSearch;
  });

  const handleOpenDetail = (order: OrderRecord) => {
    setSelectedOrder(order);
    setCourierInput(order.courier || 'GIG Logistics');
    setTrackingInput(order.trackingNumber || '');
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    updateOrderTracking(selectedOrder.id, courierInput, trackingInput);
    setSelectedOrder({
      ...selectedOrder,
      courier: courierInput,
      trackingNumber: trackingInput
    });
    alert('Courier tracking updated and synchronized with client portal.');
  };

  const orderPipelineSteps: OrderRecord['orderStatus'][] = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED'
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0b132b] tracking-tight">
            Orders
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Real-time fulfillment tracking, payment verification, and dispatch management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 text-xs font-semibold shadow-xs">
            {orders.length} Total Records
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search order number, client, destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-10 pr-4 py-2 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-500 transition-colors"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#0b132b] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl bg-white border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 text-stone-500 uppercase tracking-wider text-[10px] font-semibold border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5">Order</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Destination &amp; Courier</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Payment</th>
                <th className="px-5 py-3.5">Total</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-stone-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((ord) => {
                  const statusColors: Record<string, string> = {
                    DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    SHIPPED: 'bg-sky-50 text-sky-700 border-sky-200',
                    PROCESSING: 'bg-purple-50 text-purple-700 border-purple-200',
                    CONFIRMED: 'bg-amber-50 text-amber-700 border-amber-200',
                    PENDING: 'bg-rose-50 text-rose-700 border-rose-200',
                    CANCELLED: 'bg-stone-100 text-stone-600 border-stone-200'
                  };

                  const dateStr = ord.date || (ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-GB') : 'Recent');
                  const locationText = ord.shippingAddress?.city
                    ? `${ord.shippingAddress.city}, ${ord.shippingRegion || 'NG'}`
                    : `${ord.city || 'Lagos'}, ${ord.country || 'Nigeria'}`;
                  const orderTotal = ord.totalAmount || (ord as any).total || 0;

                  return (
                    <tr key={ord.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-mono font-bold text-stone-900 text-xs block">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {dateStr}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-stone-900">{ord.customerName}</div>
                        <div className="text-[11px] text-stone-500">{ord.phone || ord.email}</div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="font-medium text-stone-800 block">{locationText}</span>
                        <span className="text-[10px] text-stone-500 font-medium">
                          {ord.courier || 'Pending Carrier'}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) =>
                            updateOrderStatus(ord.id, e.target.value as OrderRecord['orderStatus'])
                          }
                          className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider border cursor-pointer ${statusColors[ord.orderStatus] || 'bg-stone-100 text-stone-700'}`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <ShieldCheck size={12} />
                          {ord.paymentStatus}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="font-bold text-stone-900 font-mono text-xs">
                          {formatCurrency(orderTotal, ord.currency || 'NGN')}
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleOpenDetail(ord)}
                          className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-[#0b132b] text-stone-800 hover:text-white border border-stone-200 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] rounded-xl bg-white border border-stone-200 shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-bold text-[#0b132b]">
                    {selectedOrder.orderNumber}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-200">
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                  <Calendar size={12} />
                  <span>
                    Placed on{' '}
                    {selectedOrder.date ||
                      (selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString('en-GB') : 'Recent')}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
                  title="Print Order"
                >
                  <Printer size={16} />
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs">
              {/* Status Stepper */}
              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Fulfillment Status
                </h4>
                <div className="flex items-center justify-between">
                  {orderPipelineSteps.map((step, idx) => {
                    const currentIdx = orderPipelineSteps.indexOf(selectedOrder.orderStatus);
                    const isDone = currentIdx >= idx;
                    const isCurrent = currentIdx === idx;

                    return (
                      <React.Fragment key={step}>
                        <div
                          onClick={() => {
                            updateOrderStatus(selectedOrder.id, step);
                            setSelectedOrder({ ...selectedOrder, orderStatus: step });
                          }}
                          className="flex flex-col items-center cursor-pointer group"
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                              isCurrent
                                ? 'bg-[#0b132b] text-white shadow-xs'
                                : isDone
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-200 text-stone-500 group-hover:bg-stone-300'
                            }`}
                          >
                            {isDone ? '✓' : idx + 1}
                          </div>
                          <span
                            className={`text-[9px] uppercase font-semibold tracking-wider mt-1.5 ${
                              isCurrent ? 'text-stone-900' : isDone ? 'text-stone-700' : 'text-stone-400'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                        {idx < orderPipelineSteps.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mx-2 ${
                              orderPipelineSteps.indexOf(selectedOrder.orderStatus) > idx
                                ? 'bg-emerald-500'
                                : 'bg-stone-200'
                            }`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Client & Shipping Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Customer Details
                  </h4>
                  <p className="text-sm font-bold text-stone-900">{selectedOrder.customerName}</p>
                  <p className="text-stone-600">{selectedOrder.email}</p>
                  <p className="text-stone-600">{selectedOrder.phone || 'No phone supplied'}</p>
                  {selectedOrder.phone && (
                    <a
                      href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-medium text-xs mt-2 transition-colors"
                    >
                      <MessageCircle size={14} />
                      <span>WhatsApp Message</span>
                    </a>
                  )}
                </div>

                <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Shipping Address
                  </h4>
                  <div className="flex items-start gap-2 text-stone-700">
                    <MapPin size={15} className="text-stone-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-stone-900">
                        {selectedOrder.shippingAddress?.address || selectedOrder.destination || 'Primary Address'}
                      </p>
                      <p className="text-stone-600">
                        {selectedOrder.shippingAddress?.city || selectedOrder.city || 'Lagos'},{' '}
                        {selectedOrder.shippingAddress?.country || selectedOrder.country || selectedOrder.shippingRegion || 'Nigeria'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Courier & Tracking Form */}
              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Courier Dispatch &amp; Tracking
                </h4>
                <form onSubmit={handleSaveTracking} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-600 text-[11px] mb-1 font-medium">Courier Service</label>
                    <input
                      type="text"
                      value={courierInput}
                      onChange={(e) => setCourierInput(e.target.value)}
                      placeholder="e.g. GIG Logistics / Royal Mail"
                      className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-900 text-xs focus:outline-none focus:border-stone-600"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 text-[11px] mb-1 font-medium">Tracking Number</label>
                    <input
                      type="text"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      placeholder="e.g. GIG-88492019"
                      className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-stone-900 font-mono text-xs focus:outline-none focus:border-stone-600"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-[#0b132b] text-white hover:bg-black rounded text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Update Tracking
                    </button>
                  </div>
                </form>
              </div>

              {/* Items List */}
              <div className="rounded-lg border border-stone-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] font-semibold border-b border-stone-200">
                    <tr>
                      <th className="px-4 py-2.5">Item</th>
                      <th className="px-4 py-2.5">Qty</th>
                      <th className="px-4 py-2.5 text-right">Price</th>
                      <th className="px-4 py-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {(selectedOrder.items || []).map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2.5 font-medium text-stone-900">
                          {item.name}
                          {item.size && <span className="text-[10px] text-stone-500 block">Size: {item.size}</span>}
                        </td>
                        <td className="px-4 py-2.5 text-stone-700">{item.quantity}</td>
                        <td className="px-4 py-2.5 text-right text-stone-700">
                          {formatCurrency(item.price, selectedOrder.currency || 'NGN')}
                        </td>
                        <td className="px-4 py-2.5 text-right font-semibold text-stone-900">
                          {formatCurrency(item.price * item.quantity, selectedOrder.currency || 'NGN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-stone-50 font-semibold text-stone-900 border-t border-stone-200">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right">
                        Grand Total:
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm text-[#0b132b]">
                        {formatCurrency(
                          selectedOrder.totalAmount || (selectedOrder as any).total || 0,
                          selectedOrder.currency || 'NGN'
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
