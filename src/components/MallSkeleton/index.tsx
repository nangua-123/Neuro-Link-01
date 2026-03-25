import React from 'react';

export const MallSkeleton = () => {
  return (
    <div className="h-full bg-slate-50 pb-24 animate-pulse overflow-y-auto hide-scrollbar">
      {/* Header Skeleton */}
      <div className="bg-white rounded-b-[32px] p-6 pt-12 shadow-sm mb-6">
        <div className="w-32 h-6 bg-slate-200 rounded mb-4"></div>
        <div className="w-48 h-4 bg-slate-200 rounded"></div>
      </div>

      {/* Package Cards Skeleton */}
      <div className="px-4 space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-200 rounded-2xl"></div>
                <div>
                  <div className="w-32 h-5 bg-slate-200 rounded mb-2"></div>
                  <div className="w-24 h-4 bg-slate-200 rounded"></div>
                </div>
              </div>
              <div className="w-16 h-6 bg-slate-200 rounded-full"></div>
            </div>
            <div className="space-y-3 mb-6">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-200 rounded-full"></div>
                  <div className="w-48 h-4 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <div className="flex-1 h-12 bg-slate-200 rounded-2xl"></div>
              <div className="flex-1 h-12 bg-slate-200 rounded-2xl"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
