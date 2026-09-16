import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Phone,
  Mail,
  Lock,
  Tag,
  ArrowRight,
  ShieldCheck,
  Gift,
  Eye,
  EyeOff,
} from 'lucide-react';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
  const { register, showToast } = useApp();

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('PAK300');
  const [showPassword, setShowPassword] = useState(false);

  // Auto-detect referral code from URL if user arrived via a friend's referral link
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const refParam = params.get('ref');
      if (refParam) {
        setReferralCode(refParam.toUpperCase());
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Validation Error', 'Please enter your name.', 'error');
      return;
    }

    if (!number.trim() || number.trim().length < 10) {
      showToast('Validation Error', 'Please enter a valid mobile number (e.g. 03001234567).', 'error');
      return;
    }

    if (!gmail.trim() || !gmail.includes('@')) {
      showToast('Validation Error', 'Please enter a valid Gmail / email address.', 'error');
      return;
    }

    if (!password || password.length < 6) {
      showToast('Validation Error', 'Password must be at least 6 characters long.', 'error');
      return;
    }

    register(name.trim(), number.trim(), gmail.trim(), password, referralCode.trim());
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden" id="register-page">
      {/* Brand Header */}
      <div className="p-6 sm:p-8 text-center border-b border-slate-100 bg-white">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 mb-3 shadow-xs">
          <Gift className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
          Create Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Register now & get ₨ 10.00 PKR welcome bonus instantly!
        </p>

        {/* Bonus Highlight */}
        <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-center gap-2 font-semibold">
          <Gift className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>₨ 10.00 PKR Welcome Bonus will be added to your wallet!</span>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex border-b border-slate-100 bg-slate-50 p-1.5 gap-1.5">
        <button
          type="button"
          onClick={onSwitchToLogin}
          id="switch-to-login-btn"
          className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-900 transition-all flex items-center justify-center gap-1.5 hover:bg-slate-200/60"
        >
          <Lock className="w-4 h-4" />
          <span>Log In</span>
        </button>

        <button
          type="button"
          id="register-tab-btn"
          className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-emerald-600 shadow-xs border border-slate-200 transition-all flex items-center justify-center gap-1.5"
        >
          <span>Register</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded-full">
            +₨ 10
          </span>
        </button>
      </div>

      {/* Simple Form: Name, Number, Gmail, Password, Referral Code */}
      <div className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4" id="simple-register-form">
          {/* 1. Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                id="register-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
                required
              />
            </div>
          </div>

          {/* 2. Number */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                id="register-phone"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="03001234567 or 03XX-XXXXXXX"
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 transition-colors font-mono"
                required
              />
            </div>
          </div>

          {/* 3. Gmail */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Gmail / Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                id="register-gmail"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
                required
              />
            </div>
          </div>

          {/* 4. Password */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="register-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter account password (min 6 characters)"
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 transition-colors font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 5. Referral Code */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Referral Code (Optional)
              </label>
              <span className="text-[11px] font-semibold text-emerald-600">
                +₨ 10 Bonus
              </span>
            </div>
            <div className="relative">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                id="register-referral-code"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="e.g. PAK300"
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 transition-colors font-mono uppercase font-bold"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Have a friend's referral link or code? Enter it here to claim extra rewards.
            </p>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            id="register-submit-btn"
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
          >
            <span>Register & Claim ₨ 10 Bonus</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Switch to Login Link */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-bold text-blue-600 hover:text-blue-700 underline underline-offset-2"
            >
              Sign In (Log In)
            </button>
          </p>
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-Bit SSL Encrypted & Verified Pakistani Earning Portal</span>
        </div>
      </div>
    </div>
  );
};
