import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import QuickCities from './components/QuickCities';
import CurrentWeather from './components/CurrentWeather';
import WeatherDetails from './components/WeatherDetails';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorMessage from './components/ErrorMessage';
import {
  fetchWeatherData,
  reverseGeocode,
  getWeatherInfo,
  POPULAR_CITIES
} from './services/weatherApi';

const DEFAULT_LOCATION = POPULAR_CITIES[0]; // Jakarta

export default function App() {
  const [location, setLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('last_weather_location');
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [unit, setUnit] = useState(() => {
    return localStorage.getItem('weather_unit') || 'C';
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('weather_favorites');
      return saved ? JSON.parse(saved) : [
        POPULAR_CITIES[0], // Jakarta
        POPULAR_CITIES[2], // Bandung
        POPULAR_CITIES[4], // Denpasar Bali
      ];
    } catch {
      return [];
    }
  });

  // Ambil data cuaca dari API
  const loadWeather = useCallback(async (locToFetch) => {
    const targetLoc = locToFetch || location;
    if (!targetLoc) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(
        targetLoc.latitude,
        targetLoc.longitude,
        targetLoc.timezone || 'auto'
      );
      setWeatherData(data);

      // Simpan lokasi terakhir
      try {
        localStorage.setItem('last_weather_location', JSON.stringify(targetLoc));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
    } catch (err) {
      console.error('Error loadWeather:', err);
      setError('Gagal memuat data cuaca untuk lokasi terpilih. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  }, [location]);

  // Muat cuaca saat aplikasi dibuka atau saat lokasi berganti
  useEffect(() => {
    loadWeather(location);
  }, [location.latitude, location.longitude]);

  // Handler ganti unit suhu (°C / °F)
  const handleToggleUnit = (newUnit) => {
    setUnit(newUnit);
    localStorage.setItem('weather_unit', newUnit);
  };

  // Handler memilih lokasi dari Search atau Chip
  const handleSelectLocation = (newLoc) => {
    setLocation(newLoc);
  };

  // Handler bookmark / favorit
  const handleToggleFavorite = () => {
    if (!location) return;

    const exists = favorites.some(
      (f) => f.name.toLowerCase() === location.name.toLowerCase()
    );

    let updated;
    if (exists) {
      updated = favorites.filter(
        (f) => f.name.toLowerCase() !== location.name.toLowerCase()
      );
    } else {
      updated = [...favorites, location];
    }

    setFavorites(updated);
    try {
      localStorage.setItem('weather_favorites', JSON.stringify(updated));
    } catch (e) {
      console.warn('Gagal simpan favorit:', e);
    }
  };

  const handleRemoveFavorite = (favToRemove) => {
    const updated = favorites.filter(
      (f) => f.name.toLowerCase() !== favToRemove.name.toLowerCase()
    );
    setFavorites(updated);
    try {
      localStorage.setItem('weather_favorites', JSON.stringify(updated));
    } catch (e) {
      console.warn('Gagal simpan favorit:', e);
    }
  };

  // Handler deteksi GPS Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung deteksi lokasi otomatis (Geolocation).');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const detectedLoc = await reverseGeocode(latitude, longitude);
          setLocation(detectedLoc);
        } catch (err) {
          console.error('Gagal reverse geocode GPS:', err);
          setLocation({
            name: 'Lokasi Anda (GPS)',
            admin1: '',
            country: 'Indonesia',
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            timezone: 'auto'
          });
        }
      },
      (err) => {
        setLoading(false);
        console.warn('Geolocation denied or failed:', err);
        alert('Tidak dapat mendeteksi lokasi GPS. Pastikan izin akses lokasi telah diaktifkan di peramban Anda.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Cek apakah lokasi saat ini ada di daftar favorit
  const isCurrentFavorite = favorites.some(
    (f) => f.name.toLowerCase() === location?.name?.toLowerCase()
  );

  // Tentukan tema latar belakang sesuai kondisi cuaca saat ini
  const bgTheme = weatherData?.current
    ? getWeatherInfo(weatherData.current.weatherCode, weatherData.current.isDay).theme
    : 'weather-bg-cloudy';

  return (
    <div className={`min-h-screen ${bgTheme} transition-colors duration-700 py-6 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-5xl mx-auto">
        {/* Header dengan Jam, GPS & Unit Switcher */}
        <Header
          onRefresh={() => loadWeather(location)}
          loading={loading}
          onUseCurrentLocation={handleUseCurrentLocation}
          unit={unit}
          onToggleUnit={handleToggleUnit}
        />

        {/* Kotak Pencarian Daerah / Kota */}
        <SearchBar onSelectLocation={handleSelectLocation} />

        {/* Pilihan Cepat Kota Populer & Favorit */}
        <QuickCities
          currentCityName={location?.name}
          onSelectCity={handleSelectLocation}
          favorites={favorites}
          onRemoveFavorite={handleRemoveFavorite}
        />

        {/* Tampilan Status Loading / Error / Data Cuaca */}
        {loading && !weatherData ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => loadWeather(location)} />
        ) : weatherData ? (
          <main className="space-y-6 animate-in fade-in duration-300">
            {/* Kartu Hero Cuaca Real-Time */}
            <CurrentWeather
              location={location}
              weather={weatherData}
              unit={unit}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={handleToggleFavorite}
            />

            {/* Prakiraan Per Jam (24 Jam) */}
            <HourlyForecast
              hourly={weatherData.hourly}
              unit={unit}
            />

            {/* Metrik Lengkap & Kualitas Udara */}
            <WeatherDetails
              weather={weatherData}
            />

            {/* Prakiraan 7 Hari */}
            <DailyForecast
              daily={weatherData.daily}
              unit={unit}
            />
          </main>
        ) : null}

        {/* Footer */}
        <footer className="text-center py-8 text-xs text-slate-500 border-t border-slate-850/80 mt-12 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} PantauCuaca Real-Time. Data didukung oleh Open-Meteo & WMO.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Pembaruan Otomatis</span>
            <span>•</span>
            <span>Seluruh Daerah Indonesia & Dunia</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
