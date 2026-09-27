import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = '#ffffff';
    document.documentElement.style.backgroundColor = '#ffffff';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#ffffff');
  }, []);

  return (
    <div className="w-full relative pb-24">
      <div className="fixed top-0 inset-x-0 w-full max-w-[600px] mx-auto transition-all z-50 bg-[#FFF0E5] pt-[env(safe-area-inset-top)] border-b border-[#FCD8BE]/50">
      
      
        <div className="px-4 py-3 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-[40px] h-[40px] flex items-center justify-center bg-white border border-[#EEEEEE] rounded-full shadow-sm cursor-pointer"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
          <h1 className="text-[24px] font-bold text-[#111111] tracking-tight">Profile Info</h1>
        </div>
      </div>
      <div className="w-full h-[calc(70px+env(safe-area-inset-top))]" />
      <div className="flex flex-col items-center w-full max-w-[400px] mx-auto pt-6">
        <div className="w-[100px] h-[100px] bg-[#1C1C1C] rounded-full flex items-center justify-center mb-4 shadow-md"><svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>
        <h2 className="text-[26px] font-bold text-[#111111] leading-none mb-1.5">testt</h2>
        <p className="text-[15px] text-[#888888] mb-0.5">@testt2656</p><p className="text-[15px] text-[#888888]">ayoraelvis22@gmail.com</p>
        <p className="text-[14px] font-semibold text-[#F07820] mt-3 mb-10">Member since November 2021</p>
        <button className="w-full bg-[#F07820] text-white py-3.5 rounded-[16px] font-bold text-[15px] shadow-sm mb-3 cursor-pointer">Change Profile Picture</button>
        <button className="w-full bg-[#F9F9F9] border-[1.5px] border-[#DE3B40] text-[#DE3B40] py-3.5 rounded-[16px] font-bold text-[15px] flex items-center justify-center gap-2.5 cursor-pointer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>Logout from Discord</button>
      </div>
    </div>
  );
};
export default ProfilePage;
