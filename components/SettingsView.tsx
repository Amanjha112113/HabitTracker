
import React from 'react';
import { UserProfile, AppSettings } from '../types';
import { ICONS } from '../constants';

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
        <h2 className="text-2xl font-bold text-gray-900">Control Center</h2>
        <p className="text-gray-500">Configure your growth environment and privacy</p>
      </div>

      {/* Security Section */}
      <section className="bg-indigo-900 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            {ICONS.Shield}
            <h3 className="text-xl font-bold">Privacy & Security</h3>
          </div>
          <div className="flex items-center justify-between">
            <div className="max-w-md">
              <h4 className="font-bold mb-1">Secure Session Mode</h4>
              <p className="text-indigo-200 text-sm">If enabled, data is only stored in memory during your active session. Use manual 'Export' to save progress permanently.</p>
            </div>
            <button 
              onClick={() => toggleSetting('secureSession')}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${settings.secureSession ? 'bg-emerald-500' : 'bg-white/20'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${settings.secureSession ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Profile */}
      <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">{ICONS.User} Developer Identity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input 
            type="text" 
            value={user.firstName}
            placeholder="First Name"
            onChange={(e) => setUser({...user, firstName: e.target.value})}
            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
          />
          <input 
            type="text" 
            value={user.lastName}
            placeholder="Last Name"
            onChange={(e) => setUser({...user, lastName: e.target.value})}
            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
          />
        </div>
      </section>

      {/* Preferences */}
      <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">{ICONS.Settings} Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="space-y-2">
             <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Calendar Start</label>
             <select value={settings.startWeekOn} onChange={(e) => setSettings({...settings, startWeekOn: e.target.value as any})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
               <option>Monday</option><option>Sunday</option>
             </select>
           </div>
           <div className="space-y-2">
             <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Theme</label>
             <select value={settings.theme} onChange={(e) => setSettings({...settings, theme: e.target.value as any})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
               <option>Light</option><option>Dark (WIP)</option>
             </select>
           </div>
           <div className="space-y-2">
             <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Timezone</label>
             <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
               <option>Auto-detect</option><option>UTC</option>
             </select>
           </div>
        </div>
      </section>

      {/* Data Section */}
      <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">{ICONS.Download} Data Management</h3>
        <div className="space-y-4">
          <button className="w-full p-5 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-100 flex items-center justify-between transition-all group">
            <div className="text-left">
              <h4 className="font-bold text-gray-800">Export Growth History</h4>
              <p className="text-sm text-gray-400">Download all JSON data for offline storage</p>
            </div>
            <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">{ICONS.Download}</div>
          </button>
          
          <button className="w-full p-5 bg-red-50 hover:bg-red-100 rounded-2xl border border-red-100 flex items-center justify-between transition-all group">
            <div className="text-left">
              <h4 className="font-bold text-red-600">Factory Reset</h4>
              <p className="text-sm text-red-400">Permanently purge all local records</p>
            </div>
            <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all text-red-500">{ICONS.Trash}</div>
          </button>
        </div>
      </section>

      <div className="flex justify-end pt-4">
        <button className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:scale-105 transition-all">SAVE CONFIGURATION</button>
      </div>
    </div>
  );
};

export default SettingsView;
