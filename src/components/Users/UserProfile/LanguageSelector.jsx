import React, { useState } from 'react';

const LANGUAGE_LIST = [
  'Albanian', 'Amharic', 'Arabic', 'Armenian', 'Azerbaijani', 'Basque', 'Bengali', 'Bulgarian',
  'Burmese', 'Croatian', 'Czech', 'Danish', 'Dutch', 'English', 'Esperanto', 'Estonian',
  'Finnish', 'French', 'Georgian', 'German', 'Greek', 'Gujarati', 'Haitian Creole', 'Hebrew',
  'Hindi', 'Hungarian', 'Igbo', 'Indonesian', 'Italian', 'Japanese', 'Kannada', 'Kazakh',
  'Khmer', 'Korean', 'Kurdish', 'Lao', 'Latin', 'Latvian', 'Lithuanian', 'Maori', 'Malayalam',
  'Mandarin Chinese', 'Marathi', 'Mongolian', 'Nepali', 'Norwegian', 'Pashto', 'Persian',
  'Polish', 'Portuguese', 'Punjabi', 'Romanian', 'Russian', 'Samoan', 'Serbian', 'Sinhala',
  'Slovak', 'Slovenian', 'Somali', 'Spanish', 'Swahili', 'Swedish', 'Tajik', 'Tamil', 'Telugu',
  'Thai', 'Tigrinya', 'Turkish', 'Ukrainian', 'Urdu', 'Uzbek', 'Vietnamese', 'Xhosa', 'Yoruba',
  'Zulu'
];


const LanguageSelector = ({ selectedLanguages, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddLanguage = () => {
    const trimmedInput = inputValue.trim();
    if (
      trimmedInput &&
      LANGUAGE_LIST.includes(trimmedInput) && // Ensure it's a valid language
      !selectedLanguages.includes(trimmedInput)
    ) {
      onChange([...selectedLanguages, trimmedInput]);
      setInputValue(''); // Clear input after adding
    } else if (selectedLanguages.includes(trimmedInput)) {
        alert(`${trimmedInput} is already added.`); // UX: feedback
    } else if (trimmedInput && !LANGUAGE_LIST.includes(trimmedInput)) {
        alert(`"${trimmedInput}" is not a recognized language in our list.`); // UX: feedback
    }
  };

  const handleRemoveLanguage = (languageToRemove) => {
    onChange(selectedLanguages.filter((lang) => lang !== languageToRemove));
  };

    return (
    <div className="multi-select-input-container">
      <label htmlFor="language-select">Languages Spoken</label> {/* For accessibility */}
      <div className="multi-select-controls">
        <select
          id="language-select"
          className="custom-select-input" // Use new class
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        >
          <option value="">-- Select a language to add --</option>
          {LANGUAGE_LIST.map((language) => (
            <option key={language} value={language} disabled={selectedLanguages.includes(language)}>
              {language}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-sm btn-add-to-list" // Use new class & btn styles
          onClick={handleAddLanguage}
          disabled={!inputValue}
        >
          Add
        </button>
      </div>

      {selectedLanguages.length > 0 && (
        <ul className="selected-items-pill-list">
          {selectedLanguages.map((lang) => (
            <li key={lang} className="selected-item-pill">
              {lang}
              <button
                type="button"
                className="btn-remove-from-list" // Use new class
                onClick={() => handleRemoveLanguage(lang)}
                aria-label={`Remove ${lang}`}
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

export default LanguageSelector;