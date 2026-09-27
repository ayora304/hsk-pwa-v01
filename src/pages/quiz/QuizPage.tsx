import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.backgroundColor = '#FFF0E5';
    document.documentElement.style.backgroundColor = '#FFF0E5';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#FFF0E5');
  }, []);

  const options = ['Sorry', 'Thank you', 'Goodbye', 'Please'];

  return (
    <div className="w-full relative pb-28">
      {/* IMMOVABLE FIXED HEADER */}
      <div className="fixed top-0 inset-x-0 w-full max-w-[1200px] mx-auto z-50 bg-[#FFF0E5] pt-[env(safe-area-inset-top)]">
        <div className="px-[24px] md:px-[30px] py-4 flex items-center gap-4">
          <button onClick={() => navigate('/home')} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm active:scale-95 transition-transform cursor-pointer">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" className="mr-0.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1 className="font-bold text-[22px] text-[#111111]">Daily Quiz</h1>
        </div>
      </div>
      <div className="w-full h-[calc(72px+env(safe-area-inset-top))]" />

      {/* PAGE CONTENT */}
      <div className="space-y-6">
        <div className="w-full bg-white p-4 rounded-[20px] shadow-sm border border-[#EEEEEE] flex items-center gap-4">
          <div className="flex-1 h-3 bg-[#F0F0F0] rounded-full overflow-hidden"><div className="h-full bg-[#F07820] w-[60%] rounded-full"></div></div>
          <span className="text-xs font-extrabold text-[#F07820]">3 / 5</span>
        </div>
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#EEEEEE] text-center space-y-3">
          <span className="text-xs font-bold text-[#888888] uppercase tracking-wider">Select the correct English translation</span>
          <h2 className="text-[36px] font-extrabold text-[#111111]">谢谢</h2>
          <p className="text-sm text-[#F07820] font-semibold">Pinyin: xièxie</p>
        </div>
        <div className="space-y-3">
          {options.map((option, idx) => (
            <button key={idx} onClick={() => setSelectedOption(idx)} className={`w-full py-4 px-5 rounded-[20px] font-bold text-[16px] text-left border transition-all cursor-pointer ${selectedOption === idx ? 'bg-[#F07820] text-white border-[#F07820] shadow-md' : 'bg-white text-[#111111] border-[#EEEEEE] shadow-sm active:bg-gray-50'}`}>{option}</button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default QuizPage;
