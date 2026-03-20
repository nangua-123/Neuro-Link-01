import React from 'react';
import { useAppStore } from '../../store';
import { IoTStatusCard } from '../IoTStatusCard';
import { Smartphone, Footprints, Flame, Droplets, Sparkles, ArrowRight } from 'lucide-react';

interface HealthInsightsBentoProps {
  chart?: React.ReactNode;
  analysisTitle?: string;
  analysisDescription?: string;
  onAnalysisClick?: () => void;
}

export function HealthInsightsBento({ chart, analysisTitle, analysisDescription, onAnalysisClick }: HealthInsightsBentoProps) {
  const { vitals, isDeviceBound } = useAppStore();
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">智能数据与分析中心</h3>
      </div>
      
      {/* Bento Box Layout */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Chart Section - Spans full width */}
        {chart && (
          <div className="col-span-2">
            {chart}
          </div>
        )}

        {/* Analysis Action Button - Spans full width */}
        {analysisTitle && onAnalysisClick && (
          <div 
            onClick={onAnalysisClick}
            className="col-span-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-[20px] p-4 flex items-center justify-between shadow-[0_8px_24px_rgba(37,99,235,0.2)] cursor-pointer active:scale-95 transition-transform relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/20 transition-colors" />
            <div className="relative z-10">
              <h4 className="text-[15px] font-bold text-white mb-0.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-200" />
                {analysisTitle}
              </h4>
              {analysisDescription && (
                <p className="text-[11px] text-blue-100/90 font-medium">{analysisDescription}</p>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm relative z-10">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        )}

        {/* IoT Status - Spans full width */}
        <div className="col-span-2">
          <IoTStatusCard />
        </div>

        {/* 4 Small Vitals Cards */}
        <div className="col-span-2 relative">
          {!isDeviceBound && (
            <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[4px] rounded-[16px] flex flex-col items-center justify-center border border-white/50 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 text-slate-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-[13px] font-bold text-slate-800">连接设备解锁更多体征</span>
              <span className="text-[10px] text-slate-500 mt-1">支持 Apple Watch 等主流穿戴设备</span>
            </div>
          )}
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
                  <span className="text-[9px] text-slate-500 font-medium">/ 8000</span>
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
                  <span className="text-[9px] text-slate-500 font-medium">/ 6h</span>
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
                  <span className="text-[9px] text-slate-500 font-medium">kcal</span>
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
                  <span className="text-[9px] text-slate-500 font-medium">/ 2.0L</span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (vitals.water / 2.0) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
