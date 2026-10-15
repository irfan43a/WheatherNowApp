import React from 'react';
import { CalendarDays, Droplets } from 'lucide-react';
import { WeatherIcon } from '../utils/weatherIcons';
import { getWeatherInfo } from '../services/weatherApi';

export default function DailyForecast({ daily, unit = 'C' }) {
  if (!daily || daily.length === 0) return null;

  const formatTemp = (celsius) => {
    if (celsius == null) return '--';
    if (unit === 'F') {
      return `${Math.round((celsius * 9) / 5 + 32)}°`;
    }
    return `${celsius}°`;
  };

  // Cari suhu terendah dan tertinggi global 7 hari untuk bar scaling
  const allMins = daily.map((d) => d.tempMin);
  const allMaxs = daily.map((d) => d.tempMax);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const tempRange = Math.max(1, globalMax - globalMin);

  return (
    <div className="mb-6">
      <h3 className="text-base font-semibold text-slate-200 mb-3 flex items-center gap-2">
        <CalendarDays className="w-4 h-4 text-sky-400" /> Prakiraan 7 Hari Ke Depan
      </h3>

      <div className="rounded-3xl glass-card border border-white/10 p-3 md:p-5 divide-y divide-slate-800/80">
        {daily.map((day, idx) => {
          const info = getWeatherInfo(day.weatherCode, 1);
          
          // Hitung persentase posisi bar suhu
          const leftPercent = Math.max(0, Math.min(100, ((day.tempMin - globalMin) / tempRange) * 100));
          const widthPercent = Math.max(10, Math.min(100 - leftPercent, ((day.tempMax - day.tempMin) / tempRange) * 100));

          return (
            <div
              key={day.date}
              className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-slate-800/40 rounded-xl transition"
            >
              {/* Nama Hari & Tanggal */}
              <div className="w-24 md:w-32 shrink-0">
                <p className="text-sm font-semibold text-white">{day.dayName}</p>
                <p className="text-xs text-slate-400">{day.dateFormatted}</p>
              </div>

              {/* Ikon & Kondisi */}
              <div className="flex items-center gap-2.5 w-32 md:w-40 shrink-0">
                <WeatherIcon code={day.weatherCode} isDay={1} className="w-6 h-6 shrink-0" />
                <span className="text-xs font-medium text-slate-300 truncate hidden sm:inline">
                  {info.label}
                </span>
              </div>

              {/* Peluang Hujan */}
              <div className="w-16 shrink-0 flex items-center gap-1 text-xs text-sky-300">
                {day.precipitationProb > 0 ? (
                  <>
                    <Droplets className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>{day.precipitationProb}%</span>
                  </>
                ) : (
                  <span className="text-slate-500">-</span>
                )}
              </div>

              {/* Bar Rentang Suhu & Nilai Min/Max */}
              <div className="flex items-center gap-3 flex-1 justify-end max-w-xs">
                <span className="text-xs text-slate-400 w-7 text-right font-medium">
                  {formatTemp(day.tempMin)}
                </span>

                <div className="flex-1 h-2 bg-slate-800 rounded-full relative overflow-hidden hidden sm:block">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-300 to-rose-500"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                <span className="text-xs text-white w-7 font-bold">
                  {formatTemp(day.tempMax)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
