import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Save, Code, FileText, BookOpen } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  type: 'snippet' | 'log' | 'research';
  createdAt: string;
}

export default function NotesView() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('growthpath_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse notes', e);
      }
    }
    return [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', type: 'snippet' as const });

  // Save to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('growthpath_notes', JSON.stringify(notes));
  }, [notes]);

  const handleSave = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;
    
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      type: newNote.type,
      createdAt: new Date().toISOString(),
    };
    
    setNotes([note, ...notes]);
    setNewNote({ title: '', content: '', type: 'snippet' });
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dev Knowledge Base</h1>
        <p className="text-gray-500">Store and search your research, snippets, and logs.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search your knowledge base..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Entry
        </button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-white shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-start mb-4">
            <input
              className="flex-1 text-xl font-semibold placeholder-gray-400 border-none focus:ring-0 p-0"
              placeholder="Entry Title"
              value={newNote.title}
              onChange={e => setNewNote({ ...newNote, title: e.target.value })}
              autoFocus
            />
            <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-gray-600">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex gap-4 mb-4">
            {(['snippet', 'log', 'research'] as const).map(type => (
              <label key={type} className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer text-sm font-medium transition-colors ${newNote.type === type ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                <input
                  type="radio"
                  name="type"
                  className="hidden"
                  checked={newNote.type === type}
                  onChange={() => setNewNote({ ...newNote, type })}
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>

          <textarea
            className="w-full h-48 p-4 mb-4 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="Paste code snippets, logs, or research notes here..."
            value={newNote.content}
            onChange={e => setNewNote({ ...newNote, content: e.target.value })}
          />

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={!newNote.title || !newNote.content}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save Entry
            </button>
          </div>
        </div>
      )}

      {/* Grid of Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNotes.map(note => (
          <div key={note.id} className="group relative p-6 border border-gray-200 rounded-xl bg-white hover:shadow-lg transition-all duration-200">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                {note.type === 'snippet' && <Code className="w-4 h-4 text-purple-500" />}
                {note.type === 'log' && <FileText className="w-4 h-4 text-green-500" />}
                {note.type === 'research' && <BookOpen className="w-4 h-4 text-blue-500" />}
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">{note.type}</span>
              </div>
              <button 
                onClick={() => handleDelete(note.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">{note.title}</h3>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-3 overflow-hidden">
              <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap line-clamp-6">
                {note.content}
              </pre>
            </div>

            <div className="text-xs text-gray-400">
              Added {new Date(note.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && !isCreating && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Knowledge Base is Empty</h3>
          <p className="text-gray-500 mt-1">Start building your personal developer library.</p>
        </div>
      )}
    </div>
  );
}