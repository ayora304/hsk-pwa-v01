import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const NotesPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = '#FFF0E5';
    document.documentElement.style.backgroundColor = '#FFF0E5';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#FFF0E5');
  }, []);

  const snippets = [
    { word: '苹果 (píngguǒ)', mean: 'Apple', tag: 'HSK 1' },
    { word: '多少钱 (duōshao qián)', mean: 'How much is it?', tag: 'Shopping' },
    { word: '认识你很高兴', mean: 'Nice to meet you', tag: 'Greetings' }
  ];

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
          <h1 className="font-bold text-[22px] text-[#111111]">Saved Notes</h1>
        </div>
      </div>
      <div className="w-full h-[calc(72px+env(safe-area-inset-top))]" />

      {/* PAGE CONTENT */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-[20px] border border-[#EEEEEE] shadow-sm"><span className="text-2xl font-bold text-[#7C3AED]">142</span><p className="text-xs text-[#888888] mt-1 font-semibold">Saved Vocabulary</p></div>
          <div className="bg-white p-4 rounded-[20px] border border-[#EEEEEE] shadow-sm"><span className="text-2xl font-bold text-[#F07820]">18</span><p className="text-xs text-[#888888] mt-1 font-semibold">Grammar Rules</p></div>
        </div>
        <h2 className="font-bold text-[17px] text-[#111111] pt-2">Recent Snippets</h2>
        <div className="bg-white rounded-[24px] border border-[#EEEEEE] shadow-sm p-2 divide-y divide-[#F5F5F5]">
          {snippets.map((item, idx) => (
            <div key={idx} className="p-3 flex items-center justify-between">
              <div><p className="font-bold text-[16px] text-[#111111]">{item.word}</p><p className="text-xs text-[#888888]">{item.mean}</p></div>
              <span className="text-[10px] font-bold text-[#7C3AED] bg-[#F3E8FF] px-2.5 py-1 rounded-full">{item.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default NotesPage;
