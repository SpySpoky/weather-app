# Weather App 🌤️

A full-stack weather application built with React, Node.js, and Express. Users can search for a city and view real-time weather information using the Open-Meteo API.

## Features

- Search weather by city name
- Display temperature, humidity, and wind speed
- Responsive interface with Tailwind CSS
- Loading indicator during API requests
- Error handling for invalid cities and connection failures
- Search using the Enter key

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS

**Backend:** Node.js, Express

**External API:** Open-Meteo

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/weather-app.git
cd weather-app
```

### 2. Start the backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on `http://localhost:4200`.

### 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## API Endpoint

`GET /api/weather?city=London`

Returns the city, country, temperature, humidity, and wind speed.

## Project Structure

```text
WeatherApp/
├── backend/
├── frontend/
├── .gitignore
└── README.md
```

## Future Improvements

- Dynamic weather icons
- Multi-day weather forecast
- Temperature unit selection
- Deployment to a hosting platform
