// src/components/Users/UserProfile/SocialLinksEditor.jsx
import React from 'react';
// CSS is imported by UserProfile.jsx or EditProfileForm.jsx

const SocialLinksEditor = ({ socialLinks, onChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...socialLinks, [name]: value });
  };

  return (
    // This div might be part of EditProfileForm.jsx structure
    // <div className="edit-profile-form-section">
    //   <h3 className="edit-profile-form-section-title">Social Media</h3>
        <> {/* Use fragment if no specific wrapper needed here */}
          <div className="form-group"> {/* Each input in a form-group */}
            <label htmlFor="facebook-link">Facebook Profile URL</label>
            <input
              type="url"
              id="facebook-link"
              name="facebook"
              placeholder="e.g., https://facebook.com/yourprofile"
              value={socialLinks?.facebook || ''} // Optional chaining for safety
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="instagram-link">Instagram Profile URL</label>
            <input
              type="url"
              id="instagram-link"
              name="instagram"
              placeholder="e.g., https://instagram.com/yourusername"
              value={socialLinks?.instagram || ''} // Optional chaining
              onChange={handleInputChange}
            />
          </div>
          {/* Add more social links here if needed (e.g., Twitter, LinkedIn) */}
        </>
    // </div>
  );
};

export default SocialLinksEditor;