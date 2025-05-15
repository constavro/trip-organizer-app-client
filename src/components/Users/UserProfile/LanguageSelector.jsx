import React, { useState } from 'react';
import './LanguageSelector.css'

// List of all available languages
const allLanguages = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Russian',
  'Arabic', 'Hindi', 'Portuguese', 'Korean', 'Italian', 'Dutch', 'Swedish',
  'Norwegian', 'Danish', 'Finnish', 'Greek', 'Turkish', 'Polish', 'Czech',
  'Hungarian', 'Thai', 'Vietnamese', 'Swahili', 'Zulu', 'Hebrew', 'Latin',
  // Add more languages as needed
];

const LanguageSelector = ({ initialLanguages = [], onSave }) => {
  const [spokenLanguages, setSpokenLanguages] = useState(initialLanguages);
  const [availableLanguages, setAvailableLanguages] = useState(
    allLanguages.filter((lang) => !initialLanguages.includes(lang))
  );

  const handleLanguageClick = (language, type) => {
    if (type === 'available') {
      setSpokenLanguages([...spokenLanguages, language]);
      setAvailableLanguages(availableLanguages.filter((lang) => lang !== language));
    } else {
      setAvailableLanguages([...availableLanguages, language].sort());
      setSpokenLanguages(spokenLanguages.filter((lang) => lang !== language));
    }
  };

  const handleSave = () => {
    onSave(spokenLanguages);
  };

  return (
    <div className="language-selector">
      <h3>Select Spoken Languages</h3>

      <div className="language-lists">
        <div className="language-column">
          <h4>Available Languages</h4>
          <ul>
            {availableLanguages.map((language, index) => (
              <li
                key={index}
                className="language-item"
                onClick={() => handleLanguageClick(language, 'available')}
              >
                {language}
              </li>
            ))}
          </ul>
        </div>

        <div className="language-column">
          <h4>Your Spoken Languages</h4>
          <ul>
            {spokenLanguages.map((language, index) => (
              <li
                key={index}
                className="language-item"
                onClick={() => handleLanguageClick(language, 'spoken')}
              >
                {language}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button className="save-button" onClick={handleSave}>
        Save Languages
      </button>
    </div>
  );
};

export default LanguageSelector;