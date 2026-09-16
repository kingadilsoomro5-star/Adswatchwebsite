import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/ToastContainer';
import { AdWatcherModal } from './components/AdWatcherModal';
import { AuthView } from './components/AuthView';
import { HomeView } from './components/views/HomeView';
import { TaskView } from './components/views/TaskView';
import { WithdrawView } from './components/views/WithdrawView';
import { ProfileView } from './components/views/ProfileView';
import { ReferView } from './components/views/ReferView';

const MainContent: React.FC = () => {
  const { user, activeTab, setActiveTab } = useApp();

  // If user is not authenticated, show Register / Login view first
  if (!user.isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
        <ToastContainer />
        <AuthView />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <ToastContainer />
      <Navbar />

      {/* Main Content Area: Primary tabs + Dedicated Login & Register views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 md:pb-12">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'task' && <TaskView />}
        {activeTab === 'refer' && <ReferView />}
        {activeTab === 'withdraw' && <WithdrawView />}
        {activeTab === 'profile' && <ProfileView />}
        {(activeTab === 'login' || activeTab === 'register') && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-900">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>
                  Currently logged in as <strong>{user.name}</strong> ({user.phone}). You can create another account or switch accounts below.
                </span>
              </div>
              <button
                onClick={() => setActiveTab('home')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-xs"
              >
                Back to Dashboard
              </button>
            </div>
            <AuthView />
          </div>
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav />

      {/* Interactive Ad Viewer Modal */}
      <AdWatcherModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
