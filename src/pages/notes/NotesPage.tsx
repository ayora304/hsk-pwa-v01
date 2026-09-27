import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NoteItem {
  id: string;
  title: string;
  date: string;
  duration: string;
  type: 'video' | 'audio' | 'folder' | 'flashcard';
  tag: string;
  isNew?: boolean;
}

export const NotesPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All tags');
  const [tags, setTags] = useState<string[]>(['All tags', 'HSK 1', 'Grammar', 'Audio', 'Business']);

  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showCreateTagModal, setShowCreateTagModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newNoteType, setNewNoteType] = useState<'video' | 'audio' | 'folder' | 'flashcard'>('folder');
  const [newNoteTag, setNewNoteTag] = useState('HSK 1');
  const [newTagName, setNewTagName] = useState('');

  const [notes, setNotes] = useState<NoteItem[]>([
    {
      id: '1',
      title: 'HSK 1 Grammar & Sentence Patterns',
      date: '30 Jun, 2026',
      duration: '00:04:59',
      type: 'video',
      tag: 'Grammar',
      isNew: true
    },
    {
      id: '2',
      title: 'Pronunciation & Tones Audio Practice',
      date: '12 Jul, 2026',
      duration: '00:01:52',
      type: 'audio',
      tag: 'Audio'
    },
    {
      id: '3',
      title: 'Measure Words (个, 本, 只) Deck',
      date: '12 Jul, 2026',
      duration: '14 Cards',
      type: 'flashcard',
      tag: 'HSK 1'
    },
    {
      id: '4',
      title: 'Progress in the Profession Vocabulary',
      date: '15 Jul, 2026',
      duration: '00:05:12',
      type: 'folder',
      tag: 'Business'
    }
  ]);

  useEffect(() => {
    document.body.style.backgroundColor = '#FFF0E5';
    document.documentElement.style.backgroundColor = '#FFF0E5';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#FFF0E5');
  }, []);

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'All tags' || note.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  const handleCreateTag = () => {
    const trimmed = newTagName.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setSelectedTag(trimmed);
      setNewTagName('');
      setShowCreateTagModal(false);
    }
  };

  const handleAddNote = () => {
    if (!newTitle.trim()) return;
    const newNote: NoteItem = {
      id: Date.now().toString(),
      title: newTitle,
      date: 'Today',
      duration: newNoteType === 'flashcard' ? '10 Cards' : '00:03:15',
      type: newNoteType,
      tag: newNoteTag,
      isNew: true
    };
    setNotes([newNote, ...notes]);
    setNewTitle('');
    setShowAddNoteModal(false);
  };

  return (
    <div className="w-full relative pb-32 min-h-screen">
      <div className="fixed top-0 inset-x-0 w-full max-w-[1200px] mx-auto z-50 bg-[#FFF0E5] pt-[env(safe-area-inset-top)]">
        <div className="px-[24px] md:px-[30px] py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm active:scale-95 transition-transform cursor-pointer"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" className="mr-0.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h1 className="font-bold text-[24px] text-[#111111]">My notes</h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-[#F07820] text-white px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer">
              <span>👑</span> Get Pro
            </button>
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm active:scale-95 transition-transform cursor-pointer text-[#111111]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="w-full h-[calc(72px+env(safe-area-inset-top))]" />

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white rounded-2xl px-4 py-3 shadow-sm border border-[#EEEEEE] flex items-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent text-[15px] font-medium text-[#111111] focus:outline-none placeholder-[#999999]"
            />
          </div>
          <button className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-[#EEEEEE] flex items-center justify-center cursor-pointer active:scale-95 transition-transform text-[#111111]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setShowCreateTagModal(true)}
            className="text-xs font-bold text-[#F07820] bg-[#FFF0E5] border border-[#FCD8BE] px-3.5 py-2 rounded-xl whitespace-nowrap shadow-xs active:scale-95 transition-transform cursor-pointer shrink-0 flex items-center gap-1"
          >
            <span>+</span> Create tag
          </button>

          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                selectedTag === tag
                  ? 'bg-[#333333] text-white shadow-xs'
                  : 'bg-white text-[#666666] border border-[#EEEEEE] shadow-xs'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="space-y-3 pt-1">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-[24px] border border-[#EEEEEE] shadow-sm">
              <p className="text-sm font-semibold text-[#888888]">No notes found in "{selectedTag}".</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="relative bg-white rounded-[22px] p-4 shadow-sm border border-[#EEEEEE] flex items-center justify-between gap-3 active:scale-[0.99] transition-transform cursor-pointer"
              >
                {note.isNew && (
                  <span className="absolute -top-2.5 right-6 text-[10px] font-extrabold text-[#2563EB] bg-[#DBEAFE] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    NEW
                  </span>
                )}

                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    note.type === 'video' ? 'bg-[#FFE5E5] text-[#EF4444]' :
                    note.type === 'audio' ? 'bg-[#EFF6FF] text-[#2563EB]' :
                    note.type === 'flashcard' ? 'bg-[#F3E8FF] text-[#7C3AED]' : 'bg-[#FEF0E6] text-[#F07820]'
                  }`}>
                    {note.type === 'video' && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    )}
                    {note.type === 'audio' && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                    )}
                    {note.type === 'flashcard' && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /></svg>
                    )}
                    {note.type === 'folder' && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-[15px] text-[#111111] truncate">{note.title}</h3>
                    <p className="text-xs text-[#888888] font-medium mt-0.5">
                      {note.date} <span className="mx-1">•</span> {note.duration} <span className="mx-1">•</span> <span className="text-[#F07820] font-bold">{note.tag}</span>
                    </p>
                  </div>
                </div>

                <button className="p-2 text-[#AAAAAA] hover:text-[#111111] active:scale-90 transition-transform cursor-pointer shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="fixed bottom-6 inset-x-0 w-full max-w-[1200px] mx-auto z-40 flex justify-center px-4">
        <button
          onClick={() => setShowAddNoteModal(true)}
          className="bg-[#F07820] text-white px-8 py-3.5 rounded-full font-bold text-[16px] shadow-lg shadow-[#F07820]/30 active:scale-95 transition-transform cursor-pointer flex items-center gap-2 border-2 border-white"
        >
          <span className="text-xl leading-none">+</span> Add Note
        </button>
      </div>

      {showCreateTagModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[380px] rounded-[28px] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[18px] text-[#111111]">Create New Tag Filter</h3>
              <button onClick={() => setShowCreateTagModal(false)} className="text-[#888888] font-bold cursor-pointer">✕</button>
            </div>
            <p className="text-xs text-[#888888]">Add custom tag categories to organize your study notes.</p>
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Tag name (e.g. Vocabulary, HSK 2)..."
              className="w-full p-3.5 bg-[#F9F9F9] border border-[#EEEEEE] rounded-2xl text-sm font-semibold text-[#111111] focus:outline-none focus:border-[#F07820]"
            />
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCreateTagModal(false)}
                className="flex-1 py-3 bg-[#F5F5F5] rounded-xl font-bold text-sm text-[#666666] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTag}
                className="flex-1 py-3 bg-[#F07820] rounded-xl font-bold text-sm text-white shadow-md cursor-pointer"
              >
                Add Tag
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddNoteModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[420px] rounded-[28px] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[18px] text-[#111111]">Create New Study Note</h3>
              <button onClick={() => setShowAddNoteModal(false)} className="text-[#888888] font-bold cursor-pointer">✕</button>
            </div>

            <div>
              <label className="text-xs font-bold text-[#888888] uppercase">Note Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter note title..."
                className="w-full mt-1 p-3.5 bg-[#F9F9F9] border border-[#EEEEEE] rounded-2xl text-sm font-semibold text-[#111111] focus:outline-none focus:border-[#F07820]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#888888] uppercase">Media Type</label>
              <div className="grid grid-cols-4 gap-2 mt-1.5">
                {[
                  { id: 'folder', label: 'Folder' },
                  { id: 'video', label: 'Video' },
                  { id: 'audio', label: 'Audio' },
                  { id: 'flashcard', label: 'Cards' }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setNewNoteType(type.id as any)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      newNoteType === type.id
                        ? 'bg-[#F07820] text-white border-[#F07820]'
                        : 'bg-[#F9F9F9] text-[#666666] border-[#EEEEEE]'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#888888] uppercase">Assign Tag</label>
              <select
                value={newNoteTag}
                onChange={(e) => setNewNoteTag(e.target.value)}
                className="w-full mt-1 p-3.5 bg-[#F9F9F9] border border-[#EEEEEE] rounded-2xl text-sm font-semibold text-[#111111] focus:outline-none focus:border-[#F07820]"
              >
                {tags.filter(t => t !== 'All tags').map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAddNoteModal(false)}
                className="flex-1 py-3 bg-[#F5F5F5] rounded-xl font-bold text-sm text-[#666666] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                className="flex-1 py-3 bg-[#F07820] rounded-xl font-bold text-sm text-white shadow-md cursor-pointer"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
