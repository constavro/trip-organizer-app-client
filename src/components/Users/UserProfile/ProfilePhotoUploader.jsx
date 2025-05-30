import React, { useRef } from 'react';
import './ProfilePhotoUploader.css';

const ProfilePhotoUploader = ({ onUpload }) => {
  const fileInputRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/upload-profile-photo`, {
        method: 'POST',
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const { path } = await res.json();
      console.log(path);
      onUpload(path);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="photo-uploader">
      <label>Change Profile Photo</label>
      <div className="file-input-wrapper">
        Choose File
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
      </div>
    </div>
  );
};

export default ProfilePhotoUploader;
