# ☁ SkyWatch — Weather Forecast App

A React.js weather forecast web app built with OpenWeatherMap API.

## Features
- Real-time current weather by city search
- Automatic location detection (browser geolocation)
- Hourly forecast (next 24 hours)
- 5-day daily forecast
- Temperature unit toggle (°C / °F)
- Weather details: humidity, wind, pressure, visibility, clouds

## Tech Stack
- **Frontend**: ReactJS (React 18)
- **Styling**: CSS-in-JS (inline styles with CSS variables)
- **API**: OpenWeatherMap (Current Weather + Forecast APIs)
- **JavaScript**: ES6+ (async/await, hooks, custom hooks)

## Project Structure
```
weather-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── SearchBar.js        # Search input + unit toggle
│   │   ├── CurrentWeather.js   # Current weather card
│   │   ├── HourlyForecast.js   # Hourly forecast strip
│   │   └── DailyForecast.js    # 5-day forecast grid
│   ├── hooks/
│   │   └── useWeather.js       # Custom hook for API calls
│   ├── App.js                  # Main app component
│   ├── index.js                # React entry point
│   └── index.css               # Global styles
├── package.json
└── README.md
```

## Setup & Run

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## API Key
The app uses OpenWeatherMap free tier API.  
Get your own key at: https://openweathermap.org/api
