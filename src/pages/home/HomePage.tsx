import React from 'react';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-7 relative">
      
      {/* 
        This is the dedicated Orange Header Hue layer!
        It sits behind the top elements and fades into the pure white background.
      */}
      <div className="absolute -top-12 -left-8 -right-8 h-[300px] bg-gradient-to-b from-[#FFF0E5] to-transparent pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div onClick={() => navigate('/profile')} className="w-[44px] h-[44px] rounded-full bg-[#1C1C1C] flex items-center justify-center cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div>
            <p className="text-xs text-[#888888] font-normal leading-tight">Welcome Back,</p>
            <p className="text-base font-bold text-[#111111] leading-tight">testt</p>
          </div>
        </div>
        <button className="w-[44px] h-[44px] rounded-full bg-white flex items-center justify-center shadow-sm relative border border-[#F0F0F0]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#F07820]" />
        </button>
      </div>

      {/* Hero Title */}
      <div>
        <h1 className="text-[34px] md:text-[42px] text-[#111111] leading-[1.1] tracking-tight">
          Let's Start Study <br />
          <span className="font-bold">With AI Today!</span>
        </h1>
      </div>

      {/* Search Bar - Switched to light gray with slight border since bg is now white */}
      <div className="flex items-center gap-3 w-full">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Ask HSK AI anything... learn..."
            className="w-full bg-[#F9F9F9] border border-[#EEEEEE] rounded-2xl py-3.5 pl-11 pr-4 text-sm text-[#111111] placeholder-[#CCCCCC] focus:outline-none focus:border-[#F07820] transition-colors"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#AAAAAA" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
        <button className="w-[40px] h-[40px] rounded-full bg-[#F07820] flex items-center justify-center shadow-sm flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"></path>
          </svg>
        </button>
      </div>

      {/* Quick Links - Updated to light gray to contrast against white background */}
      <div className="grid grid-cols-4 gap-3 w-full">
        {[
          { label: 'Translate', icon: 'M5 8l6 6M4 14e1 1-1 0 10-10L4 14zM2 5h12' },
          { label: 'Classroom', icon: 'M22 10v6M2 10l10-5 10 5-10 5z' },
          { label: 'Notes', icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' },
          { label: 'Quiz', icon: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01' },
        ].map((item, i) => (
          <div key={i} className="w-full py-4 bg-[#F9F9F9] border border-[#EEEEEE] rounded-2xl flex flex-col items-center gap-2 cursor-pointer active:opacity-80 transition-transform hover:scale-[1.02]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2">
              <path d={item.icon}></path>
              {item.label === 'Quiz' && <circle cx="12" cy="12" r="10" />}
            </svg>
            <span className="text-[11px] md:text-[13px] font-medium text-[#111111]">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Cards Section */}
      <div className="w-full">
        <h2 className="font-bold text-lg text-[#111111] mb-3">Today's Schedule</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Card 1 - Light gray card on white background */}
          <div onClick={() => navigate('/schedule')} className="w-full p-4 bg-[#F9F9F9] border border-[#EEEEEE] rounded-[20px] flex items-center gap-4 cursor-pointer hover:shadow-sm transition-shadow">
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#F0E8DC" strokeWidth="3"/>
                <circle cx="24" cy="24" r="20" fill="none" stroke="#F07820" strokeWidth="3"
                  strokeDasharray={`${2*Math.PI*20*0.75}${2*Math.PI*20*0.25}`}
                  strokeDashoffset={2*Math.PI*20*0.25}
                  strokeLinecap="round" transform="rotate(-90 24 24)" />
                <text x="24" y="24" textAnchor="middle" dominantBaseline="central" fill="#F07820" fontSize="12" fontWeight="bold">75%</text>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#111111]">HSK 1 – Basic Vocabulary</p>
              <p className="text-[11px] text-[#888888] mt-0.5">In Progress • 45 Min Left</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>

          {/* Card 2 - Kept the orange gradient exactly as requested */}
          <div className="w-full p-4 rounded-[20px] shadow-sm flex flex-col justify-center" style={{ background: 'linear-gradient(135deg, #FEF0E6 0%, #FDDFC8 100%)' }}>
            <div className="flex items-center gap-2 mb-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#F07820">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"></path>
              </svg>
              <span className="text-[11px] font-bold text-[#F07820] uppercase tracking-wide">AI Insight</span>
            </div>
            <p className="text-sm text-[#111111] leading-relaxed">
              You're spending <span className="font-bold">more time on your weak topics.</span> Keep it up!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
