import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    document.body.style.backgroundColor = '#FFF0E5';
    document.documentElement.style.backgroundColor = '#FFF0E5';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#FFF0E5');
  }, []);

  return (
    <div className="w-full relative pb-28 min-h-screen bg-[#FFF0E5] text-[#111111]">
      <div className="fixed top-0 inset-x-0 w-full max-w-[1200px] mx-auto z-50 bg-[#FFF0E5] pt-[env(safe-area-inset-top)]">
        <div className="px-[24px] md:px-[30px] py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/home')} 
              className="w-10 h-10 rounded-full bg-white text-[#111111] flex items-center justify-center shadow-sm active:scale-95 transition-transform cursor-pointer"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-0.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h1 className="font-bold text-[22px]">Profile &amp; Settings</h1>
          </div>
        </div>
      </div>
      <div className="w-full h-[calc(72px+env(safe-area-inset-top))]" />

      <div className="space-y-5 px-1">
        <div className="rounded-[28px] p-5 shadow-sm border bg-white border-[#EEEEEE]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#F07820] text-white flex items-center justify-center font-extrabold text-xl shadow-md border-2 border-white shrink-0">
              JL
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-[18px] truncate">Jordan Lee</h2>
                <span className="text-[10px] font-extrabold text-[#F07820] bg-[#FFF0E5] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  HSK 3
                </span>
              </div>
              <p className="text-xs font-medium text-[#888888] mt-0.5">jordan.lee@example.com</p>
              <p className="text-[11px] font-bold text-[#F07820] mt-1.5 flex items-center gap-1">
                <span>🔥</span> 14 Day Study Streak
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-[#888888] uppercase tracking-wider px-2">Preferences</span>

          <div className="rounded-[24px] border border-[#EEEEEE] shadow-sm divide-y divide-[#F5F5F5] bg-white overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0E5] text-[#F07820] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                </div>
                <div>
                  <p className="font-bold text-[15px]">Daily Reminder</p>
                  <p className="text-xs text-[#888888]">Study notifications at 8:00 PM</p>
                </div>
              </div>

              <button 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)} 
                className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${notificationsEnabled ? 'bg-[#F07820]' : 'bg-[#E0E0E0]'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-[#888888] uppercase tracking-wider px-2">Account</span>

          <div className="rounded-[24px] border border-[#EEEEEE] shadow-sm divide-y divide-[#F5F5F5] bg-white overflow-hidden">
            <div className="p-4 flex items-center justify-between cursor-pointer active:opacity-70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0E5] flex items-center justify-center">
                  👑
                </div>
                <div>
                  <p className="font-bold text-[15px]">HSK Pro Membership</p>
                  <p className="text-xs text-[#10B981] font-semibold">Active Plan</p>
                </div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </div>

            <div className="p-4 flex items-center justify-between cursor-pointer active:opacity-70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFE5E5] text-[#EF4444] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </div>
                <p className="font-bold text-[15px] text-[#EF4444]">Log Out</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
