import { useState, useCallback } from 'react';

const API_KEY = 'fc6b5e565e3183e0fa990194e46fe892';
const BASE = 'https://api.openweathermap.org';

export function useWeather() {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchByCoords = useCallback(async (lat, lon, unit = 'metric') => {
    setLoading(true);
    setError('');
    try {
      const [curRes, foreRes] = await Promise.all([
        fetch(`${BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`),
        fetch(`${BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`)
      ]);
      const curData = await curRes.json();
      const foreData = await foreRes.json();
      if (curData.cod !== 200) throw new Error(curData.message || 'Failed to fetch weather');
      setCurrent(curData);
      setForecast(foreData);
    } catch (e) {
      setError(e.message || 'Network error. Please try again.');
    }
    setLoading(false);
  }, []);

  const fetchByCity = useCallback(async (city, unit = 'metric') => {
    setLoading(true);
    setError('');
    try {
      const geoRes = await fetch(`${BASE}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`);
      const geoData = await geoRes.json();
      if (!geoData.length) throw new Error(`City "${city}" not found. Try another name.`);
      await fetchByCoords(geoData[0].lat, geoData[0].lon, unit);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }, [fetchByCoords]);

  return { current, forecast, loading, error, fetchByCity, fetchByCoords };
}
