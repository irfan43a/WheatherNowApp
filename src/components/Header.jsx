import React, { useState, useEffect } from 'react';
import { CloudSun, RefreshCw, Navigation, Sparkles } from 'lucide-react';

export default function Header({ 
  onRefresh, 
  loading, 
  onUseCurrentLocation, 
  unit, 
  onToggleUnit 
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const dateString = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-2 border-b border-slate-800/80 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/25 ring-1 ring-white/20">
          <CloudSun className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              PantauCuaca
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Real-Time
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {dateString} • <span className="font-mono text-slate-300 font-medium">{timeString}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap justify-center">
        {/* Tombol Lokasi Saya (GPS) */}
        <button
          onClick={onUseCurrentLocation}
          title="Gunakan lokasi saya saat ini"
          className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl glass-card glass-card-hover text-sky-300 hover:text-sky-200 border border-sky-500/30 active:scale-95 cursor-pointer"
        >
          <Navigation className="w-4 h-4 text-sky-400 animate-pulse" />
          <span className="hidden sm:inline">Lokasi Saya</span>
        </button>

        {/* Toggle Unit Suhu (°C / °F) */}
        <div className="flex items-center p-1 rounded-xl glass-card border border-white/10">
          <button
            onClick={() => onToggleUnit('C')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              unit === 'C'
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => onToggleUnit('F')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              unit === 'F'
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            °F
          </button>
        </div>

        {/* Tombol Refresh Cuaca */}
        <button
          onClick={onRefresh}
          disabled={loading}
          title="Perbarui Data Cuaca"
          className="p-2.5 rounded-xl glass-card glass-card-hover text-slate-300 hover:text-white border border-white/10 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-400' : ''}`} />
        </button>
      </div>
    </header>
  );
}
