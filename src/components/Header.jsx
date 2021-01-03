import React from 'react';
import '../styles/Header.css';

export default function Header() {
  return (
    <header className="Header">
      <h1 className="Header__h1">
        City forecas
        <i className="fas fa-umbrella" />
      </h1>
      <p className="Header__symbols">
        <i className="fas fa-sun" />
        <i className="fas fa-cloud-sun" />
        <i className="fas fa-cloud-rain" />
        <i className="fas fa-cloud-showers-heavy" />
        <i className="far fa-snowflake" />
      </p>
    </header>
  );
}
