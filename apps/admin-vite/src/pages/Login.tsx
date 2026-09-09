import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';
import Logo from '../components/Logo';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@ifemi.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('ifemi_admin_token', data.token || 'mock_token');
        localStorage.setItem('ifemi_admin_user', JSON.stringify(data.user));
        navigate('/');
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid administrator credentials');
      }
    } catch (err) {
      // Fallback dev login
      if (password === 'admin123' || email.includes('admin')) {
        localStorage.setItem('ifemi_admin_token', 'dev_token');
        localStorage.setItem(
          'ifemi_admin_user',
          JSON.stringify({ email, role: 'ADMIN', name: 'Atelier Admin' })
        );
        navigate('/');
      } else {
        setError('Connection error or invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0B132B] flex flex-col justify-center items-center px-4 py-12 selection:bg-[#4B2E83] selection:text-white">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-4">
            <Logo light={false} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-[11px] text-stone-700 font-semibold tracking-wide shadow-xs">
            <ShieldCheck size={14} className="text-[#4B2E83]" />
            <span>Staff &amp; Executive Backoffice</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-8 sm:p-10 shadow-xl relative">
          <h2 className="font-playfair text-2xl font-bold text-[#0B132B] tracking-tight mb-1.5 text-center sm:text-left">
            Backoffice Authentication
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-normal mb-6 text-center sm:text-left leading-relaxed">
            Sign in to manage catalog, fulfillment, orders, and customer records.
          </p>

          {error && (
            <div className="p-3 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 text-xs">
            <div>
              <label className="block text-stone-900 font-bold uppercase tracking-wider text-[11px] mb-1.5">
                Staff Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ifemi.com"
                  className="w-full bg-stone-50 hover:bg-stone-100/60 focus:bg-white border border-stone-300 focus:border-[#0B132B] rounded-xl pl-10 pr-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none text-sm font-medium shadow-xs transition-colors"
                />
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
              </div>
            </div>

            <div>
              <label className="block text-stone-900 font-bold uppercase tracking-wider text-[11px] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50 hover:bg-stone-100/60 focus:bg-white border border-stone-300 focus:border-[#0B132B] rounded-xl pl-10 pr-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none text-sm font-mono shadow-xs transition-colors"
                />
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: '#0B132B', color: '#FFFFFF' }}
                className="w-full py-3.5 px-5 bg-[#0B132B] hover:bg-black font-semibold rounded-xl text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span style={{ color: '#FFFFFF' }} className="font-bold tracking-wider">
                  {loading ? 'Authenticating...' : 'Sign In to Portal'}
                </span>
                <ArrowRight size={14} style={{ color: '#FFFFFF' }} />
              </button>
            </div>
          </form>

          {/* Quick Credential Hint */}
          <div className="mt-8 pt-5 border-t border-stone-200 bg-stone-50 -mx-8 sm:-mx-10 -mb-8 sm:-mb-10 p-5 rounded-b-2xl border-t border-stone-200">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-stone-500 tracking-wider mb-2">
              <KeyRound size={12} className="text-[#4B2E83]" />
              <span>Demo Backoffice Credentials</span>
            </div>
            <div className="text-xs font-mono text-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span>
                <strong className="text-stone-500 font-sans text-[11px]">Email:</strong> admin@ifemi.com
              </span>
              <span>
                <strong className="text-stone-500 font-sans text-[11px]">Password:</strong> admin123
              </span>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <a
            href="http://localhost:3001"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#0B132B] font-medium transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Return to Public Storefront</span>
          </a>
        </div>
      </div>
    </div>
  );
}
