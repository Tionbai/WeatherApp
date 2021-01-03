import React, { useState, useEffect } from 'react';
import PropTypes, { objectOf } from 'prop-types';
import '../styles/Forecast.css';

export default function Forecast(props) {
  const { setSearch, weather } = props;

  const [weatherIcon, setWeatherIcon] = useState('');

  const forecastCitytext = document.getElementsByClassName(
    'Forecast__city--text',
  );

  // Get weather icon from API based on retrieved weather data.
  const getWeatherIcon = () => {
    const iconCode = weather.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
    setWeatherIcon(iconUrl);
  };

  // Round temperature from weather data.
  const roundTemp = (temp) => Math.round(temp);

  useEffect(() => {
    if (weather.cod === 200) getWeatherIcon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weather]);

  // Listen for window changes to adjust font-size.
  useEffect(() => {
    const handleResize = () => {
      const dimensions = {
        height: window.innerHeight,
        width: window.innerWidth,
      };
      return dimensions;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  // Return true if element's text is overflowing.
  const isOverflown = (element) =>
    element.scrollWidth > element.clientWidth;

  // Adjust font size on element based on overflow.
  const adjustFontSize = (elementText) => {
    const text = elementText;
    const styleFontSize = window
      .getComputedStyle(elementText, null)
      .getPropertyValue('font-size');
    let fontSize = parseFloat(styleFontSize);

    for (let i = fontSize; i < 24; i += 1) {
      const overflow = isOverflown(elementText);
      if (!overflow) {
        fontSize += 1;
        text.style.fontSize = `${fontSize}px`;
      }
    }
    for (let i = fontSize; i >= 0; i -= 1) {
      const overflow = isOverflown(elementText);
      if (overflow) {
        fontSize -= 1;
        text.style.fontSize = `${fontSize}px`;
      }
    }
  };

  useEffect(() => {
    if (forecastCitytext[0]) adjustFontSize(forecastCitytext[0]);
  });

  const handleEnterKeyPress = (e, func) => {
    if (e.key === 'Enter') return func();
    return null;
  };

  return (
    <>
      {weather.cod === 200 ? (
        <>
          <section className="Forecast">
            <p className="Forecast__city">
              <i className="fas fa-city" />
              <span className="Forecast__city--line">|</span>
              <span className="Forecast__city--text">
                {' '}
                {weather.name}
              </span>
            </p>
            <p className="Forecast__conditions">
              <span className="Forecast__conditions--degrees">
                {' '}
                {roundTemp(weather.main.temp)}
                {'° '}
              </span>
              &
              <img
                className="Forecast__conditions--icon"
                src={weatherIcon && weatherIcon}
                alt=""
              />
            </p>
          </section>

          <section className="Forecast__new__search">
            <p
              className="Forecast__new__search--text"
              role="presentation"
              onClick={() => setSearch(false)}
              onKeyPress={(e) => handleEnterKeyPress(e, setSearch())}
            >
              Search another city
            </p>
          </section>
        </>
      ) : (
        <p
          style={{ zIndex: 1, color: 'white' }}
          onClick={() => setSearch(false)}
          role="presentation"
        >
          Loading...
        </p>
      )}
    </>
  );
}

Forecast.propTypes = {
  setSearch: PropTypes.func.isRequired,
  weather: objectOf(PropTypes.object).isRequired,
};
