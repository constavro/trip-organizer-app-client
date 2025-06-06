import React, { useState } from 'react';
import LanguageSelector from './LanguageSelector';
import PhotoUploader from './PhotoUploader'; // For gallery photos
import SocialLinksEditor from './SocialLinksEditor';
import CountriesVisitedSelector from './CountriesVisitedSelector';
import ProfilePhotosDelete from './ProfilePhotosDelete';
import ProfilePhotoUploader from './ProfilePhotoUploader'; // For main profile picture
// CSS is imported by UserProfile.jsx

const EditProfileForm = ({ currentUserData, onSave }) => {
  const [formState, setFormState] = useState({
    profilePhoto: currentUserData.profilePhoto || '',
    bio: currentUserData.bio || '',
    about: currentUserData.about || '',
    spokenLanguages: currentUserData.spokenLanguages || [],
    countriesVisited: currentUserData.countriesVisited || [],
    socialLinks: currentUserData.socialLinks || { facebook: '', instagram: '' },
    photos: currentUserData.photos || [],
  });
  const [formError, setFormError] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    // Add any specific validation for edit form if needed
    // For example, bio length
    if (formState.bio.length > 500) {
        setFormError("Bio cannot exceed 500 characters.");
        return;
    }
    onSave(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-profile-form-container">
      {formError && <p className="error-message">{formError}</p>}

      <section className="edit-profile-form-section">
        <h3 className="edit-profile-form-section-title">Profile Picture</h3>
        <ProfilePhotoUploader
          onUpload={(imagePath) =>
            setFormState((prev) => ({ ...prev, profilePhoto: imagePath }))
          }
          currentImage={formState.profilePhoto} // Pass current image for preview
        />
      </section>

      <section className="edit-profile-form-section">
        <h3 className="edit-profile-form-section-title">About You</h3>
        <div className="form-group">
          <label htmlFor="bio">Bio (Short introduction)</label>
          <textarea
            id="bio"
            name="bio"
            value={formState.bio}
            onChange={handleChange}
            placeholder="Tell us a bit about yourself in a sentence or two."
            rows="3"
            maxLength="250" // UX: Max length
          />
        </div>
        <div className="form-group">
          <label htmlFor="about">More About Me (Optional)</label>
          <textarea
            id="about"
            name="about"
            value={formState.about}
            onChange={handleChange}
            placeholder="Share more details, your travel style, interests, etc."
            rows="6"
          />
        </div>
      </section>

      <section className="edit-profile-form-section">
        <h3 className="edit-profile-form-section-title">Languages & Travels</h3>
        <LanguageSelector
          selectedLanguages={formState.spokenLanguages}
          onChange={(updatedLanguages) =>
            setFormState((prev) => ({ ...prev, spokenLanguages: updatedLanguages }))
          }
        />
        <CountriesVisitedSelector
          selectedCountries={formState.countriesVisited}
          onChange={(updatedCountries) =>
            setFormState((prev) => ({ ...prev, countriesVisited: updatedCountries }))
          }
        />
      </section>
      
      <section className="edit-profile-form-section">
        <h3 className="edit-profile-form-section-title">Photo Gallery</h3>
        <p className="text-muted" style={{fontSize: '0.9rem', marginTop: '-1rem', marginBottom: '1rem'}}>Share some of your favorite travel moments!</p>
        <ProfilePhotosDelete
          photos={formState.photos}
          onPhotoRemoved={(removedPath) =>
            setFormState((prev) => ({
              ...prev,
              photos: prev.photos.filter((photo) => photo !== removedPath),
            }))
          }
          onPhotoDeleteError={(errMsg) => setFormError(errMsg || "Failed to delete photo.")} // UX: Show error for photo deletion
        />
        <PhotoUploader
          onUpload={(imagePath) =>
            setFormState((prev) => ({
              ...prev,
              photos: [...prev.photos, imagePath],
            }))
          }
          // endpoint="/api/users/upload-gallery-photo" // Example if different endpoint
        />
      </section>

      <section className="edit-profile-form-section">
        <h3 className="edit-profile-form-section-title">Social Media</h3>
        <SocialLinksEditor
          socialLinks={formState.socialLinks}
          onChange={(updatedLinks) =>
            setFormState((prev) => ({ ...prev, socialLinks: updatedLinks }))
          }
        />
      </section>

      <button type="submit" className="btn btn-success btn-lg btn-save-profile">Save Changes</button>
    </form>
  );
};

export default EditProfileForm;