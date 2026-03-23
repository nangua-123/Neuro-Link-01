import React from 'react';
import { HeartPulse, Activity, Moon } from 'lucide-react';

interface DeviceIllustrationProps {
  type: 'watch' | 'patch' | 'monitor';
  className?: string;
}

export const DeviceIllustration: React.FC<DeviceIllustrationProps> = ({ type, className = '' }) => {
  if (type === 'watch') {
    return (
      <div className={`relative w-32 h-32 flex items-center justify-center ${className}`}>
        {/* Watch Band Top */}
        <div className="absolute top-1 w-12 h-12 bg-gradient-to-b from-slate-200 to-slate-300 rounded-t-xl shadow-inner" />
        {/* Watch Band Bottom */}
        <div className="absolute bottom-1 w-12 h-12 bg-gradient-to-t from-slate-200 to-slate-300 rounded-b-xl shadow-inner" />
        
        {/* Watch Case */}
        <div className="relative w-16 h-20 bg-slate-800 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.2),inset_0_0_0_2px_rgba(255,255,255,0.15)] flex items-center justify-center overflow-hidden z-10 border border-slate-700">
          {/* Screen Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
          
          {/* UI Elements */}
          <div className="flex flex-col items-center gap-1.5 z-10">
            <div className="relative">
              <HeartPulse className="w-6 h-6 text-rose-400" />
              <div className="absolute inset-0 bg-rose-400 blur-md opacity-40" />
            </div>
            <div className="w-8 h-1 bg-white/30 rounded-full" />
            <div className="w-5 h-1 bg-white/20 rounded-full" />
          </div>
          
          {/* Glass Reflection */}
          <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/20 to-transparent rounded-b-full opacity-50 pointer-events-none" />
        </div>
        
        {/* Digital Crown */}
        <div className="absolute right-7 top-10 w-1.5 h-4 bg-slate-300 rounded-r-sm shadow-sm z-0" />
        <div className="absolute right-7 top-16 w-1 h-6 bg-slate-300 rounded-r-sm shadow-sm z-0" />
      </div>
    );
  }

  if (type === 'patch') {
    return (
      <div className={`relative w-32 h-32 flex items-center justify-center ${className}`}>
        {/* Glow */}
        <div className="absolute w-24 h-12 bg-emerald-400/20 rounded-full blur-xl animate-pulse" />
        
        {/* Patch Base */}
        <div className="relative w-24 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.08),inset_0_2px_4px_rgba(255,255,255,1)] border border-slate-100 flex items-center justify-between px-2.5 z-10">
          {/* Left Electrode */}
          <div className="w-4 h-4 rounded-full bg-slate-100 shadow-inner border border-slate-200 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          </div>
          
          {/* Center Module */}
          <div className="w-10 h-10 rounded-full bg-slate-800 shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.1)] flex items-center justify-center z-10 -mt-1 border border-slate-700">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          
          {/* Right Electrode */}
          <div className="w-4 h-4 rounded-full bg-slate-100 shadow-inner border border-slate-200 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          </div>
        </div>
        
        {/* Connection Lines */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-0.5 bg-slate-200 z-0" />
      </div>
    );
  }

  if (type === 'monitor') {
    return (
      <div className={`relative w-32 h-32 flex items-center justify-center ${className}`}>
        {/* Base Shadow */}
        <div className="absolute bottom-4 w-16 h-4 bg-slate-300/50 rounded-full blur-md" />
        
        {/* Device Body */}
        <div className="relative w-16 h-24 bg-gradient-to-b from-white to-slate-50 rounded-t-full rounded-b-2xl shadow-[0_12px_24px_rgba(0,0,0,0.08),inset_0_2px_4px_rgba(255,255,255,1)] border border-slate-100 flex flex-col items-center justify-start pt-4 z-10">
          
          {/* Radar Dome */}
          <div className="w-12 h-12 rounded-full bg-slate-800 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] flex items-center justify-center relative overflow-hidden border border-slate-700">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20" />
            <Moon className="w-5 h-5 text-violet-400 z-10" />
            {/* Radar Sweep */}
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(139,92,246,0.3)_360deg)] animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          
          {/* Indicator Light */}
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.8)] mt-3" />
        </div>
      </div>
    );
  }

  return null;
};
