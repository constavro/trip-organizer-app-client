import React from 'react';

const SocialLinksEditor = ({ socialLinks, onChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...socialLinks, [name]: value });
  };

  return (
    <div className="form-group">
      <label>Social Media Links</label>
      <input
        type="url"
        name="facebook"
        placeholder="Facebook URL"
        value={socialLinks.facebook || ''}
        onChange={handleInputChange}
      />
      <input
        type="url"
        name="instagram"
        placeholder="Instagram URL"
        value={socialLinks.instagram || ''}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SocialLinksEditor;
