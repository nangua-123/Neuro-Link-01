import React from 'react';

export const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white rounded-b-[32px] p-6 pt-12 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
            <div>
              <div className="w-24 h-5 bg-slate-200 rounded mb-2"></div>
              <div className="w-32 h-4 bg-slate-200 rounded"></div>
            </div>
          </div>
          <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 h-12 bg-slate-200 rounded-2xl"></div>
          <div className="flex-1 h-12 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-3 flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
              <div className="w-12 h-3 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* List Skeleton */}
      <div className="px-4">
        <div className="bg-white rounded-3xl p-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                <div className="w-24 h-4 bg-slate-200 rounded"></div>
              </div>
              <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
