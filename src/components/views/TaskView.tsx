import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WhatsAppChannelTasks } from '../tasks/WhatsAppChannelTasks';
import {
  Play,
  CheckCircle2,
  Clock,
  Coins,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Filter,
} from 'lucide-react';

export const TaskView: React.FC = () => {
  const {
    user,
    ads,
    startWatchingAd,
    setActiveTab,
    formatMoney,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'E-Commerce', 'Fintech', 'Food Delivery', 'Telecom', 'Tech & Gadgets'];

  const filteredAds = ads.filter((ad) => {
    if (selectedCategory === 'all') return true;
    return ad.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const dailyProgressPercent = Math.min(
    100,
    (user.todayAdsWatched / (user.dailyAdsLimit || 20)) * 100
  );

  return (
    <div className="space-y-6 pb-12" id="task-view">
      {/* Top Banner: Daily Ads Watch Stats */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-2">
              <Coins className="w-3.5 h-3.5" />
              <span>Earn ₨ 3.00 PKR Per Ad</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              Tasks & Ads Center
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Watch sponsored partner ads for 10 seconds and claim instant ₨ 3 PKR rewards directly to your wallet.
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Today's Completed Ads
            </span>
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
                {user.todayAdsWatched}{' '}
                <span className="text-xs text-slate-400 font-normal">/ {user.dailyAdsLimit}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
            <span className="font-semibold">Daily Quota Progress</span>
            <span className="font-mono font-bold text-slate-900">{Math.round(dailyProgressPercent)}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500 rounded-full"
              style={{ width: `${dailyProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* MANDATORY SOCIAL TASK: 2 WHATSAPP CHANNELS WITH SCREENSHOT VERIFICATION */}
      <WhatsAppChannelTasks />

      {/* WATCH ADS SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <span>Available Ads</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600">
                {filteredAds.length} Available
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Watch an ad for 10 seconds to receive ₨ 3.00 PKR instant credit.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'all' ? 'All Ads' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAds.map((ad) => {
            return (
              <div
                key={ad.id}
                className={`rounded-3xl border bg-white p-5 flex flex-col justify-between transition-all hover:shadow-md ${
                  ad.isWatched ? 'border-slate-200 opacity-75' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {ad.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <Coins className="w-3 h-3 text-emerald-600" />
                      +₨ {ad.rewardPkr} PKR
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm font-['Outfit'] line-clamp-2">
                    {ad.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {ad.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ad.durationSeconds}s Timer</span>
                  </div>

                  {ad.isWatched ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Watched</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => startWatchingAd(ad)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 hover:scale-102"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Watch & Earn ₨ 3</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
