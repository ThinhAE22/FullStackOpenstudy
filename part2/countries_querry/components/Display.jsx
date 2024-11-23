import { useState, useEffect } from 'react';
import axios from 'axios';

const Display = ({ name_list, fulldata, setList }) => {
  const [weather, setWeather] = useState(null); // Weather data state
  const api_key = import.meta.env.VITE_SOME_KEY; // Ensure this key is set in your .env file

  // Fetch weather data for the selected country
  useEffect(() => {
    if (name_list.length === 1) {
      const countryName = name_list[0];
      const countryData = fulldata.find(
        (country) => country.name.common === countryName
      );

      if (countryData) {
        const city = countryData.capital; // Using capital city for weather query
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`;

        // Fetch weather data from OpenWeatherMap
        axios
          .get(url)
          .then((response) => {
            setWeather(response.data); // Store weather data in state
          })
          .catch((error) => {
            console.error('Error fetching weather:', error);
            setWeather(null); // Handle error case
          });
      }
    }
  }, [name_list, fulldata, api_key]); // Depend on name_list, fulldata, and api_key





  //return of the display
  if (name_list.length > 10) {
    return <div><h3>Too many matches, specify the filter</h3></div>;
  } else if (name_list.length === 1) {
    const countryData = fulldata.find(
      (country) => country.name.common === name_list[0]
    );

    if (!countryData) {
      return <div>Country not found</div>;
    }

    return (
      <div>
        <h2>{countryData.name.common}</h2>
        <p>Capital: {countryData.capital}</p>
        <p>Area: {countryData.area}</p>
        <h3>Languages:</h3>
        <ul>
          {Object.values(countryData.languages).map((language, index) => (
            <li key={index}>{language}</li>
          ))}
        </ul>
        <img src={countryData.flags.svg} width="100" height="100" alt="Flag" />
        



        {/* Display weather info if available */}


        {weather ? (
          <div>
            <h3>Weather in {countryData.capital}:</h3>
            <p>Temperature: {weather.main.temp}°C</p>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} width="100" height="100" ></img>
            <p>Wind speed: {weather.wind.speed} m/s</p>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}


      </div>
    );
  } else {
    return (
      <div>
        {name_list.map((country, index) => (
          <div key={index}>
            {country}{' '}
            <button
              onClick={() => {
                const selectedCountry = fulldata.find(
                  (c) => c.name.common === country
                );
                if (selectedCountry) {
                  console.log('Selected Country:', selectedCountry);
                  setList({ name: [country], fulldata: [selectedCountry] });
                }
              }}
            >
              Show
            </button>
          </div>
        ))}
      </div>
    );
  }
};

export default Display;
