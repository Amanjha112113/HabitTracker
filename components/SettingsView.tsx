
import React from 'react';
import { UserProfile, AppSettings } from '../types';
import { ICONS } from '../constants';

import { Save } from 'lucide-react';

interface SettingsViewProps {
  user: UserProfile;
  setUser: (u: UserProfile) => void;
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, setUser, settings, setSettings }) => {
  const toggleSetting = (key: keyof AppSettings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h2 className="text-3xl font-black text-stone-800 tracking-tight">System Control</h2>
        <p className="text-stone-500 font-medium">Environment configuration and data governance</p>
      </div>

      {/* Security Section */}
      <section className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-[32px] p-8 text-white shadow-2xl shadow-stone-900/40 relative overflow-hidden border border-stone-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-teal-500/20 rounded-xl border border-teal-500/30 backdrop-blur-md">
              {ICONS.Shield}
            </div>
            <div>
              <h3 className="text-xl font-bold">Privacy & Security</h3>
              <p className="text-teal-200/60 text-xs uppercase tracking-widest font-bold">Level 1 Protection</p>
            </div>
          </div>
          <div className="flex items-center justify-between glass p-6 rounded-2xl border-teal-500/30 hover:bg-white/5 transition-colors">
            <div className="max-w-md">
              <h4 className="font-bold mb-1 text-lg">Secure Session Mode</h4>
              <p className="text-teal-200 text-sm leading-relaxed"> ephemeral persistence enabled. Data is retained only in volatile memory during the active session. Use 'Export Growth History' to persist state.</p>
            </div>
            <button
              onClick={() => toggleSetting('secureSession')}
              className={`w-16 h-9 rounded-full p-1 transition-all duration-300 ${settings.secureSession ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-stone-700/50'}`}
            >
              <div className={`w-7 h-7 bg-white rounded-full shadow-md transition-transform duration-300 ${settings.secureSession ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Profile */}
      <section className="glass rounded-[32px] p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-500 to-transparent"></div>
        <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
          <span className="p-2 bg-teal-50 rounded-xl text-teal-600">{ICONS.User}</span>
          Developer Identity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1 mb-2 block">First Name</label>
            <input
              type="text"
              value={user.firstName}
              placeholder="First Name"
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
              className="w-full px-6 py-4 bg-stone-50/50 border border-stone-200 rounded-2xl font-bold text-stone-800 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white transition-all outline-none"
            />
          </div>
          <div className="group">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1 mb-2 block">Last Name</label>
            <input
              type="text"
              value={user.lastName}
              placeholder="Last Name"
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              className="w-full px-6 py-4 bg-stone-50/50 border border-stone-200 rounded-2xl font-bold text-stone-800 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white transition-all outline-none"
            />
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="glass rounded-[32px] p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-500 to-transparent"></div>
        <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
          <span className="p-2 bg-teal-50 rounded-xl text-teal-600">{ICONS.Settings}</span>
          System Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1">Calendar Start</label>
            <div className="relative">
              <select value={settings.startWeekOn} onChange={(e) => setSettings({ ...settings, startWeekOn: e.target.value as any })} className="w-full px-6 py-4 bg-stone-50/50 border border-stone-200 rounded-2xl font-bold text-stone-800 appearance-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all">
                <option>Monday</option><option>Sunday</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">▼</div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1">Theme Interface</label>
            <div className="relative">
              <select value={settings.theme} onChange={(e) => setSettings({ ...settings, theme: e.target.value as any })} className="w-full px-6 py-4 bg-stone-50/50 border border-stone-200 rounded-2xl font-bold text-stone-800 appearance-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all">
                <option>Light</option><option>Dark</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">▼</div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1">Timezone</label>
            <div className="relative">
              <select className="w-full px-6 py-4 bg-stone-50/50 border border-stone-200 rounded-2xl font-bold text-stone-800 appearance-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all">
                <option>Auto-detect</option><option>UTC</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">▼</div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Section */}
      <section className="glass rounded-[32px] p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-transparent"></div>
        <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
          <span className="p-2 bg-emerald-50 rounded-xl text-emerald-600">{ICONS.Download}</span>
          Data Governance
        </h3>
        <div className="space-y-4">
          <button className="w-full p-6 bg-stone-50/50 hover:bg-white rounded-2xl border border-stone-200/60 hover:border-emerald-200 flex items-center justify-between transition-all group hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="text-left">
              <h4 className="font-bold text-stone-800 text-lg group-hover:text-emerald-700 transition-colors">Export Growth History</h4>
              <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mt-1">JSON • Encrypted • All Time</p>
            </div>
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-stone-100 group-hover:bg-emerald-500 group-hover:text-white transition-all transform group-hover:scale-110">{ICONS.Download}</div>
          </button>

          <button className="w-full p-6 bg-red-50/30 hover:bg-red-50 rounded-2xl border border-red-100/50 hover:border-red-200 flex items-center justify-between transition-all group hover:shadow-lg hover:shadow-red-500/10">
            <div className="text-left">
              <h4 className="font-bold text-red-600 text-lg">Factory Reset</h4>
              <p className="text-xs font-medium text-red-400 uppercase tracking-wider mt-1">Purge Local Storage • Irreversible</p>
            </div>
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-red-100 group-hover:bg-red-500 group-hover:text-white transition-all transform group-hover:scale-110 text-red-500">{ICONS.Trash}</div>
          </button>
        </div>
      </section>

      <div className="flex justify-end pt-8 pb-8">
        <button className="px-12 py-5 bg-stone-900 text-white font-black rounded-2xl shadow-2xl shadow-stone-900/30 hover:scale-[1.02] active:scale-95 hover:bg-stone-800 transition-all flex items-center gap-3">
          <Save className="w-5 h-5" />
          SAVE SYSTEM CONFIG
        </button>
      </div>
    </div>
  );
};


export default SettingsView;
