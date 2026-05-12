import { useState } from 'react';
import { Search, Plus, Trash2, Save, Code, FileText, BookOpen } from 'lucide-react';
import { DevNote } from '../types';

interface NotesViewProps {
  notes: DevNote[];
  onSave: (note: DevNote) => void;
  onDelete: (id: string) => void;
}

export default function NotesView({ notes, onSave, onDelete }: NotesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState<{ title: string; content: string; type: 'snippet' | 'log' | 'research' }>({ title: '', content: '', type: 'snippet' });

  // Remove persistence effect as it's handled in App.tsx
  // useEffect(() => { ... }, [notes]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const note: DevNote = {
      id: editingId || Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      type: newNote.type,
      createdAt: editingId ? notes.find(n => n.id === editingId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
    };

    onSave(note);
    setNewNote({ title: '', content: '', type: 'snippet' });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleEdit = (note: DevNote) => {
    setNewNote({ title: note.title, content: note.content, type: note.type });
    setEditingId(note.id);
    setIsCreating(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    if (editingId === id) {
      setIsCreating(false);
      setEditingId(null);
      setNewNote({ title: '', content: '', type: 'snippet' });
    }
  };


  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-stone-800 tracking-tight">Knowledge Base</h1>
          <p className="text-stone-500 font-medium">Second Brain for Engineering</p>
        </div>
        <button
          onClick={() => {
            if (isCreating) {
              setIsCreating(false);
              setEditingId(null);
              setNewNote({ title: '', content: '', type: 'snippet' });
            } else {
              setIsCreating(true);
            }
          }}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-xl shadow-stone-900/10 active:scale-95 ${isCreating
            ? 'bg-stone-100 text-stone-600 hover:bg-stone-200 shadow-none'
            : 'bg-stone-800 text-white hover:bg-stone-700 hover:scale-105'
            }`}
        >
          {isCreating ? 'Cancel Entry' : (
            <>
              <Plus className="w-5 h-5" />
              New Resource
            </>
          )}
        </button>
      </div>

      <div className="relative z-20">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
        <input
          type="text"
          placeholder="Search snippets, logs, and research nodes..."
          className="w-full pl-12 pr-4 py-4 glass rounded-2xl border border-white/40 focus:outline-none focus:ring-4 focus:ring-teal-500/10 text-stone-800 placeholder:text-stone-400 font-medium transition-shadow hover:shadow-lg hover:shadow-teal-500/5 focus:shadow-xl focus:shadow-teal-500/10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isCreating && (
        <div className="glass-card p-8 rounded-[32px] animate-in slide-up-fade relative overflow-hidden border border-white/60">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

          <div className="flex justify-between items-start mb-6">
            <input
              className="flex-1 text-2xl font-black bg-transparent placeholder-stone-300 border-none focus:ring-0 p-0 text-stone-800"
              placeholder="Untitled Resource..."
              value={newNote.title}
              onChange={e => setNewNote({ ...newNote, title: e.target.value })}
              autoFocus
            />
          </div>

          <div className="flex gap-3 mb-6">
            {(['snippet', 'log', 'research'] as const).map(type => (
              <label key={type} className={`group flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer text-sm font-bold transition-all border ${newNote.type === type
                ? 'bg-teal-500 text-white border-teal-500 shadow-lg shadow-teal-500/30 scale-105'
                : 'bg-white/50 text-stone-500 border-white/50 hover:bg-white hover:border-teal-200'
                }`}>
                <input
                  type="radio"
                  name="type"
                  className="hidden"
                  checked={newNote.type === type}
                  onChange={() => setNewNote({ ...newNote, type })}
                />
                {type === 'snippet' && <Code className="w-4 h-4" />}
                {type === 'log' && <FileText className="w-4 h-4" />}
                {type === 'research' && <BookOpen className="w-4 h-4" />}
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-rose-500 rounded-2xl opacity-0 group-hover:opacity-10 transition duration-500 pointer-events-none"></div>
            <textarea
              className="w-full h-64 p-6 bg-stone-900 rounded-xl resize-none focus:outline-none font-mono text-sm text-stone-100 placeholder:text-stone-500 leading-relaxed shadow-inner relative z-10"
              placeholder="// Enter code snippets or technical logs..."
              value={newNote.content}
              onChange={e => setNewNote({ ...newNote, content: e.target.value })}
            />
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              disabled={!newNote.title || !newNote.content}
              className="flex items-center gap-2 px-8 py-3 bg-teal-600 text-white rounded-xl shadow-lg shadow-teal-500/30 hover:bg-teal-700 hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:shadow-none transition-all font-bold"
            >
              <Save className="w-4 h-4" />
              {editingId ? 'Update Resource' : 'Commit Resource'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNotes.map(note => (
          <div key={note.id} className="group relative p-8 glass-card rounded-[32px] hover:-translate-y-1 transition-all duration-300 cursor-pointer" onClick={() => handleEdit(note)}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/5 to-transparent rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-teal-500/10 transition-colors"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-2 rounded-xl backdrop-blur-md border border-white/50 ${note.type === 'snippet' ? 'bg-purple-50 text-purple-600' :
                note.type === 'log' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-rose-50 text-rose-600'
                }`}>
                {note.type === 'snippet' && <Code className="w-5 h-5" />}
                {note.type === 'log' && <FileText className="w-5 h-5" />}
                {note.type === 'research' && <BookOpen className="w-5 h-5" />}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-black text-stone-800 mb-4 relative z-10 line-clamp-1">{note.title}</h3>

            <div className="bg-stone-900/5 rounded-2xl p-4 mb-4 overflow-hidden relative z-10 border border-stone-900/5 group-hover:border-teal-500/20 transition-colors">
              <pre className="text-xs text-stone-600 font-mono whitespace-pre-wrap line-clamp-6 leading-relaxed">
                {note.content}
              </pre>
            </div>

            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest bg-white/50 px-2 py-1 rounded-lg">
                {note.type}
              </span>
              <span className="text-[10px] font-bold text-stone-400">
                {new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && !isCreating && (
        <div className="text-center py-20 flex flex-col items-center justify-center animate-in fade-in zoom-in-95">
          <div className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-teal-500/10 rounded-full blur-xl animate-pulse"></div>
            <BookOpen className="w-10 h-10 text-stone-400 relative z-10" />
          </div>
          <h3 className="text-xl font-black text-stone-800">Knowledge Base Empty</h3>
          <p className="text-stone-500 mt-2 max-w-xs mx-auto">Initialize your second brain by adding code snippets, research notes, or daily logs.</p>
        </div>
      )}
    </div>
  );
}