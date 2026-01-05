
export enum View {
  HABITS = 'habits',
  JOURNAL = 'journal',
  ANALYTICS = 'analytics',
  NOTES = 'notes',
  SETTINGS = 'settings',
  JOURNAL_ENTRY = 'journal_entry'
}

export type HabitCategory = 'Productivity' | 'Health' | 'Learning' | 'Code' | 'Mental';

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  category: HabitCategory;
  completions: string[]; // ISO Date strings YYYY-MM-DD
}

export interface JournalEntry {
  date: string; // YYYY-MM-DD
  mood: 'happy' | 'neutral' | 'calm' | 'sad' | 'crying' | null;
  gratitude: string;
  highlights: string;
  challenges: string;
  learning: string;
  goals: string;
  notes: string;
  lastUpdated: string;
}

export interface DevNote {
  id: string;
  title: string;
  category: 'Snippet' | 'Research' | 'ChatLog' | 'General';
  content: string;
  language?: string;
  tags: string[];
  createdAt: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}

export interface AppSettings {
  dailyReminders: boolean;
  weeklyReports: boolean;
  achievementNotifications: boolean;
  startWeekOn: 'Monday' | 'Sunday';
  theme: 'Light' | 'Dark';
  timezone: string;
  secureSession: boolean; // If true, don't auto-save to localStorage
}
