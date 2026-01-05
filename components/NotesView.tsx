
import React, { useState, useMemo } from 'react';
import { DevNote } from '../types';
import { ICONS } from '../constants';
import { format } from 'date-fns';

interface NotesViewProps {
  notes: DevNote[];
  onSave: (note: DevNote) => void;
  onDelete: (id: string) => void;
}

const NotesView: React.FC<NotesViewProps> = ({ notes, onSave, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<DevNote | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState<DevNote['category'] | 'All'>('All');

  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            n.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === 'All' || n.category === filter;
      return matchesSearch && matchesFilter;
    });
  }, [notes, searchQuery, filter]);

  const handleCreateNew = () => {
    const newNote: DevNote = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      category: 'Snippet',
      content: '',
      tags: [],
      createdAt: new Date().toISOString()
    };
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (selectedNote && selectedNote.title) {
      onSave(selectedNote);
      setIsEditing(false);
    }
  };

  const categories = ['All', 'Snippet', 'Research', 'ChatLog', 'General'];

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dev Knowledge Base</h2>
          <p className="text-gray-500">Store and search your research, snippets and logs</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          {ICONS.Plus} New Resource
        </button>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden min-h-0">
        {/* Sidebar List */}
        <div className="w-80 flex flex-col gap-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{ICONS.Search}</span>
            <input 
              type="text" 
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  filter === c ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
            {filteredNotes.map(note => (
              <button
                key={note.id}
                onClick={() => { setSelectedNote(note); setIsEditing(false); }}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedNote?.id === note.id 
                    ? 'bg-white border-indigo-600 shadow-md ring-1 ring-indigo-600' 
                    : 'bg-white border-gray-100 hover:border-indigo-200'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    note.category === 'Snippet' ? 'bg-blue-50 text-blue-600' :
                    note.category === 'ChatLog' ? 'bg-emerald-50 text-emerald-600' :
                    note.category === 'Research' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {note.category}
                  </span>
                  <span className="text-[10px] text-gray-400">{format(new Date(note.createdAt), 'MMM dd')}</span>
                </div>
                <h4 className="font-bold text-gray-900 truncate">{note.title || 'Untitled Note'}</h4>
                <p className="text-xs text-gray-400 line-clamp-2 mt-1">{note.content}</p>
              </button>
            ))}
            {filteredNotes.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <p className="text-sm">No items found</p>
              </div>
            )}
          </div>
        </div>

        {/* Note Content Area */}
        <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          {selectedNote ? (
            <>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={selectedNote.title}
                    onChange={(e) => setSelectedNote({...selectedNote, title: e.target.value})}
                    placeholder="Enter resource title..."
                    className="flex-1 text-xl font-bold text-gray-900 focus:outline-none placeholder-gray-300"
                  />
                ) : (
                  <h3 className="text-xl font-bold text-gray-900">{selectedNote.title}</h3>
                )}
                <div className="flex items-center gap-3">
                  {!isEditing ? (
                    <>
                      <button onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        {ICONS.Settings}
                      </button>
                      <button onClick={() => onDelete(selectedNote.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        {ICONS.Trash}
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl">Cancel</button>
                      <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-md">Save Changes</button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="p-6 bg-gray-50 flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">Category:</span>
                  {isEditing ? (
                    <select 
                      value={selectedNote.category}
                      onChange={(e) => setSelectedNote({...selectedNote, category: e.target.value as any})}
                      className="bg-white border border-gray-200 text-xs px-2 py-1 rounded"
                    >
                      <option>Snippet</option>
                      <option>Research</option>
                      <option>ChatLog</option>
                      <option>General</option>
                    </select>
                  ) : (
                    <span className="text-xs font-bold text-indigo-600">{selectedNote.category}</span>
                  )}
                </div>
                <div className="h-4 w-[1px] bg-gray-200" />
                <div className="flex items-center gap-2">
                   {ICONS.Calendar}
                   <span className="text-xs text-gray-500">{format(new Date(selectedNote.createdAt), 'EEEE, MMMM d, yyyy')}</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {isEditing ? (
                  <textarea
                    value={selectedNote.content}
                    onChange={(e) => setSelectedNote({...selectedNote, content: e.target.value})}
                    placeholder="Paste your code snippet, research notes, or chat logs here..."
                    className="w-full h-full resize-none focus:outline-none text-gray-700 leading-relaxed font-mono text-sm bg-transparent"
                  />
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <pre className="bg-gray-900 text-indigo-300 p-6 rounded-2xl overflow-x-auto font-mono text-sm leading-relaxed border border-indigo-500/20 shadow-xl">
                      <code>{selectedNote.content || 'No content provided.'}</code>
                    </pre>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-400">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-300 rounded-full flex items-center justify-center mb-6">
                 {ICONS.Knowledge}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Build Your Knowledge Base</h3>
              <p className="max-w-xs text-sm">Select a resource from the list or create a new one to store snippets, research logs, and AI chats for future use.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesView;
