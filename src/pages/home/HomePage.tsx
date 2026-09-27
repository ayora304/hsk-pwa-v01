import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = '#ffffff';
    document.documentElement.style.backgroundColor = '#ffffff';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#ffffff');
  }, []);

  const dashArray = `${2 * Math.PI * 40 * 0.75} ${2 * Math.PI * 40 * 0.25}`;
  const dashOffset = 2 * Math.PI * 40 * 0.25;

  return (
    <div className="w-full relative pb-24">
      {/* IMMOVABLE FIXED GLASS SHIELD */}
      <div className="fixed top-0 inset-x-0 w-full max-w-[600px] mx-auto transition-all z-50 bg-[#FFF0E5] pt-[env(safe-area-inset-top)] border-b border-[#FCD8BE]/50">
      
      
        <div className="px-4 py-3 flex items-center justify-between">
          {/* PROFILE HEADER BLOCK */}
          <div onClick={() => navigate('/profile')} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-[44px] h-[44px] rounded-full bg-[#2C2D30] flex items-center justify-center shrink-0 border border-stone-700/40 shadow-sm">
              <svg className="w-6 h-6 text-[#A0A0A0]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex flex-col">
              <p className="text-[12px] text-[#71717A] font-normal leading-tight">Welcome Back</p>
              <p className="text-[20px] font-extrabold text-[#111111] leading-tight tracking-tight mt-0.5">testt</p>
            </div>
          </div>

          <button onClick={() => navigate('/notifications')} className="w-[42px] h-[42px] rounded-full bg-[#FFF0E5] flex items-center justify-center relative shadow-sm border border-[#FCD8BE]/50 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-[#E53E3E] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
              1
            </span>
          </button>
        </div>
      </div>

      {/* INVISIBLE SPACER TO PREVENT OVERLAP */}
      <div className="w-full h-[calc(70px+env(safe-area-inset-top))]" />

      {/* PAGE CONTENT */}
      <div className="space-y-6 pt-1">
        <div>
          <h1 className="text-[26px] font-bold text-[#111111] leading-snug tracking-tight">Ready to level up today?</h1>
        </div>
        <div className="flex items-center gap-3 w-full">
          <div className="relative flex-1">
            <input type="text" placeholder="Ask HSK AI anything..." className="w-full bg-[#F5F5F7] border border-[#EEEEEE] rounded-full py-3.5 pl-11 pr-4 text-sm text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#F07820]" />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>
          <button className="w-[44px] h-[44px] rounded-full bg-[#F07820] flex items-center justify-center shadow-md flex-shrink-0 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M11.5 2.5L13.5 8.5L19.5 10.5L13.5 12.5L11.5 18.5L9.5 12.5L3.5 10.5L9.5 8.5L11.5 2.5z"/><path d="M18.5 15.5L19.5 18L22 19L19.5 20L18.5 22.5L17.5 20L15 19L17.5 18L18.5 15.5z"/><path d="M20 3L20.5 4.5L22 5L20.5 5.5L20 7L19.5 5.5L18 5L19.5 4.5L20 3z"/></svg>
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2.5 w-full">
          <div className="bg-white border border-[#F0F0F0] rounded-[20px] p-3 shadow-sm flex flex-col items-center gap-2.5 cursor-pointer"><div className="w-11 h-11 rounded-2xl bg-[#EFF6FF] flex items-center justify-center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg></div><span className="text-[12px] font-semibold text-[#333333]">Translate</span></div>
          <div className="bg-white border border-[#F0F0F0] rounded-[20px] p-3 shadow-sm flex flex-col items-center gap-2.5 cursor-pointer"><div className="w-11 h-11 rounded-2xl bg-[#ECFDF5] flex items-center justify-center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="M10 8l5 3-5 3z"/></svg></div><span className="text-[12px] font-semibold text-[#333333]">Classroom</span></div>
          <div className="bg-white border border-[#F0F0F0] rounded-[20px] p-3 shadow-sm flex flex-col items-center gap-2.5 cursor-pointer"><div className="w-11 h-11 rounded-2xl bg-[#F3E8FF] flex items-center justify-center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div><span className="text-[12px] font-semibold text-[#333333]">Notes</span></div>
          <div className="bg-white border border-[#F0F0F0] rounded-[20px] p-3 shadow-sm flex flex-col items-center gap-2.5 cursor-pointer"><div className="w-11 h-11 rounded-2xl bg-[#FFF0E5] flex items-center justify-center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/><path d="M9 12l2 2 4-4"/><path d="M9 16h6"/></svg></div><span className="text-[12px] font-semibold text-[#333333]">Quiz</span></div>
        </div>
        <div className="w-full bg-white rounded-[24px] p-5 border border-[#F0F0F0] shadow-sm space-y-4">
          <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-lg bg-[#FFF0E5] flex items-center justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg></div><span className="text-sm font-semibold text-[#666666]">Today's Schedule</span></div>
          <div className="flex items-center gap-5">
            <div className="relative w-[100px] h-[100px] flex-shrink-0 flex items-center justify-center">
              <svg width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#FDE8D8" strokeWidth="8"/><circle cx="50" cy="50" r="40" fill="none" stroke="#F07820" strokeWidth="8" strokeDasharray={dashArray} strokeDashoffset={dashOffset} strokeLinecap="round" transform="rotate(-90 50 50)" /></svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center"><span className="text-[20px] font-extrabold text-[#111111] leading-none">75%</span><span className="text-[11px] font-medium text-[#888888] mt-0.5">Complete</span></div>
            </div>
            <div className="flex-1 space-y-1.5"><h3 className="text-[18px] font-bold text-[#111111] leading-tight">HSK 1 – Basic Vocabulary</h3><div className="flex items-center gap-2 text-xs"><span className="w-2 h-2 rounded-full bg-[#F07820]" /><span className="text-[#888888] font-medium">In Progress</span><span className="text-[#888888]">•</span><span className="text-[#F07820] font-semibold">45 Min Left</span></div></div>
          </div>
          <button onClick={() => navigate('/stats')} className="w-full bg-[#F07820] text-white py-3.5 rounded-2xl font-bold text-[15px] cursor-pointer">Continue Learning</button>
        </div>
        <div className="w-full p-5 rounded-[24px] border border-[#FCD8BE]/60 shadow-sm" style={{ background: 'linear-gradient(135deg, #FFF5EE 0%, #FDE8D8 100%)' }}>
          <div className="flex items-center gap-2 mb-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="#F07820"><path d="M11.5 2.5L13.5 8.5L19.5 10.5L13.5 12.5L11.5 18.5L9.5 12.5L3.5 10.5L9.5 8.5L11.5 2.5z"/><path d="M18.5 15.5L19.5 18L22 19L19.5 20L18.5 22.5L17.5 20L15 19L17.5 18L18.5 15.5z"/><path d="M20 3L20.5 4.5L22 5L20.5 5.5L20 7L19.5 5.5L18 5L19.5 4.5L20 3z"/></svg><span className="text-[11px] font-extrabold text-[#F07820] uppercase tracking-wider">AI INSIGHT</span></div>
          <p className="text-[14px] text-[#222222] leading-relaxed">You're spending <span className="font-bold">more time on your weak topics.</span> Keep it up!</p>
        </div>
      </div>
    </div>
  );
};
export default HomePage;