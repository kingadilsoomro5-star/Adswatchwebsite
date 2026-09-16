import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Lock,
  Phone,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  Coins,
  ArrowUpRight,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const { login, formatMoney } = useApp();

  const [identifier, setIdentifier] = useState('0301-8392819');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(identifier, password);
  };

  const handleDemoLogin = () => {
    setIdentifier('0301-8392819');
    setPassword('123456');
    login('0301-8392819', '123456');
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden" id="login-page">
      {/* Brand Header */}
      <div className="p-6 sm:p-8 text-center border-b border-slate-100 bg-white">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 mb-3 shadow-xs">
          <TrendingUp className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
          Pak<span className="text-blue-600">Invest</span> Ads
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Welcome back! Log in to watch ads and withdraw cash.
        </p>

        {/* Earning Features Strip */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-slate-700">
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
            <Coins className="w-3.5 h-3.5 text-emerald-600" /> ₨ 3.00 Per Ad
          </span>
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full">
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" /> Min ₨ 300 Cashout
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" /> Easypaisa & JazzCash
          </span>
        </div>
      </div>

      {/* Auth Navigation Mode Switcher */}
      <div className="flex border-b border-slate-100 bg-slate-50 p-1.5 gap-1.5">
        <button
          type="button"
          id="login-tab-btn"
          className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-blue-600 shadow-xs border border-slate-200 transition-all flex items-center justify-center gap-1.5"
        >
          <Lock className="w-4 h-4" />
          <span>Log In Page</span>
        </button>

        <button
          type="button"
          onClick={onSwitchToRegister}
          id="switch-to-register-btn"
          className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-900 transition-all flex items-center justify-center gap-1.5 hover:bg-slate-200/60"
        >
          <span>Register Page (New User)</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded-full">
            +₨ 10
          </span>
        </button>
      </div>

      {/* Form Content */}
      <div className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Mobile Number or Email Address
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                id="login-identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="03XX-XXXXXXX or user@email.com"
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 transition-colors font-mono"
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Supports Easypaisa, JazzCash, Zong, Ufone, or Telenor numbers.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Account Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your account password"
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 transition-colors font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-0"
              />
              <span>Keep me signed in</span>
            </label>

            <span className="text-[11px] text-slate-500">
              Default Demo PIN: <strong className="font-mono text-slate-700">1234</strong>
            </span>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            id="login-submit-btn"
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Access Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            id="login-demo-btn"
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>1-Click Instant Demo Login (Adil Soomro)</span>
          </button>
        </form>

        {/* Switch Link */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600">
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="font-bold text-blue-600 hover:text-blue-700 underline underline-offset-2"
            >
              Register Now (Claim ₨ 10 Bonus)
            </button>
          </p>
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-Bit SSL Encrypted & Verified Pakistani Earning Portal</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Password Recovery</h3>
              <p className="text-xs text-slate-500 mt-1">
                For security reasons, password resets are processed via our official WhatsApp Support channel.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
              <p className="font-semibold">Demo Credentials:</p>
              <p className="font-mono text-[11px] text-slate-600 mt-1">Phone: 0301-8392819</p>
              <p className="font-mono text-[11px] text-slate-600">Password: 123456</p>
              <p className="font-mono text-[11px] text-slate-600">Withdrawal PIN: 1234</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  handleDemoLogin();
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Use Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
