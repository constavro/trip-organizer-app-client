import React, { useState } from 'react';

// You can replace this list with a full country list or import from a separate file
const COUNTRY_LIST = [
  'United States', 'Canada', 'Mexico', 'United Kingdom', 'France',
  'Germany', 'Spain', 'Italy', 'Australia', 'Japan', 'India',
  'Brazil', 'South Africa', 'China', 'New Zealand',
];

const CountriesVisitedSelector = ({ selectedCountries, onChange }) => {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (
      trimmed &&
      COUNTRY_LIST.includes(trimmed) &&
      !selectedCountries.includes(trimmed)
    ) {
      onChange([...selectedCountries, trimmed]);
      setInput('');
    }
  };

  const handleRemove = (countryToRemove) => {
    onChange(selectedCountries.filter((country) => country !== countryToRemove));
  };

  return (
    <div className="form-group">
      <label>Countries Visited</label>
      <div style={{ display: 'flex', gap: '8px' }}>
        <select value={input} onChange={(e) => setInput(e.target.value)}>
          <option value="">Select a country</option>
          {COUNTRY_LIST.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleAdd}>Add</button>
      </div>

      <ul className="selected-countries">
        {selectedCountries.map((country) => (
          <li key={country}>
            {country}{' '}
            <button type="button" onClick={() => handleRemove(country)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountriesVisitedSelector;
