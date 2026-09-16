import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Share2,
  Copy,
  Check,
  Gift,
  Coins,
  Users,
  MessageCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const ReferView: React.FC = () => {
  const { user, formatMoney, showToast, claimReferralReward } = useApp();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate dynamic referral link based on window location and user referral code
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://pakinvest.app';
  const referralCode = user.referralCode || 'PAK300';
  const referralLink = `${currentOrigin}/?ref=${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    showToast('Code Copied!', `Referral code "${referralCode}" copied to clipboard.`, 'success');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    showToast('Link Copied!', 'Your referral link has been copied. Share it with friends!', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      `Assalam-o-Alaikum! 🌟 Join PakInvest Ads and earn daily cash by watching simple 10-second ads (₨ 3 PKR per ad). Register with my referral link to get ₨ 10.00 PKR welcome bonus instantly:\n\n${referralLink}\n\nReferral Code: ${referralCode}`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  const sampleFriends = ['Zeeshan Ahmed', 'Bilal Tariq', 'Hamza Khan', 'Usman Ali', 'Ayesha Malik'];

  const handleTestReferral = () => {
    const randomFriend = sampleFriends[Math.floor(Math.random() * sampleFriends.length)];
    claimReferralReward(randomFriend);
  };

  const referralEarnings = user.referralEarnings || (user.referralCount || 0) * 10;
  const referralCount = user.referralCount || 0;

  return (
    <div className="space-y-6 animate-in fade-in" id="refer-view">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-3">
            <Gift className="w-3.5 h-3.5" />
            <span>₨ 10.00 PKR Per Successful Referral</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            Refer Friends & Earn <span className="text-emerald-600">₨ 10 PKR</span> Each
          </h1>

          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Invite your friends and family to PakInvest Ads. When they register using your referral link or referral code, they receive a ₨ 10 welcome bonus, and <strong>you earn ₨ 10.00 PKR</strong> instantly added to your wallet balance!
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold uppercase text-slate-500 block">Referral Earnings</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-700 font-['Outfit']">
              {formatMoney(referralEarnings)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold uppercase text-slate-500 block">Friends Invited</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
              {referralCount} Users
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold uppercase text-slate-500 block">Reward Rate</span>
            <span className="text-xl sm:text-2xl font-black text-blue-600 font-['Outfit']">
              ₨ 10 / User
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold uppercase text-slate-500 block">Withdrawal</span>
            <span className="text-xl sm:text-2xl font-black text-slate-800 font-['Outfit']">
              Instant
            </span>
          </div>
        </div>
      </div>

      {/* Referral Code & Referral Link Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Referral Link Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 font-['Outfit']">Your Referral Link</h3>
                  <p className="text-xs text-slate-500">Auto-fills your referral code on registration</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                +₨ 10 Reward
              </span>
            </div>

            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-2">
              <span className="font-mono text-xs sm:text-sm text-slate-800 truncate font-semibold">
                {referralLink}
              </span>
              <button
                onClick={handleCopyLink}
                id="copy-ref-link-btn"
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors flex-shrink-0 shadow-2xs"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleWhatsAppShare}
              id="share-whatsapp-btn"
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 border border-slate-200"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
          </div>
        </div>

        {/* 2. Referral Code Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 font-['Outfit']">Your Referral Code</h3>
                  <p className="text-xs text-slate-500">Friends can enter this during sign-up</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700">100% Guaranteed</span>
            </div>

            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Invite Code
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wider font-mono">
                  {referralCode}
                </span>
              </div>

              <button
                onClick={handleCopyCode}
                id="copy-ref-code-btn"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Instant Test Simulator */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Want to test receiving the reward?</span>
            <button
              onClick={handleTestReferral}
              id="test-referral-btn"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Simulate Friend Joining (+₨ 10)</span>
            </button>
          </div>
        </div>
      </div>

      {/* How it Works Guide */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <h3 className="font-extrabold text-lg text-slate-900 mb-4 font-['Outfit'] flex items-center gap-2">
          <span>How The Referral Program Works</span>
          <span className="text-xs font-normal text-slate-500">(3 Simple Steps)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-sm text-slate-900">Share Your Link / Code</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Send your personal referral link or code to friends on WhatsApp groups, Facebook, or Telegram.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-sm text-slate-900">Friend Registers</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your friend signs up using simple details: Name, Number, Gmail, Password, and your Referral Code.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black text-sm flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-sm text-slate-900">Both Get Rewarded</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your friend receives a ₨ 10 welcome bonus, and <strong>you get ₨ 10.00 PKR</strong> credited to your balance!
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-xs text-blue-900">
            <strong>Zero Limits:</strong> There is no limit to how many friends you can invite. If you invite 30 friends, you earn <strong>₨ 300.00 PKR</strong>, which meets the minimum withdrawal threshold directly!
          </p>
        </div>
      </div>
    </div>
  );
};
