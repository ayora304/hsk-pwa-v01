import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const StatsPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = '#ffffff';
    document.documentElement.style.backgroundColor = '#ffffff';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#ffffff');
  }, []);

  return (
    <div className="w-full relative pb-24">
      <div className="fixed top-0 inset-x-0 w-full max-w-[600px] mx-auto transition-all z-50 bg-[#FFF0E5] pt-[env(safe-area-inset-top)] border-b border-[#FCD8BE]/50">
      
      
        <div className="px-4 py-3 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-[40px] h-[40px] flex items-center justify-center bg-white border border-[#EEEEEE] rounded-full shadow-sm cursor-pointer"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
          <h1 className="text-[24px] font-bold text-[#111111] tracking-tight">Your Progress</h1>
        </div>
      </div>
      <div className="w-full h-[calc(70px+env(safe-area-inset-top))]" />
      <div className="space-y-4 pt-2">
        <div className="p-5 rounded-[24px] bg-white border border-[#EEEEEE] shadow-sm flex items-center justify-between">
          <div><p className="text-xs text-[#888888] font-medium uppercase tracking-wider mb-1">Total Study Time</p><h2 className="text-3xl font-bold text-[#111111]">14h 25m</h2></div>
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0E5] flex items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 16 14"></polyline></svg></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-[24px] bg-white border border-[#EEEEEE] shadow-sm"><p className="text-xs text-[#888888] font-medium uppercase tracking-wider mb-1">Words Learned</p><h3 className="text-2xl font-bold text-[#111111]">342</h3></div>
          <div className="p-5 rounded-[24px] bg-white border border-[#EEEEEE] shadow-sm"><p className="text-xs text-[#888888] font-medium uppercase tracking-wider mb-1">Streak</p><h3 className="text-2xl font-bold text-[#F07820]">7 Days 🔥</h3></div>
        </div>
      </div>
    </div>
  );
};
export default StatsPage;
