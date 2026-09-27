import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="h-[56px] relative flex items-center justify-center">
        <button onClick={() => navigate('/home')} className="absolute left-0 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xs active:opacity-70">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="2.2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h1 className="text-xl font-bold text-[#111111]">Notes</h1>
      </div>

      <div className="rounded-2xl p-4 bg-white shadow-sm space-y-2">
        <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-[#FEF0E6] text-[#F07820]">Grammar</span>
        <h3 className="text-sm font-bold text-[#111111]">HSK 3 - 把 (bǎ) Structure Usage</h3>
        <p className="text-xs text-[#888888]">Used to express an action done to a subject that changes its state or position...</p>
      </div>
    </div>
  );
};

export default NotesPage;
