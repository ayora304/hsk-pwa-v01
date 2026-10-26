import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- FLOATING MENU STATE ---
  const [isNavOpen, setIsNavOpen] = useState<boolean>(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const navItems = [
    { label: 'Home', path: '/home', icon: (a: boolean) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "#F07820" : "#555555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><path d="M9 22V12h6v10"></path></svg> },
    { label: 'Chats', path: '/chats', icon: (a: boolean) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "#F07820" : "#555555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> },
    { label: 'AI Hub', path: '/home', icon: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M10 2.5L11.5 7.5L16.5 9L11.5 10.5L10 15.5L8.5 10.5L3.5 9L8.5 7.5L10 2.5z"/><path d="M17 14l1 2.5l2.5 1l-2.5 1l-1 2.5l-1-2.5l-2.5-1l2.5-1l1-2.5z"/></svg>, isAi: true },
    { label: 'Stats', path: '/stats', icon: (a: boolean) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "#F07820" : "#555555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="12" width="4" height="8" rx="1"/><rect x="10" y="8" width="4" height="12" rx="1"/><rect x="16" y="4" width="4" height="16" rx="1"/></svg> },
    { label: 'Profile', path: '/profile', icon: (a: boolean) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "#F07820" : "#555555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
  ];

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 40 || distance < -40) setIsNavOpen(false); 
  };
  // ---------------------------

  useEffect(() => {
    document.body.style.backgroundColor = '#ffffff';
    document.documentElement.style.backgroundColor = '#ffffff';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#ffffff');
  }, []);

  const dashArray = `${2 * Math.PI * 40 * 0.75} ${2 * Math.PI * 40 * 0.25}`;
  const dashOffset = 2 * Math.PI * 40 * 0.25;

  return (
    <div className="w-full relative pb-32 min-h-screen">
      {/* IMMOVABLE FIXED GLASS SHIELD */}
      <div className="fixed top-0 inset-x-0 w-full max-w-[600px] mx-auto transition-all z-40 bg-[#FFF0E5] pt-[env(safe-area-inset-top)] border-b border-[#FCD8BE]/50">
        <div className="px-4 py-3 flex items-center justify-between">
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

      <div className="w-full h-[calc(70px+env(safe-area-inset-top))]" />

      <div className="space-y-6 pt-1">
        <button onClick={() => navigate('/whiteboard')} className="w-full text-left p-5 rounded-[24px] bg-[#FFF0E5] border border-[#FCD8BE] cursor-pointer">
          <span className="text-xs font-bold text-[#F07820]">STUDY TOGETHER · EXCALIDRAW</span>
          <span className="block text-xl font-bold mt-1">Study whiteboard ↗</span>
          <span className="block text-sm text-[#666666] mt-1">Sketch ideas, discuss lessons, and practice Chinese characters.</span>
        </button>
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
          <div onClick={() => navigate('/translate')} className="bg-white border border-[#F0F0F0] rounded-[20px] p-3 shadow-sm flex flex-col items-center gap-2.5 cursor-pointer active:scale-95 transition-transform"><div className="w-11 h-11 rounded-2xl bg-[#EFF6FF] flex items-center justify-center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg></div><span className="text-[12px] font-semibold text-[#333333]">Translate</span></div>
          <div onClick={() => navigate('/classroom')} className="bg-white border border-[#F0F0F0] rounded-[20px] p-3 shadow-sm flex flex-col items-center gap-2.5 cursor-pointer active:scale-95 transition-transform"><div className="w-11 h-11 rounded-2xl bg-[#ECFDF5] flex items-center justify-center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="M10 8l5 3-5 3z"/></svg></div><span className="text-[12px] font-semibold text-[#333333]">Classroom</span></div>
          <div onClick={() => navigate('/notes')} className="bg-white border border-[#F0F0F0] rounded-[20px] p-3 shadow-sm flex flex-col items-center gap-2.5 cursor-pointer active:scale-95 transition-transform"><div className="w-11 h-11 rounded-2xl bg-[#F3E8FF] flex items-center justify-center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div><span className="text-[12px] font-semibold text-[#333333]">Notes</span></div>
          <div onClick={() => navigate('/quiz')} className="bg-white border border-[#F0F0F0] rounded-[20px] p-3 shadow-sm flex flex-col items-center gap-2.5 cursor-pointer active:scale-95 transition-transform"><div className="w-11 h-11 rounded-2xl bg-[#FFF0E5] flex items-center justify-center"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/><path d="M9 12l2 2 4-4"/><path d="M9 16h6"/></svg></div><span className="text-[12px] font-semibold text-[#333333]">Quiz</span></div>
        </div>
        <div onClick={() => navigate('/schedule-detail')} className="w-full bg-white rounded-[24px] p-5 border border-[#F0F0F0] shadow-sm space-y-4 cursor-pointer active:scale-[0.98] transition-transform">
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
        <div onClick={() => navigate('/ai-insight')} className="w-full p-5 rounded-[24px] border border-[#FCD8BE]/60 shadow-sm cursor-pointer active:scale-[0.98] transition-transform" style={{ background: 'linear-gradient(135deg, #FFF5EE 0%, #FDE8D8 100%)' }}>
          <div className="flex items-center gap-2 mb-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="#F07820"><path d="M11.5 2.5L13.5 8.5L19.5 10.5L13.5 12.5L11.5 18.5L9.5 12.5L3.5 10.5L9.5 8.5L11.5 2.5z"/><path d="M18.5 15.5L19.5 18L22 19L19.5 20L18.5 22.5L17.5 20L15 19L17.5 18L18.5 15.5z"/><path d="M20 3L20.5 4.5L22 5L20.5 5.5L20 7L19.5 5.5L18 5L19.5 4.5L20 3z"/></svg><span className="text-[11px] font-extrabold text-[#F07820] uppercase tracking-wider">AI INSIGHT</span></div>
          <p className="text-[14px] text-[#222222] leading-relaxed">You're spending <span className="font-bold">more time on your weak topics.</span> Keep it up!</p>
        </div>
      </div>

      {/* TRANSPLANTED FLOATING MENU */}
      <div 
        className="fixed bottom-6 inset-x-0 w-full max-w-[1200px] mx-auto px-[24px] md:px-[30px] flex justify-end z-50 pointer-events-none" 
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <nav 
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className={`pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center touch-pan-y ${
            isNavOpen 
              ? 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 w-full h-[80px] rounded-[32px] px-4 justify-between opacity-100' 
              : 'bg-[#F07820] shadow-[0_8px_25px_rgba(240,120,32,0.5)] border-none w-[64px] h-[64px] rounded-full px-0 justify-center opacity-100 hover:scale-105'
          }`}
        >
          {isNavOpen ? (
            navItems.map((item, idx) => {
              const active = !item.isAi && isActive(item.path);
              return (
                <button 
                  key={idx} 
                  onClick={() => navigate(item.path)} 
                  className="w-[60px] md:w-[71px] flex justify-center items-center active:opacity-70 transition-transform hover:scale-105"
                >
                  <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center transition-colors ${
                    item.isAi ? 'bg-[#F07820] shadow-[0_0_15px_rgba(240,120,32,0.6)]' : active ? 'bg-black/5' : 'bg-transparent'
                  }`}>
                    {item.icon(active)}
                  </div>
                </button>
              );
            })
          ) : (
            <button 
              onClick={() => setIsNavOpen(true)} 
              className="w-full h-full flex flex-col gap-[5px] items-center justify-center text-white active:scale-95 transition-transform"
            >
              <div className="w-5 h-[2px] bg-white rounded-full"></div>
              <div className="w-5 h-[2px] bg-white rounded-full"></div>
              <div className="w-5 h-[2px] bg-white rounded-full"></div>
            </button>
          )}
        </nav>
      </div>

    </div>
  );
};

export default HomePage;
