import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bluetooth, Watch, ChevronRight, Zap } from 'lucide-react';
import { useAppStore } from '../../store';

export const IoTStatusCard: React.FC = () => {
  const navigate = useNavigate();
  const { isDeviceBound } = useAppStore();

  if (!isDeviceBound) {
    return (
      <div 
        onClick={() => navigate('/device')}
        className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.1)] relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md">
              <Watch className="w-6 h-6 text-white/80" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight mb-1">未连接穿戴设备</h3>
              <p className="text-xs text-white/60 font-medium">绑定 Neuro-Band 开启 24h 守护</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <ChevronRight className="w-4 h-4 text-white/80" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => navigate('/device')}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[24px] p-5 shadow-[0_8px_30px_rgba(79,70,229,0.2)] relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-md relative z-10">
              <Bluetooth className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-white tracking-tight">Neuro-Band Pro</h3>
              <span className="px-1.5 py-0.5 bg-emerald-400/20 text-emerald-100 text-[10px] font-bold rounded-md border border-emerald-400/30 flex items-center gap-0.5">
                <Zap className="w-3 h-3" /> 86%
              </span>
            </div>
            <p className="text-xs text-white/80 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              实时体征监测中
            </p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
          <ChevronRight className="w-4 h-4 text-white/80" />
        </div>
      </div>
    </div>
  );
};
