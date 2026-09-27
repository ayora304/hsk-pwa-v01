import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  useEffect(() => {
    document.body.style.backgroundColor = '#F07820';
    document.documentElement.style.backgroundColor = '#F07820';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#F07820');
  }, []);

  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center w-full max-w-[400px] mx-auto animate-in fade-in duration-300 relative min-h-screen pb-28">
      {/* PINNED STICKY HEADER */}
      <div className="sticky top-0 z-20 w-full pt-[max(12px,env(safe-area-inset-top))] pb-3 mb-6 bg-transparent">
        <div className="absolute -top-[500px] -left-8 -right-8 bottom-0 bg-gradient-to-b from-[#F07820] via-[#FFF0E5] to-white/95 pointer-events-none -z-10 rounded-b-[24px]" />
        <div className="flex items-center gap-4 px-1">
          <button 
            onClick={() => navigate(-1)} 
            className="w-[44px] h-[44px] flex items-center justify-center bg-white border border-[#EEEEEE] rounded-full active:scale-95 transition-transform shadow-sm cursor-pointer"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h1 className="text-[28px] font-bold text-[#111111] tracking-tight">Profile Info</h1>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex flex-col items-center w-full px-1">
        <div className="w-[100px] h-[100px] bg-[#1C1C1C] rounded-full flex items-center justify-center mb-4 shadow-md">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        
        <h2 className="text-[26px] font-bold text-[#111111] leading-none mb-1.5">testt</h2>
        <p className="text-[15px] text-[#888888] mb-0.5">@testt2656</p>
        <p className="text-[15px] text-[#888888]">ayoraelvis22@gmail.com</p>
        
        <p className="text-[14px] font-semibold text-[#F07820] mt-3 mb-10">
          Member since November 2021
        </p>
        
        <button className="w-full bg-[#F07820] text-white py-3.5 rounded-[16px] font-bold text-[15px] active:scale-[0.98] transition-transform shadow-sm mb-3">
          Change Profile Picture
        </button>
        
        <button className="w-full bg-[#F9F9F9] border-[1.5px] border-[#DE3B40] text-[#DE3B40] py-3.5 rounded-[16px] font-bold text-[15px] flex items-center justify-center gap-2.5 active:scale-[0.98] transition-transform">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout from Discord
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
