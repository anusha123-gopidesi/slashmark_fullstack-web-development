import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ShortenForm from './components/ShortenForm';

const s = {
  app: { minHeight: '100vh', background: 'linear-gradient(160deg,#0a1628 0%,#1a3a5c 60%,#0f2d1a 100%)', color: '#e8f4ff', fontFamily: "'DM Sans',sans-serif" },
  container: { maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem 4rem' },
  header: { textAlign: 'center', marginBottom: '2.5rem' },
  h1: { fontFamily: "'Syne',sans-serif", fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 800, background: 'linear-gradient(135deg,#e8f4ff 30%,#38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-1px' },
  subtitle: { color: 'rgba(200,225,255,0.6)', fontSize: '1rem', marginTop: '0.4rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '12px', marginBottom: '1.5rem' },
  statCard: { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '1.2rem', textAlign: 'center', backdropFilter: 'blur(8px)' },
  statLabel: { fontSize: '0.75rem', color: 'rgba(200,225,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' },
  statValue: { fontFamily: "'Syne',sans-serif", fontSize: '2rem', fontWeight: 800 },
  tableCard: { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)', borderRadius: '24px', padding: '2rem', backdropFilter: 'blur(12px)' },
  tableTitle: { fontFamily: "'Syne',sans-serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.2rem', color: '#38bdf8' },
  empty: { textAlign: 'center', color: 'rgba(200,225,255,0.4)', padding: '2rem', fontSize: '0.95rem' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', fontSize: '0.72rem', color: 'rgba(200,225,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 0.75rem 0.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  td: { padding: '0.85rem 0.75rem', fontSize: '0.88rem', borderBottom: '1px solid rgba(255,255,255,0.06)', verticalAlign: 'middle' },
  shortLink: { color: '#38bdf8', fontWeight: 600, fontFamily: "'Syne',sans-serif", textDecoration: 'none' },
  origUrl: { color: 'rgba(200,225,255,0.6)', fontSize: '0.8rem', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' },
  clicks: { background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.25)', borderRadius: '20px', padding: '2px 10px', fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600 },
  delBtn: { background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: '8px', padding: '4px 10px', color: '#f87171', fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', marginLeft: '6px' },
  copyBtn: { background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '8px', padding: '4px 10px', color: '#4ade80', fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' },
  date: { fontSize: '0.75rem', color: 'rgba(200,225,255,0.4)' },
};

export default function App() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => { fetchUrls(); }, []);

  const fetchUrls = async () => {
    try {
      const res = await axios.get('/api/url/all');
      setUrls(res.data);
    } catch (err) {
      console.log('Could not fetch URLs');
    }
    setLoading(false);
  };

  const handleNewUrl = (newUrl) => {
    setUrls(prev => prev.find(u => u._id === newUrl._id) ? prev : [newUrl, ...prev]);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/url/${id}`);
      setUrls(prev => prev.filter(u => u._id !== id));
    } catch (err) { alert('Delete failed'); }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url.shortUrl);
    setCopiedId(url._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalClicks = urls.reduce((sum, u) => sum + (u.clicks || 0), 0);

  return (
    <div style={s.app}>
      <div style={s.container}>
        <header style={s.header}>
          <h1 style={s.h1}>⚡ SkyLink</h1>
          <p style={s.subtitle}>Fast &amp; simple URL shortener with analytics</p>
        </header>

        <ShortenForm onNewUrl={handleNewUrl} />

        <div style={s.statsGrid}>
          <div style={s.statCard}>
            <div style={s.statLabel}>Total Links</div>
            <div style={{ ...s.statValue, color: '#38bdf8' }}>{urls.length}</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statLabel}>Total Clicks</div>
            <div style={{ ...s.statValue, color: '#4ade80' }}>{totalClicks}</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statLabel}>Top Clicks</div>
            <div style={{ ...s.statValue, color: '#fbbf24' }}>
              {urls.length ? Math.max(...urls.map(u => u.clicks || 0)) : 0}
            </div>
          </div>
        </div>

        <div style={s.tableCard}>
          <div style={s.tableTitle}>📊 All Links &amp; Analytics</div>
          {loading ? (
            <div style={s.empty}>Loading...</div>
          ) : urls.length === 0 ? (
            <div style={s.empty}>No links yet. Shorten your first URL above! 🔗</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Short URL</th>
                    <th style={s.th}>Original URL</th>
                    <th style={s.th}>Clicks</th>
                    <th style={s.th}>Created</th>
                    <th style={s.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {urls.map(url => (
                    <tr key={url._id}>
                      <td style={s.td}>
                        <a href={url.shortUrl} target="_blank" rel="noreferrer" style={s.shortLink}>
                          {url.urlCode}
                        </a>
                      </td>
                      <td style={s.td}>
                        <span style={s.origUrl} title={url.longUrl}>{url.longUrl}</span>
                      </td>
                      <td style={s.td}>
                        <span style={s.clicks}>{url.clicks || 0} clicks</span>
                      </td>
                      <td style={s.td}>
                        <span style={s.date}>
                          {new Date(url.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                      <td style={s.td}>
                        <button style={s.copyBtn} onClick={() => handleCopy(url)}>
                          {copiedId === url._id ? '✅' : '📋'}
                        </button>
                        <button style={s.delBtn} onClick={() => handleDelete(url._id)}>🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}