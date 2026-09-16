import React from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  Search,
  BookOpen,
  Home
} from 'lucide-react';
import { UserProfile } from '../types';

export type NavTabType = 'landing' | 'dashboard' | 'verifier' | 'employer' | 'architecture';

interface NavbarProps {
  activeTab: NavTabType;
  setActiveTab?: (tab: NavTabType) => void;
  onTabChange?: (tab: NavTabType) => void;
  user?: UserProfile;
  onOpenSubmitModal?: () => void;
  onSubmitProjectClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onTabChange,
  user,
  onOpenSubmitModal,
  onSubmitProjectClick,
}) => {
  const handleTabChange = (tab: NavTabType) => {
    if (setActiveTab) setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const handleSubmitClick = () => {
    if (onOpenSubmitModal) onOpenSubmitModal();
    if (onSubmitProjectClick) onSubmitProjectClick();
  };

  const currentUser = user || {
    id: 'usr_megni_9021',
    name: 'Amina Al-Mansoor',
    email: 'amina.mansoor@alumni.megnito.org',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    githubUsername: 'amina-ai-engineer',
    did: 'did:key:z6MkpTHR8VNsBxYAAWhNx2W3cA8B1p9FqK3vW7j5x9aB1c',
    joinedAt: '2026-02-01T09:00:00Z',
    cohort: 'MegniToo AI Incubator - Batch 04',
    badgesEarned: [],
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <button
            onClick={() => handleTabChange('landing')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">MegniToo</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Portfolio Verifier
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Tamper-Proof W3C Credentials for AI & ML Engineers
              </p>
            </div>
          </button>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              id="nav-tab-landing"
              onClick={() => handleTabChange('landing')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'landing'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Home className="w-4 h-4 text-emerald-400" />
              <span>Overview</span>
            </button>

            <button
              id="nav-tab-dashboard"
              onClick={() => handleTabChange('dashboard')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Student</span> <span>Dashboard</span>
            </button>

            <button
              id="nav-tab-verifier"
              onClick={() => handleTabChange('verifier')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'verifier'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span className="hidden md:inline">Deployment</span> Verifier
            </button>

            <button
              id="nav-tab-employer"
              onClick={() => handleTabChange('employer')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'employer'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Search className="w-4 h-4 text-blue-400" />
              <span>Employer Portal</span>
            </button>

            <button
              id="nav-tab-architecture"
              onClick={() => handleTabChange('architecture')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span className="hidden lg:inline">System</span> Blueprint
            </button>
          </nav>

          {/* Actions & Profile */}
          <div className="flex items-center gap-3">
            <button
              id="btn-submit-repo"
              onClick={handleSubmitClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-xs rounded-lg shadow-sm transition-all"
            >
              + Submit Repo
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full border border-slate-700 object-cover"
              />
              <div className="hidden xl:block text-left">
                <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                  {currentUser.name}
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />
                </div>
                <div className="text-[10px] text-slate-400">@{currentUser.githubUsername}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
