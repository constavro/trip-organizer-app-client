import React, { useState } from 'react';

// You can replace this list with a full country list or import from a separate file
const COUNTRY_LIST = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo (Congo-Brazzaville)',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Democratic Republic of the Congo',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Ivory Coast',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine State',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe'
];


const CountriesVisitedSelector = ({ selectedCountries, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddCountry = () => {
    const trimmedInput = inputValue.trim();
    if (
      trimmedInput &&
      COUNTRY_LIST.includes(trimmedInput) && // Ensure it's a valid country
      !selectedCountries.includes(trimmedInput)
    ) {
      onChange([...selectedCountries, trimmedInput]);
      setInputValue(''); // Clear input after adding
    } else if (selectedCountries.includes(trimmedInput)) {
        alert(`${trimmedInput} is already added.`); // UX: feedback
    } else if (trimmedInput && !COUNTRY_LIST.includes(trimmedInput)) {
        alert(`"${trimmedInput}" is not a recognized country in our list.`); // UX: feedback
    }
  };

  const handleRemoveCountry = (countryToRemove) => {
    onChange(selectedCountries.filter((cntr) => cntr !== countryToRemove));
  };


  return (
    <div className="multi-select-input-container">
      <label htmlFor="country-select">Countries Visited</label> {/* For accessibility */}
      <div className="multi-select-controls">
        <select
          id="country-select"
          className="custom-select-input" // Use new class
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        >
          <option value="">-- Select a country to add --</option>
          {COUNTRY_LIST.map((country) => (
            <option key={country} value={country} disabled={selectedCountries.includes(country)}>
              {country}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-sm btn-add-to-list" // Use new class & btn styles
          onClick={handleAddCountry}
          disabled={!inputValue}
        >
          Add
        </button>
      </div>

      {selectedCountries.length > 0 && (
        <ul className="selected-items-pill-list">
          {selectedCountries.map((cntr) => (
            <li key={cntr} className="selected-item-pill">
              {cntr}
              <button
                type="button"
                className="btn-remove-from-list" // Use new class
                onClick={() => handleRemoveCountry(cntr)}
                aria-label={`Remove ${cntr}`}
              >
                × {/* HTML entity for 'x' */ }
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountriesVisitedSelector;
