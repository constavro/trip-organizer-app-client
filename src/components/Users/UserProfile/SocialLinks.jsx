// src/components/Users/UserProfile/SocialLinks.jsx
import React from 'react';
// CSS is imported by UserProfile.jsx or ProfileDetails.jsx

// UX: Consider adding more social platforms or making icons dynamic
const SOCIAL_PLATFORMS = {
    facebook: { icon: "https://cdn-icons-png.flaticon.com/512/733/733547.png", name: "Facebook" },
    instagram: { icon: "https://cdn-icons-png.flaticon.com/512/733/733558.png", name: "Instagram" },
    // twitter: { icon: "path/to/twitter.png", name: "Twitter" },
};

const SocialLinks = ({ links }) => {
  if (!links || (Object.values(links).every(link => !link))) { // Check if any link exists
    return <p className="text-muted">No social media links provided.</p>;
  }

  return (
    // The section wrapper and title are handled in ProfileDetails.jsx
    <ul className="social-links-display">
      {Object.entries(links).map(([platform, url]) => {
        if (url && SOCIAL_PLATFORMS[platform]) {
          const platformInfo = SOCIAL_PLATFORMS[platform];
          return (
            <li key={platform}>
              <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${platformInfo.name} profile`}>
                <img
                  src={platformInfo.icon}
                  alt={`${platformInfo.name} icon`}
                  className="social-link-icon"
                />
                {/* Optional: Display platform name text as well for clarity */}
                {/* <span className="platform-name">{platformInfo.name}</span> */}
              </a>
            </li>
          );
        }
        return null;
      })}
    </ul>
  );
};

export default SocialLinks;