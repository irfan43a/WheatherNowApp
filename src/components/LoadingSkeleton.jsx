import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Hero Skeleton */}
      <div className="rounded-3xl glass-card p-6 md:p-8 border border-white/5 h-64 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="h-6 w-48 bg-slate-800 rounded-lg"></div>
          <div className="h-4 w-32 bg-slate-850 rounded-lg"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-16 w-32 bg-slate-800 rounded-2xl"></div>
          <div className="h-20 w-20 bg-slate-800 rounded-full"></div>
        </div>
      </div>

      {/* Grid Metrics Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-4 rounded-2xl glass-card border border-white/5 h-28 space-y-3">
            <div className="h-4 w-20 bg-slate-800 rounded"></div>
            <div className="h-6 w-16 bg-slate-700 rounded-lg"></div>
          </div>
        ))}
      </div>

      {/* Hourly Skeleton */}
      <div className="p-5 rounded-3xl glass-card border border-white/5 h-36">
        <div className="h-4 w-36 bg-slate-800 rounded mb-4"></div>
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-24 h-20 bg-slate-800/60 rounded-2xl shrink-0"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
