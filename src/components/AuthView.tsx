import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LoginPage } from './auth/LoginPage';
import { RegisterPage } from './auth/RegisterPage';
import {
  TrendingUp,
  Coins,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const AuthView: React.FC = () => {
  const { authMode, setAuthMode, formatMoney } = useApp();

  // Live Payout Ticker strictly with 200 PKR and 500 PKR withdrawals as requested
  const [tickerIndex, setTickerIndex] = useState(0);
  const tickers = [
    { name: 'Zeeshan M.', city: 'Karachi', amount: 200, method: 'Easypaisa' },
    { name: 'Tariq Javed', city: 'Lahore', amount: 500, method: 'JazzCash' },
    { name: 'Bilal Khan', city: 'Peshawar', amount: 200, method: 'Easypaisa' },
    { name: 'Muhammad Ali', city: 'Islamabad', amount: 500, method: 'JazzCash' },
    { name: 'Farhan S.', city: 'Faisalabad', amount: 200, method: 'Easypaisa' },
    { name: 'Usman R.', city: 'Rawalpindi', amount: 500, method: 'JazzCash' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickers.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [tickers.length]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between" id="auth-screen">
      {/* Top Header Bar for Unauthenticated Users */}
      <header className="w-full bg-white border-b border-slate-200 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 font-['Outfit']">
                Pak<span className="text-blue-600">Invest</span> Ads
              </span>
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 hidden sm:inline-block">
                ₨ 3 / Ad
              </span>
            </div>
          </div>

          {/* Quick Header Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAuthMode('login')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                authMode === 'login'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                authMode === 'register'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              Register (+₨ 10)
            </button>
          </div>
        </div>
      </header>

      {/* Live Payout Ticker Announcement Bar */}
      <div className="bg-white border-b border-slate-200 py-2 px-4 shadow-2xs">
        <div className="max-w-xl mx-auto flex items-center justify-center gap-2 text-xs">
          <span className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
            Live Payout
          </span>
          <p className="text-slate-700 truncate text-[11px] sm:text-xs">
            <span className="font-semibold text-slate-900">{tickers[tickerIndex].name}</span> from {tickers[tickerIndex].city} withdrew{' '}
            <span className="text-blue-700 font-bold">{formatMoney(tickers[tickerIndex].amount)}</span> via {tickers[tickerIndex].method}
          </p>
        </div>
      </div>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        {authMode === 'login' ? (
          <LoginPage onSwitchToRegister={() => setAuthMode('register')} />
        ) : (
          <RegisterPage onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </main>

      {/* Footer Info */}
      <footer className="w-full bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 PakInvest Ads. All rights reserved. Earn ₨ 3.00 PKR per ad watched.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Minimum Withdrawal: ₨ 300 PKR</span>
            <span>•</span>
            <span>Easypaisa & JazzCash</span>
            <span>•</span>
            <span>Mandatory WhatsApp Verification</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
