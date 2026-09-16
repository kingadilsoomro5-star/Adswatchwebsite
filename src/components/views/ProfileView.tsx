import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  ShieldCheck,
  Lock,
  Phone,
  Mail,
  Calendar,
  Settings,
  RefreshCw,
  LogOut,
  Play,
  ArrowUpRight,
  MessageCircle,
  Coins,
  Award,
  Gift,
  Share2,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    user,
    setActiveTab,
    formatMoney,
    currency,
    setCurrency,
    transactions,
    updatePin,
    updateProfile,
    logout,
    resetAllData,
    showToast,
  } = useApp();

  // PIN change state
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // Profile edit state
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);

  // Transaction filter
  const [txFilter, setTxFilter] = useState<'all' | 'ad_reward' | 'social_reward' | 'withdraw'>('all');

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPin !== user.withdrawalPin) {
      showToast('PIN Error', 'Current PIN does not match. Default is 1234.', 'error');
      return;
    }
    if (newPin.length < 4) {
      showToast('PIN Too Short', 'PIN must be at least 4 digits.', 'error');
      return;
    }
    if (newPin !== confirmPin) {
      showToast('PIN Mismatch', 'New PIN and Confirm PIN do not match.', 'error');
      return;
    }
    updatePin(newPin);
    setOldPin('');
    setNewPin('');
    setConfirmPin('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    updateProfile(editName.trim(), editPhone.trim());
  };

  const filteredTransactions = transactions.filter((t) => {
    if (txFilter === 'all') return true;
    return t.type === txFilter;
  });

  return (
    <div className="space-y-6 pb-12" id="profile-view">
      {/* Header Profile Hero Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-blue-50 border border-blue-200 p-1 shadow-sm flex-shrink-0">
              <div className="w-full h-full bg-white rounded-[20px] flex items-center justify-center">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Outfit']">{user.name}</h1>
                <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  <ShieldCheck className="w-3 h-3 text-blue-600" /> Active Member
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Tier: {user.vipTier}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {user.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Member since {user.joinedDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('task')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Ads</span>
            </button>

            <button
              onClick={() => setActiveTab('withdraw')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 shadow-sm transition-all flex items-center gap-1.5"
            >
              <ArrowUpRight className="w-4 h-4 text-blue-600" />
              <span>Withdraw (Min ₨ 300)</span>
            </button>

            <button
              onClick={() => setActiveTab('refer')}
              className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 shadow-sm transition-all flex items-center gap-1.5"
            >
              <Gift className="w-4 h-4 text-emerald-600" />
              <span>Refer & Earn (+₨ 10)</span>
            </button>

            <button
              onClick={logout}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1.5"
              title="Log out of account"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>

        {/* Financial Overview Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Wallet Balance</span>
            <span className="text-lg font-extrabold text-blue-700 font-['Outfit'] mt-0.5 block">
              {formatMoney(user.balance)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Ads Watched</span>
            <span className="text-lg font-extrabold text-slate-900 font-['Outfit'] mt-0.5 block">
              {user.adsWatchedCount} Ads
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Earnings</span>
            <span className="text-lg font-extrabold text-emerald-600 font-['Outfit'] mt-0.5 block">
              +{formatMoney(user.totalEarned)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Referral Rewards</span>
            <span className="text-lg font-extrabold text-emerald-700 font-['Outfit'] mt-0.5 block">
              {formatMoney(user.referralEarnings || (user.referralCount || 0) * 10)}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {user.referralCount || 0} friends
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Withdrawn</span>
            <span className="text-lg font-extrabold text-slate-700 font-['Outfit'] mt-0.5 block">
              {formatMoney(user.totalWithdrawn)}
            </span>
          </div>
        </div>
      </div>

      {/* Settings & Security Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security: Change Withdrawal PIN */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base font-['Outfit']">Withdrawal Security PIN</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">Current: {user.withdrawalPin}</span>
          </div>

          <form onSubmit={handleUpdatePin} className="space-y-3">
            <div>
              <label className="text-xs text-slate-600 block mb-1">Current PIN</label>
              <input
                type="password"
                maxLength={6}
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value)}
                placeholder="Current 4-digit PIN (1234)"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-600 block mb-1">New PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="New PIN"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Confirm PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="Confirm PIN"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
            >
              Update Security PIN
            </button>
          </form>
        </div>

        {/* Profile Details & Preferences */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base font-['Outfit']">Account Details</h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrency(currency === 'PKR' ? 'USD' : 'PKR')}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-bold text-blue-700"
              >
                Currency: {currency}
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div>
              <label className="text-xs text-slate-600 block mb-1">Full Legal Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-600 block mb-1">Mobile Phone Number</label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={resetAllData}
                className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset Demo
              </button>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Save Details
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 24/7 Help & Support Desk Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 font-['Outfit']">24/7 Official Support Helpdesk</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Contact our official customer assistance team for instant support with your Easypaisa and JazzCash transfers.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            window.open('https://api.whatsapp.com/send?phone=923000000000&text=Hello%20PakInvest%20Support', '_blank');
          }}
          className="px-5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp Official Support</span>
        </button>
      </div>

      {/* Full Transaction Audit History */}
      <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Transaction History Ledger</h3>
            <p className="text-xs text-slate-500">Detailed records of all ad rewards, bonuses, and payouts</p>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'ad_reward', label: 'Ad Rewards' },
              { id: 'social_reward', label: 'Social Tasks' },
              { id: 'withdraw', label: 'Withdrawals' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setTxFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  txFilter === f.id
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-xs">
              <div>
                <p className="font-bold text-slate-900 text-sm">{tx.title}</p>
                <p className="text-slate-500 mt-0.5">{tx.description}</p>
                <p className="text-[10px] text-slate-400 mt-1">{tx.date}</p>
              </div>

              <div className="text-right">
                <span
                  className={`font-extrabold text-sm font-['Outfit'] ${
                    tx.isCredit ? 'text-emerald-600' : 'text-slate-900'
                  }`}
                >
                  {tx.isCredit ? '+' : '-'}{formatMoney(tx.amount)}
                </span>
                <div className="mt-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                    {tx.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
