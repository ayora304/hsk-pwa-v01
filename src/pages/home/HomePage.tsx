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

  return (
    <div className="space-y-6 relative @container z-0 pb-24">
      
      {/* Frosted Glass Sticky Header Bar */}
      <div className="sticky top-0 z-30 -mx-4 px-4 pt-[max(12px,env(safe-area-inset-top))] pb-3 bg-white/80 backdrop-blur-md border-b border-gray-100/60 flex items-center justify-between transition-all">
        {/* User Info / Profile Link */}
        <div 
          onClick={() => navigate('/profile')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-[44px] h-[44px] rounded-full bg-[#1C1C1C] flex items-center justify-center active:scale-95 transition-transform shadow-sm">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div>
            <p className="text-xs text-[#888888] font-normal leading-tight">Welcome Back</p>
            <p className="text-[17px] font-bold text-[#111111] leading-tight">testt</p>
          </div>
        </div>

        {/* Notification Bell */}
        <button 
          onClick={() => navigate('/notifications')} 
          className="w-[44px] h-[44px] rounded-full bg-[#FFF0E5] flex items-center justify-center relative active:scale-95 transition-transform cursor-pointer shadow-sm border border-[#FCD8BE]/50"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#E53E3E] text-white text-[11px] font-bold flex items-center justify-center border-2 border-white">
            1
          </span>
        </button>
      </div>

      {/* Main Greeting */}
      <div className="pt-1">
        <h1 className="text-[26px] @lg:text-[32px] font-bold text-[#111111] leading-snug tracking-tight">
          Ready to level up today?
        </h1>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 w-full">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Ask HSK AI anything..."
            className="w-full bg-[#F5F5F7] border border-[#EEEEEE] rounded-full py-3.5 pl-11 pr-4 text-sm text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#F07820] transition-colors"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
        <button className="w-[44px] h-[44px] rounded-full bg-[#F07820] flex items-center justify-center shadow-md flex-shrink-0 active:scale-95 transition-transform">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"></path>
          </svg>
        </button>
      </div>

      {/* Quick Action Cards (4 Grid Items) */}
      <div className="grid grid-cols-4 gap-2.5 w-full">
        {/* Translate */}
        <div className="bg-white border border-[#F0F0F0] rounded-[20px] p-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center gap-2.5 cursor-pointer active:scale-95 transition-transform">
          <div className="w-11 h-11 rounded-2xl bg-[#EFF6FF] flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <path d="M8 9h8"></path>
              <path d="M8 13h6"></path>
            </svg>
          </div>
          <span className="text-[12px] font-semibold text-[#333333]">Translate</span>
        </div>

        {/* Classroom */}
        <div className="bg-white border border-[#F0F0F0] rounded-[20px] p-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center gap-2.5 cursor-pointer active:scale-95 transition-transform">
          <div className="w-11 h-11 rounded-2xl bg-[#ECFDF5] flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <span className="text-[12px] font-semibold text-[#333333]">Classroom</span>
        </div>

        {/* Notes */}
        <div className="bg-white border border-[#F0F0F0] rounded-[20px] p-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center gap-2.5 cursor-pointer active:scale-95 transition-transform">
          <div className="w-11 h-11 rounded-2xl bg-[#F3E8FF] flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <span className="text-[12px] font-semibold text-[#333333]">Notes</span>
        </div>

        {/* Quiz */}
        <div className="bg-white border border-[#F0F0F0] rounded-[20px] p-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center gap-2.5 cursor-pointer active:scale-95 transition-transform">
          <div className="w-11 h-11 rounded-2xl bg-[#FFF0E5] flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              <path d="M9 12l2 2 4-4"></path>
            </svg>
          </div>
          <span className="text-[12px] font-semibold text-[#333333]">Quiz</span>
        </div>
      </div>

      {/* Elevated Today's Schedule Card */}
      <div className="w-full bg-white rounded-[24px] p-5 border border-[#F0F0F0] shadow-[0_4px_20px_rgba(0,0,0,0.05)] space-y-4">
        {/* Card Header */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#FFF0E5] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <span className="text-sm font-semibold text-[#666666]">Today's Schedule</span>
        </div>

        {/* Content Split: Ring + Info */}
        <div className="flex items-center gap-5">
          {/* Progress Ring */}
          <div className="relative w-[100px] h-[100px] flex-shrink-0 flex items-center justify-center">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#FDE8D8" strokeWidth="8"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#F07820" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40 * 0.75} ${2 * Math.PI * 40 * 0.25}`}
                strokeDashoffset={2*Math.PI*40*0.25}
                strokeLinecap="round" transform="rotate(-90 50 50)" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[20px] font-extrabold text-[#111111] leading-none">75%</span>
              <span className="text-[11px] font-medium text-[#888888] mt-0.5">Complete</span>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-1.5">
            <h3 className="text-[18px] font-bold text-[#111111] leading-tight">
              HSK 1 – Basic Vocabulary
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#F07820]" />
              <span className="text-[#888888] font-medium">In Progress</span>
              <span className="text-[#888888]">•</span>
              <span className="text-[#F07820] font-semibold">45 Min Left</span>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <button 
          onClick={() => navigate('/stats')} 
          className="w-full bg-[#F07820] hover:bg-[#e06b18] text-white py-3.5 rounded-2xl font-bold text-[15px] active:scale-[0.98] transition-all shadow-md shadow-[#F07820]/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          Continue Learning
        </button>
      </div>

      {/* AI Insight Card */}
      <div className="w-full p-5 rounded-[24px] border border-[#FCD8BE]/60 shadow-sm" style={{ background: 'linear-gradient(135deg, #FFF5EE 0%, #FDE8D8 100%)' }}>
        <div className="flex items-center gap-2 mb-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#F07820">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"></path>
          </svg>
          <span className="text-[11px] font-extrabold text-[#F07820] uppercase tracking-wider">AI INSIGHT</span>
        </div>
        <p className="text-[14px] text-[#222222] leading-relaxed">
          You're spending <span className="font-bold">more time on your weak topics.</span> Keep it up!
        </p>
      </div>

    </div>
  );
};

export default HomePage;
