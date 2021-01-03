import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Form.css';

export default function Form(props) {
  const { getCurrentLocation, setCity, setError } = props;

  const input = document.getElementsByClassName(
    'Form__search--input',
  );
  // Regex for only alphabetical letters, and no space in beginning.
  const regex = /^[a-zA-Z][a-zA-Z ]*$/;

  // Validate search from input field using regex.
  const formSearch = (e) => {
    if (e) e.preventDefault();
    const validSearch = input[0].value.match(regex);
    if (validSearch) {
      setCity(validSearch);
    } else {
      setError('Only alphabet letters allowed.');
    }
    input[0].value = '';
  };

  return (
    <section className="Form">
      <form
        className="Form__search"
        type="submit"
        onSubmit={(e) => formSearch(e)}
      >
        <button className="Form__search--button" type="submit">
          <i className="fas fa-search" />
        </button>
        <input
          className="Form__search--input"
          type="text"
          placeholder="Search for city"
        />
      </form>

      <article
        className="Form__location"
        onClick={() => getCurrentLocation()}
        role="presentation"
      >
        <p className="Form__location--text">
          <i className="fas fa-location-arrow" />
          Use location
        </p>
      </article>
    </section>
  );
}

Form.propTypes = {
  getCurrentLocation: PropTypes.func.isRequired,
  setCity: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};
