import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  useEffect(() => {
    document.body.style.backgroundColor = '#F07820';
    document.documentElement.style.backgroundColor = '#F07820';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#F07820');
  }, []);

  const navigate = useNavigate();
  const notifications: any[] = []; 

  return (
    <div className="flex flex-col w-full max-w-[600px] mx-auto animate-in fade-in duration-300 relative min-h-screen pb-28">
      {/* PINNED STICKY HEADER */}
      <div className="sticky top-0 z-20 w-full pt-[max(12px,env(safe-area-inset-top))] pb-3 mb-4 bg-transparent">
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
          <h1 className="text-[28px] font-bold text-[#111111] tracking-tight">Notifications</h1>
        </div>
      </div>

      <div className="px-1 flex-1 flex flex-col">
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div key={notif.id} className="w-full p-4 rounded-[20px] bg-white border border-[#EEEEEE] shadow-sm flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-[#FFF0E5] flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <div className="flex-1 pt-0.5">
                  <h3 className="font-bold text-[#111111] text-[15px]">{notif.title}</h3>
                  <p className="text-[13px] text-[#666666] leading-relaxed">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center mt-12 opacity-90 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className="w-24 h-24 bg-[#F9F9F9] border border-[#EEEEEE] rounded-full flex items-center justify-center mb-5 shadow-sm">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1.5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                <line x1="4" y1="4" x2="20" y2="20" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round"></line>
              </svg>
            </div>
            <h3 className="font-bold text-[20px] text-[#111111] mb-2">No notifications yet</h3>
            <p className="text-[15px] text-[#888888] text-center max-w-[240px] leading-relaxed">
              When you get study reminders or AI insights, they'll show up here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
