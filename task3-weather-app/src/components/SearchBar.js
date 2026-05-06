import React, { useState } from 'react';

const styles = {
  wrapper: { display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem' },
  input: {
    flex: 1, minWidth: '200px',
    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '14px', padding: '0.85rem 1.2rem', color: '#e8f4ff',
    fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', outline: 'none',
  },
  btn: {
    background: '#38bdf8', border: 'none', borderRadius: '14px',
    padding: '0.85rem 1.5rem', color: '#0a1628',
    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem',
    cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.2s',
  },
  btnOutline: {
    background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '14px', padding: '0.85rem 1.2rem', color: '#e8f4ff',
    fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '0.9rem',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
    transition: 'background 0.2s',
  },
  unitWrap: { display: 'flex', gap: '6px', marginLeft: 'auto' },
  uBtn: (on) => ({
    background: on ? '#38bdf8' : 'transparent',
    border: `1px solid ${on ? '#38bdf8' : 'rgba(255,255,255,0.2)'}`,
    borderRadius: '8px', padding: '5px 13px',
    color: on ? '#0a1628' : 'rgba(200,225,255,0.6)',
    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.85rem',
    cursor: 'pointer', transition: 'all 0.15s',
  }),
};

export default function SearchBar({ onSearch, onLocate, unit, onUnitChange, loading }) {
  const [city, setCity] = useState('');

  const handleSearch = () => { if (city.trim()) onSearch(city.trim()); };
  const handleKey = (e) => { if (e.key === 'Enter') handleSearch(); };

  return (
    <div style={styles.wrapper}>
      <input
        style={styles.input}
        type="text"
        placeholder="Search city — e.g. Hyderabad, Mumbai, London..."
        value={city}
        onChange={e => setCity(e.target.value)}
        onKeyDown={handleKey}
      />
      <button style={styles.btn} onClick={handleSearch} disabled={loading}>
        {loading ? 'Loading...' : 'Search'}
      </button>
      <button style={styles.btnOutline} onClick={onLocate}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
        </svg>
        My Location
      </button>
      <div style={styles.unitWrap}>
        <button style={styles.uBtn(unit === 'metric')} onClick={() => onUnitChange('metric')}>°C</button>
        <button style={styles.uBtn(unit === 'imperial')} onClick={() => onUnitChange('imperial')}>°F</button>
      </div>
    </div>
  );
}
