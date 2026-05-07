import React, { useState } from 'react';
import axios from 'axios';

const s = {
  card:{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.13)',borderRadius:'24px',padding:'2rem',marginBottom:'1.5rem',backdropFilter:'blur(12px)',animation:'fadeUp 0.5s ease forwards'},
  title:{fontFamily:"'Syne',sans-serif",fontSize:'1.1rem',fontWeight:700,marginBottom:'1.2rem',color:'#38bdf8'},
  label:{fontSize:'0.78rem',color:'rgba(200,225,255,0.5)',marginBottom:'6px'},
  row:{display:'flex',gap:'10px',flexWrap:'wrap',marginBottom:'10px'},
  input:{flex:1,minWidth:'200px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'12px',padding:'0.8rem 1.1rem',color:'#e8f4ff',fontFamily:"'DM Sans',sans-serif",fontSize:'0.95rem',outline:'none'},
  btn:{background:'#38bdf8',border:'none',borderRadius:'12px',padding:'0.8rem 1.5rem',color:'#0a1628',fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:'0.95rem',cursor:'pointer'},
  err:{background:'rgba(248,113,113,0.15)',border:'1px solid rgba(248,113,113,0.3)',color:'#fca5a5',borderRadius:'10px',padding:'0.7rem 1rem',fontSize:'0.88rem',marginTop:'10px'},
  result:{background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.25)',borderRadius:'14px',padding:'1.2rem',marginTop:'1rem',animation:'fadeUp 0.4s ease'},
  resultLabel:{fontSize:'0.75rem',color:'rgba(200,225,255,0.5)',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.05em'},
  shortUrl:{fontFamily:"'Syne',sans-serif",fontSize:'1.3rem',fontWeight:700,color:'#4ade80',wordBreak:'break-all'},
  copyBtn:{background:'rgba(74,222,128,0.15)',border:'1px solid rgba(74,222,128,0.3)',borderRadius:'8px',padding:'5px 14px',color:'#4ade80',fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:'0.82rem',cursor:'pointer',marginTop:'8px'},
};

export default function ShortenForm({ onNewUrl }) {
  const [longUrl, setLongUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!longUrl.trim()) { setError('Please enter a URL'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await axios.post('/api/url/shorten', { longUrl: longUrl.trim() });
      setResult(res.data);
      if (onNewUrl) onNewUrl(res.data);
      setLongUrl('');
    } catch (err) {
      setError(err.response?.data || 'Something went wrong. Make sure the backend is running.');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={s.card}>
      <div style={s.title}>🔗 Shorten a URL</div>
      <div style={s.label}>Paste your long URL</div>
      <div style={s.row}>
        <input style={s.input} type="text" placeholder="https://example.com/very/long/url..."
          value={longUrl} onChange={e => setLongUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        <button style={s.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten →'}
        </button>
      </div>
      {error && <div style={s.err}>{error}</div>}
      {result && (
        <div style={s.result}>
          <div style={s.resultLabel}>Your short link is ready!</div>
          <div style={s.shortUrl}>{result.shortUrl}</div>
          <div style={{fontSize:'0.8rem',color:'rgba(200,225,255,0.45)',marginTop:'4px'}}>
            Code: <span style={{color:'#38bdf8'}}>{result.urlCode}</span>
          </div>
          <button style={s.copyBtn} onClick={handleCopy}>
            {copied ? '✅ Copied!' : '📋 Copy Link'}
          </button>
        </div>
      )}
    </div>
  );
}
