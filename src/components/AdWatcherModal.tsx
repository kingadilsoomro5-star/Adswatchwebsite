import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Play,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Clock,
  Coins,
  Sparkles,
  Award,
} from 'lucide-react';

export const AdWatcherModal: React.FC = () => {
  const { activeAdForWatching, cancelWatchingAd, claimAdReward, formatMoney } = useApp();

  const [timeLeft, setTimeLeft] = useState(10);
  const [canClaim, setCanClaim] = useState(false);
  const [mathAnswer, setMathAnswer] = useState('');
  const [num1] = useState(() => Math.floor(Math.random() * 5) + 3);
  const [num2] = useState(() => Math.floor(Math.random() * 4) + 1);
  const [claimError, setClaimError] = useState('');

  const duration = activeAdForWatching?.durationSeconds || 10;

  useEffect(() => {
    if (!activeAdForWatching) return;

    setTimeLeft(duration);
    setCanClaim(false);
    setMathAnswer('');
    setClaimError('');

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanClaim(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeAdForWatching, duration]);

  if (!activeAdForWatching) return null;

  const progressPercent = ((duration - timeLeft) / duration) * 100;

  const handleClaim = () => {
    const expected = num1 + num2;
    if (parseInt(mathAnswer.trim(), 10) !== expected) {
      setClaimError(`Incorrect captcha. What is ${num1} + ${num2}?`);
      return;
    }
    claimAdReward(activeAdForWatching.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        id="ad-watcher-modal"
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
              <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block font-['Outfit']">
                {activeAdForWatching.sponsor}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Category: {activeAdForWatching.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold">
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              +₨ {activeAdForWatching.rewardPkr} PKR
            </span>
            <button
              onClick={cancelWatchingAd}
              className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
              title="Close Ad"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ad Content Creative Box */}
        <div className="p-6 space-y-4">
          <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 overflow-hidden shadow-inner">
            <div className="relative z-10 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Official Pakistani Sponsor
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold font-['Outfit'] leading-snug">
                {activeAdForWatching.title}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-2">
                {activeAdForWatching.description}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                <span>Visit Sponsor: {activeAdForWatching.sponsor}</span>
                <a
                  href={activeAdForWatching.targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold"
                >
                  <span>Learn More</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Progress Countdown Section */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                {canClaim ? 'Ad Completed!' : `Watching: Please wait ${timeLeft}s`}
              </span>
              <span className="font-mono font-bold text-slate-900">
                {Math.round(progressPercent)}%
              </span>
            </div>

            {/* Visual Animated Progress Bar */}
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Verification & Claim Button */}
          {canClaim ? (
            <div className="space-y-3 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Human Verification</p>
                  <p className="text-[11px] text-slate-500">
                    Solve this quick equation to credit ₨ {activeAdForWatching.rewardPkr} PKR:
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-sm">
                  {num1} + {num2} = ?
                </span>
                <input
                  type="number"
                  value={mathAnswer}
                  onChange={(e) => {
                    setMathAnswer(e.target.value);
                    setClaimError('');
                  }}
                  placeholder="Answer"
                  className="w-28 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-600"
                  autoFocus
                />
                <button
                  onClick={handleClaim}
                  disabled={!mathAnswer.trim()}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Coins className="w-4 h-4" />
                  <span>Claim ₨ {activeAdForWatching.rewardPkr} PKR</span>
                </button>
              </div>

              {claimError && (
                <p className="text-xs text-rose-600 font-semibold">{claimError}</p>
              )}
            </div>
          ) : (
            <button
              disabled
              className="w-full py-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Clock className="w-4 h-4 animate-spin text-slate-400" />
              <span>Watching in progress... ({timeLeft}s left)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
