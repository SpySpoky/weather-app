import { useState } from "react";

function App() {

    const [city, setCity] = useState("");
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleSearch() {
        try {
            setError("");
            setLoading(true);

            if(!city.trim()){  
                setError("Please enter a city");
                return;
            }

            const response = await fetch(`http://localhost:4200/api/weather?city=${encodeURIComponent(city)}`);
            if(!response.ok) {
                setError("City not found");
                return;
            }

            const data = await response.json();
            setWeatherData(data);
        } catch(err) {
            console.error(err);
            setError("Failed to connect to the weather server");
        } finally {
            setLoading(false);
        }
    }


    return(
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">☁️ Weather App</h1>
                    <p className="text-slate-400 mt-2">
                        Check the weather in your city
                    </p>
                </div>
                

                <div className="flex gap-3 mb-6">
                    <input type="text" placeholder="Enter city name" value={city} onChange={(event) => setCity(event.target.value)} onKeyDown={(e) => {if(e.key === "Enter") {handleSearch();}}} 
                    className="flex-1 min-w-0 bg-slate-800 text-white placeholder-slate-400 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"/>
                    <button onClick={() => handleSearch()} disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-5 py-3 rounded-lg transition-colors">{loading ? "Searching..." : "Search"}</button>
                </div>

                <div>
                    {loading && (
                        <div className="flex items-center justify-center gap-3 py-6 text-blue-400">
                            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm font-medium">Loading weather...</p>
                        </div>
                    )}
                    {weatherData && ( // if exeists only shows
                        <div className="bg-slate-800 rounded-xl p-6 text-white">
                            <div className="flex justify-between items-start mb-6">
                                <div className="">
                                    <h2 className="text-2xl font-bold">{weatherData.city}</h2>
                                    <p className="text-slate-400">Country: {weatherData.country}</p>
                                </div>
                                <span className="text-5xl">🌤️</span>
                            </div>
                        
                            <div className="mb-6">
                                <p className="text-5xl font-bold">
                                {weatherData.weather.temperature_2m} {weatherData.units.temperature_2m}
                                </p>
                            </div>
                            <div className="border-t border-slate-700 mb-6"></div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-slate-400 text-sm mb-1">
                                        💧 Humidity
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {weatherData.weather.relative_humidity_2m} {weatherData.units.relative_humidity_2m}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-400 text-sm mb-1">
                                        💨 Wind speed
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {weatherData.weather.wind_speed_10m}
                                        {" "}
                                        {weatherData.units.wind_speed_10m}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {error && (
                        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                            {error}
                        </p>
                    )}
                </div>

            </div>  
        </div>
    );
}

export default App;