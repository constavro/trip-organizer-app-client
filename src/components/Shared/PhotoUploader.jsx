// components/UserProfile/PhotoUploader.jsx
import React, { useRef, useState } from 'react';

const PhotoUploader = ({ onUpload, currentImage, feature }) => { // Added endpoint prop for flexibility
  const fileInputRef = useRef();
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setUploadError('');
    if (!file) return;

    // UX: Basic file type and size validation
    if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file (jpeg, png, gif).');
        return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setUploadError('File is too large. Maximum size is 5MB.');
        return;
    }

    // const reader = new FileReader();
    // reader.onloadend = () => {
    //   setPreview(reader.result); // Show local preview immediately
    // };
    // reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('photo', file); // Backend expects 'photo'

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/${feature}/upload-photo`, {
        method: 'POST',
        headers: { Authorization: token }, // No Content-Type, FormData sets it
        body: formData,
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.message || 'Photo upload failed');
      }
      onUpload(responseData.path); // Send new path to parent
    } catch (err) {
      setUploadError(err.message || 'An error occurred during upload.');
      console.error('Photo upload error:', err);
    } finally {
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear file input
        }
    }
  };


  return (
    <div className="photo-upload-area">
      {/* <label>Change Profile Photo</label> */} {/* Label provided by section title */}
      <label htmlFor="photo-input" className="file-input-styled-button btn btn-outline-primary">
        Choose New Photo
        <input
            id="photo-input"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg, image/png, image/gif"
            style={{ display: 'none' }} // Hide default input, label acts as button
        />
      </label>
      {uploadError && <p className="error-message" style={{marginTop: '0.5rem'}}>{uploadError}</p>}
    </div>
  );
};

export default PhotoUploader;