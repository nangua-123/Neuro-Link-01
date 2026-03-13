import React from 'react';
import { useAppStore } from '../../store';
import { IoTStatusCard } from '../IoTStatusCard';
import { VitalsGrid } from '../Charts/VitalsGrid';
import { Activity, Smartphone, Footprints, Moon, Flame, Droplets } from 'lucide-react';

export function DailyHealthBase() {
  const { isDeviceBound, vitals } = useAppStore();
  
  return (
    <div className="space-y-4">
      <div className="px-1 flex items-center justify-between">
        <h3 className="text-[17px] font-bold text-slate-900 tracking-tight">实时体征监测</h3>
      </div>
      
      <IoTStatusCard />
      
      {isDeviceBound && (
        <div className="space-y-4">
          <VitalsGrid vitals={vitals} />
          
          {/* 异常体征微干预 (Micro-intervention) */}
          {vitals.deepSleepRatio < 20 && (
            <div className="bg-indigo-50/80 border border-indigo-100/50 rounded-[16px] p-3 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-[12px] font-semibold text-indigo-900">昨夜睡眠欠佳</h4>
                <p className="text-[10px] text-indigo-700/80 mt-0.5 leading-relaxed">
                  检测到深度睡眠比例偏低，建议今晚睡前尝试「正念呼吸」或聆听助眠白噪音。
                </p>
              </div>
            </div>
          )}
        </div>
      )}

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
              <span className="text-[16px] font-bold text-slate-900 tracking-tight">6,240</span>
              <span className="text-[9px] text-slate-400 font-medium">/ 8000</span>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: '78%' }} />
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
              <span className="text-[16px] font-bold text-slate-900 tracking-tight">4.2</span>
              <span className="text-[9px] text-slate-400 font-medium">/ 6h</span>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full" style={{ width: '70%' }} />
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
              <span className="text-[16px] font-bold text-slate-900 tracking-tight">320</span>
              <span className="text-[9px] text-slate-400 font-medium">kcal</span>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-orange-400 rounded-full" style={{ width: '45%' }} />
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
              <span className="text-[16px] font-bold text-slate-900 tracking-tight">1.2</span>
              <span className="text-[9px] text-slate-400 font-medium">/ 2.0L</span>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
