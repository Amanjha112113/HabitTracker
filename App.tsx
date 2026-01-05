
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

const App: React.FC = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<View>(View.HABITS);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  // Data State
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('growthpath_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [journalEntries, setJournalEntries] = useState<Record<string, JournalEntry>>(() => {
    const saved = localStorage.getItem('growthpath_journal');
    return saved ? JSON.parse(saved) : {};
  });

  const [notes, setNotes] = useState<DevNote[]>(() => {
    const saved = localStorage.getItem('growthpath_notes');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('growthpath_user');
    return saved ? JSON.parse(saved) : {
      firstName: 'Aman',
      lastName: 'Jha',
      email: 'amanjha@example.com',
      avatar: 'https://picsum.photos/seed/user123/200/200'
    };
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('growthpath_settings');
    return saved ? JSON.parse(saved) : {
      dailyReminders: true,
      weeklyReports: true,
      achievementNotifications: true,
      startWeekOn: 'Monday',
      theme: 'Light',
      timezone: 'Auto-detect',
      secureSession: false
    };
  });

  // Persistence (Only if not in secureSession mode)
  useEffect(() => {
    if (!settings.secureSession) {
      localStorage.setItem('growthpath_habits', JSON.stringify(habits));
      localStorage.setItem('growthpath_journal', JSON.stringify(journalEntries));
      localStorage.setItem('growthpath_notes', JSON.stringify(notes));
      localStorage.setItem('growthpath_user', JSON.stringify(user));
      localStorage.setItem('growthpath_settings', JSON.stringify(settings));
    }
  }, [habits, journalEntries, notes, user, settings]);

  // Handlers
  const toggleHabit = (habitId: string, date: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const completed = h.completions.includes(date);
        return {
          ...h,
          completions: completed 
            ? h.completions.filter(d => d !== date) 
            : [...h.completions, date]
        };
      }
      return h;
    }));
  };

  const addHabit = (name: string, emoji: string) => {
    const newHabit: Habit = { id: Math.random().toString(36).substr(2, 9), name, emoji, category: 'General' as any, completions: [] };
    setHabits(prev => [...prev, newHabit]);
  };

  const saveJournalEntry = (entry: JournalEntry) => setJournalEntries(prev => ({ ...prev, [entry.date]: entry }));
  const saveNote = (note: DevNote) => setNotes(prev => {
    const exists = prev.find(n => n.id === note.id);
    if (exists) return prev.map(n => n.id === note.id ? note : n);
    return [note, ...prev];
  });
  const deleteNote = (id: string) => setNotes(prev => prev.filter(n => n.id !== id));
  const navigateToEntry = (date: string) => { setSelectedDate(date); setCurrentView(View.JOURNAL_ENTRY); };

  return (
    <div className={`flex h-screen overflow-hidden ${settings.theme === 'Dark' ? 'bg-gray-900 text-white' : 'bg-[#F8F9FD]'}`}>
      <Sidebar activeView={currentView} onViewChange={setCurrentView} user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">
              {currentView === View.HABITS && "Habit Tracker"}
              {currentView === View.JOURNAL && "Journal"}
              {currentView === View.ANALYTICS && "Insights"}
              {currentView === View.NOTES && "Dev Library"}
              {currentView === View.SETTINGS && "Settings"}
            </h1>
            {settings.secureSession && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase">
                {ICONS.Shield} Secure Session Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full border-2 border-indigo-100 overflow-hidden shadow-sm">
               <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {(() => {
            switch (currentView) {
              case View.HABITS: return <HabitsView habits={habits} toggleHabit={toggleHabit} addHabit={addHabit} />;
              case View.JOURNAL: return <JournalView entries={journalEntries} onDateSelect={navigateToEntry} />;
              case View.JOURNAL_ENTRY: return <JournalEntryView date={selectedDate} entry={journalEntries[selectedDate]} onSave={saveJournalEntry} onBack={() => setCurrentView(View.JOURNAL)} />;
              case View.ANALYTICS: return <AnalyticsView habits={habits} journalEntries={journalEntries} />;
              case View.NOTES: return <NotesView notes={notes} onSave={saveNote} onDelete={deleteNote} />;
              case View.SETTINGS: return <SettingsView user={user} setUser={setUser} settings={settings} setSettings={setSettings} />;
              default: return null;
            }
          })()}
        </main>
      </div>
    </div>
  );
};

export default App;
