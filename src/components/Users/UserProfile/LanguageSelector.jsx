import React, { useState } from 'react';
import './LanguageSelector.css'

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
    <div className="select-wrapper">
      <label>Languages Spoken</label>
      <div>
        <select className="custom-select" value={input} onChange={(e) => setInput(e.target.value)}>
          <option value="">Select a language</option>
          {LANGUAGE_LIST.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
        <button className='language-button' type="button" onClick={handleAdd}>Add</button>
      </div>

      <ul className="selected-list">
        {selectedLanguages.map((lang) => (
          <li key={lang}>
            {lang}{'  '}
            <button className='language-button' type="button" onClick={() => handleRemove(lang)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSelector;
