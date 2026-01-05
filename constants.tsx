
import React from 'react';
import { 
  CheckSquare, 
  BookOpen, 
  BarChart2, 
  Heart, 
  Settings, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Award,
  Calendar as CalendarIcon,
  LayoutGrid,
  List,
  Smile,
  Meh,
  Frown,
  CloudRain,
  Sun,
  User,
  LogOut,
  Bell,
  Download,
  Trash2,
  Code,
  BrainCircuit,
  Terminal,
  Search,
  Hash,
  ShieldCheck
} from 'lucide-react';
import { Habit } from './types';

export const ICONS = {
  Habits: <CheckSquare size={20} />,
  Journal: <BookOpen size={20} />,
  Analytics: <BarChart2 size={20} />,
  Knowledge: <BrainCircuit size={20} />,
  Support: <Heart size={20} />,
  Settings: <Settings size={20} />,
  Plus: <Plus size={16} />,
  Left: <ChevronLeft size={20} />,
  Right: <ChevronRight size={20} />,
  Trending: <TrendingUp size={20} />,
  Award: <Award size={20} />,
  Calendar: <CalendarIcon size={20} />,
  Grid: <LayoutGrid size={20} />,
  List: <List size={20} />,
  Smile: <Smile size={32} />,
  Meh: <Meh size={32} />,
  Frown: <Frown size={32} />,
  CloudRain: <CloudRain size={32} />,
  Sun: <Sun size={32} />,
  User: <User size={20} />,
  LogOut: <LogOut size={20} />,
  Bell: <Bell size={20} />,
  Download: <Download size={20} />,
  Trash: <Trash2 size={20} />,
  Code: <Code size={20} />,
  Terminal: <Terminal size={20} />,
  Search: <Search size={18} />,
  Hash: <Hash size={14} />,
  Shield: <ShieldCheck size={20} />
};

export const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'Make Video', emoji: '🎥', category: 'Productivity', completions: [] },
  { id: '2', name: 'Wake at Constant', emoji: '🌅', category: 'Productivity', completions: [] },
  { id: '3', name: 'AI Learning', emoji: '📖', category: 'Learning', completions: [] },
  { id: '4', name: 'Exercise', emoji: '🏃', category: 'Health', completions: [] },
  { id: '5', name: 'DSA Practice', emoji: '✍️', category: 'Code', completions: [] },
  { id: '6', name: 'YT video', emoji: '📼', category: 'Learning', completions: [] },
  { id: '7', name: 'Meditation', emoji: '🧘', category: 'Mental', completions: [] },
  { id: '8', name: 'CodeForces', emoji: '✍️', category: 'Code', completions: [] },
];

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const DAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];
