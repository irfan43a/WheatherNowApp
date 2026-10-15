import React from 'react';
import { MapPin, Star, ArrowUp, ArrowDown, Lightbulb, Clock } from 'lucide-react';
import { WeatherIcon } from '../utils/weatherIcons';
import { getWeatherInfo } from '../services/weatherApi';

export default function CurrentWeather({ 
  location, 
  weather, 
  unit = 'C', 
  isFavorite = false, 
  onToggleFavorite 
}) {
  if (!weather || !location) return null;

  const current = weather.current;
  const today = weather.today;
  const weatherInfo = getWeatherInfo(current.weatherCode, current.isDay);

  // Fungsi konversi Celcius ke Fahrenheit bila dibutuhkan
  const formatTemp = (celsius) => {
    if (celsius == null) return '--';
    if (unit === 'F') {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${celsius}°C`;
  };

  const updatedTime = current.time 
    ? new Date(current.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }) 
    : '';

  return (
    <div className="relative overflow-hidden rounded-3xl glass-card p-6 md:p-8 border border-white/10 shadow-2xl mb-6">
      {/* Background ambient glow effect */}
      <div className={`absolute -right-16 -top-16 w-64 h-64 rounded-full bg-gradient-to-br ${weatherInfo.color} opacity-20 blur-3xl pointer-events-none animate-pulse-glow`}></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Info Lokasi & Waktu */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <MapPin className="w-5 h-5 text-sky-400" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {location.name}
                </h2>
                <button
                  onClick={onToggleFavorite}
                  title={isFavorite ? "Hapus dari Favorit" : "Simpan ke Favorit"}
                  className="p-1.5 rounded-xl hover:bg-slate-800 transition active:scale-90 cursor-pointer"
                >
                  <Star className={`w-5 h-5 transition ${isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-500 hover:text-amber-300'}`} />
                </button>
              </div>
              <p className="text-sm text-slate-400">
                {[location.admin1, location.country].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>

          {/* Badge Kondisi Cuaca */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/15 backdrop-blur-md">
              {weatherInfo.label}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> Pembaruan: {updatedTime} WIB
            </span>
          </div>

          {/* Saran Cerdas */}
          <div className="mt-3 flex items-start gap-2.5 p-3 rounded-2xl bg-sky-950/40 border border-sky-500/20 max-w-lg">
            <Lightbulb className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <p className="text-xs text-sky-200/90 leading-relaxed">
              {weatherInfo.tip}
            </p>
          </div>
        </div>

        {/* Suhu & Ikon Cuaca Utama */}
        <div className="flex items-center gap-6 md:gap-8 self-start md:self-auto">
          <div className="relative">
            <WeatherIcon
              code={current.weatherCode}
              isDay={current.isDay}
              className="w-24 h-24 md:w-28 md:h-28 drop-shadow-[0_10px_20px_rgba(56,189,248,0.25)]"
            />
          </div>

          <div className="space-y-1">
            <div className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white">
              {formatTemp(current.temp)}
            </div>
            <p className="text-xs md:text-sm text-slate-300 font-medium">
              Terasa seperti <span className="font-semibold text-white">{formatTemp(current.feelsLike)}</span>
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
              <span className="flex items-center text-rose-400 font-semibold gap-0.5">
                <ArrowUp className="w-3.5 h-3.5" /> {formatTemp(today.tempMax)}
              </span>
              <span className="flex items-center text-cyan-400 font-semibold gap-0.5">
                <ArrowDown className="w-3.5 h-3.5" /> {formatTemp(today.tempMin)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
