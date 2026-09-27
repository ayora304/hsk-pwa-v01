import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const notifications: any[] = []; 

  useEffect(() => {
    document.body.style.backgroundColor = '#ffffff';
    document.documentElement.style.backgroundColor = '#ffffff';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#ffffff');
  }, []);

  return (
    <div className="w-full relative pb-24 flex flex-col min-h-screen">
      <div className="fixed top-0 inset-x-0 z-40 w-full max-w-[600px] mx-auto bg-white/85 backdrop-blur-md [-webkit-backdrop-filter:blur(16px)] border-b border-gray-100/80 pt-[env(safe-area-inset-top)] transition-all">
        <div className="px-4 py-3 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-[40px] h-[40px] flex items-center justify-center bg-white border border-[#EEEEEE] rounded-full shadow-sm cursor-pointer"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
          <h1 className="text-[24px] font-bold text-[#111111] tracking-tight">Notifications</h1>
        </div>
      </div>
      <div className="w-full h-[calc(70px+env(safe-area-inset-top))]" />
      <div className="flex-1 flex flex-col pt-2">
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div key={notif.id} className="w-full p-4 rounded-[20px] bg-white border border-[#EEEEEE] shadow-sm flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-[#FFF0E5] flex items-center justify-center flex-shrink-0"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg></div>
                <div className="flex-1 pt-0.5"><h3 className="font-bold text-[#111111] text-[15px]">{notif.title}</h3><p className="text-[13px] text-[#666666] leading-relaxed">{notif.message}</p></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center my-auto opacity-90 pb-20">
            <div className="w-24 h-24 bg-[#F9F9F9] border border-[#EEEEEE] rounded-full flex items-center justify-center mb-5 shadow-sm"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path><line x1="4" y1="4" x2="20" y2="20" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round"></line></svg></div>
            <h3 className="font-bold text-[20px] text-[#111111] mb-2">No notifications yet</h3><p className="text-[15px] text-[#888888] text-center max-w-[240px] leading-relaxed">When you get study reminders or AI insights, they'll show up here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default NotificationsPage;
