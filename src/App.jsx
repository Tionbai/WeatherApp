import React, { useState, useEffect } from 'react';
import './App.css';
import * as dotenv from 'dotenv';
import Header from './components/Header';
import Form from './components/Form';
import Forecast from './components/Forecast';
import './styles/Header.css';
// For example purposes.
import mockWeatherData from './mockWeather.json';

dotenv.config();

export default function App() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [search, setSearch] = useState(false);
  const [weather, setWeather] = useState('');
  const [city, setCity] = useState(null);
  const [error, setError] = useState(false);

  const UNIT = 'metric';

  const errorHandlerApiKey = () => {
    if (!process.env.REACT_APP_API_KEY)
      setError('You need an API key to make real calls.');
  };

  // Update state if location city has changed.
  const updateCityState = (locationCity) => {
    if (currentLocation !== locationCity)
      setCurrentLocation(locationCity);
    if (city !== locationCity) setCity(locationCity);
  };

  // Get city from user location coords and update state.
  const showCurrentLocation = async (position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;

    const response = await fetch(url);
    const data = await response.json();
    const locationCity = data.principalSubdivision;
    updateCityState(locationCity);
    setSearch(true);
    errorHandlerApiKey();
  };

  // Ask for location from user.
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showCurrentLocation);
    } else setError('We could not get your location.');
  };

  // Get weather data from API.
  const getWeather = async () => {
    const uriEncodedCity = encodeURIComponent(city);

    // Only make API call if there is a valid API key.
    if (process.env.REACT_APP_API_KEY) {
      const response = await fetch(
        `https://community-open-weather-map.p.rapidapi.com/weather?units=${UNIT}&q=${uriEncodedCity}`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-key': process.env.REACT_APP_API_KEY,
            'x-rapidapi-host': process.env.REACT_APP_API_URL,
          },
        },
      );
      const data = await response.json();
      setWeather(data);
    } else {
      // Set mock weather data for example purposes.
      setWeather(mockWeatherData);
      setSearch(true);
      errorHandlerApiKey();
    }
  };

  // Refresh error.
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  }, [error]);

  // Capitalize error from API.
  const capitalizeErrorMsg = (msg) => {
    const capitalizedMsg = msg[0].toUpperCase() + msg.slice(1);
    return capitalizedMsg;
  };

  useEffect(() => {
    if (city) getWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  // Show forecast or error when weather data is retrieved.
  useEffect(() => {
    if (weather.cod) {
      switch (weather.cod) {
        case 200:
          setSearch(true);
          errorHandlerApiKey();
          break;
        default:
          setError(
            `${weather.cod} - ${capitalizeErrorMsg(weather.message)}`,
          );
          break;
      }
    }
  }, [weather]);

  return (
    <main className="App">
      <img
        className="App__image"
        src="https://images.unsplash.com/photo-1564750975191-0ed807751adf?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
        alt=""
      />
      <Header />
      {error && <p className="App__error">{error}</p>}
      {!search ? (
        <Form
          search={search}
          setSearch={setSearch}
          getCurrentLocation={getCurrentLocation}
          setCity={setCity}
          setError={setError}
        />
      ) : (
        <Forecast
          city={city}
          search={search}
          setSearch={setSearch}
          weather={weather}
          getWeather={getWeather}
        />
      )}
    </main>
  );
}
