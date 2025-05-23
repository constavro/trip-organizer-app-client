import React, { useState } from 'react';

const LANGUAGE_LIST = [
  'English', 'Mandarin Chinese', 'Hindi', 'Spanish', 'French', 'Arabic', 'Bengali', 'Russian',
  'Portuguese', 'Urdu', 'Indonesian', 'German', 'Japanese', 'Swahili', 'Marathi', 'Telugu',
  'Turkish', 'Tamil', 'Vietnamese', 'Korean', 'Italian', 'Polish', 'Ukrainian', 'Dutch',
  'Persian', 'Malayalam', 'Thai', 'Gujarati', 'Kannada', 'Punjabi', 'Hebrew', 'Czech',
  'Romanian', 'Greek', 'Hungarian', 'Swedish', 'Finnish', 'Danish', 'Norwegian', 'Slovak',
  'Bulgarian', 'Serbian', 'Croatian', 'Lithuanian', 'Latvian', 'Estonian', 'Slovenian',
  'Armenian', 'Georgian', 'Albanian', 'Azerbaijani', 'Basque', 'Pashto', 'Nepali', 'Sinhala',
  'Amharic', 'Somali', 'Zulu', 'Xhosa', 'Yoruba', 'Igbo', 'Hausa', 'Burmese', 'Khmer', 'Lao',
  'Mongolian', 'Kazakh', 'Uzbek', 'Tajik', 'Kurdish', 'Tigrinya', 'Maori', 'Samoan', 'Haitian Creole',
  'Esperanto', 'Latin'
];

const LanguageSelector = ({ selectedLanguages, onChange }) => {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (
      trimmed &&
      LANGUAGE_LIST.includes(trimmed) &&
      !selectedLanguages.includes(trimmed)
    ) {
      onChange([...selectedLanguages, trimmed]);
      setInput('');
    }
  };

  const handleRemove = (languageToRemove) => {
    onChange(selectedLanguages.filter((lang) => lang !== languageToRemove));
  };

  return (
    <div className="form-group">
      <label>Languages Spoken</label>
      <div style={{ display: 'flex', gap: '8px' }}>
        <select value={input} onChange={(e) => setInput(e.target.value)}>
          <option value="">Select a language</option>
          {LANGUAGE_LIST.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleAdd}>Add</button>
      </div>

      <ul className="selected-list">
        {selectedLanguages.map((lang) => (
          <li key={lang}>
            {lang}{' '}
            <button type="button" onClick={() => handleRemove(lang)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSelector;
