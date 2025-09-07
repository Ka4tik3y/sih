import { useEffect, useState } from "react";
import axios from "axios";
export default function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    if (!apiKey) {
      setError("Missing API key");
      return;
    }
    const fetchWeather = async (lat, lon) => {
      try {
        const q = `${lat},${lon}`;
        const { data } = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${q}&aqi=no`
        );
        setWeather(data);
      } catch (err) {
        console.error("Weather fetch error:", err);
        if (err.response?.status === 401) {
          setError("Invalid API key");
        } else {
          setError("Unable to fetch weather");
        }
      }
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => setError("Location access denied")
      );
    } else {
      setError("Geolocation not supported");
    }
  }, []);
  return (
    <div className="w-80 rounded shadow-lg overflow-hidden my-4">
      <div className="bg-orange-500 text-white text-center font-semibold py-3 text-lg">
        Today's Weather
      </div>
      <div className="bg-white p-5 flex flex-col items-center gap-4">
        {error ? (
          <p className="text-red-600 text-sm text-center">{error}</p>
        ) : !weather ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <img
                src={weather.current.condition.icon}
                alt={weather.current.condition.text}
                className="w-16 h-16"
              />
              <div className="flex flex-col">
                <p className="text-xl font-bold text-gray-800">{weather.location.name}</p>
                <p className="text-sm text-gray-600 capitalize">{weather.current.condition.text}</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{Math.round(weather.current.temp_c)}°C</p>
            <div className="flex justify-between w-full text-sm text-gray-700">
              <p>Humidity: {weather.current.humidity}%</p>
              <p>Wind: {Math.round(weather.current.wind_kph)} kph</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
