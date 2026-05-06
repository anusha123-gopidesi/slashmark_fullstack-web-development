import React from 'react';

const s = {
  card: {
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)',
    borderRadius: '24px', padding: '2rem', marginBottom: '1.5rem',
    backdropFilter: 'blur(12px)', animation: 'fadeUp 0.5s ease forwards',
  },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' },
  locName: { fontFamily: "'Syne', sans-serif", fontSize: '1.7rem', fontWeight: 700 },
  locDate: { fontSize: '0.88rem', color: 'rgba(200,225,255,0.55)', marginTop: '3px' },
  tempBlock: { display: 'flex', alignItems: 'center', gap: '1rem' },
  icon: { width: '80px', height: '80px', filter: 'drop-shadow(0 0 12px rgba(56,189,248,0.35))' },
  tempNum: { fontFamily: "'Syne', sans-serif", fontSize: '4rem', fontWeight: 800, lineHeight: 1 },
  tempSym: { fontSize: '1.8rem', color: 'rgba(200,225,255,0.55)' },
  desc: { fontSize: '1rem', color: '#7dd3fc', textTransform: 'capitalize', marginTop: '4px' },
  feels: { fontSize: '0.85rem', color: 'rgba(200,225,255,0.55)' },
  sunRow: { display: 'flex', gap: '12px', marginBottom: '1.5rem' },
  sunCard: {
    flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '14px', padding: '0.9rem 1rem', display: 'flex', alignItems: 'center', gap: '10px',
  },
  sunIco: { fontSize: '1.6rem' },
  sunLbl: { fontSize: '0.72rem', color: 'rgba(200,225,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  sunT: { fontFamily: "'Syne', sans-serif", fontSize: '1.1rem', fontWeight: 600 },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' },
  stat: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '14px', padding: '0.9rem', textAlign: 'center',
  },
  statLbl: { fontSize: '0.72rem', color: 'rgba(200,225,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' },
  statV: { fontFamily: "'Syne', sans-serif", fontSize: '1.25rem', fontWeight: 600 },
};

function unixToTime(unix, tz) {
  const d = new Date((unix + tz) * 1000);
  const h = d.getUTCHours(), m = d.getUTCMinutes();
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

export default function CurrentWeather({ data, unit }) {
  const sym = unit === 'metric' ? '°C' : '°F';
  const windUnit = unit === 'metric' ? 'm/s' : 'mph';
  const date = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={s.card}>
      <div style={s.topRow}>
        <div>
          <div style={s.locName}>{data.name}, {data.sys.country}</div>
          <div style={s.locDate}>{date}</div>
        </div>
        <div style={s.tempBlock}>
          <img style={s.icon} src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt={data.weather[0].description} />
          <div>
            <div>
              <span style={s.tempNum}>{Math.round(data.main.temp)}</span>
              <span style={s.tempSym}>{sym}</span>
            </div>
            <div style={s.desc}>{data.weather[0].description}</div>
            <div style={s.feels}>Feels like {Math.round(data.main.feels_like)}{sym}</div>
          </div>
        </div>
      </div>

      <div style={s.sunRow}>
        <div style={s.sunCard}>
          <span style={s.sunIco}>🌅</span>
          <div>
            <div style={s.sunLbl}>Sunrise</div>
            <div style={s.sunT}>{unixToTime(data.sys.sunrise, data.timezone)}</div>
          </div>
        </div>
        <div style={s.sunCard}>
          <span style={s.sunIco}>🌇</span>
          <div>
            <div style={s.sunLbl}>Sunset</div>
            <div style={s.sunT}>{unixToTime(data.sys.sunset, data.timezone)}</div>
          </div>
        </div>
      </div>

      <div style={s.stats}>
        {[
          { label: 'Humidity', value: data.main.humidity + '%' },
          { label: 'Wind', value: data.wind.speed + ' ' + windUnit },
          { label: 'Pressure', value: data.main.pressure + ' hPa' },
          { label: 'Visibility', value: data.visibility ? (data.visibility / 1000).toFixed(1) + ' km' : 'N/A' },
          { label: 'Clouds', value: data.clouds.all + '%' },
          { label: 'Min / Max', value: `${Math.round(data.main.temp_min)}° / ${Math.round(data.main.temp_max)}°` },
        ].map(({ label, value }) => (
          <div key={label} style={s.stat}>
            <div style={s.statLbl}>{label}</div>
            <div style={s.statV}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
