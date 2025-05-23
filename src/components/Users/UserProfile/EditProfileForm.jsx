// components/UserProfile/EditProfileForm.jsx
import React, { useState } from 'react';
import LanguageSelector from './LanguageSelector';
import PhotoUploader from './PhotoUploader';
import SocialLinksEditor from './SocialLinksEditor';
import CountriesVisitedSelector from './CountriesVisitedSelector';
import ProfilePhotosDelete from './ProfilePhotosDelete';
import ProfilePhotoUploader from './ProfilePhotoUploader';
import './EditProfileForm.css'

const EditProfileForm = ({ user, onSave }) => {
  const [formState, setFormState] = useState({
    profilePhoto: user.profilePhoto || '/default-avatar.png',
    bio: user.bio || '',
    about: user.about || '',
    spokenLanguages: user.spokenLanguages || [],
    countriesVisited: user.countriesVisited || [],
    socialLinks: user.socialLinks || { facebook: '', instagram: '' },
    photos: user.photos || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (updatedLanguages) => {
    setFormState((prev) => ({ ...prev, spokenLanguages: updatedLanguages }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-profile-form">
      <div className="form-group">
      <ProfilePhotoUploader
        onUpload={(imagePath) =>
          setFormState((prev) => ({
            ...prev,
            profilePhoto: imagePath,
          }))
        }
      />
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          name="bio"
          value={formState.bio}
          onChange={handleChange}
          placeholder="Write a short bio about yourself"
        />
      </div>

      <div className="form-group">
        <label htmlFor="about">About</label>
        <textarea
          id="about"
          name="about"
          value={formState.about}
          onChange={handleChange}
          placeholder="Describe more about yourself"
        />
      </div>


<LanguageSelector
  selectedLanguages={formState.spokenLanguages}
  onChange={(updatedLanguages) =>
    setFormState((prev) => ({ ...prev, spokenLanguages: updatedLanguages }))
  }
/>

<ProfilePhotosDelete
  photos={formState.photos}
  onPhotoRemoved={(removedPath) =>
    setFormState((prev) => ({
      ...prev,
      photos: prev.photos.filter((photo) => photo !== removedPath),
    }))
  }
/>

      <PhotoUploader
        onUpload={(imagePath) =>
          setFormState((prev) => ({
            ...prev,
            photos: [...prev.photos, imagePath],
          }))
        }
      />

<SocialLinksEditor
  socialLinks={formState.socialLinks}
  onChange={(updatedLinks) =>
    setFormState((prev) => ({ ...prev, socialLinks: updatedLinks }))
  }
/>

<CountriesVisitedSelector
  selectedCountries={formState.countriesVisited}
  onChange={(updatedCountries) =>
    setFormState((prev) => ({ ...prev, countriesVisited: updatedCountries }))
  }
/>

      <button type="submit">Save</button>
    </form>
  );
};

export default EditProfileForm;
