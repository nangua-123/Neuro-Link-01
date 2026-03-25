import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface OfflineBoundaryProps {
  children: React.ReactNode;
}

export const OfflineBoundary: React.FC<OfflineBoundaryProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="h-full bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center relative overflow-y-auto hide-scrollbar">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[10%] -right-[10%] w-[120%] h-[50%] bg-gradient-to-b from-slate-100 to-transparent opacity-60 blur-3xl" />
          <div className="absolute top-[20%] -left-[20%] w-[80%] h-[60%] bg-gradient-to-tr from-slate-50 to-transparent opacity-30 blur-3xl" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <WifiOff className="w-10 h-10 text-slate-400" />
          </div>
          <h1 className="text-[22px] font-bold text-slate-800 mb-3 tracking-tight">网络连接已断开</h1>
          <p className="text-[14px] text-slate-500 mb-8 leading-relaxed max-w-[280px]">
            请检查您的网络设置，确保设备已连接到 Wi-Fi 或蜂窝移动网络。
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-slate-800 text-white px-8 py-3.5 rounded-full font-bold text-[15px] shadow-[0_8px_24px_rgba(15,23,42,0.12)] active:scale-95 transition-transform"
          >
            <RefreshCw className="w-4 h-4" />
            重试连接
          </button>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};
