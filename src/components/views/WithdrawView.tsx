import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentMethodId } from '../../types';
import { WITHDRAWAL_METHODS, PAKISTANI_BANKS } from '../../data/mockData';
import {
  ArrowUpRight,
  ShieldCheck,
  Clock,
  AlertCircle,
  Smartphone,
  Wallet,
  Building2,
  Coins,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  HelpCircle,
  History,
  FileText,
  MessageCircle,
  Unlock,
  ChevronRight,
} from 'lucide-react';

export const WithdrawView: React.FC = () => {
  const { user, formatMoney, requestWithdrawal, withdrawals, showToast, setActiveTab } = useApp();

  const [selectedMethodId, setSelectedMethodId] = useState<PaymentMethodId>('easypaisa');
  const [amount, setAmount] = useState<string>('300');
  const [accountTitle, setAccountTitle] = useState<string>(user.name);
  const [accountNumber, setAccountNumber] = useState<string>(user.phone || '');
  const [selectedBank, setSelectedBank] = useState<string>(PAKISTANI_BANKS[0]);
  const [pin, setPin] = useState<string>('1234');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectedMethod = WITHDRAWAL_METHODS.find((m) => m.id === selectedMethodId)!;

  const numAmount = Number(amount) || 0;
  const fee = Math.round((numAmount * selectedMethod.feePercent) / 100);
  const netAmount = Math.max(0, numAmount - fee);

  const handlePercentageSelect = (percent: number) => {
    const val = Math.floor((user.balance * percent) / 100);
    setAmount(val.toString());
  };

  const handlePresetSelect = (val: number) => {
    setAmount(val.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user.isWhatsAppJoined) {
      showToast(
        'Both WhatsApp Channels Required',
        'You must join both official WhatsApp Channels and upload screenshot proofs in the Tasks tab to unlock withdrawals.',
        'error'
      );
      return;
    }

    if (!numAmount || numAmount < selectedMethod.minWithdraw) {
      showToast(
        'Minimum Limit',
        `Minimum withdrawal for ${selectedMethod.name} is ${formatMoney(selectedMethod.minWithdraw)}.`,
        'error'
      );
      return;
    }

    if (numAmount > selectedMethod.maxWithdraw) {
      showToast(
        'Maximum Limit',
        `Maximum withdrawal per transaction is ${formatMoney(selectedMethod.maxWithdraw)}.`,
        'error'
      );
      return;
    }

    if (numAmount > user.balance) {
      showToast('Insufficient Balance', 'You do not have enough wallet balance.', 'error');
      return;
    }

    if (!accountTitle.trim()) {
      showToast('Missing Account Title', 'Please enter your account title / holder name.', 'error');
      return;
    }

    if (!accountNumber.trim()) {
      showToast('Missing Account Number', 'Please enter your account number or mobile number.', 'error');
      return;
    }

    if (!pin.trim()) {
      showToast('Security PIN Required', 'Please enter your 4-digit withdrawal PIN (Default: 1234)', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = requestWithdrawal({
        method: selectedMethodId,
        amount: numAmount,
        accountTitle: accountTitle.trim(),
        accountNumber: accountNumber.trim(),
        bankName: selectedMethodId === 'bank' ? selectedBank : undefined,
        pin: pin.trim(),
      });

      setIsSubmitting(false);

      if (result.success) {
        setAmount('300');
      }
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12" id="withdraw-view">
      {/* WhatsApp Requirement Banner */}
      {!user.isWhatsAppJoined ? (
        <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center flex-shrink-0 text-amber-800">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-amber-900 text-sm sm:text-base font-['Outfit']">
                Withdrawals Locked: 2 WhatsApp Channels Proof Required
              </h3>
              <p className="text-xs text-amber-800/90 mt-0.5 max-w-xl">
                To protect our community, all users must join both official WhatsApp Channels and upload screenshot proof in the Tasks tab to unlock cashouts.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('task')}
            className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 flex-shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Go to Tasks & Upload Proof</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-bold">
              Both WhatsApp Channels Verified: Your withdrawal gateway is fully unlocked!
            </span>
          </div>
          <span className="font-semibold text-emerald-700 hidden sm:inline">0% Fee Enabled</span>
        </div>
      )}

      {/* Header Overview Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Cashout System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              Withdraw Earnings
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-lg">
              Instant payouts to your Easypaisa and JazzCash account with 0% transaction fee. Minimum cashout is ₨ 300 PKR.
            </p>
          </div>

          {/* Balance Preview Block */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-start md:items-end min-w-[200px]">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Available For Withdrawal
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] mt-0.5">
              {formatMoney(user.balance)}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-600" />
              <span>Processing: 5 - 15 mins</span>
            </span>
          </div>
        </div>

        {/* Highlight Perks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Min Cashout</span>
            <span className="text-sm font-extrabold text-slate-900 font-['Outfit'] mt-0.5 block">
              ₨ 300 PKR
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Withdrawal Fee</span>
            <span className="text-sm font-extrabold text-emerald-600 font-['Outfit'] mt-0.5 block">
              0% Free
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Speed</span>
            <span className="text-sm font-extrabold text-blue-600 font-['Outfit'] mt-0.5 block">
              5 - 15 Mins
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Withdrawn</span>
            <span className="text-sm font-extrabold text-slate-900 font-['Outfit'] mt-0.5 block">
              {formatMoney(user.totalWithdrawn)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Withdrawal Form (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6"
          >
            {/* 1. Select Payment Method */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                1. Select Payout Method
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {WITHDRAWAL_METHODS.map((method) => {
                  const isSelected = selectedMethodId === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethodId(method.id)}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-900 font-['Outfit']">
                          {method.name}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{method.subtitle}</p>
                      <div className="mt-2 text-[10px] font-bold text-blue-700">
                        Min: ₨ {method.minWithdraw} PKR
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Amount Input & Presets */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  2. Withdrawal Amount (PKR)
                </label>
                <span className="text-xs text-slate-500 font-medium">
                  Min: ₨ {selectedMethod.minWithdraw} | Max: ₨ {selectedMethod.maxWithdraw.toLocaleString()}
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-3.5 text-base font-bold text-slate-400 font-['Outfit']">
                  ₨
                </span>
                <input
                  type="number"
                  min={selectedMethod.minWithdraw}
                  max={selectedMethod.maxWithdraw}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Enter amount (Minimum ${selectedMethod.minWithdraw})`}
                  className="w-full bg-white border border-slate-300 rounded-2xl pl-10 pr-4 py-3.5 text-base text-slate-900 font-bold focus:outline-none focus:border-blue-600 font-['Outfit']"
                  required
                />
              </div>

              {/* Fast Presets (300, 500, 1000, 2000) */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {[300, 500, 1000, 2000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                      numAmount === preset
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    ₨ {preset}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handlePercentageSelect(100)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  All Balance
                </button>
              </div>
            </div>

            {/* 3. Account Details */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                3. Beneficiary Account Information
              </label>

              {selectedMethodId === 'bank' && (
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Select Commercial Bank
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  >
                    {PAKISTANI_BANKS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Account Title / Beneficiary Name
                  </label>
                  <input
                    type="text"
                    value={accountTitle}
                    onChange={(e) => setAccountTitle(e.target.value)}
                    placeholder="Full name registered on SIM/Bank"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    {selectedMethod.accountLabel}
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder={selectedMethod.placeholder}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Security PIN */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-600">
                    Security Withdrawal PIN
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Default: 1234</span>
                </div>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="4-digit PIN (1234)"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Fee Breakdown Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Requested Amount:</span>
                <span className="font-bold text-slate-900">₨ {numAmount.toLocaleString()} PKR</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Withdrawal Fee ({selectedMethod.feePercent}%):</span>
                <span className="font-bold text-emerald-600">
                  {fee === 0 ? '₨ 0 (Free)' : `₨ ${fee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Net Amount Transferred:</span>
                <span className="text-blue-700 font-['Outfit']">
                  ₨ {netAmount.toLocaleString()} PKR
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !user.isWhatsAppJoined}
              className={`w-full py-3.5 rounded-2xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${
                !user.isWhatsAppJoined
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : isSubmitting
                  ? 'bg-blue-400 text-white cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:scale-[1.01]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Processing Verification...</span>
                </>
              ) : !user.isWhatsAppJoined ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Locked: Join WhatsApp Channel in Tasks First</span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Submit Withdrawal Request (₨ {numAmount.toLocaleString()})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Information & History */}
        <div className="space-y-6">
          {/* Security & Rules Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm font-['Outfit'] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Withdrawal Guidelines</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                <span>Minimum cashout threshold is strictly <strong>₨ 300 PKR</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                <span>Double-check that the Easypaisa / JazzCash account title matches the registered mobile number.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                <span>Default withdrawal security PIN is <strong>1234</strong> (can be updated in Profile).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0" />
                <span>Transfers process 24 hours a day, 7 days a week.</span>
              </li>
            </ul>
          </div>

          {/* Recent Withdrawal Requests */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm font-['Outfit'] flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                <span>Recent Withdrawals</span>
              </h3>
              <span className="text-xs text-slate-500">{withdrawals.length} Records</span>
            </div>

            {withdrawals.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No past withdrawal requests yet. Your payout submissions will show here.
              </div>
            ) : (
              <div className="space-y-3">
                {withdrawals.map((w) => (
                  <div
                    key={w.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{w.methodName}</span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          w.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {w.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-mono text-[11px]">{w.accountNumber}</span>
                      <span className="font-extrabold text-slate-900 font-['Outfit'] text-sm">
                        ₨ {w.netAmount} PKR
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                      {w.createdAt} • ID: {w.transactionId}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
