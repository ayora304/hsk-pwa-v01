import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ClassroomPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = '#FFF0E5';
    document.documentElement.style.backgroundColor = '#FFF0E5';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#FFF0E5');
  }, []);

  const modules = [
    { title: '1. Essential Restaurant Vocabulary', time: '14 min', status: 'Completed' },
    { title: '2. Expressing Preferences (我要 / 不要)', time: '18 min', status: 'In Progress' },
    { title: '3. Asking for the Check (买单)', time: '10 min', status: 'Locked' }
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
          <h1 className="font-bold text-[22px] text-[#111111]">Classroom</h1>
        </div>
      </div>
      <div className="w-full h-[calc(72px+env(safe-area-inset-top))]" />

      {/* PAGE CONTENT */}
      <div className="space-y-6">
        <div className="w-full p-5 bg-white rounded-[24px] border border-[#EEEEEE] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#059669] bg-[#ECFDF5] px-3 py-1 rounded-full">ACTIVE LESSON</span>
            <span className="text-xs text-[#888888]">Module 3 of 12</span>
          </div>
          <h2 className="text-[20px] font-bold text-[#111111]">Ordering Food &amp; Drinks in Chinese</h2>
          <p className="text-sm text-[#888888]">Learn key sentence patterns for restaurants &amp; cafes.</p>
          <button className="w-full bg-[#059669] text-white py-3 rounded-2xl font-bold text-[15px] cursor-pointer">Join Live Session</button>
        </div>

        <div>
          <h2 className="font-bold text-[17px] text-[#111111] mb-3">Course Modules</h2>
          <div className="bg-white rounded-[24px] border border-[#EEEEEE] shadow-sm overflow-hidden divide-y divide-[#F5F5F5]">
            {modules.map((m, i) => (
              <div key={i} className="p-4 flex items-center justify-between active:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] flex items-center justify-center text-[#059669] font-bold">{i + 1}</div>
                  <div><p className="text-[15px] font-semibold text-[#111111]">{m.title}</p><p className="text-xs text-[#888888]">{m.time}</p></div>
                </div>
                <span className={`text-xs font-bold ${m.status === 'Completed' ? 'text-[#2CB44A]' : m.status === 'In Progress' ? 'text-[#F07820]' : 'text-[#AAAAAA]'}`}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ClassroomPage;
