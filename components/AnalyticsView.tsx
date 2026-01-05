
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Consistency Score</p>
          <h3 className="text-3xl font-black text-indigo-600">{consistencyScore}%</h3>
          <p className="text-xs text-gray-400 mt-2">Overall habit adherence</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Active Habits</p>
          <h3 className="text-3xl font-black text-emerald-600">{habits.length}</h3>
          <p className="text-xs text-gray-400 mt-2">Currently being tracked</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Mood Avg (30d)</p>
          <h3 className="text-3xl font-black text-orange-600">
            {(moodCorrelationData.filter(d => d.mood > 0).reduce((a, b) => a + b.mood, 0) / (moodCorrelationData.filter(d => d.mood > 0).length || 1) / (habits.length / 5)).toFixed(1)}
          </h3>
          <p className="text-xs text-gray-400 mt-2">Emotional stability</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Knowledge Assets</p>
          <h3 className="text-3xl font-black text-purple-600">Saved</h3>
          <p className="text-xs text-gray-400 mt-2">Snippets & Logs stored</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-800">Habit Frequency</h3>
            <span className="text-indigo-600">{ICONS.Trending}</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={habitFrequencyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} tick={{fill: '#64748b', fontSize: 11}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-800">Habit-Mood Correlation</h3>
            <span className="text-orange-600">{ICONS.Smile}</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moodCorrelationData}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHabits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="mood" stroke="#f59e0b" fillOpacity={1} fill="url(#colorMood)" strokeWidth={2} />
                <Area type="monotone" dataKey="habits" stroke="#6366f1" fillOpacity={1} fill="url(#colorHabits)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Growth Vector (30d)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} />
                  <Radar name="Activity" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-indigo-900 rounded-3xl p-8 text-white md:col-span-2 relative overflow-hidden flex flex-col justify-center">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Dev Intelligence Insight</h2>
              <p className="text-indigo-200 mb-6 max-w-md">
                {consistencyScore > 70 
                  ? "Your coding consistency is high. Consider increasing the complexity of your DSA problems to maintain cognitive load."
                  : "Try to link your 'Tech Reading' with your 'DSA Practice' to build a stronger mental model of new concepts."}
              </p>
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                   <p className="text-xs opacity-60">ML Confidence</p>
                   <p className="font-bold">88.4%</p>
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                   <p className="text-xs opacity-60">Focus Quality</p>
                   <p className="font-bold">High</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4 scale-150">
               {ICONS.Knowledge}
            </div>
         </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
