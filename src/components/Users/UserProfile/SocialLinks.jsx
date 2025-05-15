// components/UserProfile/SocialLinks.jsx
import React from 'react';

const SocialLinks = ({ links }) => {
  if (!links) return null;

  return (
    <div className="profile-section">
      <h3>Social Links</h3>
      <ul>
        {links.facebook && (
          <li>
            <a href={links.facebook} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          </li>
        )}
        {links.instagram && (
          <li>
            <a href={links.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};

export default SocialLinks;
