import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('Renders City header', () => {
  render(<App />);
  const headerElement = screen.getByText(/City/i);
  expect(headerElement).toBeInTheDocument();
});
