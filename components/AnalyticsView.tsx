
import React, { useMemo } from 'react';
import { Habit, JournalEntry, HabitCategory } from '../types';
import { ICONS } from '../constants';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, AreaChart, Area
} from 'recharts';
import { format, subDays, eachDayOfInterval, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';

interface AnalyticsViewProps {
  habits: Habit[];
  journalEntries: Record<string, JournalEntry>;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ habits, journalEntries }) => {
  const last30Days = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 29);
    return eachDayOfInterval({ start, end });
  }, []);

  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  // Dynamic Radar Data based on categories
  const radarData = useMemo(() => {
    const categories: HabitCategory[] = ['Productivity', 'Health', 'Learning', 'Code', 'Mental'];
    return categories.map(cat => {
      const catHabits = habits.filter(h => h.category === cat);
      if (catHabits.length === 0) return { subject: cat, A: 0, fullMark: 100 };

      const totalPossible = catHabits.length * 30; // Last 30 days
      const totalCompleted = catHabits.reduce((acc, h) => {
        return acc + h.completions.filter(d => {
          const date = new Date(d);
          return date >= subDays(new Date(), 30);
        }).length;
      }, 0);

      const score = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;
      return { subject: cat, A: Math.round(score), fullMark: 100 };
    });
  }, [habits]);

  const habitFrequencyData = useMemo(() => {
    return habits.map(h => ({
      name: h.name,
      count: h.completions.length,
    })).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [habits]);

  const moodCorrelationData = useMemo(() => {
    const moodMap: Record<string, number> = {
      'happy': 5, 'calm': 4, 'neutral': 3, 'sad': 2, 'crying': 1
    };

    return last30Days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const entry = journalEntries[dateStr];
      const moodValue = entry?.mood ? moodMap[entry.mood] : 0;
      const completedHabits = habits.reduce((acc, h) => acc + (h.completions.includes(dateStr) ? 1 : 0), 0);

      return {
        date: format(day, 'MMM dd'),
        mood: moodValue * (habits.length / 5), // Normalize for visualization
        habits: completedHabits
      };
    });
  }, [journalEntries, habits, last30Days]);

  const consistencyScore = useMemo(() => {
    if (habits.length === 0) return 0;
    const totalCompletions = habits.reduce((acc, h) => acc + h.completions.length, 0);
    const daysTracked = habits.length * 30; // Sample size
    return Math.min(100, Math.round((totalCompletions / daysTracked) * 100));
  }, [habits]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-3xl -mr-8 -mt-8 group-hover:bg-indigo-500/20 transition-colors"></div>
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 relative z-10">Consistency</p>
          <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400 relative z-10">{consistencyScore}%</h3>
          <p className="text-xs text-stone-500 mt-2 font-bold relative z-10">System Adherence</p>
        </div>
        <div className="glass-card p-6 rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl -mr-8 -mt-8 group-hover:bg-emerald-500/20 transition-colors"></div>
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 relative z-10">Active Protocols</p>
          <h3 className="text-4xl font-black text-emerald-600 relative z-10">{habits.length}</h3>
          <p className="text-xs text-stone-500 mt-2 font-bold relative z-10">Currently Tracking</p>
        </div>
        <div className="glass-card p-6 rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-3xl -mr-8 -mt-8 group-hover:bg-orange-500/20 transition-colors"></div>
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 relative z-10">Avg Mood</p>
          <h3 className="text-4xl font-black text-orange-500 relative z-10">
            {(moodCorrelationData.filter(d => d.mood > 0).reduce((a, b) => a + b.mood, 0) / (moodCorrelationData.filter(d => d.mood > 0).length || 1) / (habits.length / 5)).toFixed(1)}
          </h3>
          <p className="text-xs text-stone-500 mt-2 font-bold relative z-10">30-Day Index</p>
        </div>
        <div className="glass-card p-6 rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl -mr-8 -mt-8 group-hover:bg-purple-500/20 transition-colors"></div>
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 relative z-10">Knowledge Base</p>
          <h3 className="text-4xl font-black text-purple-600 relative z-10">Saved</h3>
          <p className="text-xs text-stone-500 mt-2 font-bold relative z-10">Snippets & Logs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[32px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-teal-300"></div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-stone-800">Protocol Frequency</h3>
            <span className="p-2 bg-teal-50 rounded-xl text-teal-600 shadow-sm">{ICONS.Trending}</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={habitFrequencyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(231, 229, 228, 0.5)" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} tick={{ fill: '#78716c', fontSize: 11, fontWeight: 700 }} />
                <Tooltip cursor={{ fill: '#fafaf9' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)' }} />
                <Bar dataKey="count" fill="#14b8a6" radius={[0, 8, 8, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-[32px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-300"></div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-stone-800">Correlation Matrix</h3>
            <span className="p-2 bg-orange-50 rounded-xl text-orange-600 shadow-sm">{ICONS.Smile}</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moodCorrelationData}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorHabits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 10, fontWeight: 700 }} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)' }} />
                <Area type="monotone" dataKey="mood" stroke="#f59e0b" fillOpacity={1} fill="url(#colorMood)" strokeWidth={3} />
                <Area type="monotone" dataKey="habits" stroke="#14b8a6" fillOpacity={1} fill="url(#colorHabits)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass p-8 rounded-[32px] overflow-hidden">
          <h3 className="text-lg font-black text-stone-800 mb-6">Growth Vector (30d)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="rgba(231, 229, 228, 0.5)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#78716c', fontSize: 10, fontWeight: 700 }} />
                <Radar name="Activity" dataKey="A" stroke="#14b8a6" strokeWidth={2} fill="#14b8a6" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-[32px] p-10 text-white md:col-span-2 relative overflow-hidden flex flex-col justify-center border border-stone-700/50 shadow-2xl shadow-stone-900/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-teal-500/20 rounded-lg backdrop-blur-md border border-teal-400/30">
                {ICONS.Knowledge}
              </div>
              <h2 className="text-2xl font-black tracking-tight">AI Insight Engine</h2>
            </div>
            <p className="text-stone-300 mb-8 max-w-lg text-lg leading-relaxed font-medium">
              {consistencyScore > 70
                ? "Your consistency vector allows for increased load. Recommended: Introduce complex DSA patterns to leverage current momentum."
                : "Variance detected. Optimization strategy: Couple 'Tech Reading' with 'DSA Practice' to reinforce neural pathways."}
            </p>
            <div className="flex gap-4">
              <div className="px-5 py-3 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                <p className="text-[10px] font-bold uppercase tracking-widest text-teal-300 mb-1">Confidence</p>
                <p className="font-black text-xl">88.4%</p>
              </div>
              <div className="px-5 py-3 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                <p className="text-[10px] font-bold uppercase tracking-widest text-teal-300 mb-1">State</p>
                <p className="font-black text-xl">Flow</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
