import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';
import {
  TrendingUp,
  Play,
  ArrowUpRight,
  User,
  Bell,
  RefreshCw,
  Coins,
  ShieldCheck,
  MessageCircle,
  LogOut,
  Gift,
  UserPlus,
  LogIn,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    user,
    activeTab,
    setActiveTab,
    currency,
    setCurrency,
    formatMoney,
    resetAllData,
    logout,
    setAuthMode,
  } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const navLinks: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: TrendingUp },
    { id: 'task', label: 'Tasks & Ads', icon: Play, badge: '₨ 3/Ad' },
    { id: 'refer', label: 'Refer & Earn', icon: Gift, badge: '₨ 10' },
    { id: 'withdraw', label: 'Withdraw', icon: ArrowUpRight, badge: 'Min ₨ 300' },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'register', label: 'Register', icon: UserPlus, badge: '+₨ 10' },
    { id: 'login', label: 'Log In', icon: LogIn },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
          id="nav-brand-logo"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 p-0.5 shadow-sm transition-all flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 font-['Outfit']">
                Pak<span className="text-blue-600">Invest</span> Ads
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                ₨ 3 / Ad
              </span>
            </div>
            <p className="text-[10px] text-slate-500 hidden sm:block">Watch Daily Sponsored Ads & Cash Out</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'register') {
                    setAuthMode('register');
                    setActiveTab('register');
                  } else if (item.id === 'login') {
                    setAuthMode('login');
                    setActiveTab('login');
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                id={`desktop-nav-${item.id}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.id === 'register'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Section: Balance, Watch Ads CTA & Tools */}
        <div className="flex items-center gap-2">
          {/* Direct Register / Login Quick Links */}
          <button
            onClick={() => {
              setAuthMode('register');
              setActiveTab('register');
            }}
            id="nav-quick-register-btn"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all shadow-2xs"
            title="Open Register Page (+₨ 10 Bonus)"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Register</span>
            <span className="text-[9px] bg-emerald-200/70 text-emerald-900 font-extrabold px-1 py-0.2 rounded">
              +₨ 10
            </span>
          </button>

          <button
            onClick={() => {
              setAuthMode('login');
              setActiveTab('login');
            }}
            id="nav-quick-login-btn"
            className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-bold transition-all"
            title="Open Log In Page"
          >
            <LogIn className="w-3.5 h-3.5 text-blue-600" />
            <span>Log In</span>
          </button>

          {/* Quick Balance Preview */}
          <div
            onClick={() => setActiveTab('profile')}
            className="flex flex-col items-end px-3 py-1 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors"
            title="Click to view full portfolio"
          >
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Balance</span>
            <span className="text-sm font-bold text-slate-900 font-['Outfit']">
              {formatMoney(user.balance)}
            </span>
          </div>

          {/* Watch Ads CTA Button */}
          <button
            onClick={() => setActiveTab('task')}
            id="nav-watch-ads-btn"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Watch Ads</span>
          </button>

          {/* Currency Toggle */}
          <button
            onClick={() => setCurrency(currency === 'PKR' ? 'USD' : 'PKR')}
            id="currency-toggle-btn"
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
            title="Toggle between PKR (₨) and USD ($)"
          >
            {currency}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              id="notifications-toggle-btn"
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors relative"
              title="Platform Announcements"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">News & Alerts</h4>
                  <span className="text-[10px] text-emerald-600 font-semibold">Active Server</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-semibold text-emerald-700">⚡ ₨ 3.00 PKR Per Ad</p>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Watch up to 20 sponsored partner ads daily. Fast 10-second timer.
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-semibold text-blue-700">📢 Mandatory WhatsApp Channel</p>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Join our official WhatsApp channel in the Tasks tab to unlock withdrawals.
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-semibold text-slate-900">💳 Min Withdrawal ₨ 300 PKR</p>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Cash out directly to Easypaisa or JazzCash with 0% fee.
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
                  <span className="text-slate-500">Security PIN: 1234</span>
                  <button
                    onClick={resetAllData}
                    className="text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset Demo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Log Out Button */}
          <button
            onClick={logout}
            id="nav-logout-btn"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-700 text-xs font-semibold transition-colors"
            title="Log Out (Switch to Login / Register)"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
