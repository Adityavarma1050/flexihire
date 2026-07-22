import React from 'react';

export default function Loader({ text = 'Loading data...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 space-y-4">
      {/* Animated Glowing Ring */}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-slate-700/50"></div>
        <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full bg-brand-500/10 blur-sm"></div>
      </div>
      <p className="text-sm font-medium text-slate-400 animate-pulse">{text}</p>

      {/* Skeleton Card Mock Grid for UX loading feedback */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 opacity-60">
        {[1, 2].map((i) => (
          <div key={i} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-700 rounded-xl"></div>
              <div className="space-y-1.5 flex-1">
                <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                <div className="h-3 bg-slate-700/60 rounded w-1/3"></div>
              </div>
            </div>
            <div className="h-3 bg-slate-700/40 rounded w-full"></div>
            <div className="flex gap-2 pt-2">
              <div className="h-6 bg-slate-700/50 rounded-full w-16"></div>
              <div className="h-6 bg-slate-700/50 rounded-full w-20"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
