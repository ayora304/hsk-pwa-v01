import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [deviceMode, setDeviceMode] = useState<string>('responsive');
  const [isDevMenuOpen, setIsDevMenuOpen] = useState<boolean>(false);
  const [isNavOpen, setIsNavOpen] = useState<boolean>(true);
  
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const [simScale, setSimScale] = useState<number>(1);

  const devices = {
    responsive: { name: 'Full Screen', width: '100%', height: '100%', rounded: '0px' },
    iphone16promax: { name: 'iPhone 16 Pro', width: '440px', height: '956px', rounded: '44px' },
    tablet10: { name: 'Tablet 10"', width: '810px', height: '1080px', rounded: '24px' },
    laptop16: { name: 'Laptop 16"', width: '1728px', height: '1117px', rounded: '16px' },
  };

  const currentDevice = devices[deviceMode as keyof typeof devices];

  useEffect(() => {
    setIsDevMenuOpen(false);
    setIsNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (window.innerWidth > 1024) {
      setDeviceMode('iphone16promax');
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (deviceMode === 'responsive') {
        setSimScale(1);
        return;
      }
      const w = parseInt(currentDevice.width);
      const h = parseInt(currentDevice.height);
      
      const scaleW = (window.innerWidth * 0.95) / w;
      const scaleH = (window.innerHeight * 0.95) / h;
      setSimScale(Math.min(1, scaleW, scaleH));
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [deviceMode, currentDevice.width, currentDevice.height]);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const navItems = [
    { label: 'Home', path: '/home', icon: (a: boolean) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "#F07820" : "#555555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><path d="M9 22V12h6v10"></path></svg> },
    { label: 'Chats', path: '/chats', icon: (a: boolean) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "#F07820" : "#555555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> },
    { label: 'AI Hub', path: '/home', icon: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M10 2.5L11.5 7.5L16.5 9L11.5 10.5L10 15.5L8.5 10.5L3.5 9L8.5 7.5L10 2.5z"/><path d="M17 14l1 2.5l2.5 1l-2.5 1l-1 2.5l-1-2.5l-2.5-1l2.5-1l1-2.5z"/></svg>, isAi: true },
    { label: 'Stats', path: '/stats', icon: (a: boolean) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "#F07820" : "#555555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="12" width="4" height="8" rx="1"/><rect x="10" y="8" width="4" height="12" rx="1"/><rect x="16" y="4" width="4" height="16" rx="1"/></svg> },
    { label: 'Profile', path: '/profile', icon: (a: boolean) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? "#F07820" : "#555555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
  ];

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if (e.currentTarget.scrollTop > 150) {
      setIsDevMenuOpen(false);
      setIsNavOpen(false);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 40 || distance < -40) setIsNavOpen(false); 
  };

  const appContent = (
    <div className="h-full w-full flex flex-col relative bg-white  transition-colors duration-500">
      
      <main 
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto  w-full px-[24px] md:px-[30px] pb-[120px] relative ${
          deviceMode === 'iphone16promax' 
            ? 'pt-[54px]' 
            : 'pt-[calc(env(safe-area-inset-top,0px)+12px)]'
        }`}
      >
        <div className="w-full max-w-[1200px] mx-auto">
          {children}
        </div>
      
      {/* Perfectly Aligned Floating Menu Tray */}
      

      
      {/* Global Aligned Floating Menu */}
      


      
      
    </main>

      <div 
        className="absolute bottom-6 inset-x-0 w-full max-w-[1200px] mx-auto px-[24px] md:px-[30px] flex justify-end z-40 pointer-events-none" 
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <nav 
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className={`pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center  touch-pan-y ${
            isNavOpen 
              ? 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 w-full h-[80px] rounded-[32px] px-4 justify-between opacity-100' 
              : 'bg-[#F07820] shadow-[0_8px_25px_rgba(240,120,32,0.5)] border-none w-[64px] h-[64px] rounded-full px-0 justify-center opacity-100 hover:scale-105'
          }`}
        >
          {isNavOpen ? (
            navItems.map((item, idx) => {
              const active = !item.isAi && isActive(item.path);
              return (
                <button 
                  key={idx} 
                  onClick={() => navigate(item.path)} 
                  className="w-[60px] md:w-[71px] flex justify-center items-center active:opacity-70 transition-transform hover:scale-105"
                >
                  <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center transition-colors ${
                    item.isAi ? 'bg-[#F07820] shadow-[0_0_15px_rgba(240,120,32,0.6)]' : active ? 'bg-black/5' : 'bg-transparent'
                  }`}>
                    {item.icon(active)}
                  </div>
                </button>
              );
            })
          ) : (
            <button 
              onClick={() => setIsNavOpen(true)} 
              className="w-full h-full flex flex-col gap-[5px] items-center justify-center text-white active:scale-95 transition-transform"
            >
              <div className="w-5 h-[2px] bg-white rounded-full"></div>
              <div className="w-5 h-[2px] bg-white rounded-full"></div>
              <div className="w-5 h-[2px] bg-white rounded-full"></div>
            </button>
          )}
        </nav>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center font-sans ">
      
      <div className="absolute top-24 right-0 z-50 flex items-start">
        <button 
          onClick={() => setIsDevMenuOpen(!isDevMenuOpen)}
          className="glass3d p-2.5 rounded-l-2xl text-white flex items-center justify-center translate-x-[1px] hover:brightness-110 transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-300 ${isDevMenuOpen ? 'rotate-180' : ''}`}>
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div className={`transition-all duration-300 ease-in-out  glass3d rounded-bl-2xl ${isDevMenuOpen ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0'}`}>
          <div className="p-3 flex flex-col gap-1 w-[160px]">
            <div className="text-[10px] font-bold text-white uppercase tracking-widest mb-1 px-1">Device Mode</div>
            {Object.entries(devices).map(([key, config]) => (
              <button
                key={key}
                onClick={() => {
                  setDeviceMode(key);
                  setIsDevMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                  deviceMode === key 
                    ? 'bg-[#F07820] text-white shadow-md' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {config.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div 
        className={`relative flex flex-col transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_0_80px_rgba(0,0,0,0.6)] ${
          deviceMode !== 'responsive' ? 'border-[8px] border-[#222222] bg-black' : ''
        }`}
        style={{ 
          width: currentDevice.width, 
          height: currentDevice.height,
          borderRadius: currentDevice.rounded,
          transform: deviceMode !== 'responsive' ? `scale(${simScale})` : 'none',
          transformOrigin: 'center center',
        }}
      >
        {deviceMode === 'iphone16promax' && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[126px] h-[34px] bg-[#222222] rounded-b-[20px] z-50 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-1 bg-[#111111] rounded-full"></div>
          </div>
        )}

        <div className="w-full h-full rounded-[inherit]  flex flex-col">
           {appContent}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
