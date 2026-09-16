export type Currency = 'PKR' | 'USD';

export type TabType = 'home' | 'task' | 'refer' | 'withdraw' | 'profile' | 'login' | 'register';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
  adsWatchedCount: number;
  todayAdsWatched: number;
  dailyAdsLimit: number;
  isWhatsAppJoined: boolean;
  whatsAppChannelUrl: string;
  whatsAppChannelUrl2?: string;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  referralEarnings: number;
  vipTier: 'Standard' | 'Silver' | 'Gold' | 'VIP';
  withdrawalPin: string;
  currency: Currency;
  isVerified: boolean;
  joinedDate: string;
  isLoggedIn: boolean;
}

export interface AdItem {
  id: string;
  title: string;
  sponsor: string;
  category: string;
  rewardPkr: number; // 3 PKR
  durationSeconds: number; // 10-15s
  description: string;
  targetUrl: string;
  isWatched: boolean;
}

export interface SocialTask {
  id: string;
  title: string;
  description: string;
  platform: 'whatsapp' | 'telegram' | 'youtube';
  url: string;
  isCompleted: boolean;
  isRequiredForWithdraw: boolean;
  rewardPkr: number;
  channelNumber?: number;
  screenshotUrl?: string;
  submittedAt?: string;
}

export type PaymentMethodId = 'easypaisa' | 'jazzcash' | 'bank';

export interface WithdrawalMethod {
  id: PaymentMethodId;
  name: string;
  subtitle: string;
  iconName: string;
  minWithdraw: number; // 300 PKR
  maxWithdraw: number;
  feePercent: number;
  estimatedTime: string;
  accountLabel: string;
  placeholder: string;
  patternNotice?: string;
}

export interface WithdrawalRequest {
  id: string;
  transactionId: string;
  method: PaymentMethodId;
  methodName: string;
  amount: number;
  fee: number;
  netAmount: number;
  accountTitle: string;
  accountNumber: string;
  bankName?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  type: 'ad_reward' | 'social_reward' | 'withdraw' | 'referral_bonus' | 'signup_bonus';
  title: string;
  description: string;
  amount: number;
  isCredit: boolean;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method?: string;
}
