import React from 'react';
import { IoTVitals } from '../../interfaces/manager_dashboard';
import { Activity, Moon, BrainCircuit } from 'lucide-react';

interface VitalsGridProps {
  vitals: IoTVitals;
}

export const VitalsGrid: React.FC<VitalsGridProps> = ({ vitals }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {/* HRV Card */}
      <div className="bg-white rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col items-center justify-center text-center">
        <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center mb-2">
          <Activity className="w-4 h-4 text-rose-500" />
        </div>
        <div className="text-xs text-slate-500 font-medium mb-1">心率变异性</div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-xl font-bold text-slate-900 tracking-tight">{vitals.hrv}</span>
          <span className="text-[10px] text-slate-400 font-medium">ms</span>
        </div>
      </div>

      {/* Deep Sleep Card */}
      <div className="bg-white rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col items-center justify-center text-center">
        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mb-2">
          <Moon className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="text-xs text-slate-500 font-medium mb-1">深睡比例</div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-xl font-bold text-slate-900 tracking-tight">{vitals.deepSleepRatio}</span>
          <span className="text-[10px] text-slate-400 font-medium">%</span>
        </div>
      </div>

      {/* EEG Stability Card */}
      <div className="bg-white rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col items-center justify-center text-center">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-2">
          <BrainCircuit className="w-4 h-4 text-blue-500" />
        </div>
        <div className="text-xs text-slate-500 font-medium mb-1">脑电稳定度</div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-xl font-bold text-slate-900 tracking-tight">{vitals.eegStability}</span>
          <span className="text-[10px] text-slate-400 font-medium">分</span>
        </div>
      </div>
    </div>
  );
};
