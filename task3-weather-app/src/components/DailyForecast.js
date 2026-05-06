import React from 'react';

const s = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px' },
  card: {
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px', padding: '0.9rem 0.7rem', textAlign: 'center',
    backdropFilter: 'blur(6px)', transition: 'border-color 0.2s, transform 0.2s', cursor: 'default',
  },
  day: {
    fontFamily: "'Syne', sans-serif", fontSize: '0.75rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(200,225,255,0.5)',
    marginBottom: '7px',
  },
  icon: { width: '44px', height: '44px', margin: '0 auto 6px', display: 'block' },
  desc: { fontSize: '0.7rem', color: 'rgba(200,225,255,0.5)', marginBottom: '7px', textTransform: 'capitalize' },
  temps: { display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '0.88rem' },
  hi: { fontWeight: 600 },
  lo: { color: 'rgba(200,225,255,0.5)' },
};

export default function DailyForecast({ list }) {
  const days = {};
  list.forEach(item => {
    const key = new Date(item.dt * 1000).toDateString();
    if (!days[key]) days[key] = [];
    days[key].push(item);
  });

  return (
    <div style={s.grid}>
      {Object.keys(days).slice(0, 5).map(key => {
        const items = days[key];
        const mid = items[Math.floor(items.length / 2)];
        const hi = Math.max(...items.map(i => i.main.temp_max));
        const lo = Math.min(...items.map(i => i.main.temp_min));
        const d = new Date(items[0].dt * 1000);
        const label = d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
        return (
          <div key={key} style={s.card}>
            <div style={s.day}>{label}</div>
            <img style={s.icon} src={`https://openweathermap.org/img/wn/${mid.weather[0].icon}@2x.png`} alt={mid.weather[0].description} />
            <div style={s.desc}>{mid.weather[0].description}</div>
            <div style={s.temps}>
              <span style={s.hi}>{Math.round(hi)}°</span>
              <span style={s.lo}>{Math.round(lo)}°</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
