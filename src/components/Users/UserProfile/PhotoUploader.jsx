// components/UserProfile/PhotoUploader.jsx
import React, { useRef } from 'react';
import './ProfilePhotoUploader.css';

const PhotoUploader = ({ onUpload, endpoint = '/api/users/upload-photo' }) => { // Added endpoint prop for flexibility
  const fileInputRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}${endpoint}`, { // Use endpoint prop
        method: 'POST',
        headers: {
          Authorization: token, // Assuming token is 'Bearer <your_token>' format if backend expects it
        },
        body: formData,
      });

      const responseData = await res.json(); // Always parse JSON first

      if (!res.ok) {
        throw new Error(responseData.message || responseData.error || 'Upload failed');
      }
      
      // The backend now returns the full Azure URL in 'path'
      onUpload(responseData.path); 

    } catch (err) {
      console.error('Upload error:', err);
      alert(err.message || 'An error occurred during upload.');
    } finally {
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="photo-uploader">
      <label>Upload Photo</label>
      <div className="file-input-wrapper">
        Choose File
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
      </div>
    </div>
  );
};

export default PhotoUploader;