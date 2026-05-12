
import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { ICONS } from '../constants';
import { format, parseISO } from 'date-fns';

interface JournalEntryViewProps {
  date: string;
  entry?: JournalEntry;
  onSave: (entry: JournalEntry) => void;
  onBack: () => void;
}

const JournalEntryView: React.FC<JournalEntryViewProps> = ({ date, entry, onSave, onBack }) => {
  const [formData, setFormData] = useState<JournalEntry>(entry || {
    date,
    mood: null,
    gratitude: '',
    highlights: '',
    challenges: '',
    learning: '',
    goals: '',
    notes: '',
    lastUpdated: new Date().toISOString()
  });

  const handleSave = () => {
    onSave({ ...formData, lastUpdated: new Date().toISOString() });
    onBack();
  };

  const updateField = (field: keyof JournalEntry, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const moods = [
    { id: 'happy', emoji: '😊' },
    { id: 'neutral', emoji: '😐' },
    { id: 'calm', emoji: '😌' },
    { id: 'sad', emoji: '😔' },
    { id: 'crying', emoji: '😢' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-900 flex items-center gap-2 font-medium">
          {ICONS.Left} Back to Journal
        </button>
        <button 
          onClick={handleSave}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md"
        >
          Save Entry
        </button>
      </div>

      <div className="flex items-center gap-4">
         <h2 className="text-3xl font-bold text-gray-900">
           {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
         </h2>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Mood Selector */}
        <div className="p-8 border-b border-gray-100">
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">✨ How are you feeling today?</label>
          <div className="flex gap-4">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => updateField('mood', mood.id)}
                className={`w-16 h-16 flex items-center justify-center text-3xl rounded-2xl transition-all ${
                  formData.mood === mood.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-400'
                }`}
              >
                {mood.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Gratitude Section */}
        <div className="p-8 border-b border-gray-100 bg-gray-50/30">
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">🙏 What am I grateful for today?</label>
          <textarea
            value={formData.gratitude}
            onChange={(e) => updateField('gratitude', e.target.value)}
            placeholder="I am grateful for..."
            className="w-full h-24 bg-transparent resize-none focus:outline-none text-lg text-gray-700 placeholder-gray-300 leading-relaxed"
          />
        </div>

        {/* Highlights & Challenges */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 border-b border-gray-100">
          <div className="p-8">
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">✨ Today's Highlights</label>
            <textarea
              value={formData.highlights}
              onChange={(e) => updateField('highlights', e.target.value)}
              placeholder="What went well?"
              className="w-full h-32 bg-transparent resize-none focus:outline-none text-lg text-gray-700 placeholder-gray-300"
            />
          </div>
          <div className="p-8">
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">💪 Today's Challenges</label>
            <textarea
              value={formData.challenges}
              onChange={(e) => updateField('challenges', e.target.value)}
              placeholder="What was difficult?"
              className="w-full h-32 bg-transparent resize-none focus:outline-none text-lg text-gray-700 placeholder-gray-300"
            />
          </div>
        </div>

        {/* Learn & Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 border-b border-gray-100">
          <div className="p-8">
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">📚 What did I learn?</label>
            <textarea
              value={formData.learning}
              onChange={(e) => updateField('learning', e.target.value)}
              placeholder="Insights & realizations"
              className="w-full h-32 bg-transparent resize-none focus:outline-none text-lg text-gray-700 placeholder-gray-300"
            />
          </div>
          <div className="p-8">
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">🎯 Tomorrow's Goals</label>
            <textarea
              value={formData.goals}
              onChange={(e) => updateField('goals', e.target.value)}
              placeholder="What to accomplish?"
              className="w-full h-32 bg-transparent resize-none focus:outline-none text-lg text-gray-700 placeholder-gray-300"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="p-8">
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">📝 Additional Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="Free writing space for any thoughts..."
            className="w-full h-40 bg-transparent resize-none focus:outline-none text-lg text-gray-700 placeholder-gray-300"
          />
        </div>

        <div className="p-6 bg-gray-50 flex items-center justify-between">
           <span className="text-xs text-gray-400 font-medium italic">
             Last updated: {format(parseISO(formData.lastUpdated), 'h:mm a')}
           </span>
           <button 
             onClick={handleSave}
             className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
           >
             Save Journal Entry
           </button>
        </div>
      </div>
    </div>
  );
};

export default JournalEntryView;
