import React from 'react';
import {
  Droplets,
  Wind,
  Compass,
  Gauge,
  Sunrise,
  Sunset,
  Sun,
  ShieldAlert,
  CloudRain,
  Eye,
  Cloud
} from 'lucide-react';
import { getUVInfo } from '../services/weatherApi';

export default function WeatherDetails({ weather }) {
  if (!weather) return null;

  const { current, airQuality, today } = weather;
  const uvInfo = getUVInfo(today?.uvMax);

  // Format sunrise and sunset
  const formatTimeOnly = (isoString) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // Convert wind degrees to cardinal direction
  const getWindDirection = (deg) => {
    if (deg == null) return '';
    const directions = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  const detailsList = [
    {
      title: 'Kelembaban Udara',
      value: `${current.humidity}%`,
      subtitle: current.humidity > 70 ? 'Cukup lembab' : current.humidity < 40 ? 'Kering' : 'Normal',
      icon: Droplets,
      iconColor: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
    },
    {
      title: 'Kecepatan Angin',
      value: `${current.windSpeed} km/j`,
      subtitle: `Arah ${getWindDirection(current.windDirection)} (${current.windDirection}°) • Hembusan ${current.windGusts} km/j`,
      icon: Wind,
      iconColor: 'text-teal-400',
      bgColor: 'bg-teal-500/10',
    },
    {
      title: 'Indeks UV Maksimal',
      value: today?.uvMax != null ? today.uvMax.toFixed(1) : '-',
      subtitle: uvInfo.level,
      badge: uvInfo.badge,
      icon: Sun,
      iconColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Tekanan Udara',
      value: `${current.pressure} hPa`,
      subtitle: current.pressure > 1013 ? 'Tekanan tinggi' : 'Tekanan normal',
      icon: Gauge,
      iconColor: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
    },
    {
      title: 'Curah Hujan & Awan',
      value: `${current.precipitation} mm`,
      subtitle: `Tutupan awan: ${current.cloudCover}%`,
      icon: CloudRain,
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Matahari Terbit & Terbenam',
      value: `${formatTimeOnly(today?.sunrise)} / ${formatTimeOnly(today?.sunset)}`,
      subtitle: 'Waktu terbit & terbenam lokal',
      icon: Sunrise,
      iconColor: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-base font-semibold text-slate-200 mb-3 flex items-center gap-2">
        <Gauge className="w-4 h-4 text-sky-400" /> Metrik Cuaca Lengkap
      </h3>

      {/* Grid 6 Kartu Metrik Cuaca */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-4">
        {detailsList.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl glass-card glass-card-hover border border-white/5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">{item.title}</span>
                <div className={`p-2 rounded-xl ${item.bgColor}`}>
                  <Icon className={`w-4 h-4 ${item.iconColor}`} />
                </div>
              </div>
              <div>
                <p className="text-lg md:text-xl font-bold text-white mb-0.5">{item.value}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-400 truncate">{item.subtitle}</p>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${item.badge}`}>
                      {item.subtitle}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kualitas Udara (AQI Card) */}
      {airQuality && (
        <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-200">Indeks Kualitas Udara (AQI)</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${airQuality.badge}`}>
                  {airQuality.level}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{airQuality.advice}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/5">
              <span className="text-slate-400">AQI: </span>
              <span className="font-bold text-white text-sm">{airQuality.aqi || '--'}</span>
            </div>
            {airQuality.pm25 != null && (
              <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/5">
                <span className="text-slate-400">PM2.5: </span>
                <span className="font-bold text-white text-sm">{airQuality.pm25} µg/m³</span>
              </div>
            )}
            {airQuality.pm10 != null && (
              <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/5">
                <span className="text-slate-400">PM10: </span>
                <span className="font-bold text-white text-sm">{airQuality.pm10} µg/m³</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
