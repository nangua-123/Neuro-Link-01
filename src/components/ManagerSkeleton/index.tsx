import React from 'react';
import { motion } from 'motion/react';

export const ManagerSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col pb-24 relative overflow-hidden">
      {/* 极浅弥散暖色渐变背景 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[120%] h-[50%] bg-gradient-to-b from-[#E8F3FF] to-transparent opacity-60 blur-3xl" />
        <div className="absolute top-[20%] -left-[20%] w-[80%] h-[60%] bg-gradient-to-tr from-[#FFF0E6] to-transparent opacity-30 blur-3xl" />
      </div>

      <div className="p-5 relative z-10 pt-12 space-y-6">
        {/* Header Skeleton */}
        <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[16px] bg-slate-100 animate-pulse" />
              <div className="space-y-2">
                <div className="w-32 h-5 bg-slate-100 rounded animate-pulse" />
                <div className="w-20 h-4 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1 h-20 bg-slate-50 rounded-[20px] animate-pulse" />
            <div className="flex-1 h-20 bg-slate-50 rounded-[20px] animate-pulse" />
          </div>
        </div>

        {/* Chart Skeleton */}
        <div className="bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-[16px] bg-slate-100 animate-pulse" />
            <div className="w-32 h-5 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="h-48 bg-slate-50 rounded-[20px] animate-pulse" />
        </div>

        {/* Vitals Skeleton */}
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50 animate-pulse" />
          <div className="h-32 bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50 animate-pulse" />
        </div>

        {/* Actions Skeleton */}
        <div className="bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-[16px] bg-slate-100 animate-pulse" />
            <div className="w-32 h-5 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-16 bg-slate-50 rounded-[20px] animate-pulse" />
            <div className="h-16 bg-slate-50 rounded-[20px] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
