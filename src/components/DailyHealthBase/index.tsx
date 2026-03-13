import React, { useEffect } from 'react';
import { useAppStore } from '../../store';
import { IoTStatusCard } from '../IoTStatusCard';
import { Activity, Smartphone, Footprints, Moon, Flame, Droplets } from 'lucide-react';

export function DailyHealthBase() {
  const { vitals, connectedDevices, updateVitals } = useAppStore();
  
  // 模拟数据流：当连接设备后，实时更新体征数据
  useEffect(() => {
    if (connectedDevices.length === 0) return;

    const interval = setInterval(() => {
      updateVitals({
        steps: vitals.steps + Math.floor(Math.random() * 5),
        calories: vitals.calories + Math.floor(Math.random() * 2),
        heartRate: 70 + Math.floor(Math.random() * 10),
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [connectedDevices.length, vitals.steps, vitals.calories, updateVitals]);
  
  return (
    <div className="space-y-4">
      <div className="px-1 flex items-center justify-between">
        <h3 className="text-[17px] font-bold text-slate-900 tracking-tight">实时体征监测</h3>
      </div>
      
      <IoTStatusCard />

      {/* 泛健康体能打卡 (General Health Tracking) - High Density Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* 步数打卡 */}
        <div className="bg-white rounded-[16px] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-2 -bottom-2 opacity-5 pointer-events-none">
            <Footprints className="w-16 h-16 text-emerald-500" />
          </div>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
              <Footprints className="w-3 h-3 text-emerald-500" />
            </div>
            <span className="text-[10px] font-semibold text-slate-700">今日步数</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-[16px] font-bold text-slate-900 tracking-tight">{vitals.steps.toLocaleString()}</span>
              <span className="text-[9px] text-slate-400 font-medium">/ 8000</span>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (vitals.steps / 8000) * 100)}%` }} />
            </div>
          </div>
        </div>

        {/* 屏幕时间打卡 */}
        <div className="bg-white rounded-[16px] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-2 -bottom-2 opacity-5 pointer-events-none">
            <Smartphone className="w-16 h-16 text-blue-500" />
          </div>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
              <Smartphone className="w-3 h-3 text-blue-500" />
            </div>
            <span className="text-[10px] font-semibold text-slate-700">屏幕使用</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-[16px] font-bold text-slate-900 tracking-tight">{vitals.screenTime}</span>
              <span className="text-[9px] text-slate-400 font-medium">/ 6h</span>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (vitals.screenTime / 6) * 100)}%` }} />
            </div>
          </div>
        </div>
        
        {/* 消耗卡路里 */}
        <div className="bg-white rounded-[16px] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-2 -bottom-2 opacity-5 pointer-events-none">
            <Flame className="w-16 h-16 text-orange-500" />
          </div>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center">
              <Flame className="w-3 h-3 text-orange-500" />
            </div>
            <span className="text-[10px] font-semibold text-slate-700">活动消耗</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-[16px] font-bold text-slate-900 tracking-tight">{vitals.calories}</span>
              <span className="text-[9px] text-slate-400 font-medium">kcal</span>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-orange-400 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (vitals.calories / 500) * 100)}%` }} />
            </div>
          </div>
        </div>

        {/* 饮水打卡 */}
        <div className="bg-white rounded-[16px] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-2 -bottom-2 opacity-5 pointer-events-none">
            <Droplets className="w-16 h-16 text-cyan-500" />
          </div>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-5 h-5 rounded-full bg-cyan-50 flex items-center justify-center">
              <Droplets className="w-3 h-3 text-cyan-500" />
            </div>
            <span className="text-[10px] font-semibold text-slate-700">饮水记录</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-[16px] font-bold text-slate-900 tracking-tight">{vitals.water}</span>
              <span className="text-[9px] text-slate-400 font-medium">/ 2.0L</span>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (vitals.water / 2.0) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
