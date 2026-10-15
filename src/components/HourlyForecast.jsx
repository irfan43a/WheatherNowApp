import React from 'react';
import { Clock, Droplets, Wind } from 'lucide-react';
import { WeatherIcon } from '../utils/weatherIcons';

export default function HourlyForecast({ hourly, unit = 'C' }) {
  if (!hourly || hourly.length === 0) return null;

  const formatTemp = (celsius) => {
    if (celsius == null) return '--';
    if (unit === 'F') {
      return `${Math.round((celsius * 9) / 5 + 32)}°`;
    }
    return `${celsius}°`;
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" /> Prakiraan 24 Jam Mendatang
        </h3>
        <span className="text-xs text-slate-400">Geser untuk melihat jam berikutnya →</span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin">
        {hourly.map((item, idx) => {
          const isNow = idx === 0;
          return (
            <div
              key={idx}
              className={`shrink-0 w-24 p-3.5 rounded-2xl flex flex-col items-center justify-between gap-2.5 transition-all text-center ${
                isNow
                  ? 'bg-sky-500/20 border border-sky-400/50 shadow-md shadow-sky-500/10 ring-1 ring-sky-400/30'
                  : 'glass-card glass-card-hover border border-white/5'
              }`}
            >
              <span className={`text-xs font-semibold ${isNow ? 'text-sky-300' : 'text-slate-300'}`}>
                {isNow ? 'Sekarang' : item.hour}
              </span>

              <WeatherIcon
                code={item.weatherCode}
                isDay={item.isDay}
                className="w-8 h-8 drop-shadow-sm"
              />

              <span className="text-base font-bold text-white">
                {formatTemp(item.temp)}
              </span>

              {/* Peluang Hujan */}
              <div className="flex items-center gap-1 text-[11px] font-medium text-sky-300">
                <Droplets className="w-3 h-3 text-sky-400" />
                <span>{item.precipitationProb}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
