import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props { onBack?: () => void; }

export const AiInsightDetailPage: React.FC<Props> = ({ onBack }) => {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate('/home'));

  useEffect(() => {
    document.body.style.backgroundColor = '#FFF0E5';
    document.documentElement.style.backgroundColor = '#FFF0E5';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#FFF0E5');
  }, []);

  return (
    <div className="w-full relative pb-24">
      
      {/* IMMOVABLE FIXED HEADER */}
      <div className="fixed top-0 inset-x-0 w-full max-w-[1200px] mx-auto z-50 bg-[#FFF0E5] pt-[env(safe-area-inset-top)]">
        <div className="px-[24px] md:px-[30px] py-4 flex items-center gap-4">
          <button onClick={handleBack} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm active:scale-95 transition-transform cursor-pointer">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" className="mr-0.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1 className="font-bold text-[22px] text-[#111111]">AI Insight Analysis</h1>
        </div>
      </div>

      {/* INVISIBLE SPACER */}
      <div className="w-full h-[calc(72px+env(safe-area-inset-top))]" />

      {/* PAGE CONTENT */}
      <div className="space-y-6">
        
        {/* Main Highlight Card */}
        <div className="w-full p-5 rounded-[24px] border border-[#FCD8BE]/60 shadow-sm" style={{ background: 'linear-gradient(135deg, #FFF5EE 0%, #FDE8D8 100%)' }}>
          <div className="flex items-center gap-2 mb-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#F07820">
              <path d="M11.5 2.5L13.5 8.5L19.5 10.5L13.5 12.5L11.5 18.5L9.5 12.5L3.5 10.5L9.5 8.5L11.5 2.5z"/>
              <path d="M18.5 15.5L19.5 18L22 19L19.5 20L18.5 22.5L17.5 20L15 19L17.5 18L18.5 15.5z"/>
              <path d="M20 3L20.5 4.5L22 5L20.5 5.5L20 7L19.5 5.5L18 5L19.5 4.5L20 3z"/>
            </svg>
            <span className="text-[12px] font-extrabold text-[#F07820] uppercase tracking-wider">RECOMMENDED FOCUS</span>
          </div>
          <h2 className="text-xl font-bold text-[#111111] leading-tight mb-2">
            Measure Words &amp; Time Expressions
          </h2>
          <p className="text-[14px] text-[#444444] leading-relaxed">
            You spent <span className="font-bold text-[#F07820]">65% of your recent study time</span> reviewing measure words like <span className="font-semibold">个 (gè)</span> and <span className="font-semibold">本 (běn)</span>. Addressing this gap will boost your test accuracy significantly.
          </p>
        </div>

        {/* Study Time Allocation Breakdown */}
        <div>
          <h2 className="font-bold text-[17px] text-[#111111] mb-3">Topic Breakdown</h2>
          <div className="w-full p-5 shadow-sm bg-[#F9F9F9] border border-[#EEEEEE] rounded-[24px] space-y-4">
            <div>
              <div className="flex justify-between text-sm font-semibold mb-1.5">
                <span className="text-[#111111]">Measure Words (个, 本, 只)</span>
                <span className="text-[#F07820]">65% Needs Review</span>
              </div>
              <div className="w-full h-2.5 bg-[#EAEAEA] rounded-full overflow-hidden">
                <div className="h-full bg-[#F07820] rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold mb-1.5">
                <span className="text-[#111111]">Time Expressions (点, 分)</span>
                <span className="text-[#2CB44A]">85% Mastered</span>
              </div>
              <div className="w-full h-2.5 bg-[#EAEAEA] rounded-full overflow-hidden">
                <div className="h-full bg-[#2CB44A] rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold mb-1.5">
                <span className="text-[#111111]">Basic Pronouns (我, 你, 他)</span>
                <span className="text-[#2CB44A]">98% Mastered</span>
              </div>
              <div className="w-full h-2.5 bg-[#EAEAEA] rounded-full overflow-hidden">
                <div className="h-full bg-[#2CB44A] rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Options */}
        <div>
          <h2 className="font-bold text-[17px] text-[#111111] mb-3">Suggested AI Actions</h2>
          <div className="w-full shadow-sm bg-[#F9F9F9] border border-[#EEEEEE] rounded-[24px] overflow-hidden">
            
            <div onClick={() => navigate('/chats')} className="flex items-center justify-between px-5 py-4 border-b border-[#EEEEEE] active:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#FEF0E6] flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-[#111111]">Start AI Drill: Measure Words</p>
                  <p className="text-xs text-[#888888] mt-0.5">Interactive 3-minute chat quiz</p>
                </div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A0A0A0" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </div>

            <div onClick={() => navigate('/home')} className="flex items-center justify-between px-5 py-4 active:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-[#111111]">Add to Tomorrow's Schedule</p>
                  <p className="text-xs text-[#888888] mt-0.5">Prioritize weak vocabulary</p>
                </div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A0A0A0" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AiInsightDetailPage;
