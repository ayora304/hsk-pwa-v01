import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props { onBack?: () => void; }

export const ScheduleDetailPage: React.FC<Props> = ({ onBack }) => {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate('/home'));

  // Ensure the background color matches the peach design scheme
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
          <h1 className="font-bold text-[22px] text-[#111111]">Schedule Detail</h1>
        </div>
      </div>

      {/* INVISIBLE SPACER */}
      <div className="w-full h-[calc(72px+env(safe-area-inset-top))]" />

      {/* PAGE CONTENT */}
      <div className="space-y-6">
        
        {/* Main Info Card */}
        <div className="w-full p-5 shadow-sm bg-[#F9F9F9] border border-[#EEEEEE] rounded-[24px]">
          <h2 className="text-2xl font-bold text-[#111111] leading-tight mb-1">
            HSK 1 – Basic <br/>Vocabulary
          </h2>
          <p className="text-sm text-[#999999] mb-5">
            HSK Level 1 • Vocabulary &amp; Grammar
          </p>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex-shrink-0">
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="22" fill="none" stroke="#F0E8DC" strokeWidth="5" />
                <circle cx="28" cy="28" r="22" fill="none" stroke="#F07820" strokeWidth="5" strokeDasharray={`${2 * Math.PI * 22 * 0.75} ${2 * Math.PI * 22 * 0.25}`} strokeDashoffset={2 * Math.PI * 22 * 0.25} strokeLinecap="round" transform="rotate(-90 28 28)" />
              </svg>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[17px] font-bold text-[#F07820]">75% Complete</span>
              <span className="text-[13px] text-[#999999]">45 Min Left</span>
            </div>
          </div>
        </div>

        {/* Objectives */}
        <div>
          <h2 className="font-bold text-[17px] text-[#111111] mb-3">Learning Objectives</h2>
          <div className="w-full py-4 px-5 shadow-sm bg-[#F9F9F9] border border-[#EEEEEE] rounded-[24px]">
            <div className="flex flex-col gap-4">
              {[
                { text: 'Master 150 basic HSK 1 vocabulary words', done: true },
                { text: 'Learn basic sentence structures (SVO)', done: true },
                { text: 'Practice pinyin pronunciation', done: false },
                { text: 'Understand measure words usage', done: false },
              ].map((obj, i) => (
                <div key={i} className="flex items-start gap-3">
                  {obj.done ? (
                    <div className="w-6 h-6 rounded-full bg-[#2CB44A] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#D0D0D0] flex-shrink-0 mt-0.5" />
                  )}
                  <p className={`text-[15px] leading-snug ${obj.done ? 'text-[#2CB44A]' : 'text-[#888888]'}`}>{obj.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resources */}
        <div>
          <h2 className="font-bold text-[17px] text-[#111111] mb-3">Resources</h2>
          <div className="w-full shadow-sm bg-[#F9F9F9] border border-[#EEEEEE] rounded-[24px] overflow-hidden">
            {[
              { title: 'Video Lesson: Basic Greetings', meta: '12 min' },
              { title: 'Vocabulary List: Daily Life', meta: '50 words' }
            ].map((r, i) => (
              <div key={i} className={`flex items-center gap-4 px-5 py-4 ${i === 0 ? 'border-b border-[#F5F5F5]' : ''} active:bg-gray-50 transition-colors cursor-pointer`}>
                <div className="w-10 h-10 rounded-full bg-[#FEF0E6] flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#F07820"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                </div>
                <div>
                  <p className="text-[15px] font-medium text-[#111111]">{r.title}</p>
                  <p className="text-xs text-[#AAAAAA] mt-0.5">{r.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailPage;
