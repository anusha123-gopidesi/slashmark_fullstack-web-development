import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");

  // 🌙 THEME STATE
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") !== "light"
  );

  // Save theme
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // 📍 Auto location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      try {
        const res = await fetch(
          `http://localhost:5000/weather?city=${lat},${lon}`
        );
        const data = await res.json();
        setWeather(data);

        const res2 = await fetch(
          `http://localhost:5000/forecast?city=${lat},${lon}`
        );
        const data2 = await res2.json();

        if (data2.list) {
          setHourly(data2.list.slice(0, 8));
          const daily = data2.list.filter((_, i) => i % 8 === 0);
          setForecast(daily);
        }
      } catch {}
    });
  }, []);

  // Suggestions
  const getSuggestions = async (value) => {
    setCity(value);
    if (value.length < 2) return setSuggestions([]);

    try {
      const res = await fetch(
        `http://localhost:5000/suggest?query=${value}`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    }
  };

  // Search
  const getWeather = async (selectedCity) => {
    const searchCity = selectedCity || city;

    try {
      const res1 = await fetch(
        `http://localhost:5000/weather?city=${searchCity}`
      );
      if (!res1.ok) throw new Error("Location not found");

      const data1 = await res1.json();
      setWeather(data1);

      const res2 = await fetch(
        `http://localhost:5000/forecast?city=${searchCity}`
      );
      const data2 = await res2.json();

      if (data2.list) {
        setHourly(data2.list.slice(0, 8));
        const daily = data2.list.filter((_, i) => i % 8 === 0);
        setForecast(daily);
      }

      setSuggestions([]);
      setError("");
    } catch (err) {
      setError(err.message);
      setWeather(null);
    }
  };

  return (
    <div className={darkMode ? "app dark" : "app light"}>

      {/* 🌙 Toggle Button */}
      <div className="toggle">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* HEADER */}
      <div className="header">
        <h1>🌦 Weather Forecast Website</h1>

        <div className="search-box">
          <input
            placeholder="Search city or village..."
            value={city}
            onChange={(e) => getSuggestions(e.target.value)}
          />
          <button onClick={() => getWeather()}>Search</button>
        </div>

        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((s, i) => (
              <div key={i} onClick={() => getWeather(s.name)}>
                {s.name}, {s.country}
              </div>
            ))}
          </div>
        )}

        {error && <p className="error">{error}</p>}
      </div>

      {/* MAIN */}
      {weather?.main && (
        <div className="main">

          <div className="current">
            <h2>
              {weather.placeName || weather.name}, {weather.sys?.country}
            </h2>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@4x.png`}
              alt=""
            />

            <div className="temp">
              {Math.round(weather.main.temp)}°C
            </div>

            <p className="desc">
              {weather.weather?.[0]?.description}
            </p>
          </div>

          <div className="details">
            <p>💧 Humidity: {weather.main.humidity}%</p>
            <p>🌬 Wind: {weather.wind?.speed} m/s</p>
            <p>🌡 Feels: {Math.round(weather.main.feels_like)}°C</p>
          </div>

        </div>
      )}

      {/* HOURLY */}
      <div className="section">
        <h3>Hourly Forecast</h3>
        <div className="hourly">
          {hourly.map((h, i) => (
            <div key={i} className="card">
              <p>{new Date(h.dt_txt).getHours()}:00</p>
              <img
                src={`https://openweathermap.org/img/wn/${h.weather?.[0]?.icon}.png`}
                alt=""
              />
              <p>{Math.round(h.main.temp)}°C</p>
            </div>
          ))}
        </div>
      </div>

      {/* DAILY */}
      <div className="section">
        <h3>5-Day Forecast</h3>
        <div className="forecast">
          {forecast.map((d, i) => (
            <div key={i} className="card">
              <p>{new Date(d.dt_txt).toLocaleDateString()}</p>
              <img
                src={`https://openweathermap.org/img/wn/${d.weather?.[0]?.icon}.png`}
                alt=""
              />
              <p>{Math.round(d.main.temp)}°C</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default App;