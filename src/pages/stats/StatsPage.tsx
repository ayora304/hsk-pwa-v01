import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const StatsPage: React.FC = () => {
  useEffect(() => {
    document.body.style.backgroundColor = '#F07820';
    document.documentElement.style.backgroundColor = '#F07820';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#F07820');
  }, []);

  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full max-w-[600px] mx-auto animate-in fade-in duration-300 relative min-h-screen pb-28">
      {/* PINNED STICKY HEADER */}
      <div className="sticky top-0 z-20 w-full pt-[max(12px,env(safe-area-inset-top))] pb-3 mb-4 bg-transparent">
        <div className="absolute -top-[500px] -left-8 -right-8 bottom-0 bg-gradient-to-b from-[#F07820] via-[#FFF0E5] to-white/95 pointer-events-none -z-10 rounded-b-[24px]" />
        <div className="flex items-center gap-4 px-1">
          <button 
            onClick={() => navigate(-1)} 
            className="w-[44px] h-[44px] flex items-center justify-center bg-white border border-[#EEEEEE] rounded-full active:scale-95 transition-transform shadow-sm cursor-pointer"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h1 className="text-[28px] font-bold text-[#111111] tracking-tight">Your Progress</h1>
        </div>
      </div>

      {/* Cards Scroll Under Pinned Header */}
      <div className="space-y-4 px-1">
        <div className="p-5 rounded-[24px] bg-white border border-[#EEEEEE] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-[#888888] font-medium uppercase tracking-wider mb-1">Total Study Time</p>
            <h2 className="text-3xl font-bold text-[#111111]">14h 25m</h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0E5] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 16 14"></polyline>
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-[24px] bg-white border border-[#EEEEEE] shadow-sm">
            <p className="text-xs text-[#888888] font-medium uppercase tracking-wider mb-1">Words Learned</p>
            <h3 className="text-2xl font-bold text-[#111111]">342</h3>
          </div>
          <div className="p-5 rounded-[24px] bg-white border border-[#EEEEEE] shadow-sm">
            <p className="text-xs text-[#888888] font-medium uppercase tracking-wider mb-1">Streak</p>
            <h3 className="text-2xl font-bold text-[#F07820]">7 Days 🔥</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
