import "./App.css";
import { useState, useEffect } from "react";
import axios from 'axios';

const api = {
  key: "512bd4cfb512085b6f35ed1708dead49",
  base: "https://api.openweathermap.org/data/2.5/",
};

const indianMetros = [
  { id: 1, name: "Delhi", lat: 28.6139, lon: 77.2090 },
  { id: 2, name: "Mumbai", lat: 19.0760, lon: 72.8777 },
  { id: 3, name: "Chennai", lat: 13.0827, lon: 80.2707 },
  { id: 4, name: "Bangalore", lat: 12.9716, lon: 77.5946 },
  { id: 5, name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { id: 6, name: "Hyderabad", lat: 17.3850, lon: 78.4867 },
];

function App() {
  const [metros, setMetros] = useState(indianMetros);
  const [selectedMetro, setSelectedMetro] = useState(metros[0]);
  const [weather, setWeather] = useState({});
  const [dailyWeather, setDailyWeather] = useState([]);
  const [unit, setUnit] = useState("celsius");
  const [alert, setAlert] = useState(false);
  const [consecutiveAlerts, setConsecutiveAlerts] = useState(0);
  const [threshold, setThreshold] = useState(35); 

  const fetchWeather = () => {
    axios.get(`${api.base}weather?q=${selectedMetro.name}&units=metric&appid=${api.key}`)
      .then((res) => {
        setWeather(res.data);
        checkThreshold(res.data.main.temp);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchDailyWeather = () => {
    axios.get(`${api.base}onecall?lat=${selectedMetro.lat}&lon=${selectedMetro.lon}&exclude=hourly,minutely&units=metric&appid=${api.key}`)
      .then((res) => {
        setDailyWeather(res.data.daily);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchWeather(); // Initial fetch for current weather
    fetchDailyWeather(); // Fetch daily weather
    const intervalId = setInterval(fetchWeather, 300000); // Fetch every 5 minutes
    return () => clearInterval(intervalId);
  }, [selectedMetro, threshold]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
    return date.toLocaleDateString(); // Format date
  };

  const checkThreshold = (currentTemp) => {
    if (currentTemp > threshold) {
      setConsecutiveAlerts(prev => prev + 1);
      if (consecutiveAlerts >= 1) { // Check if it exceeds for two consecutive updates
        setAlert(true);
      }
    } else {
      setConsecutiveAlerts(0);
      setAlert(false);
    }
  };

  // Function to convert temperature to Kelvin
  const convertToKelvin = (temp) => {
    return temp + 273.15;
  };

  // Function to toggle the unit
  const toggleUnit = () => {
    if (unit === "celsius") {
      setUnit("kelvin");
    } else {
      setUnit("celsius");
    }
  };

  const handleThresholdChange = (e) => {
    setThreshold(Number(e.target.value));
    setAlert(false); // Reset alert when threshold is changed
  };

  // Function to calculate daily aggregates
  const calculateDailySummary = (dailyData) => {
    return dailyData.map(day => {
      const avgTemp = (day.temp.max + day.temp.min) / 2;
      const maxTemp = day.temp.max;
      const minTemp = day.temp.min;
      const dominantCondition = day.weather[0].main; // Assuming the first weather condition is the dominant one

      return {
        date: formatDate(day.dt),
        avgTemp: avgTemp.toFixed(2),
        maxTemp,
        minTemp,
        dominantCondition,
      };
    });
  };

  // Calculate daily summary when dailyWeather is updated
  const dailySummary = calculateDailySummary(dailyWeather);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather App</h1>

        <select
          value={selectedMetro.name}
          onChange={(e) => {
            const selected = indianMetros.find((metro) => metro.name === e.target.value);
            setSelectedMetro(selected);
          }}
        >
          {indianMetros.map((metro) => (
            <option key={metro.id} value={metro.name}>
              {metro.name}
            </option>
          ))}
        </select>

        <div>
          <label>Set Temperature Threshold (°C): </label>
          <input
            type="number"
            value={threshold}
            onChange={handleThresholdChange}
          />
        </div>

        {alert && <p style={{ color: 'red' }}>Alert! Temperature exceeds {threshold}°C!</p>}

        {/* Current Weather Info */}
        <div className="weather-info">
          {typeof weather.main !== "undefined" ? (
            <div>
              <p>City: {weather.name}</p>
              <p>{weather.weather[0].main} ({weather.weather[0].description})</p>
              <p>
                Temperature:{" "}
                {unit === "celsius"
                  ? `${weather.main.temp}°C`
                  : `${convertToKelvin(weather.main.temp)} K`}
                <button onClick={toggleUnit}>
                  {unit === "celsius" ? "Toggle to Kelvin" : "Toggle to Celsius"}
                </button>
              </p>
              <p>Feels Like: {weather.main.feels_like}°C</p>
              <p>Last Updated: {formatDate(weather.dt)}</p>
            </div>
          ) : (
            <p>Loading ..</p>
          )}
        </div>

        {/* Daily Weather Summary */}
        <h2>Daily Weather Summary</h2>
        {dailySummary.length > 0 ? (
          <div>
            {dailySummary.map((day, index) => (
              <div key={index} className="weather-summary">
                <p>Date: {day.date}</p>
                <p>Average Temperature: {day.avgTemp}°C</p>
                <p>Maximum Temperature: {day.maxTemp}°C</p>
                <p>Minimum Temperature: {day.minTemp}°C</p>
                <p>Dominant Weather Condition: {day.dominantCondition}</p>
                <hr />
              </div>
            ))}
          </div>
        ) : (
          <p>No daily weather data available.</p>
        )}
      </header>
    </div>
  );
}

export default App;