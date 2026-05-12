
import React, { useState, useMemo } from 'react';
import { Habit } from '../types';
import { ICONS } from '../constants';
import { startOfMonth, format, eachDayOfInterval, endOfMonth } from 'date-fns';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface HabitsViewProps {
  habits: Habit[];
  toggleHabit: (id: string, date: string) => void;
  addHabit: (name: string, emoji: string, category: any) => void;
  deleteHabit: (id: string) => void;
}

const HabitsView: React.FC<HabitsViewProps> = ({ habits, toggleHabit, addHabit, deleteHabit }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Habit Form State
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitEmoji, setNewHabitEmoji] = useState('🚀');
  const [newHabitCategory, setNewHabitCategory] = useState<any>('Productivity');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const progressData = useMemo(() => {
    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const count = habits.reduce((acc, h) => acc + (h.completions.includes(dateStr) ? 1 : 0), 0);
      return { name: format(day, 'dd'), count };
    });
  }, [habits, days]);

  const changeMonth = (offset: number) => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + offset);
    setCurrentDate(next);
  };

  const CATEGORIES = ['Productivity', 'Health', 'Learning', 'Code', 'Mental'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-stone-900 tracking-tight">System Architecture</h2>
          <p className="text-stone-500 font-medium">Daily consistency protocols</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-stone-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-stone-800 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-stone-900/20"
        >
          {ICONS.Plus} New Protocol
        </button>
      </div>

      <div className="glass rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="p-6 border-b border-stone-200/50 flex items-center justify-between bg-white/40 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white/60 rounded-lg transition-all text-stone-600">{ICONS.Left}</button>
            <h3 className="text-xl font-black text-stone-800 w-48 text-center tracking-tight">{format(currentDate, 'MMMM yyyy')}</h3>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white/60 rounded-lg transition-all text-stone-600">{ICONS.Right}</button>
          </div>
          <div className="hidden sm:flex gap-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]" /> Complete</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full border border-stone-300 bg-stone-100" /> Pending</div>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar relative z-10">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-stone-200/50 bg-white/30">
                <th className="sticky left-0 bg-white/80 backdrop-blur-md z-20 p-6 text-left text-xs font-bold text-stone-500 uppercase tracking-widest border-r border-stone-100 min-w-[240px]">Active Protocols</th>
                {days.map(day => (
                  <th key={day.toString()} className="p-3 text-center border-r border-stone-100/50 min-w-[44px] group hover:bg-white/50 transition-colors cursor-default">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-stone-400 uppercase">{format(day, 'EEEEE')}</span>
                      <span className={`text-sm font-bold w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-300 ${format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'bg-stone-900 text-white shadow-lg shadow-stone-800/30 scale-110' : 'text-stone-700 group-hover:bg-stone-100'}`}>
                        {format(day, 'd')}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {habits.map((habit) => (
                <tr key={habit.id} className="hover:bg-teal-50/20 transition-colors group/row">
                  <td className="sticky left-0 bg-white/60 backdrop-blur-md group-hover:bg-white/90 transition-colors z-10 p-5 border-r border-stone-100 shadow-[4px_0_24px_rgba(0,0,0,0.01)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300 cursor-default ring-1 ring-stone-900/5">
                          {habit.emoji}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-stone-900 group-hover/row:text-teal-900 transition-colors">{habit.name}</span>
                          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide bg-stone-100 px-2.5 py-1 rounded-full w-fit mt-1 border border-stone-200">{habit.category}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); if (confirm('Delete this habit?')) deleteHabit(habit.id); }}
                        className="text-stone-300 hover:text-red-500 opacity-0 group-hover/row:opacity-100 transition-all p-2 hover:bg-red-50 rounded-lg"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                  {days.map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isCompleted = habit.completions.includes(dateStr);
                    return (
                      <td key={dateStr} className="p-2 text-center border-r border-stone-100/50 relative">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => toggleHabit(habit.id, dateStr)}
                            className={`w-9 h-9 rounded-xl transition-all duration-300 flex items-center justify-center transform focus:outline-none ${isCompleted
                              ? 'bg-gradient-to-br from-teal-400 to-teal-500 shadow-lg shadow-teal-500/30 scale-100'
                              : 'bg-white border-[2.5px] border-stone-200 hover:border-teal-300 hover:bg-teal-50/20 scale-90 hover:scale-100'
                              }`}
                          >
                            <svg
                              className={`w-5 h-5 text-blue-700 transition-all duration-300 ${isCompleted ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-teal-50/30 to-transparent -z-10"></div>
        <h3 className="text-lg font-black text-stone-800 mb-6 flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 rounded-lg text-teal-600">{ICONS.Trending}</div>
          Momentum Visualizer
        </h3>
        <div className="h-56 w-full -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" hide />
              <YAxis hide domain={[0, 'auto']} />
              <Tooltip
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)' }}
                itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="url(#strokeGradient)"
                strokeWidth={4}
                fill="url(#colorWave)"
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-8 relative overflow-hidden ring-1 ring-white/50">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-rose-500"></div>
            <h3 className="text-2xl font-black text-stone-900 mb-2">Deploy New Protocol</h3>
            <p className="text-stone-500 mb-8">What habit do you want to install?</p>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1 mb-2 block">Protocol Name</label>
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="e.g. Deep Work Session"
                  className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl font-bold text-stone-800 placeholder:text-stone-400 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1 mb-2 block">Category</label>
                  <select
                    value={newHabitCategory}
                    onChange={(e) => setNewHabitCategory(e.target.value)}
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl font-bold text-stone-800 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none appearance-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1 mb-2 block">Icon (Emoji)</label>
                  <input
                    type="text"
                    value={newHabitEmoji}
                    onChange={(e) => setNewHabitEmoji(e.target.value)}
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl font-bold text-stone-800 text-center placeholder:text-stone-400 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none"
                    placeholder="🚀"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-4 text-stone-500 font-bold hover:bg-stone-100/80 rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newHabitName) {
                    addHabit(newHabitName, newHabitEmoji || '🚀', newHabitCategory);
                    setNewHabitName('');
                    setNewHabitEmoji('🚀');
                    setShowAddModal(false);
                  }
                }}
                className="flex-1 py-4 bg-stone-900 text-white font-bold rounded-2xl shadow-xl shadow-stone-900/20 hover:bg-stone-800 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Initialize
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitsView;
