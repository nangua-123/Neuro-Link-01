import React from 'react';
import { IoTVitals } from '../../interfaces/manager_dashboard';
import { Activity, Moon, BrainCircuit } from 'lucide-react';

interface VitalsGridProps {
  vitals: IoTVitals;
}

export const VitalsGrid: React.FC<VitalsGridProps> = ({ vitals }) => {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {/* HRV Card */}
      <div className="bg-white rounded-[16px] p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute -right-2 -bottom-2 opacity-5 pointer-events-none">
          <Activity className="w-10 h-10 text-rose-500" />
        </div>
        <div className="w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center mb-1">
          <Activity className="w-3.5 h-3.5 text-rose-500" />
        </div>
        <div className="text-[9px] text-slate-500 font-medium mb-0.5">心率变异性</div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-[16px] font-bold text-slate-900 tracking-tight">{vitals.hrv}</span>
          <span className="text-[9px] text-slate-400 font-medium">ms</span>
        </div>
      </div>

      {/* Deep Sleep Card */}
      <div className="bg-white rounded-[16px] p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute -right-2 -bottom-2 opacity-5 pointer-events-none">
          <Moon className="w-10 h-10 text-indigo-500" />
        </div>
        <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center mb-1">
          <Moon className="w-3.5 h-3.5 text-indigo-500" />
        </div>
        <div className="text-[9px] text-slate-500 font-medium mb-0.5">深睡比例</div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-[16px] font-bold text-slate-900 tracking-tight">{vitals.deepSleepRatio}</span>
          <span className="text-[9px] text-slate-400 font-medium">%</span>
        </div>
      </div>

      {/* EEG Stability Card */}
      <div className="bg-white rounded-[16px] p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute -right-2 -bottom-2 opacity-5 pointer-events-none">
          <BrainCircuit className="w-10 h-10 text-blue-500" />
        </div>
        <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center mb-1">
          <BrainCircuit className="w-3.5 h-3.5 text-blue-500" />
        </div>
        <div className="text-[9px] text-slate-500 font-medium mb-0.5">脑电稳定度</div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-[16px] font-bold text-slate-900 tracking-tight">{vitals.eegStability}</span>
          <span className="text-[9px] text-slate-400 font-medium">分</span>
        </div>
      </div>
    </div>
  );
};
