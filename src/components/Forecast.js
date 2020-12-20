import React, { useState, useEffect } from 'react'
import '../styles/Forecast.css';

export default function Forecast(props) {
    const { setSearch, weather } = props;

    const [weatherIcon, setWeatherIcon] = useState('');
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    })

    const forecastCitytext = document.getElementsByClassName('Forecast__city--text');

    // Get weather icon from API based on retrieved weather data.
    const getWeatherIcon = () => {
        const iconCode = weather.weather[0].icon;
        const iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
        setWeatherIcon(iconUrl);
    }

    // Round temperature from weather data.
    const roundTemp = (temp) => {
        return Math.round(temp);
    }

    useEffect(() => {
        weather.cod === 200 && getWeatherIcon();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [weather]);

    // Listen for window changes to adjust font-size.
    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            })
        }
        window.addEventListener('resize', handleResize)
        return _ => {
            window.removeEventListener('resize', handleResize)
        }
    })

    // Return true if element's text is overflowing.
    const isOverflown = (element) => {
        return element.scrollWidth > element.clientWidth;
    }

    // Adjust font size on element based on overflow.
    const adjustFontSize = (elementText) => {
        const styleFontSize = window.getComputedStyle(elementText, null).getPropertyValue('font-size');
        let fontSize = parseFloat(styleFontSize);

        for (let i = fontSize; i < 24; i++) {
            let overflow = isOverflown(elementText);
            if (!overflow) {
                fontSize++;
                elementText.style.fontSize = fontSize + 'px';
            }
        }
        for (let i = fontSize; i >= 0; i--) {
            let overflow = isOverflown(elementText);
            if (overflow) {
                fontSize--;
                elementText.style.fontSize = fontSize + 'px';
            }
        }

    }

    useEffect(() => {
        forecastCitytext[0] && adjustFontSize(forecastCitytext[0])
    })

    return (
        <>{weather.cod === 200 ?
            <>
                <section className="Forecast">
                    <p className="Forecast__city">
                        <i className="fas fa-city"></i>
                        <span className="Forecast__city--line">|</span>
                        <span className="Forecast__city--text"> {weather.name}</span></p>
                    <p className="Forecast__conditions">
                        <span className="Forecast__conditions--degrees"> {roundTemp(weather.main.temp)}°</span> &
                        <img className="Forecast__conditions--icon" src={weatherIcon && weatherIcon} alt={''}></img></p>
                </section>

                <section className="Forecast__new__search">
                    <p className="Forecast__new__search--text" onClick={(() => setSearch(false))}>Search another city</p>
                </section>
            </>
            :
            <p style={{ zIndex: 1, color: 'white' }} onClick={(() => setSearch(false))}>Loading...</p>}
        </>

    )
}
