
import React, { useState, useMemo } from 'react';
import { JournalEntry } from '../types';
import { ICONS, DAYS_SHORT } from '../constants';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';

interface JournalViewProps {
  entries: Record<string, JournalEntry>;
  onDateSelect: (date: string) => void;
}

const JournalView: React.FC<JournalViewProps> = ({ entries, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const stats = useMemo(() => {
    // FIX: Explicitly type allEntries to JournalEntry[] to avoid 'unknown' type inference on line 34
    const allEntries: JournalEntry[] = Object.values(entries);
    const thisMonth = allEntries.filter(e => isSameMonth(new Date(e.date), currentMonth)).length;

    // Simple streak calculation (mock)
    const streak = 1;

    return [
      { label: 'Total', value: allEntries.length, icon: ICONS.Journal, color: 'text-indigo-600' },
      { label: 'Streak', value: `${streak} days`, icon: ICONS.Trending, color: 'text-emerald-600' },
      { label: 'Best', value: `${streak} days`, icon: ICONS.Award, color: 'text-purple-600' },
      { label: 'This Month', value: thisMonth, icon: ICONS.Calendar, color: 'text-orange-600' },
    ];
  }, [entries, currentMonth]);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(new Date());

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-stone-900 tracking-tight">Mindset Journal</h2>
          <p className="text-stone-500 font-medium">Reflect on your journey, one day at a time</p>
        </div>
        <button
          onClick={() => onDateSelect(format(new Date(), 'yyyy-MM-dd'))}
          className="px-6 py-3 bg-stone-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-stone-800 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-stone-900/20"
        >
          {ICONS.Plus} New Entry
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card p-6 rounded-3xl flex flex-col gap-1 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl -mr-12 -mt-12 transition-colors ${stat.color.includes('indigo') ? 'bg-teal-500/10' :
              stat.color.includes('emerald') ? 'bg-emerald-500/10' :
                stat.color.includes('purple') ? 'bg-purple-500/10' : 'bg-orange-500/10'
              }`}></div>
            <div className="flex items-center justify-between mb-2 relative z-10">
              <span className="text-xs font-black text-stone-400 uppercase tracking-widest">{stat.label}</span>
              <span className={`${stat.color.replace('indigo', 'teal')} p-2 bg-white/50 rounded-lg`}>{stat.icon}</span>
            </div>
            <div className="text-3xl font-black text-stone-800 relative z-10">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-[32px] overflow-hidden border-0">
        <div className="p-8 border-b border-stone-200/50 flex items-center justify-between bg-white/40 backdrop-blur-md">
          <div className="flex bg-white/60 p-1.5 rounded-2xl border border-stone-200 shadow-sm">
            <button className="px-4 py-2 bg-stone-800 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-stone-800/20">{ICONS.Calendar} Calendar</button>
            <button className="px-4 py-2 text-stone-500 text-sm font-bold hover:bg-white/80 rounded-xl flex items-center gap-2 transition-all">{ICONS.Grid} Tiles</button>
            <button className="px-4 py-2 text-stone-500 text-sm font-bold hover:bg-white/80 rounded-xl flex items-center gap-2 transition-all">{ICONS.List} List</button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/60 p-1 rounded-xl border border-stone-200">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-white rounded-lg transition-all text-stone-600">{ICONS.Left}</button>
              <button onClick={handleToday} className="px-4 py-1 text-sm font-bold text-stone-600 hover:bg-white rounded-lg transition-all">Today</button>
              <button onClick={handleNextMonth} className="p-2 hover:bg-white rounded-lg transition-all text-stone-600">{ICONS.Right}</button>
            </div>
            <h3 className="text-xl font-black text-stone-800 min-w-[160px] text-center tracking-tight">{format(currentMonth, 'MMMM yyyy')}</h3>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-stone-100 bg-white/20">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="py-4 text-center text-[10px] font-black text-stone-400 uppercase tracking-widest">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 bg-white/10">
          {days.map((day, idx) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const hasEntry = !!entries[dateStr];
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <button
                key={dateStr}
                onClick={() => onDateSelect(dateStr)}
                className={`group min-h-[140px] p-4 border-r border-b border-stone-100 text-left transition-all duration-300 relative overflow-hidden outline-none ${!isCurrentMonth ? 'bg-stone-50/50 opacity-40' : 'hover:bg-white/40 focus:bg-white/60'
                  } ${idx % 7 === 6 ? 'border-r-0' : ''}`}
              >
                {hasEntry && <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent pointer-events-none" />}

                <div className="flex justify-between items-start relative z-10">
                  <span className={`text-sm font-bold transition-all ${isToday
                    ? 'bg-stone-900 text-white w-8 h-8 flex items-center justify-center rounded-xl shadow-lg shadow-stone-900/20 scale-110'
                    : 'text-stone-400 group-hover:text-stone-600'
                    }`}>
                    {format(day, 'd')}
                  </span>
                  {hasEntry && (
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full shadow-lg shadow-teal-500/30 animate-pulse-soft" />
                  )}
                </div>
                {hasEntry && entries[dateStr].mood && (
                  <div className="mt-4 flex flex-col gap-2 relative z-10">
                    <div className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform origin-left">
                      {entries[dateStr].mood === 'happy' && '😊'}
                      {entries[dateStr].mood === 'neutral' && '😐'}
                      {entries[dateStr].mood === 'calm' && '😌'}
                      {entries[dateStr].mood === 'sad' && '😔'}
                      {entries[dateStr].mood === 'crying' && '😢'}
                    </div>
                    <div className="h-1 w-12 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-400 w-2/3"></div>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JournalView;
