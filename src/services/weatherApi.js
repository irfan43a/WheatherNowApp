// Service untuk mengelola interaksi API Cuaca dan Geocoding (Open-Meteo)

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

/**
 * Peta kode cuaca WMO (World Meteorological Organization) ke deskripsi Bahasa Indonesia
 */
export const WMO_WEATHER_MAP = {
  0: { label: 'Cerah', icon: 'Sun', color: 'from-amber-400 to-orange-500', theme: 'weather-bg-sunny', tip: 'Cuaca cerah benderang! Jangan lupa gunakan tabir surya jika beraktivitas di luar.' },
  1: { label: 'Sebagian Besar Cerah', icon: 'SunMedium', color: 'from-amber-300 to-yellow-500', theme: 'weather-bg-sunny', tip: 'Hari yang menyenangkan untuk beraktivitas santai di luar ruangan.' },
  2: { label: 'Sebagian Berawan', icon: 'CloudSun', color: 'from-sky-300 to-amber-200', theme: 'weather-bg-cloudy', tip: 'Matahari sesekali tertutup awan, udara terasa cukup nyaman.' },
  3: { label: 'Mendung Berawan', icon: 'Cloud', color: 'from-slate-300 to-slate-500', theme: 'weather-bg-cloudy', tip: 'Awan mendung tebal menyelimuti langit, siapkan payung untuk berjaga-jaga.' },
  45: { label: 'Berkabut', icon: 'CloudFog', color: 'from-gray-300 to-slate-400', theme: 'weather-bg-cloudy', tip: 'Jarak pandang terbatas karena kabut, harap berhati-hati saat berkendara.' },
  48: { label: 'Kabut Tebal Berembun', icon: 'CloudFog', color: 'from-gray-300 to-slate-400', theme: 'weather-bg-cloudy', tip: 'Kabut tebal dingin, pastikan lampu kendaraan menyala.' },
  51: { label: 'Gerimis Ringan', icon: 'CloudDrizzle', color: 'from-sky-300 to-blue-400', theme: 'weather-bg-rainy', tip: 'Gerimis lembut turun, kenakan jaket atau bawa payung kecil.' },
  53: { label: 'Gerimis Sedang', icon: 'CloudDrizzle', color: 'from-sky-400 to-blue-500', theme: 'weather-bg-rainy', tip: 'Gerimis cukup konsisten, hindari berbasah-basahan terlalu lama.' },
  55: { label: 'Gerimis Lebat', icon: 'CloudDrizzle', color: 'from-blue-400 to-indigo-500', theme: 'weather-bg-rainy', tip: 'Gerimis cukup lebat, gunakan payung atau jas hujan.' },
  56: { label: 'Gerimis Dingin Membeku', icon: 'CloudSnow', color: 'from-cyan-300 to-blue-400', theme: 'weather-bg-rainy', tip: 'Suhu cukup dingin disertai gerimis.' },
  57: { label: 'Gerimis Membeku Lebat', icon: 'CloudSnow', color: 'from-cyan-300 to-blue-500', theme: 'weather-bg-rainy', tip: 'Cuaca dingin dan basah, kenakan pakaian hangat.' },
  61: { label: 'Hujan Ringan', icon: 'CloudRain', color: 'from-blue-300 to-sky-500', theme: 'weather-bg-rainy', tip: 'Hujan rintik-rintik, jangan lupa membawa payung saat keluar.' },
  63: { label: 'Hujan Sedang', icon: 'CloudRain', color: 'from-blue-400 to-blue-600', theme: 'weather-bg-rainy', tip: 'Hujan sedang turun, siapkan jas hujan jika mengendarai sepeda motor.' },
  65: { label: 'Hujan Lebat', icon: 'CloudRain', color: 'from-blue-600 to-indigo-700', theme: 'weather-bg-rainy', tip: 'Hujan lebat! Waspadai genangan air dan jalanan licin.' },
  66: { label: 'Hujan Membeku Ringan', icon: 'CloudSnow', color: 'from-cyan-400 to-blue-600', theme: 'weather-bg-rainy', tip: 'Hujan sangat dingin, jaga kondisi tubuh tetap hangat.' },
  67: { label: 'Hujan Membeku Lebat', icon: 'CloudSnow', color: 'from-cyan-500 to-blue-800', theme: 'weather-bg-rainy', tip: 'Kondisi cuaca dingin ekstrem dan hujan lebat.' },
  71: { label: 'Salju Ringan', icon: 'Snowflake', color: 'from-blue-100 to-sky-300', theme: 'weather-bg-night', tip: 'Salju tipis mulai turun.' },
  73: { label: 'Salju Sedang', icon: 'Snowflake', color: 'from-blue-200 to-sky-400', theme: 'weather-bg-night', tip: 'Hujan salju sedang berlangsung, kenakan pakaian berlapis.' },
  75: { label: 'Salju Lebat', icon: 'Snowflake', color: 'from-blue-300 to-indigo-400', theme: 'weather-bg-night', tip: 'Hujan salju lebat, tetap berada di dalam ruangan jika memungkinkan.' },
  77: { label: 'Butiran Salju / Hujan Es Halus', icon: 'Snowflake', color: 'from-blue-200 to-cyan-300', theme: 'weather-bg-night', tip: 'Butiran salju kecil berjatuhan.' },
  80: { label: 'Hujan Rintik Sesaat', icon: 'CloudRain', color: 'from-sky-400 to-blue-500', theme: 'weather-bg-rainy', tip: 'Hujan rintik datang dan pergi, sedia payung.' },
  81: { label: 'Hujan Deras Sesaat', icon: 'CloudRain', color: 'from-blue-500 to-blue-700', theme: 'weather-bg-rainy', tip: 'Hujan lebat mendadak, berteduhlah di tempat yang aman.' },
  82: { label: 'Hujan Badai Sangat Lebat', icon: 'CloudRainWind', color: 'from-blue-600 to-indigo-900', theme: 'weather-bg-rainy', tip: 'Hujan sangat deras! Berhati-hati di jalan dan hindari pohon besar.' },
  85: { label: 'Hujan Salju Ringan', icon: 'CloudSnow', color: 'from-slate-200 to-sky-300', theme: 'weather-bg-night', tip: 'Salju ringan turun sesaat.' },
  86: { label: 'Hujan Salju Lebat', icon: 'CloudSnow', color: 'from-slate-300 to-sky-400', theme: 'weather-bg-night', tip: 'Hujan salju lebat turun sesaat.' },
  95: { label: 'Badai Petir', icon: 'CloudLightning', color: 'from-amber-400 to-purple-600', theme: 'weather-bg-thunderstorm', tip: 'Petir menyambar! Hindari area terbuka dan cabut alat elektronik yang rentan.' },
  96: { label: 'Badai Petir & Hujan Es Ringan', icon: 'CloudLightning', color: 'from-amber-400 to-indigo-700', theme: 'weather-bg-thunderstorm', tip: 'Waspada badai disertai butiran es dan kilatan petir.' },
  99: { label: 'Badai Petir & Hujan Es Lebat', icon: 'CloudLightning', color: 'from-red-400 to-purple-800', theme: 'weather-bg-thunderstorm', tip: 'Peringatan cuaca ekstrem! Berlindung di bangunan kokoh.' },
};

/**
 * Ambil informasi interpretasi cuaca berdasarkan WMO code
 */
export function getWeatherInfo(code, isDay = 1) {
  const defaultInfo = {
    label: 'Cerah Berawan',
    icon: 'CloudSun',
    color: 'from-sky-400 to-amber-200',
    theme: isDay ? 'weather-bg-sunny' : 'weather-bg-night',
    tip: 'Kondisi cuaca terpantau normal.'
  };

  const info = WMO_WEATHER_MAP[code] || defaultInfo;

  // Jika malam hari dan cuaca cerah/sebagian cerah, sesuaikan icon dan theme
  if (!isDay && (code === 0 || code === 1)) {
    return {
      ...info,
      label: code === 0 ? 'Malam Cerah' : 'Malam Sebagian Cerah',
      icon: 'Moon',
      color: 'from-indigo-300 to-purple-500',
      theme: 'weather-bg-night',
      tip: 'Langit malam bersih, pemandangan bintang tampak indah.'
    };
  }

  if (!isDay && (code === 2)) {
    return {
      ...info,
      label: 'Malam Berawan',
      icon: 'CloudMoon',
      color: 'from-slate-300 to-indigo-400',
      theme: 'weather-bg-night',
      tip: 'Malam berawan dengan udara sejuk.'
    };
  }

  return info;
}

/**
 * Interpretasi Kualitas Udara (US AQI)
 */
export function getAirQualityInfo(aqi) {
  if (aqi == null) return { level: 'Tidak Ada Data', color: 'text-gray-400', badge: 'bg-gray-500/20 text-gray-300', advice: 'Data tidak tersedia' };
  if (aqi <= 50) return { level: 'Baik', color: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', advice: 'Kualitas udara sangat sehat untuk kegiatan luar.' };
  if (aqi <= 100) return { level: 'Sedang', color: 'text-yellow-400', badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', advice: 'Udara dapat diterima, kelompok sensitif disarankan waspada.' };
  if (aqi <= 150) return { level: 'Sensitif', color: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30', advice: 'Penderita alergi atau asma sebaiknya kurangi aktivitas berat di luar.' };
  if (aqi <= 200) return { level: 'Tidak Sehat', color: 'text-red-400', badge: 'bg-red-500/20 text-red-300 border-red-500/30', advice: 'Kenakan masker pelindung saat berada di luar.' };
  if (aqi <= 300) return { level: 'Sangat Tidak Sehat', color: 'text-purple-400', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30', advice: 'Kualitas udara buruk, batasi kegiatan di luar ruangan.' };
  return { level: 'Berbahaya', color: 'text-rose-500', badge: 'bg-rose-500/30 text-rose-300 border-rose-500/50', advice: 'Hindari aktivitas di luar ruangan sama sekali!' };
}

/**
 * Interpretasi Indeks UV
 */
export function getUVInfo(uv) {
  if (uv == null) return { level: '-', badge: 'bg-gray-500/20 text-gray-300' };
  if (uv < 3) return { level: 'Rendah', badge: 'bg-emerald-500/20 text-emerald-300' };
  if (uv < 6) return { level: 'Sedang', badge: 'bg-yellow-500/20 text-yellow-300' };
  if (uv < 8) return { level: 'Tinggi', badge: 'bg-orange-500/20 text-orange-300' };
  if (uv < 11) return { level: 'Sangat Tinggi', badge: 'bg-red-500/20 text-red-300' };
  return { level: 'Ekstrem', badge: 'bg-purple-500/20 text-purple-300' };
}

/**
 * Cari daerah atau kota dengan Open-Meteo Geocoding API
 */
export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(query.trim())}&count=10&language=id&format=json`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Gagal mengambil data lokasi');
    const data = await res.json();
    
    if (!data.results || !data.results.length) return [];
    
    return data.results.map((item) => ({
      id: item.id,
      name: item.name,
      admin1: item.admin1 || '',
      country: item.country || '',
      countryCode: item.country_code || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'auto',
      displayName: `${item.name}${item.admin1 ? ', ' + item.admin1 : ''}${item.country ? ' (' + item.country + ')' : ''}`,
    }));
  } catch (error) {
    console.error('Error saat mencari lokasi:', error);
    throw error;
  }
}

/**
 * Ambil data cuaca lengkap berdasarkan koordinat
 */
export async function fetchWeatherData(latitude, longitude, timezone = 'auto') {
  try {
    const weatherParams = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'rain',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m'
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'weather_code',
        'precipitation_probability',
        'wind_speed_10m'
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'sunrise',
        'sunset',
        'uv_index_max',
        'precipitation_sum',
        'precipitation_probability_max',
        'wind_speed_10m_max'
      ].join(','),
      timezone: timezone || 'auto',
      forecast_days: '7'
    });

    const weatherUrl = `${WEATHER_BASE_URL}?${weatherParams.toString()}`;
    const airQualityUrl = `${AIR_QUALITY_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=pm10,pm2_5,us_aqi`;

    // Fetch data cuaca & kualitas udara secara paralel
    const [weatherRes, aqiRes] = await Promise.allSettled([
      fetch(weatherUrl),
      fetch(airQualityUrl)
    ]);

    if (weatherRes.status !== 'fulfilled' || !weatherRes.value.ok) {
      throw new Error('Gagal mengambil data cuaca dari server.');
    }

    const weatherData = await weatherRes.value.json();

    let aqiData = null;
    if (aqiRes.status === 'fulfilled' && aqiRes.value.ok) {
      try {
        aqiData = await aqiRes.value.json();
      } catch (e) {
        console.warn('Gagal parsing data AQI:', e);
      }
    }

    return {
      raw: weatherData,
      current: {
        time: weatherData.current.time,
        temp: Math.round(weatherData.current.temperature_2m),
        feelsLike: Math.round(weatherData.current.apparent_temperature),
        humidity: weatherData.current.relative_humidity_2m,
        isDay: weatherData.current.is_day,
        precipitation: weatherData.current.precipitation,
        rain: weatherData.current.rain,
        weatherCode: weatherData.current.weather_code,
        cloudCover: weatherData.current.cloud_cover,
        pressure: Math.round(weatherData.current.pressure_msl || weatherData.current.surface_pressure),
        windSpeed: Math.round(weatherData.current.wind_speed_10m),
        windDirection: weatherData.current.wind_direction_10m,
        windGusts: Math.round(weatherData.current.wind_gusts_10m || 0),
      },
      hourly: formatHourlyForecast(weatherData.hourly, weatherData.current.time),
      daily: formatDailyForecast(weatherData.daily),
      airQuality: aqiData?.current ? {
        aqi: aqiData.current.us_aqi,
        pm25: aqiData.current.pm2_5,
        pm10: aqiData.current.pm10,
        ...getAirQualityInfo(aqiData.current.us_aqi),
      } : null,
      today: {
        sunrise: weatherData.daily.sunrise?.[0],
        sunset: weatherData.daily.sunset?.[0],
        uvMax: weatherData.daily.uv_index_max?.[0],
        tempMax: Math.round(weatherData.daily.temperature_2m_max?.[0]),
        tempMin: Math.round(weatherData.daily.temperature_2m_min?.[0]),
      }
    };
  } catch (error) {
    console.error('Error saat fetchWeatherData:', error);
    throw error;
  }
}

/**
 * Format prakiraan 24 jam ke depan
 */
function formatHourlyForecast(hourlyData, currentTimeStr) {
  if (!hourlyData || !hourlyData.time) return [];

  const now = new Date(currentTimeStr);
  const result = [];
  
  // Ambil jam yang relevan mulai dari waktu sekarang hingga 24 jam ke depan
  for (let i = 0; i < hourlyData.time.length; i++) {
    const itemDate = new Date(hourlyData.time[i]);
    // Mulai dari jam saat ini
    if (itemDate >= now || i === 0 && itemDate.getHours() === now.getHours()) {
      result.push({
        time: hourlyData.time[i],
        hour: itemDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }),
        temp: Math.round(hourlyData.temperature_2m[i]),
        humidity: hourlyData.relative_humidity_2m[i],
        weatherCode: hourlyData.weather_code[i],
        precipitationProb: hourlyData.precipitation_probability ? hourlyData.precipitation_probability[i] : 0,
        windSpeed: Math.round(hourlyData.wind_speed_10m[i]),
        isDay: itemDate.getHours() >= 6 && itemDate.getHours() < 18 ? 1 : 0
      });
      if (result.length >= 24) break;
    }
  }

  // Jika hasil filter kurang dari 24, fallback ambil 24 jam pertama
  if (result.length === 0) {
    for (let i = 0; i < Math.min(24, hourlyData.time.length); i++) {
      const itemDate = new Date(hourlyData.time[i]);
      result.push({
        time: hourlyData.time[i],
        hour: itemDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }),
        temp: Math.round(hourlyData.temperature_2m[i]),
        humidity: hourlyData.relative_humidity_2m[i],
        weatherCode: hourlyData.weather_code[i],
        precipitationProb: hourlyData.precipitation_probability ? hourlyData.precipitation_probability[i] : 0,
        windSpeed: Math.round(hourlyData.wind_speed_10m[i]),
        isDay: itemDate.getHours() >= 6 && itemDate.getHours() < 18 ? 1 : 0
      });
    }
  }

  return result;
}

/**
 * Format prakiraan 7 hari
 */
function formatDailyForecast(dailyData) {
  if (!dailyData || !dailyData.time) return [];

  const daysIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  return dailyData.time.map((timeStr, idx) => {
    const d = new Date(timeStr);
    const dayName = idx === 0 ? 'Hari Ini' : idx === 1 ? 'Besok' : daysIndo[d.getDay()];
    const dateFormatted = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

    return {
      date: timeStr,
      dayName,
      dateFormatted,
      weatherCode: dailyData.weather_code[idx],
      tempMax: Math.round(dailyData.temperature_2m_max[idx]),
      tempMin: Math.round(dailyData.temperature_2m_min[idx]),
      precipitationProb: dailyData.precipitation_probability_max ? dailyData.precipitation_probability_max[idx] : 0,
      precipitationSum: dailyData.precipitation_sum ? dailyData.precipitation_sum[idx] : 0,
      uvMax: dailyData.uv_index_max ? dailyData.uv_index_max[idx] : 0,
      sunrise: dailyData.sunrise ? dailyData.sunrise[idx] : null,
      sunset: dailyData.sunset ? dailyData.sunset[idx] : null,
    };
  });
}

/**
 * Reverse geocode untuk koordinat browser geolocation
 */
export async function reverseGeocode(latitude, longitude) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=id`;
    const res = await fetch(url, { headers: { 'User-Agent': 'WeatherAppClient/1.0' } });
    if (!res.ok) throw new Error('Reverse geocode failed');
    const data = await res.json();
    const city = data.address?.city || data.address?.town || data.address?.regency || data.address?.county || data.address?.suburb || 'Lokasi Saya';
    const state = data.address?.state || '';
    const country = data.address?.country || 'Indonesia';

    return {
      name: city,
      admin1: state,
      country: country,
      displayName: `${city}${state ? ', ' + state : ''} (${country})`,
      latitude,
      longitude,
    };
  } catch (error) {
    console.warn('Fallback reverse geocoding:', error);
    return {
      name: 'Lokasi Anda',
      admin1: '',
      country: 'Indonesia',
      displayName: 'Lokasi Terdeteksi (GPS)',
      latitude,
      longitude,
    };
  }
}

/**
 * Daftar preset kota populer di Indonesia
 */
export const POPULAR_CITIES = [
  { name: 'Jakarta', admin1: 'DKI Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456, timezone: 'Asia/Jakarta' },
  { name: 'Surabaya', admin1: 'Jawa Timur', country: 'Indonesia', latitude: -7.2575, longitude: 112.7521, timezone: 'Asia/Jakarta' },
  { name: 'Bandung', admin1: 'Jawa Barat', country: 'Indonesia', latitude: -6.9175, longitude: 107.6191, timezone: 'Asia/Jakarta' },
  { name: 'Medan', admin1: 'Sumatera Utara', country: 'Indonesia', latitude: 3.5952, longitude: 98.6722, timezone: 'Asia/Jakarta' },
  { name: 'Denpasar (Bali)', admin1: 'Bali', country: 'Indonesia', latitude: -8.6705, longitude: 115.2126, timezone: 'Asia/Makassar' },
  { name: 'Yogyakarta', admin1: 'DI Yogyakarta', country: 'Indonesia', latitude: -7.7956, longitude: 110.3695, timezone: 'Asia/Jakarta' },
  { name: 'Makassar', admin1: 'Sulawesi Selatan', country: 'Indonesia', latitude: -5.1477, longitude: 119.4327, timezone: 'Asia/Makassar' },
  { name: 'Semarang', admin1: 'Jawa Tengah', country: 'Indonesia', latitude: -6.9667, longitude: 110.4167, timezone: 'Asia/Jakarta' },
  { name: 'Malang', admin1: 'Jawa Timur', country: 'Indonesia', latitude: -7.9797, longitude: 112.6304, timezone: 'Asia/Jakarta' },
  { name: 'Balikpapan', admin1: 'Kalimantan Timur', country: 'Indonesia', latitude: -1.2654, longitude: 116.8312, timezone: 'Asia/Makassar' },
  { name: 'Palembang', admin1: 'Sumatera Selatan', country: 'Indonesia', latitude: -2.9761, longitude: 104.7754, timezone: 'Asia/Jakarta' },
];
