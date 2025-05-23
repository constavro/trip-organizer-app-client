// components/UserProfile/SpokenLanguages.jsx
import React from 'react';
import './SpokenLanguages.css';

// Language to country code mapping for flag icons
const LANGUAGE_TO_COUNTRY_CODE = {
  English: 'gb',
  Spanish: 'es',
  French: 'fr',
  German: 'de',
  Chinese: 'cn',
  Japanese: 'jp',
  Russian: 'ru',
  Arabic: 'sa',
  Hindi: 'in',
  Portuguese: 'pt',
  Korean: 'kr',
  Italian: 'it',
  Dutch: 'nl',
  Swedish: 'se',
  Norwegian: 'no',
  Danish: 'dk',
  Finnish: 'fi',
  Greek: 'gr',
  Turkish: 'tr',
  Polish: 'pl',
  Czech: 'cz',
  Hungarian: 'hu',
  Thai: 'th',
  Vietnamese: 'vn',
  Swahili: 'ke',
  Zulu: 'za',
  Hebrew: 'il',
  Latin: 'va' // Vatican
};

const SpokenLanguages = ({ languages = [] }) => {
  if (!languages.length) return <p>No spoken languages provided.</p>;

  return (
    <ul className="spoken-languages">
      {languages.map((language, index) => {
        const code = LANGUAGE_TO_COUNTRY_CODE[language];
        const flagUrl = code
          ? `https://flagcdn.com/w160/${code}.png`
          : '/flags/default.png'; // fallback or your custom image

        return (
          <li key={index}>
            <img src={flagUrl} alt={`${language} flag`} className="flag-image" />
            <span className="language">{language}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default SpokenLanguages;
