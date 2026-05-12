
import React from 'react';
import { View, UserProfile } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
  user: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, user }) => {
  const navItems = [
    { id: View.HABITS, label: 'Habits', icon: ICONS.Habits },
    { id: View.JOURNAL, label: 'Journal', icon: ICONS.Journal },
    { id: View.NOTES, label: 'Knowledge Base', icon: ICONS.Knowledge },
    { id: View.ANALYTICS, label: 'Analytics', icon: ICONS.Analytics },
  ];

  const bottomItems = [
    { id: 'support', label: 'Support', icon: ICONS.Support },
    { id: View.SETTINGS, label: 'Settings', icon: ICONS.Settings },
  ];

  return (
    <aside className="w-72 m-4 rounded-3xl glass flex flex-col shrink-0 relative overflow-hidden transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>

      <div className="p-8 flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-black font-black shadow-lg shadow-indigo-500/30 transform rotate-3 hover:rotate-6 transition-transform">
          GP
        </div>
        <div>
          <span className="text-xl font-black text-slate-800 tracking-tight block leading-none">GrowthPath</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System v2.0</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 relative z-10">
        <div className="px-4 py-2 text-xs font-bold text-stone-400 uppercase tracking-widest">Main Menu</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as View)}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 group relative overflow-hidden ${activeView === item.id
              ? 'bg-blue-50 text-blue-900 shadow-sm border border-blue-100'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
          >
            <span className={`transition-transform duration-300 ${activeView === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
              {item.icon}
            </span>
            <span className="relative z-10">{item.label}</span>
            {activeView === item.id && (
              <div className="absolute right-4 w-1.5 h-1.5 bg-blue-900 rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 relative z-10">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-5 shadow-lg shadow-blue-500/5 border border-blue-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-6 -mt-6 group-hover:bg-blue-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Current Level</p>
              <p className="text-lg font-black text-blue-900">Pro Developer</p>
            </div>
            <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
              {ICONS.Trending}
            </div>
          </div>
          <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden">
            <div className="w-3/4 bg-gradient-to-r from-teal-400 to-teal-300 h-full rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
          </div>
          <p className="text-[10px] text-right mt-2 font-medium text-blue-400">750 / 1000 XP</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-2 relative z-10">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => item.id !== 'support' && onViewChange(item.id as View)}
            className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl text-sm font-semibold transition-colors ${activeView === item.id
              ? 'bg-blue-900/10 text-blue-900'
              : 'text-stone-400 hover:bg-stone-50 hover:text-stone-900'
              }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
