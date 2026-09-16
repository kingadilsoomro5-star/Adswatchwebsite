import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  ArrowUpRight,
  Play,
  CheckCircle2,
  Clock,
  Coins,
  ShieldCheck,
  ChevronRight,
  MessageCircle,
  Sparkles,
  Zap,
  Lock,
  Unlock,
  Gift,
  Share2,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    user,
    setActiveTab,
    formatMoney,
    ads,
    startWatchingAd,
    transactions,
    socialTasks,
  } = useApp();

  const whatsappTasks = socialTasks.filter((t) => t.platform === 'whatsapp');
  const completedWaCount = whatsappTasks.filter((t) => t.isCompleted).length;

  // Simulated live payout ticker - strictly 200 and 500 PKR values as requested
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

  const featuredAds = ads.slice(0, 4);

  return (
    <div className="space-y-6 pb-12" id="home-view">
      {/* Live Payout News Ticker */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2.5 flex items-center justify-between overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
            Live Payout
          </span>
          <p className="text-xs text-slate-700 truncate">
            <span className="font-semibold text-slate-900">{tickers[tickerIndex].name}</span> from {tickers[tickerIndex].city} withdrew{' '}
            <span className="text-blue-700 font-bold">{formatMoney(tickers[tickerIndex].amount)}</span> via {tickers[tickerIndex].method}
          </p>
        </div>
        <span className="text-[10px] text-slate-500 hidden sm:block">Just now</span>
      </div>

      {/* Main Balance & Earnings Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest text-slate-500">
                Available Wallet Balance
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold flex items-center gap-1 border border-emerald-200">
                <Coins className="w-3 h-3 text-emerald-600" /> Earn ₨ 3 Per Ad
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
                {formatMoney(user.balance)}
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Minimum withdrawal threshold is ₨ 300 PKR to Easypaisa or JazzCash.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('task')}
              id="home-action-watch-ads"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Ads (Tasks)</span>
            </button>

            <button
              onClick={() => setActiveTab('withdraw')}
              id="home-action-withdraw"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs sm:text-sm border border-slate-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ArrowUpRight className="w-4 h-4 text-blue-600" />
              <span>Withdraw (Min ₨ 300)</span>
            </button>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Ad Reward</span>
            <span className="text-sm font-extrabold text-blue-700 font-['Outfit'] mt-0.5 block">
              ₨ 3.00 PKR / Ad
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Today's Ads</span>
            <span className="text-sm font-extrabold text-slate-900 font-['Outfit'] mt-0.5 block">
              {user.todayAdsWatched} / {user.dailyAdsLimit} Watched
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Earned</span>
            <span className="text-sm font-extrabold text-emerald-600 font-['Outfit'] mt-0.5 block">
              {formatMoney(user.totalEarned)}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Min Cashout</span>
            <span className="text-sm font-extrabold text-slate-900 font-['Outfit'] mt-0.5 block">
              ₨ 300 PKR
            </span>
          </div>
        </div>
      </div>

      {/* WhatsApp Task Status Alert Box */}
      <div
        className={`p-5 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
          user.isWhatsAppJoined
            ? 'bg-white border-slate-200'
            : 'bg-amber-50/70 border-amber-200 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              user.isWhatsAppJoined
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-sm font-['Outfit']">
                Official WhatsApp Channels (2 Channels)
              </h4>
              {user.isWhatsAppJoined ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  2/2 Verified & Unlocked
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  {completedWaCount}/2 Joined • Screenshot Required
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {user.isWhatsAppJoined
                ? 'Both WhatsApp channels verified with screenshot proofs. Cashout gateway is active.'
                : 'Join both WhatsApp channels and upload screenshots in the Tasks tab to unlock withdrawals.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('task')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 flex-shrink-0 ${
            user.isWhatsAppJoined
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
              : 'bg-amber-700 hover:bg-amber-800 text-white'
          }`}
        >
          <span>{user.isWhatsAppJoined ? 'View Channels' : 'Join & Upload Proof'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Refer & Earn Banner */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center flex-shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-sm font-['Outfit']">
                Refer Friends & Earn ₨ 10 PKR
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                +₨ 10 / User
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Share your referral link or code. When your friend registers, you get ₨ 10.00 PKR added to your wallet!
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('refer')}
          id="home-refer-earn-btn"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 flex-shrink-0 shadow-xs"
        >
          <Share2 className="w-4 h-4" />
          <span>Get Referral Link</span>
        </button>
      </div>

      {/* Featured Ads To Watch Quick Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <span>Featured Ads</span>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                ₨ 3.00 PKR Each
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Watch for 10 seconds to earn instant balance.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('task')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All ({ads.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {featuredAds.map((ad) => (
            <div
              key={ad.id}
              className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {ad.category}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    +₨ {ad.rewardPkr}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 line-clamp-2 font-['Outfit']">
                  {ad.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {ad.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {ad.durationSeconds}s
                </span>

                {ad.isWatched ? (
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Watched</span>
                  </span>
                ) : (
                  <button
                    onClick={() => startWatchingAd(ad)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Watch (₨ 3)</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Ledger History */}
      <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Recent Earnings & Payouts</h3>
            <p className="text-xs text-slate-500">Live ledger of ad rewards and cashouts</p>
          </div>
          <button
            onClick={() => setActiveTab('profile')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            View Full Ledger
          </button>
        </div>

        <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
          {transactions.slice(0, 5).map((tx) => (
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
