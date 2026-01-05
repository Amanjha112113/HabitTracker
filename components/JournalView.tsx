
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
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Journal</h2>
          <p className="text-gray-500">Reflect on your journey, one day at a time</p>
        </div>
        <button 
          onClick={() => onDateSelect(format(new Date(), 'yyyy-MM-dd'))}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          {ICONS.Plus} New Entry
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
              <span className={stat.color}>{stat.icon}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex bg-white p-1 rounded-xl border border-gray-100">
            <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg flex items-center gap-2">{ICONS.Calendar} Calendar</button>
            <button className="px-4 py-2 text-gray-500 text-sm font-medium hover:bg-gray-50 rounded-lg flex items-center gap-2">{ICONS.Grid} Tiles</button>
            <button className="px-4 py-2 text-gray-500 text-sm font-medium hover:bg-gray-50 rounded-lg flex items-center gap-2">{ICONS.List} List</button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-lg">{ICONS.Left}</button>
              <button onClick={handleToday} className="px-3 py-1 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg">Today</button>
              <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg">{ICONS.Right}</button>
            </div>
            <h3 className="text-lg font-bold text-gray-800 min-w-[140px] text-center">{format(currentMonth, 'MMMM yyyy')}</h3>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-gray-100">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const hasEntry = !!entries[dateStr];
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <button
                key={dateStr}
                onClick={() => onDateSelect(dateStr)}
                className={`group min-h-[140px] p-4 border-r border-b border-gray-100 text-left transition-all hover:bg-indigo-50/30 ${
                  !isCurrentMonth ? 'bg-gray-50/50 opacity-40' : 'bg-white'
                } ${idx % 7 === 6 ? 'border-r-0' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-bold ${
                    isToday ? 'bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full' : 'text-gray-400'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {hasEntry && (
                    <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-lg shadow-indigo-200" />
                  )}
                </div>
                {hasEntry && entries[dateStr].mood && (
                   <div className="mt-2 text-2xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                      {entries[dateStr].mood === 'happy' && '😊'}
                      {entries[dateStr].mood === 'neutral' && '😐'}
                      {entries[dateStr].mood === 'calm' && '😌'}
                      {entries[dateStr].mood === 'sad' && '😔'}
                      {entries[dateStr].mood === 'crying' && '😢'}
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
