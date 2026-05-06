import React, { useState, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import { useWeather } from './hooks/useWeather';

const s = {
  container: { maxWidth: '920px', margin: '0 auto', padding: '2rem 1rem 4rem' },
  header: { textAlign: 'center', marginBottom: '2.5rem' },
  h1: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800,
    background: 'linear-gradient(135deg, #e8f4ff 30%, #38bdf8 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text', letterSpacing: '-1px',
  },
  subtitle: { color: 'rgba(200,225,255,0.6)', fontSize: '1rem', marginTop: '0.4rem' },
  errBox: {
    padding: '1rem 1.2rem', borderRadius: '14px', marginBottom: '1.5rem',
    background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)',
    color: '#fca5a5', fontSize: '0.95rem', textAlign: 'center',
  },
  foreCard: {
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)',
    borderRadius: '24px', padding: '2rem', marginBottom: '1.5rem',
    backdropFilter: 'blur(12px)', animation: 'fadeUp 0.5s ease 0.2s forwards', opacity: 0,
  },
  secTitle: {
    fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.1em',
    color: 'rgba(200,225,255,0.5)', marginBottom: '0.9rem',
  },
};

export default function App() {
  const [unit, setUnit] = useState('metric');
  const { current, forecast, loading, error, fetchByCity, fetchByCoords } = useWeather();

  const handleSearch = useCallback((city) => {
    fetchByCity(city, unit);
  }, [fetchByCity, unit]);

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) { alert('Geolocation not supported by your browser.'); return; }
    navigator.geolocation.getCurrentPosition(
      pos => fetchByCoords(pos.coords.latitude, pos.coords.longitude, unit),
      () => alert('Location access denied. Please search by city name.')
    );
  }, [fetchByCoords, unit]);

  const handleUnitChange = useCallback((newUnit) => {
    setUnit(newUnit);
    if (current) fetchByCoords(current.coord.lat, current.coord.lon, newUnit);
  }, [current, fetchByCoords]);

  return (
    <div style={s.container}>
      <header style={s.header}>
        <h1 style={s.h1}>☁ SkyWatch</h1>
        <p style={s.subtitle}>Real-time weather &amp; 5-day forecast powered by OpenWeatherMap</p>
      </header>

      <SearchBar
        onSearch={handleSearch}
        onLocate={handleLocate}
        unit={unit}
        onUnitChange={handleUnitChange}
        loading={loading}
      />

      {error && <div style={s.errBox}>{error}</div>}

      {current && <CurrentWeather data={current} unit={unit} />}

      {forecast && (
        <div style={s.foreCard}>
          <div style={s.secTitle}>Hourly Forecast — Next 24h</div>
          <HourlyForecast list={forecast.list} unit={unit} />
          <div style={{ ...s.secTitle, marginTop: '1.5rem' }}>5-Day Forecast</div>
          <DailyForecast list={forecast.list} />
        </div>
      )}
    </div>
  );
}
