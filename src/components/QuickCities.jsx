import React from 'react';
import { POPULAR_CITIES } from '../services/weatherApi';
import { Star, MapPin, X } from 'lucide-react';

export default function QuickCities({ 
  currentCityName, 
  onSelectCity, 
  favorites = [], 
  onRemoveFavorite 
}) {
  return (
    <div className="w-full mb-6 space-y-3">
      {/* Favorit Pengguna jika ada */}
      {favorites.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 shrink-0 mr-1">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>Favorit:</span>
          </div>
          {favorites.map((fav) => {
            const isActive = currentCityName?.toLowerCase() === fav.name.toLowerCase();
            return (
              <div
                key={`fav-${fav.name}-${fav.latitude}`}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all shrink-0 ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
                    : 'glass-card text-slate-300 hover:text-white border-white/10 hover:border-amber-400/40'
                }`}
              >
                <button
                  onClick={() => onSelectCity(fav)}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{fav.name}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavorite(fav);
                  }}
                  title="Hapus dari favorit"
                  className="opacity-60 hover:opacity-100 p-0.5 rounded-full hover:bg-slate-700/50 cursor-pointer ml-1"
                >
                  <X className="w-2.5 h-2.5 text-slate-400 hover:text-red-400" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Preset Kota-Kota Populer Indonesia */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-medium text-slate-400 shrink-0 mr-1">
          Pilihan Cepat:
        </span>
        {POPULAR_CITIES.map((city) => {
          const isActive = currentCityName?.toLowerCase() === city.name.toLowerCase();
          return (
            <button
              key={city.name}
              onClick={() => onSelectCity(city)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-sky-500 text-white font-semibold shadow-md shadow-sky-500/30 ring-1 ring-sky-300'
                  : 'glass-card text-slate-300 hover:text-white border border-white/5 hover:border-white/20 active:scale-95'
              }`}
            >
              {city.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
