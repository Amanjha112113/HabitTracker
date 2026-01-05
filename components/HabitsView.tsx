
import React, { useState, useMemo } from 'react';
import { Habit } from '../types';
import { ICONS } from '../constants';
import { startOfMonth, format, eachDayOfInterval, endOfMonth } from 'date-fns';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface HabitsViewProps {
  habits: Habit[];
  toggleHabit: (id: string, date: string) => void;
  addHabit: (name: string, emoji: string) => void;
}

const HabitsView: React.FC<HabitsViewProps> = ({ habits, toggleHabit, addHabit }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Habit Architecture</h2>
          <p className="text-gray-500">Systematically building consistency</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          {ICONS.Plus} Create Habit
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4">
            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all">{ICONS.Left}</button>
            <h3 className="text-lg font-bold text-gray-800 w-40 text-center">{format(currentDate, 'MMMM yyyy')}</h3>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all">{ICONS.Right}</button>
          </div>
          <div className="hidden sm:flex gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-indigo-600" /> Done</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded border border-gray-300" /> Pending</div>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="sticky left-0 bg-white z-20 p-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 min-w-[200px]">System / Routine</th>
                {days.map(day => (
                  <th key={day.toString()} className="p-3 text-center text-[10px] font-bold text-gray-400 border-r border-gray-50 min-w-[40px]">
                    <div className="mb-1">{format(day, 'EEEEE')}</div>
                    <div className="text-gray-900 text-sm">{format(day, 'd')}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {habits.map((habit) => (
                <tr key={habit.id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="sticky left-0 bg-white group-hover:bg-indigo-50/20 z-10 p-5 border-r border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl drop-shadow-sm">{habit.emoji}</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-700">{habit.name}</span>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">{habit.category}</span>
                      </div>
                    </div>
                  </td>
                  {days.map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isCompleted = habit.completions.includes(dateStr);
                    return (
                      <td key={dateStr} className="p-2 text-center border-r border-gray-50">
                        <button 
                          onClick={() => toggleHabit(habit.id, dateStr)}
                          className={`w-7 h-7 rounded-lg border transition-all flex items-center justify-center ${
                            isCompleted 
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100' 
                              : 'border-gray-200 bg-white hover:border-indigo-300'
                          }`}
                        >
                          {isCompleted && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          {ICONS.Trending} Consistency Waveform
        </h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" hide />
              <YAxis hide domain={[0, habits.length || 5]} />
              <Tooltip labelStyle={{color: '#6366f1', fontWeight: 'bold'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fill="url(#colorWave)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Deploy New Habit</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="Routine name (e.g. LLM Research)"
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                autoFocus
              />
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all">Cancel</button>
              <button onClick={() => { if(newHabitName) { addHabit(newHabitName, '🧠'); setNewHabitName(''); setShowAddModal(false); } }} className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Add Habit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitsView;
