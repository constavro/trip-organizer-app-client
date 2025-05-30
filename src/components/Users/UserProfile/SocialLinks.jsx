import React from 'react';
import './SocialLinks.css';

const SocialLinks = ({ links }) => {
  if (!links) return null;

  return (
    <div className="profile-section social-links">
      <h3>Social Links</h3>
      <ul>
        {links.facebook && (
          <li>
            <a href={links.facebook} target="_blank" rel="noopener noreferrer">
              <img
                src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                alt="Facebook icon"
                className="social-icon"
              />
            </a>
          </li>
        )}
        {links.instagram && (
          <li>
            <a href={links.instagram} target="_blank" rel="noopener noreferrer">
              <img
                src="https://cdn-icons-png.flaticon.com/512/733/733558.png"
                alt="Instagram icon"
                className="social-icon"
              />
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};

export default SocialLinks;
