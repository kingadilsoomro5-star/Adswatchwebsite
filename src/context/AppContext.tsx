import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  AdItem,
  SocialTask,
  WithdrawalRequest,
  Transaction,
  TabType,
  Currency,
  PaymentMethodId,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_ADS,
  INITIAL_SOCIAL_TASKS,
  INITIAL_TRANSACTIONS,
  WITHDRAWAL_METHODS,
} from '../data/mockData';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface AppContextType {
  user: UserProfile;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatMoney: (pkrAmount: number) => string;
  ads: AdItem[];
  socialTasks: SocialTask[];
  withdrawals: WithdrawalRequest[];
  transactions: Transaction[];
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  activeAdForWatching: AdItem | null;
  startWatchingAd: (ad: AdItem) => void;
  cancelWatchingAd: () => void;
  claimAdReward: (adId: string) => { success: boolean; message: string };
  completeSocialTask: (taskId: string, screenshotUrl?: string) => { success: boolean; message: string };
  submitSocialTaskProof: (taskId: string, screenshotUrl: string) => { success: boolean; message: string };
  updateWhatsAppChannelUrl: (url: string, channelNumber?: number) => void;
  requestWithdrawal: (params: {
    method: PaymentMethodId;
    amount: number;
    accountTitle: string;
    accountNumber: string;
    bankName?: string;
    pin: string;
  }) => { success: boolean; message: string };
  login: (identifier: string, pass: string) => boolean;
  register: (name: string, phone: string, email: string, pass: string, refCode?: string) => boolean;
  claimReferralReward: (friendName?: string) => void;
  logout: () => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  updateProfile: (name: string, phone: string) => void;
  updatePin: (newPin: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'pak_ads_earn_app_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_user`);
    let base = INITIAL_USER;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.whatsAppChannelUrl2) {
          parsed.whatsAppChannelUrl2 = INITIAL_USER.whatsAppChannelUrl2;
        }
        base = parsed;
      } catch {
        // ignore
      }
    }
    // Check if session is explicitly authenticated in sessionStorage
    const hasSession = sessionStorage.getItem('pak_session_active') === 'true';
    return {
      ...base,
      isLoggedIn: hasSession,
    };
  });

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [currency, setCurrency] = useState<Currency>('PKR');

  const [ads, setAds] = useState<AdItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_ads`);
    return saved ? JSON.parse(saved) : INITIAL_ADS;
  });

  const [socialTasks, setSocialTasks] = useState<SocialTask[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_social_tasks`);
    if (saved) {
      try {
        const parsed: SocialTask[] = JSON.parse(saved);
        // If parsed doesn't have 2 whatsapp channels, ensure both exist
        if (parsed.length >= 2 && parsed.some((t) => t.id === 'task_whatsapp_2')) {
          return parsed;
        }
        // Upgrade legacy single task to 2 channels
        const legacyCompleted = parsed.some((t) => t.isCompleted);
        return INITIAL_SOCIAL_TASKS.map((task, idx) => ({
          ...task,
          isCompleted: idx === 0 ? legacyCompleted : false,
        }));
      } catch {
        // ignore
      }
    }
    return INITIAL_SOCIAL_TASKS;
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_withdrawals`);
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_transactions`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [activeAdForWatching, setActiveAdForWatching] = useState<AdItem | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_ads`, JSON.stringify(ads));
  }, [ads]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_social_tasks`, JSON.stringify(socialTasks));
  }, [socialTasks]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_withdrawals`, JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_transactions`, JSON.stringify(transactions));
  }, [transactions]);

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const formatMoney = (pkrAmount: number): string => {
    if (currency === 'USD') {
      const usd = pkrAmount / 280;
      return `$${usd.toFixed(2)}`;
    }
    return `₨ ${Math.round(pkrAmount).toLocaleString()}`;
  };

  const startWatchingAd = (ad: AdItem) => {
    if (ad.isWatched) {
      showToast('Ad Already Watched', 'You have already watched this ad today.', 'info');
      return;
    }
    if (user.todayAdsWatched >= user.dailyAdsLimit) {
      showToast('Daily Limit Reached', 'You have completed all daily ads. New ads unlock tomorrow!', 'error');
      return;
    }
    setActiveAdForWatching(ad);
  };

  const cancelWatchingAd = () => {
    setActiveAdForWatching(null);
  };

  const claimAdReward = (adId: string): { success: boolean; message: string } => {
    const targetAd = ads.find((a) => a.id === adId);
    if (!targetAd) return { success: false, message: 'Ad not found.' };

    const reward = targetAd.rewardPkr || 3; // 3 PKR per ad

    // Update ad state
    setAds((prev) =>
      prev.map((a) => (a.id === adId ? { ...a, isWatched: true } : a))
    );

    // Update user stats
    setUser((prev) => ({
      ...prev,
      balance: prev.balance + reward,
      totalEarned: prev.totalEarned + reward,
      adsWatchedCount: prev.adsWatchedCount + 1,
      todayAdsWatched: prev.todayAdsWatched + 1,
    }));

    // Add transaction
    const newTx: Transaction = {
      id: `tx_ad_${Date.now()}`,
      type: 'ad_reward',
      title: `Ad Watched (+₨ ${reward})`,
      description: targetAd.title,
      amount: reward,
      isCredit: true,
      date: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    setActiveAdForWatching(null);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    showToast(
      'Reward Credited!',
      `+₨ ${reward} PKR successfully added to your wallet balance.`,
      'success'
    );

    return { success: true, message: `Successfully earned ₨ ${reward} PKR!` };
  };

  const submitSocialTaskProof = (
    taskId: string,
    screenshotUrl: string
  ): { success: boolean; message: string } => {
    const task = socialTasks.find((t) => t.id === taskId);
    if (!task) return { success: false, message: 'Task not found.' };

    if (task.isCompleted) {
      return { success: false, message: 'This channel task is already completed!' };
    }

    if (!screenshotUrl || !screenshotUrl.trim()) {
      showToast('Screenshot Required', 'Please upload a screenshot showing you have joined the channel.', 'error');
      return { success: false, message: 'Screenshot is required.' };
    }

    const reward = task.rewardPkr || 5;
    const nowStr = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Update social task
    const updatedTasks = socialTasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            isCompleted: true,
            screenshotUrl,
            submittedAt: nowStr,
          }
        : t
    );
    setSocialTasks(updatedTasks);

    // Check if both/all mandatory channels are completed
    const allMandatoryDone = updatedTasks
      .filter((t) => t.platform === 'whatsapp' && t.isRequiredForWithdraw)
      .every((t) => t.isCompleted);

    setUser((prev) => ({
      ...prev,
      isWhatsAppJoined: allMandatoryDone,
      balance: prev.balance + reward,
      totalEarned: prev.totalEarned + reward,
    }));

    // Add transaction record
    const newTx: Transaction = {
      id: `tx_soc_${Date.now()}`,
      type: 'social_reward',
      title: `${task.title} (+₨ ${reward})`,
      description: 'Screenshot proof verified & completed',
      amount: reward,
      isCredit: true,
      date: nowStr,
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    try {
      confetti({
        particleCount: 75,
        spread: 75,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    if (allMandatoryDone) {
      showToast(
        'Both WhatsApp Channels Verified!',
        `Proof accepted! ₨ ${reward}.00 PKR credited & cashout gateway unlocked!`,
        'success'
      );
    } else {
      showToast(
        'Screenshot Verified & Done!',
        `Channel completed! ₨ ${reward}.00 PKR credited to your wallet balance.`,
        'success'
      );
    }

    return {
      success: true,
      message: allMandatoryDone
        ? 'Both channels verified! Withdrawals unlocked.'
        : `Channel verified! +₨ ${reward} PKR earned.`,
    };
  };

  const completeSocialTask = (
    taskId: string,
    screenshotUrl?: string
  ): { success: boolean; message: string } => {
    return submitSocialTaskProof(taskId, screenshotUrl || 'data:image/png;base64,sampleproof');
  };

  const updateWhatsAppChannelUrl = (url: string, channelNumber: number = 1) => {
    if (channelNumber === 2) {
      setUser((prev) => ({ ...prev, whatsAppChannelUrl2: url }));
      setSocialTasks((prev) =>
        prev.map((t) => (t.channelNumber === 2 || t.id === 'task_whatsapp_2' ? { ...t, url } : t))
      );
      showToast('Channel 2 Link Saved', 'WhatsApp Channel 2 invite link has been updated.', 'success');
    } else {
      setUser((prev) => ({ ...prev, whatsAppChannelUrl: url }));
      setSocialTasks((prev) =>
        prev.map((t) =>
          t.channelNumber === 1 || t.id === 'task_whatsapp_1' || t.id === 'task_whatsapp'
            ? { ...t, url }
            : t
        )
      );
      showToast('Channel 1 Link Saved', 'WhatsApp Channel 1 invite link has been updated.', 'success');
    }
  };

  const requestWithdrawal = ({
    method,
    amount,
    accountTitle,
    accountNumber,
    bankName,
    pin,
  }: {
    method: PaymentMethodId;
    amount: number;
    accountTitle: string;
    accountNumber: string;
    bankName?: string;
    pin: string;
  }): { success: boolean; message: string } => {
    // 1. WhatsApp task requirement check!
    if (!user.isWhatsAppJoined) {
      showToast(
        'Both WhatsApp Channels Required',
        'You must join and verify both WhatsApp Channels with screenshot proof before making a withdrawal.',
        'error'
      );
      return {
        success: false,
        message: 'Please complete and verify both WhatsApp channels in the Tasks tab first.',
      };
    }

    // 2. Minimum amount check (300 PKR)
    const methodConfig = WITHDRAWAL_METHODS.find((m) => m.id === method);
    const minLimit = methodConfig ? methodConfig.minWithdraw : 300;
    if (amount < minLimit) {
      showToast(
        'Minimum Withdrawal Limit',
        `Minimum withdrawal amount for ${methodConfig?.name || 'this method'} is ₨ ${minLimit} PKR.`,
        'error'
      );
      return { success: false, message: `Minimum withdrawal is ₨ ${minLimit} PKR.` };
    }

    // 3. Balance check
    if (user.balance < amount) {
      showToast(
        'Insufficient Balance',
        `Your current balance is ${formatMoney(user.balance)}. You need ${formatMoney(amount)}.`,
        'error'
      );
      return { success: false, message: 'Insufficient wallet balance.' };
    }

    // 4. PIN check
    if (pin !== user.withdrawalPin) {
      showToast('Incorrect PIN', 'The 4-digit security PIN is incorrect. Default is 1234.', 'error');
      return { success: false, message: 'Security PIN is incorrect.' };
    }

    // 5. Deduct balance and create request
    const feePercent = methodConfig?.feePercent || 0;
    const fee = (amount * feePercent) / 100;
    const netAmount = amount - fee;

    setUser((prev) => ({
      ...prev,
      balance: prev.balance - amount,
      totalWithdrawn: prev.totalWithdrawn + amount,
    }));

    const txCode = 'TXW-' + Math.floor(100000 + Math.random() * 900000);
    const newWithdrawal: WithdrawalRequest = {
      id: `wdr_${Date.now()}`,
      transactionId: txCode,
      method,
      methodName: methodConfig?.name || method,
      amount,
      fee,
      netAmount,
      accountTitle,
      accountNumber,
      bankName,
      status: 'pending',
      createdAt: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      notes: `Withdrawal request sent to ${methodConfig?.name} (${accountNumber}).`,
    };

    setWithdrawals((prev) => [newWithdrawal, ...prev]);

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'withdraw',
      title: `${methodConfig?.name} Withdrawal`,
      description: `Sent to ${accountNumber} (${accountTitle})`,
      amount,
      isCredit: false,
      date: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'pending',
      method: methodConfig?.name,
    };

    setTransactions((prev) => [newTx, ...prev]);

    showToast(
      'Withdrawal Submitted!',
      `₨ ${amount} PKR withdrawal request is under review. Estimated time: ${methodConfig?.estimatedTime || '15 mins'}.`,
      'success'
    );

    return { success: true, message: 'Withdrawal request submitted successfully.' };
  };

  const login = (identifier: string, _pass: string): boolean => {
    if (!identifier.trim()) {
      showToast('Login Failed', 'Please enter your phone number or email.', 'error');
      return false;
    }
    try {
      sessionStorage.setItem('pak_session_active', 'true');
    } catch {
      // ignore
    }
    setUser((prev) => ({
      ...prev,
      isLoggedIn: true,
      phone: identifier.includes('@') ? prev.phone : identifier,
      email: identifier.includes('@') ? identifier : prev.email,
    }));
    setActiveTab('home');
    showToast('Welcome Back!', 'Logged in successfully to PakInvest Ads & Earn.', 'success');
    return true;
  };

  const register = (
    name: string,
    phone: string,
    email: string,
    _pass: string,
    refCode?: string
  ): boolean => {
    if (!name.trim()) {
      showToast('Name Required', 'Please enter your full name.', 'error');
      return false;
    }
    if (!phone.trim()) {
      showToast('Number Required', 'Please enter your mobile phone number.', 'error');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      showToast('Gmail Required', 'Please enter a valid Gmail / email address.', 'error');
      return false;
    }

    try {
      sessionStorage.setItem('pak_session_active', 'true');
    } catch {
      // ignore
    }

    // Generate custom referral code for the new user (e.g. PAK + last 4 digits of phone or random 3 digits)
    const phoneDigits = phone.replace(/\D/g, '');
    const userRefCode = phoneDigits.length >= 4 ? `PAK${phoneDigits.slice(-4)}` : `PAK${Math.floor(100 + Math.random() * 900)}`;

    setUser((prev) => ({
      ...prev,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      referralCode: userRefCode,
      isLoggedIn: true,
      referredBy: refCode?.trim() || prev.referredBy,
      balance: prev.balance + 10, // ₨ 10 welcome signup gift!
      totalEarned: prev.totalEarned + 10,
    }));
    setActiveTab('home');

    showToast(
      'Registration Successful!',
      'Welcome to PakInvest! ₨ 10.00 PKR welcome bonus added to your balance.',
      'success'
    );
    return true;
  };

  const claimReferralReward = (friendName?: string) => {
    const friend = friendName || 'New User';
    setUser((prev) => ({
      ...prev,
      balance: prev.balance + 10,
      totalEarned: prev.totalEarned + 10,
      referralCount: (prev.referralCount || 0) + 1,
      referralEarnings: (prev.referralEarnings || 0) + 10,
    }));

    const newTx: Transaction = {
      id: `tx_ref_${Date.now()}`,
      type: 'referral_bonus',
      amount: 10,
      isCredit: true,
      title: 'Referral Reward (₨ 10.00)',
      date: 'Today, Just now',
      status: 'completed',
      description: `Friend (${friend}) registered using your referral code/link`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    showToast(
      '₨ 10 PKR Referral Earned!',
      `Congratulations! ₨ 10.00 PKR added to your wallet for referring ${friend}.`,
      'success'
    );
  };

  const logout = () => {
    try {
      sessionStorage.removeItem('pak_session_active');
    } catch {
      // ignore
    }
    setUser((prev) => ({ ...prev, isLoggedIn: false }));
    setAuthMode('login');
    setActiveTab('home');
    showToast('Logged Out', 'You have been logged out safely.', 'info');
  };

  const updateProfile = (name: string, phone: string) => {
    setUser((prev) => ({ ...prev, name, phone }));
    showToast('Profile Updated', 'Your profile details have been saved.', 'success');
  };

  const updatePin = (newPin: string) => {
    setUser((prev) => ({ ...prev, withdrawalPin: newPin }));
    showToast('Security PIN Updated', 'Your 4-digit withdrawal PIN was changed.', 'success');
  };

  const resetAllData = () => {
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_user`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_ads`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_social_tasks`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_withdrawals`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_transactions`);
    setUser(INITIAL_USER);
    setAds(INITIAL_ADS);
    setSocialTasks(INITIAL_SOCIAL_TASKS);
    setWithdrawals([]);
    setTransactions(INITIAL_TRANSACTIONS);
    showToast('Reset Complete', 'Application restored to default demo state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        activeTab,
        setActiveTab,
        currency,
        setCurrency,
        formatMoney,
        ads,
        socialTasks,
        withdrawals,
        transactions,
        toasts,
        showToast,
        removeToast,
        activeAdForWatching,
        startWatchingAd,
        cancelWatchingAd,
        claimAdReward,
        completeSocialTask,
        submitSocialTaskProof,
        updateWhatsAppChannelUrl,
        requestWithdrawal,
        login,
        register,
        claimReferralReward,
        logout,
        authMode,
        setAuthMode,
        updateProfile,
        updatePin,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
