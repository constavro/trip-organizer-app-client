// src/components/Users/UserProfile/SpokenLanguages.jsx
import React from 'react';
// CSS is imported by UserProfile.jsx or ProfileDetails.jsx

const LANGUAGE_TO_COUNTRY_CODE = {
  Albanian: 'al',       // Albania
  Amharic: 'et',        // Ethiopia
  Arabic: 'sa',         // Saudi Arabia
  Armenian: 'am',       // Armenia
  Azerbaijani: 'az',    // Azerbaijan
  Basque: 'es',         // Spain (Basque region)
  Bengali: 'bd',        // Bangladesh
  Bulgarian: 'bg',      // Bulgaria
  Burmese: 'mm',        // Myanmar
  Croatian: 'hr',       // Croatia
  Czech: 'cz',          // Czech Republic
  Danish: 'dk',         // Denmark
  Dutch: 'nl',          // Netherlands
  English: 'gb',        // United Kingdom (you could also use 'us' or 'au')
  Esperanto: 'eu',      // No country; fallback to European Union flag
  Estonian: 'ee',       // Estonia
  Finnish: 'fi',        // Finland
  French: 'fr',         // France
  Georgian: 'ge',       // Georgia
  German: 'de',         // Germany
  Greek: 'gr',          // Greece
  Gujarati: 'in',       // India
  HaitianCreole: 'ht',  // Haiti
  Hebrew: 'il',         // Israel
  Hindi: 'in',          // India
  Hungarian: 'hu',      // Hungary
  Igbo: 'ng',           // Nigeria
  Indonesian: 'id',     // Indonesia
  Italian: 'it',        // Italy
  Japanese: 'jp',       // Japan
  Kannada: 'in',        // India
  Kazakh: 'kz',         // Kazakhstan
  Khmer: 'kh',          // Cambodia
  Korean: 'kr',         // South Korea
  Kurdish: 'iq',        // Iraq (or 'tr' for Turkey, 'ir' for Iran)
  Lao: 'la',            // Laos
  Latin: 'va',          // Vatican City (fallback, no Latin-speaking country)
  Latvian: 'lv',        // Latvia
  Lithuanian: 'lt',     // Lithuania
  Maori: 'nz',          // New Zealand
  Malayalam: 'in',      // India
  MandarinChinese: 'cn',// China
  Marathi: 'in',        // India
  Mongolian: 'mn',      // Mongolia
  Nepali: 'np',         // Nepal
  Norwegian: 'no',      // Norway
  Pashto: 'af',         // Afghanistan
  Persian: 'ir',        // Iran
  Polish: 'pl',         // Poland
  Portuguese: 'pt',     // Portugal (or 'br' for Brazilian Portuguese)
  Punjabi: 'in',        // India
  Romanian: 'ro',       // Romania
  Russian: 'ru',        // Russia
  Samoan: 'ws',         // Samoa
  Serbian: 'rs',        // Serbia
  Sinhala: 'lk',        // Sri Lanka
  Slovak: 'sk',         // Slovakia
  Slovenian: 'si',      // Slovenia
  Somali: 'so',         // Somalia
  Spanish: 'es',        // Spain
  Swahili: 'ke',        // Kenya (or 'tz', 'ug', etc.)
  Swedish: 'se',        // Sweden
  Tajik: 'tj',          // Tajikistan
  Tamil: 'lk',          // Sri Lanka (or 'in' for India)
  Telugu: 'in',         // India
  Thai: 'th',           // Thailand
  Tigrinya: 'er',       // Eritrea (or 'et' for Ethiopia)
  Turkish: 'tr',        // Turkey
  Ukrainian: 'ua',      // Ukraine
  Urdu: 'pk',           // Pakistan
  Uzbek: 'uz',          // Uzbekistan
  Vietnamese: 'vn',     // Vietnam
  Xhosa: 'za',          // South Africa
  Yoruba: 'ng',         // Nigeria
  Zulu: 'za'            // South Africa
};

const SpokenLanguages = ({ languages = [] }) => {
  if (!languages.length) {
    return <p className="text-muted">No spoken languages listed.</p>; // UX: Clearer empty state
  }

  return (
    <ul className="spoken-languages-grid">
      {languages.map((language, index) => {
        const code = LANGUAGE_TO_COUNTRY_CODE[language];
        // UX: Provide a more generic default flag or even hide flag if no code
        const flagUrl = code
          ? `https://flagcdn.com/w80/${code.toLowerCase()}.png` // Use w80 for slightly better resolution
          : '/flags/default-world.png'; // A generic placeholder flag

        return (
          <li key={index} className="language-display-item">
            <img
                src={flagUrl}
                alt={`${language} flag`}
                className="language-flag-icon"
                onError={(e) => { e.target.onerror = null; e.target.src='/flags/default-world.png';}} // Fallback for broken flag links
            />
            <span className="language-name-display">{language}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default SpokenLanguages;