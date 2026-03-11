import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bluetooth, Watch, ChevronRight, Zap, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../../store';

export const IoTStatusCard: React.FC = () => {
  const navigate = useNavigate();
  const { isDeviceBound } = useAppStore();

  if (!isDeviceBound) {
    return (
      <motion.div 
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/device')}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.1)] relative overflow-hidden cursor-pointer group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-transform group-hover:scale-110" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-blue-500/20 rounded-full blur-md"
              />
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md relative z-10">
                <Watch className="w-6 h-6 text-white/90" />
              </div>
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-white tracking-tight mb-1">未连接穿戴设备</h3>
              <p className="text-[12px] text-white/60 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400/50 animate-pulse" />
                绑定 Neuro-Band 开启 24h 守护
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <ChevronRight className="w-4 h-4 text-white/80" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate('/device')}
      className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[24px] p-5 shadow-[0_8px_30px_rgba(79,70,229,0.25)] relative overflow-hidden cursor-pointer group"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 rounded-full animate-ping opacity-20" />
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-md relative z-10 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <Bluetooth className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[15px] font-bold text-white tracking-tight">Neuro-Band Pro</h3>
                <span className="px-1.5 py-0.5 bg-emerald-400/20 text-emerald-50 text-[10px] font-bold rounded-md border border-emerald-400/30 flex items-center gap-0.5 backdrop-blur-sm">
                  <Zap className="w-3 h-3" /> 86%
                </span>
              </div>
              <p className="text-[12px] text-blue-100 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                实时体征监测中
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <ChevronRight className="w-4 h-4 text-white/90" />
          </div>
        </div>
        
        {/* Micro Chart Area */}
        <div className="bg-white/10 rounded-[16px] p-3 backdrop-blur-sm border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-200" />
            <span className="text-[12px] text-blue-100 font-medium">心率平稳</span>
          </div>
          <div className="flex items-end gap-1 h-6">
            {[40, 60, 45, 80, 55, 70, 50, 65].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="w-1.5 bg-white/60 rounded-t-sm"
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
