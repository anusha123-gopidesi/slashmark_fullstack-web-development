import React from 'react';

const s = {
  wrap: { overflowX: 'auto', display: 'flex', gap: '10px', paddingBottom: '6px', scrollbarWidth: 'thin' },
  card: {
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px', padding: '0.7rem 0.8rem', textAlign: 'center',
    flexShrink: 0, minWidth: '65px', backdropFilter: 'blur(6px)',
  },
  time: { fontSize: '0.72rem', color: 'rgba(200,225,255,0.5)', marginBottom: '5px' },
  icon: { width: '32px', height: '32px', margin: '0 auto 4px', display: 'block' },
  temp: { fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', fontWeight: 600 },
  rain: { fontSize: '0.65rem', color: '#7dd3fc', marginTop: '2px' },
};

export default function HourlyForecast({ list, unit }) {
  const sym = unit === 'metric' ? '°C' : '°F';

  return (
    <div style={s.wrap}>
      {list.slice(0, 8).map((item, i) => {
        const t = new Date(item.dt * 1000);
        const h = t.getHours(), ap = h >= 12 ? 'pm' : 'am';
        const rain = item.pop ? Math.round(item.pop * 100) + '%' : null;
        return (
          <div key={i} style={s.card}>
            <div style={s.time}>{h % 12 || 12}{ap}</div>
            <img style={s.icon} src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt={item.weather[0].description} />
            <div style={s.temp}>{Math.round(item.main.temp)}{sym}</div>
            {rain && <div style={s.rain}>💧{rain}</div>}
          </div>
        );
      })}
    </div>
  );
}
