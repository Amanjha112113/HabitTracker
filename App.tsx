
import React, { useState, useEffect } from 'react';
import { View, Habit, JournalEntry, UserProfile, AppSettings, DevNote } from './types';
import { INITIAL_HABITS, ICONS } from './constants';
import Sidebar from './components/Sidebar';
import HabitsView from './components/HabitsView';
import JournalView from './components/JournalView';
import JournalEntryView from './components/JournalEntryView';
import SettingsView from './components/SettingsView';
import AnalyticsView from './components/AnalyticsView';
import NotesView from './components/NotesView';
import { format } from 'date-fns';

import { api } from './src/services/api';
import { supabase } from './src/lib/supabase';
import AuthView from './components/AuthView';

const App: React.FC = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<View>(View.HABITS);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Data State
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [journalEntries, setJournalEntries] = useState<Record<string, JournalEntry>>({});
  const [notes, setNotes] = useState<DevNote[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);

  const [settings, setSettings] = useState<AppSettings>({
    dailyReminders: true,
    weeklyReports: true,
    achievementNotifications: true,
    startWeekOn: 'Monday',
    theme: 'Light',
    timezone: 'Auto-detect',
    secureSession: false
  });

  // Auth Listener & Initial Fetch
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      // Check for existing session first (from localStorage)
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        try {
          const user = await api.getUser();
          setUser(user);
        } catch (e) {
          console.error("Failed to restore user profile", e);
        }
      }

      setIsLoading(false);
    };
    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        if (session?.user) {
          const user = await api.getUser();
          setUser(user);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setHabits(INITIAL_HABITS);
        setJournalEntries({});
        setNotes([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch Data when User changes
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [fetchedHabits, fetchedJournal, fetchedNotes, fetchedSettings] = await Promise.all([
          api.getHabits(),
          api.getJournal(),
          api.getNotes(),
          api.getSettings()
        ]);

        if (fetchedHabits && fetchedHabits.length > 0) setHabits(fetchedHabits);
        if (fetchedJournal) setJournalEntries(fetchedJournal);
        if (fetchedNotes) setNotes(fetchedNotes);
        if (fetchedSettings) setSettings(fetchedSettings);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, [user]);

  // Handlers
  const toggleHabit = async (habitId: string, date: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const completed = habit.completions.includes(date);
    const updatedHabit = {
      ...habit,
      completions: completed
        ? habit.completions.filter(d => d !== date)
        : [...habit.completions, date]
    };

    setHabits(prev => prev.map(h => h.id === habitId ? updatedHabit : h));
    await api.saveHabit(updatedHabit);
  };

  const addHabit = async (name: string, emoji: string) => {
    const newHabit: Habit = { id: Math.random().toString(36).substr(2, 9), name, emoji, category: 'General' as any, completions: [] };
    setHabits(prev => [...prev, newHabit]);
    await api.saveHabit(newHabit);
  };

  const saveJournalEntry = async (entry: JournalEntry) => {
    setJournalEntries(prev => ({ ...prev, [entry.date]: entry }));
    await api.saveJournalEntry(entry);
  };

  const saveNote = async (note: DevNote) => {
    setNotes(prev => {
      const exists = prev.find(n => n.id === note.id);
      if (exists) return prev.map(n => n.id === note.id ? note : n);
      return [note, ...prev];
    });
    await api.saveNote(note);
  };

  const deleteNote = async (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    await api.deleteNote(id);
  };
  const deleteHabit = async (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    await api.deleteHabit(id);
  };

  const navigateToEntry = (date: string) => { setSelectedDate(date); setCurrentView(View.JOURNAL_ENTRY); };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-stone-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-stone-200 border-t-teal-500 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-teal-500 rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthView onLogin={setUser} />;
  }
  return (
    <div className={`flex h-screen overflow-hidden ${settings.theme === 'Dark' ? 'bg-slate-900 text-white' : 'bg-transparent'}`}>
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <Sidebar activeView={currentView} onViewChange={setCurrentView} user={user} />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 flex items-center justify-between px-8 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-stone-800 to-stone-600 tracking-tight animate-in">
              {currentView === View.HABITS && "Habit Architecture"}
              {currentView === View.JOURNAL && "Mindset Journal"}
              {currentView === View.ANALYTICS && "Growth Insights"}
              {currentView === View.NOTES && "Knowledge Base"}
              {currentView === View.SETTINGS && "System Settings"}
            </h1>
            {settings.secureSession && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase ring-1 ring-red-100">
                {ICONS.Shield} Secure
              </span>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 glass px-3 py-1.5 rounded-full hover:bg-white/80 transition-all cursor-pointer group active:scale-95"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-rose-500 p-0.5">
                  <img src={user.avatar} className="w-full h-full object-cover rounded-full border-2 border-white" alt="Profile" />
                </div>
                <span className="text-sm font-bold text-stone-700 pr-2 group-hover:text-teal-600 transition-colors">{user.firstName}</span>
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute top-14 right-0 w-72 glass-card rounded-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 border border-white/60 shadow-2xl">
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-stone-200/50">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-rose-500 p-0.5 shadow-lg">
                        <img src={user.avatar} className="w-full h-full object-cover rounded-full border-2 border-white" alt="Profile" />
                      </div>
                      <div>
                        <h4 className="font-black text-stone-800">{user.firstName} {user.lastName}</h4>
                        <p className="text-xs font-bold text-stone-400">Pro Member</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <button onClick={() => { setCurrentView(View.SETTINGS); setIsProfileOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-stone-50 text-stone-600 font-bold text-sm transition-colors flex items-center gap-2">
                        {ICONS.Settings} Settings
                      </button>
                      <button onClick={async () => { await supabase.auth.signOut(); setIsProfileOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 font-bold text-sm transition-colors flex items-center gap-2">
                        {ICONS.LogOut} Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-2">
          <div className="max-w-7xl mx-auto h-full">
            {(() => {
              switch (currentView) {
                case View.HABITS: return <HabitsView habits={habits} toggleHabit={toggleHabit} addHabit={addHabit} deleteHabit={deleteHabit} />;
                case View.JOURNAL: return <JournalView entries={journalEntries} onDateSelect={navigateToEntry} />;
                case View.JOURNAL_ENTRY: return <JournalEntryView date={selectedDate} entry={journalEntries[selectedDate]} onSave={saveJournalEntry} onBack={() => setCurrentView(View.JOURNAL)} />;
                case View.ANALYTICS: return <AnalyticsView habits={habits} journalEntries={journalEntries} />;
                case View.NOTES: return <NotesView notes={notes} onSave={saveNote} onDelete={deleteNote} />;
                case View.SETTINGS: return <SettingsView user={user} setUser={setUser} settings={settings} setSettings={setSettings} />;
                default: return null;
              }
            })()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
