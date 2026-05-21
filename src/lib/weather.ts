import { CityData, HourlyForecast, WeatherData } from '../types';
import { fetchWithCache } from './api';
import { config } from './lguConfig';

/**
 * Map OpenWeatherMap icon codes to Lucide icon names
 */
export const mapWeatherIconToLucide = (iconCode: string): string => {
  const iconMap: Record<string, string> = {
    '01d': 'Sun',
    '01n': 'Moon',
    '02d': 'CloudSun',
    '02n': 'CloudMoon',
    '03d': 'Cloud',
    '03n': 'Cloud',
    '04d': 'Cloud',
    '04n': 'Cloud',
    '09d': 'CloudDrizzle',
    '09n': 'CloudDrizzle',
    '10d': 'CloudRain',
    '10n': 'CloudRain',
    '11d': 'CloudLightning',
    '11n': 'CloudLightning',
    '13d': 'CloudSnow',
    '13n': 'CloudSnow',
    '50d': 'Cloud',
    '50n': 'Cloud',
  };
  return iconMap[iconCode] || 'Cloud';
};

/**
 * Fetch weather data for all configured LGUs and transform to frontend type
 */
export const fetchWeatherData = async (): Promise<WeatherData[]> => {
  // Fetch for configured LGU

  /* // Normalize city name for API call (handle special characters)
  const cityName = config.location.weather.defaultCity;
  const cityKey = config.lgu.name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/ñ/g, 'n');

  // Always fetch specific city
  let data = await fetchWithCache(
    `/api/weather?city=${encodeURIComponent(cityName)}`
  );

  // If KV is empty or city missing, fallback to update
  if (!data || Object.keys(data).length === 0) {
    data = await fetchWithCache('/api/weather?update=true');
  }

  const city =
    data[cityKey] ||
    data[config.lgu.name.toLowerCase()] ||
    data[Object.keys(data)[0]];
  if (!city) {
    // Fallback in case API completely failed
    console.warn(`No weather data returned for ${config.lgu.name}`);
    return [];
  }

  // Transform 3-hour forecast (first 4 entries)
  const hourly: HourlyForecast[] = (city.hourly || [])
    .slice(0, 4)
    .map((h: HourlyForecast) => ({
      ...h,
      hour: new Date(h.dt * 1000).toLocaleTimeString([], {
        hour: 'numeric',
        hour12: true,
      }),
      temp: Math.round(h.temp),
      icon: mapWeatherIconToLucide(h.icon),
    }));

  const weatherData: WeatherData = {
    location: city.name || config.lgu.name,
    temperature: Math.round(city.main?.temp ?? 0),
    condition: city.weather?.[0]?.description ?? 'Unknown',
    humidity: city.main?.humidity ?? 0,
    windSpeed: city.wind?.speed ?? 0,
    icon: mapWeatherIconToLucide(city.weather?.[0]?.icon ?? '01d'),
    hourly,
    pressure: city.main?.pressure ?? 0,
    visibility: Math.round((city.visibility ?? 0) / 1000),
  };

  return [weatherData]; */

  try {
    /* 1. Fetch all cities at once in KV Cache.  */
    let data = await fetchWithCache('/api/weather');

    /* 2. Fallback: If KV is empty, trigger a forced cache update */
    if (!data || Object.keys(data).length === 0) {
      data = await fetchWithCache('/api/weather?update=true');
    }

    if (!data || Object.keys(data).length === 0) {
      console.warn('No weather data returned from API');
      return [];
    }

    /* 3. Transform the dict of cities into array of WeatherData objects */
    const allCities: WeatherData[] = Object.values(
      data as Record<string, CityData>
    ).map(city => {
      const hourly: HourlyForecast[] = (city.hourly || [])
        .slice(0, 4)
        .map((h: HourlyForecast) => ({
          ...h,
          hour: new Date(h.dt * 1000).toLocaleTimeString([], {
            hour: 'numeric',
            hour12: true,
          }),
          temp: Math.round(h.temp),
          icon: mapWeatherIconToLucide(h.icon),
        }));

      return {
        location: city.name || 'Unknown Location',
        temperature: Math.round(city.main?.temp ?? 0),
        condition: city.weather?.[0]?.description ?? 'Unknown',
        humidity: city.main?.humidity ?? 0,
        windSpeed: city.wind?.speed ?? 0,
        icon: mapWeatherIconToLucide(city.weather?.[0]?.icon ?? '01d'),
        hourly,
        pressure: city.main?.pressure ?? 0,
        visibility: Math.round((city.visibility ?? 0) / 1000),
      };
    });

    const defaultCityName = (
      config.location.weather.defaultCity || config.lgu.name
    ).toLowerCase();

    return allCities.sort((a, b) => {
      const nameA = a.location.toLowerCase();
      const nameB = b.location.toLowerCase();

      if (nameA === defaultCityName) return -1;
      if (nameB === defaultCityName) return -1;

      return nameA.localeCompare(nameB);
    });
  } catch (error) {
    console.error('Error processing weather data:', error);
    return [];
  }
};
