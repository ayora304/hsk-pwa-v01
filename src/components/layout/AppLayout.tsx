import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const [deviceMode, setDeviceMode] = useState<string>('responsive');
  const [isDevMenuOpen, setIsDevMenuOpen] = useState<boolean>(false);
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

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if (e.currentTarget.scrollTop > 150) {
      setIsDevMenuOpen(false);
    }
  };

  const appContent = (
    <div className="h-full w-full flex flex-col relative bg-white transition-colors duration-500">
      <main 
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto w-full px-[24px] md:px-[30px] pb-[120px] relative ${
          deviceMode === 'iphone16promax' 
            ? 'pt-[54px]' 
            : 'pt-[calc(env(safe-area-inset-top,0px)+12px)]'
        }`}
      >
        <div className="w-full max-w-[1200px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center font-sans">
      <div className="absolute top-24 right-0 z-50 flex items-start">
        <button 
          onClick={() => setIsDevMenuOpen(!isDevMenuOpen)}
          className="glass3d p-2.5 rounded-l-2xl text-white flex items-center justify-center translate-x-[1px] hover:brightness-110 transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-300 ${isDevMenuOpen ? 'rotate-180' : ''}`}>
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div className={`transition-all duration-300 ease-in-out glass3d rounded-bl-2xl ${isDevMenuOpen ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0'}`}>
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

        <div className="w-full h-full rounded-[inherit] flex flex-col">
           {appContent}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
