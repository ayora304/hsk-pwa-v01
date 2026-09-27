import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const TranslatePage: React.FC = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('你好，我想练习汉语');

  useEffect(() => {
    document.body.style.backgroundColor = '#FFF0E5';
    document.documentElement.style.backgroundColor = '#FFF0E5';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#FFF0E5');
  }, []);

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
          <h1 className="font-bold text-[22px] text-[#111111]">Translate</h1>
        </div>
      </div>
      <div className="w-full h-[calc(72px+env(safe-area-inset-top))]" />

      {/* PAGE CONTENT */}
      <div className="space-y-5">
        <div className="bg-white rounded-[20px] p-2.5 shadow-sm flex items-center justify-between px-6 border border-[#EEEEEE]">
          <span className="font-bold text-[15px] text-[#111111]">Chinese</span>
          <div className="w-9 h-9 rounded-full bg-[#FFF0E5] flex items-center justify-center cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2.5"><path d="M7 16V4M7 4L3 8M7 4L11 8M17 8v12M17 20l4-4M17 20l-4-4"/></svg>
          </div>
          <span className="font-bold text-[15px] text-[#111111]">English</span>
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-[#EEEEEE] space-y-4">
          <textarea 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            className="w-full h-24 text-[18px] text-[#111111] font-medium resize-none focus:outline-none placeholder-[#AAAAAA]" 
            placeholder="Type Chinese or English..." 
          />
          <div className="flex items-center justify-between border-t border-[#F5F5F5] pt-3">
            <span className="text-xs text-[#888888]">Nǐ hǎo, wǒ xiǎng liànxí hànyǔ</span>
            <button className="w-10 h-10 rounded-full bg-[#FFF0E5] flex items-center justify-center cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            </button>
          </div>
        </div>

        <div className="bg-[#FFF5EE] rounded-[24px] p-5 border border-[#FCD8BE]/60 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F07820] uppercase tracking-wider">Translation</span>
            <button className="text-xs font-semibold text-[#F07820] underline cursor-pointer">Save to Notes</button>
          </div>
          <p className="text-[19px] font-bold text-[#111111]">"Hello, I want to practice Chinese."</p>
        </div>
      </div>
    </div>
  );
};
export default TranslatePage;
