import React, { useEffect } from "react";
import "./Weather.css";
import axios from "axios";

const Weather = () => {
  const [data, setData] = React.useState({});
  const [location, setLocation] = React.useState("");

  useEffect(() => {
    const fetchDefaultLocation = async () => {
      const defaultLocation = "London";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=metric&appid=4abfb061287c4fd025ba401f40b9d02e`;
      const response = await axios.get(url);
      setData(response.data);
    };
    fetchDefaultLocation();
  }, []);

  const search = async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=4abfb061287c4fd025ba401f40b9d02e`;
    try {
      const response = await axios.get(url);
      if (Number(response.data.cod) !== 200) {
        setData({ notFound: true });
      } else {
        setData(response.data);
        setLocation("");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setData({ notFound: true });
      } else {
        console.error("An unexpected error occurred", error);
      }
    }
  };

  const handleInputCheck = (e) => {
    setLocation(e.target.value);
  };

  const getWeatherIcon = (weatherType) => {
    switch (weatherType) {
      case "Clear":
        return <i className="bx bxs-sun"></i>;
      case "Clouds":
        return <i className="bx bxs-cloud"></i>;
      case "Rain":
        return <i className="bx bxs-cloud-rain"></i>;
      case "Snow":
        return <i className="bx bxs-snow"></i>;
      case "Thunderstorm":
        return <i className="bx bxs-bolt"></i>;
      case "Haze":
      case "Mist":
        return <i className="bx bxs-cloud"></i>;
      default:
        return <i className="bx bxs-cloud"></i>;
    }
  };

  return (
    <div className="weather">
      <div className="search">
        <div className="search-top">
          <i className="fa-solid fa-location-dot"></i>
          <div className="location">{data.name}</div>
        </div>
        <div className="search-location">
          <input
            type="text"
            placeholder="Enter Location"
            value={location}
            onChange={handleInputCheck}
            onKeyDown={(e) => e.key === "Enter" && search()}
          />
          <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
        </div>
      </div>
      {data.notFound ? (
        <div className="not-found">Not Found😪</div>
      ) : (
        <div className="weather-data">
          {data.weather &&
            data.weather[0] &&
            getWeatherIcon(data.weather[0].main)}
          <div className="weather-type">
            {data.weather ? data.weather[0].main : null}
          </div>
          <div className="temp">
            {data.main ? `${Math.floor(data.main.temp)}°` : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
