import React from 'react';
import { useNavigate } from 'react-router-dom';

export const SchedulePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/home')} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm active:opacity-70">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="2.2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-[#111111]">Schedule Detail</h1>
        <div className="w-10"></div>
      </div>

      <div className="rounded-2xl px-4 py-4 shadow-sm bg-white flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#111111]">HSK 3 Lesson 4 Module</h2>
          <p className="text-sm text-[#888888]">75% Complete</p>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
