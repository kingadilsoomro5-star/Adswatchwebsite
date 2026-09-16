import React from 'react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';
import {
  TrendingUp,
  Play,
  ArrowUpRight,
  User,
  CheckSquare,
  Gift,
  UserPlus,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setAuthMode } = useApp();

  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: TrendingUp },
    { id: 'task', label: 'Tasks', icon: Play, badge: '₨ 3' },
    { id: 'refer', label: 'Refer', icon: Gift, badge: '₨ 10' },
    { id: 'withdraw', label: 'Withdraw', icon: ArrowUpRight },
    { id: 'register', label: 'Register', icon: UserPlus, badge: '+₨ 10' },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'register') {
                  setAuthMode('register');
                  setActiveTab('register');
                } else {
                  setActiveTab(item.id);
                }
              }}
              id={`bottom-nav-${item.id}`}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-7 h-1 bg-blue-600 rounded-full" />
              )}
              <div
                className={`p-1 rounded-lg transition-transform relative ${
                  isActive ? 'scale-110 bg-blue-50' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 text-[8px] font-extrabold px-1 py-0.2 rounded-full bg-emerald-600 text-white leading-none">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium tracking-tight mt-0.5 ${isActive ? 'font-bold text-slate-900' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
