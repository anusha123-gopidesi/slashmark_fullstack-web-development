const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const API_KEY = "fc6b5e565e3183e0fa990194e46fe892";

// ✅ WEATHER (SAFE + village support)
app.get("/weather", async (req, res) => {
  const place = req.query.city;

  try {
    const geo = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=1&appid=${API_KEY}`
    );

    if (!geo.data || geo.data.length === 0) {
      return res.status(404).json({ error: "Location not found" });
    }

    const { lat, lon, name, country } = geo.data[0];

    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    res.json({
      ...weatherRes.data,
      placeName: name,
      country: country
    });

  } catch (err) {
    res.status(500).json({ error: "Weather error" });
  }
});


// ✅ FORECAST (SAFE FIXED)
app.get("/forecast", async (req, res) => {
  const place = req.query.city;

  try {
    const geo = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=1&appid=${API_KEY}`
    );

    if (!geo.data || geo.data.length === 0) {
      return res.status(404).json({ error: "Location not found" });
    }

    const { lat, lon } = geo.data[0];

    const forecastRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    res.json(forecastRes.data);

  } catch {
    res.status(500).json({ error: "Forecast error" });
  }
});


// ✅ SUGGESTIONS
app.get("/suggest", async (req, res) => {
  const query = req.query.query;

  try {
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
    );

    res.json(response.data);
  } catch {
    res.json([]);
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));