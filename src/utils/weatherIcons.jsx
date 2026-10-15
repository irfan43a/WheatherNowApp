import React from 'react';
import {
  Sun,
  SunMedium,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudLightning,
  CloudSnow,
  Snowflake,
  Moon,
  CloudMoon,
  HelpCircle
} from 'lucide-react';
import { getWeatherInfo } from '../services/weatherApi';

export function WeatherIcon({ code, isDay = 1, className = "w-8 h-8", size }) {
  const info = getWeatherInfo(code, isDay);
  const iconName = info.icon;

  const props = {
    className,
    size
  };

  switch (iconName) {
    case 'Sun':
      return <Sun {...props} className={`${className} text-amber-400`} />;
    case 'SunMedium':
      return <SunMedium {...props} className={`${className} text-amber-300`} />;
    case 'CloudSun':
      return <CloudSun {...props} className={`${className} text-amber-300`} />;
    case 'Cloud':
      return <Cloud {...props} className={`${className} text-slate-300`} />;
    case 'CloudFog':
      return <CloudFog {...props} className={`${className} text-slate-400`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...props} className={`${className} text-sky-400`} />;
    case 'CloudRain':
      return <CloudRain {...props} className={`${className} text-blue-400`} />;
    case 'CloudRainWind':
      return <CloudRainWind {...props} className={`${className} text-blue-500`} />;
    case 'CloudLightning':
      return <CloudLightning {...props} className={`${className} text-amber-400`} />;
    case 'CloudSnow':
      return <CloudSnow {...props} className={`${className} text-cyan-200`} />;
    case 'Snowflake':
      return <Snowflake {...props} className={`${className} text-cyan-200`} />;
    case 'Moon':
      return <Moon {...props} className={`${className} text-indigo-300`} />;
    case 'CloudMoon':
      return <CloudMoon {...props} className={`${className} text-indigo-200`} />;
    default:
      return <HelpCircle {...props} className={`${className} text-slate-400`} />;
  }
}
