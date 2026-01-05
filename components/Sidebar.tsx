
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
    <aside className="w-64 border-r border-gray-200 bg-white flex flex-col shrink-0">
      <div className="p-6 flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
          GP
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">GrowthPath</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as View)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeView === item.id 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 mb-4">
        <div className="bg-indigo-600 rounded-2xl p-4 text-white">
          <p className="text-xs font-semibold opacity-75 uppercase tracking-widest mb-1">Growth Level</p>
          <p className="text-lg font-bold mb-2">Pro Developer</p>
          <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
            <div className="w-3/4 bg-white h-full" />
          </div>
        </div>
      </div>

      <div className="px-4 py-6 border-t border-gray-100 space-y-1">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => item.id !== 'support' && onViewChange(item.id as View)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeView === item.id 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
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
