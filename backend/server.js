import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/health", (req, res) => {
    res.status(200).json({
        message: "Weather API is running"
    });
});

app.get("/api/weather", async(req,res) => {
    try {
        const { city } = req.query;

        if(typeof city !== "string" || city.trim() === "") {
            return res.status(400).json({
                message: "City is required"
            })
        }

        const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");

        geoUrl.searchParams.set("name", city.trim());
        geoUrl.searchParams.set("count", "1");

        const geoResponse = await fetch(geoUrl);

        if(!geoResponse.ok) {
            return res.status(502).json({
                message: "Geocoding service error"
            });
        }

        const geoData = await geoResponse.json();
        
        if(!geoData.results?.length) {
            return res.status(404).json({
                message: "City not found"
            });
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
        weatherUrl.searchParams.set("latitude", latitude);
        weatherUrl.searchParams.set("longitude", longitude);
        weatherUrl.searchParams.set("current", "temperature_2m,relative_humidity_2m,wind_speed_10m");

        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            return res.status(502).json({
                message: "Weather service error"
            });
        }

        const weatherData = await weatherResponse.json();



        res.status(200).json({
            city: name, 
            country,
            weather: weatherData.current,
            units: weatherData.current_units
        });
    } catch(err) {
        console.error(err);

        res.status(500).json({
        message: "Internal server error"
        });
    }
});

app.listen(4200, () => {
    console.log("Server running on http://localhost:4200");
});