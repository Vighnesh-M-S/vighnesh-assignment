
import "./App.css";
import { useState, useEffect } from "react";
import axios from 'axios';

const api = {
  key: "512bd4cfb512085b6f35ed1708dead49",
  base: "https://api.openweathermap.org/data/2.5/",
};

const indianMetros = [
  { id: 1, name: "Delhi" },
  { id: 2, name: "Mumbai" },
  { id: 3, name: "Chennai" },
  { id: 4, name: "Bangalore" },
  { id: 5, name: "Kolkata" },
  { id: 6, name: "Hyderabad" },
];

function App() {
  const [metros, setMetros] = useState(indianMetros);
  const [selectedMetro, setSelectedMetro] = useState(metros[0]);
  // const [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});
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

  /*
    Search button is pressed. Make a fetch call to the Open Weather Map API.
  */
  // const searchPressed = () => {
  //   fetch(`${api.base}weather?q=${search}&units=metric&APPID=${api.key}`)
  //     .then((res) => res.json())
  //     .then((result) => {
  //       setWeather(result);
  //     });
  // };

  useEffect(() => {
    fetchWeather(); // Initial fetch
    const intervalId = setInterval(fetchWeather, 300000); // Fetch every 5 minutes
    return () => clearInterval(intervalId);
  }, [selectedMetro, threshold]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
    return date.toLocaleString(); // Format date and time
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

  return (
    <div className="App">
      <header className="App-header">
        {/* HEADER  */}
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

        {/* If weather is not undefined display results from API */}
        <div className="weather-info">
        {typeof weather.main !== "undefined" ? (
          <div>
            {/* Location  */}
            <p>City: {weather.name}</p>

            {/* Condition (Sunny ) */}
            <p>{weather.weather[0].main} ({weather.weather[0].description})</p>

            {/* Temperature Celsius  */}
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
      </header>
    </div>
  );
}

export default App;

