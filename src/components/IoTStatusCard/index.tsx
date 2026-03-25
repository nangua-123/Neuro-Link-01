import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bluetooth, Watch, ChevronRight, Zap, Activity, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../../store';

export const IoTStatusCard: React.FC = () => {
  const navigate = useNavigate();
  const { connectedDevices, vitals } = useAppStore();

  if (connectedDevices.length === 0) {
    return (
      <motion.div 
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/device-connect')}
        className="bg-white rounded-[16px] p-3 shadow-[0_4px_20px_rgba(37,99,235,0.06)] border border-blue-50/50 relative overflow-hidden cursor-pointer group flex items-center justify-between"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-110" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-blue-100 rounded-full blur-md"
            />
            <div className="w-9 h-9 rounded-[12px] bg-blue-50 flex items-center justify-center border border-blue-100/50 relative z-10">
              <Watch className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-slate-800 tracking-tight mb-0.5">守护升级</h3>
            <p className="text-[10px] text-slate-500 font-medium">绑定 Neuro-Band，开启 24h 异常预警</p>
          </div>
        </div>
        <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors relative z-10">
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
        </div>
      </motion.div>
    );
  }

  const firstDevice = connectedDevices[0];
  const isApp = firstDevice.type === 'app';

  // 提炼核心指标
  let coreMetric = '';
  if (isApp) {
    coreMetric = `步数同步中 | 消耗 ${vitals.calories} kcal`;
  } else {
    coreMetric = `实时心率 ${vitals.heartRate} bpm | 睡眠质量 优`;
  }

  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate('/device-connect')}
      className="bg-white rounded-[16px] p-3 shadow-[0_4px_20px_rgba(37,99,235,0.08)] border border-blue-100/50 relative overflow-hidden cursor-pointer group flex items-center justify-between"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/80 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none" />
      <div className="flex items-center gap-3 relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-40" />
          <div className="w-9 h-9 rounded-[12px] bg-emerald-50 flex items-center justify-center border border-emerald-100/50 relative z-10">
            {isApp ? <Smartphone className="w-4 h-4 text-emerald-500" /> : <Bluetooth className="w-4 h-4 text-emerald-500" />}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="text-[13px] font-bold text-slate-800 tracking-tight">
              {connectedDevices.length > 1 ? `已连接 ${connectedDevices.length} 个设备` : `${firstDevice.name} 守护中`}
            </h3>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
          </div>
          <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
            {firstDevice.battery !== undefined ? `电量 ${firstDevice.battery}% | ` : ''}{coreMetric}
          </p>
        </div>
      </div>
      <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors relative z-10">
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
      </div>
    </motion.div>
  );
};
