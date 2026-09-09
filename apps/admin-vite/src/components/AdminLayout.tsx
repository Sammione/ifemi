import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  Users,
  Tags,
  TicketPercent,
  Star,
  Settings,
  Menu,
  X,
  ExternalLink,
  Bell,
  Search,
  LogOut
} from 'lucide-react';
import Logo from './Logo';
import QuickActionsModal from './QuickActionsModal';
import { useAdminData } from '../context/AdminDataContext';

export const AdminLayout: React.FC<{ children: React.ReactNode; onOpenProductDrawer?: () => void }> = ({
  children,
  onOpenProductDrawer
}) => {
  const location = useLocation();
  const { orders, products, reviews, settings, updateSettings, currency, setCurrency } = useAdminData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);

  // Notification badges
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'PENDING' || o.orderStatus === 'CONFIRMED').length;
  const lowStockCount = products.filter((p) => p.stock <= p.threshold).length;
  const pendingReviewsCount = reviews.filter((r) => r.status === 'PENDING').length;

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Package, badge: products.length },
    { name: 'Orders', href: '/orders', icon: ShoppingBag, badge: pendingOrdersCount, badgeColor: 'bg-emerald-600 text-white' },
    { name: 'Inventory', href: '/inventory', icon: Boxes, badge: lowStockCount, badgeColor: 'bg-amber-600 text-white' },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Categories', href: '/categories', icon: Tags },
    { name: 'Discounts', href: '/discounts', icon: TicketPercent },
    { name: 'Reviews', href: '/reviews', icon: Star, badge: pendingReviewsCount, badgeColor: 'bg-blue-600 text-white' },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#faf9f6] text-[#0b132b] font-sans">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#e8e5de] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-[#e8e5de]">
            <Link to="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2">
              <Logo />
              <span className="text-[10px] uppercase tracking-widest text-stone-600 font-mono px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200">
                Admin
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors ${
                    isActive
                      ? 'bg-[#0b132b] text-white font-medium shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 font-normal'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? 'text-white' : 'text-stone-400'} />
                    <span>{item.name}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${
                        item.badgeColor || 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Storefront Link & User Profile */}
        <div className="p-3 border-t border-[#e8e5de] space-y-2 bg-stone-50/50">
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-stone-200 text-stone-700 hover:text-[#0b132b] hover:border-stone-400 transition-colors text-xs shadow-xs"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={13} className="text-stone-500" />
              <span className="font-medium">View Storefront</span>
            </span>
            <span className="text-[10px] font-mono text-stone-400">
              :3001
            </span>
          </a>

          <div className="flex items-center justify-between px-2 pt-1 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center font-medium text-stone-800 text-xs">
                AO
              </div>
              <div className="overflow-hidden">
                <p className="font-medium text-[#0b132b] truncate text-xs">Abby Ogbebor</p>
                <p className="text-[10px] text-stone-500">Store Manager</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('ifemi_admin_token');
                window.location.href = '/login';
              }}
              className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#e8e5de] flex items-center justify-between px-4 sm:px-8 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
            >
              <Menu size={18} />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500">
              <span className="font-medium text-stone-800">Ifẹ́mi Lifestyle</span>
              <span>/</span>
              <span className="text-stone-600 capitalize">
                {location.pathname === '/' ? 'Dashboard' : location.pathname.slice(1)}
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Currency Toggle */}
            <div className="flex items-center bg-stone-100 rounded-xl border border-stone-200 p-1 text-xs font-semibold shadow-xs">
              <button
                type="button"
                onClick={() => setCurrency('NGN')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  currency === 'NGN'
                    ? 'bg-[#0b132b] text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
                style={currency === 'NGN' ? { backgroundColor: '#0b132b', color: '#ffffff' } : {}}
              >
                ₦ NGN
              </button>
              <button
                type="button"
                onClick={() => setCurrency('GBP')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  currency === 'GBP'
                    ? 'bg-[#0b132b] text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
                style={currency === 'GBP' ? { backgroundColor: '#0b132b', color: '#ffffff' } : {}}
              >
                £ GBP
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => alert(`Active alerts: ${pendingOrdersCount} orders awaiting dispatch, ${lowStockCount} items low in stock.`)}
                className="p-2 rounded-lg bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300 transition-colors relative cursor-pointer shadow-xs"
                title="Notifications"
              >
                <Bell size={15} />
                {(pendingOrdersCount > 0 || lowStockCount > 0) && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#faf9f6]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Quick Command Bar Modal */}
      <QuickActionsModal
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
        onOpenProductDrawer={onOpenProductDrawer}
      />
    </div>
  );
};

export default AdminLayout;
