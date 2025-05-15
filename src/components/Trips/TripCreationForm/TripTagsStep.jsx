import React from 'react';

const TripTagsStep = ({ formData, setFormData }) => {
  const handleTagChange = (index, value) => {
    const updatedTags = [...formData.tags];
    updatedTags[index] = value;
    setFormData((prev) => ({ ...prev, tags: updatedTags }));
  };

  const addTag = () => {
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, ''] }));
  };

  const removeTag = (index) => {
    const updatedTags = [...formData.tags];
    updatedTags.splice(index, 1);
    setFormData((prev) => ({ ...prev, tags: updatedTags }));
  };

  return (
    <div>
      <h3>Tags</h3>
      {formData.tags.map((tag, index) => (
        <div key={index}>
          <input value={tag} onChange={(e) => handleTagChange(index, e.target.value)} placeholder="Tag" />
          <button type="button" onClick={() => removeTag(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={addTag}>+ Add Tag</button>
    </div>
  );
};

export default TripTagsStep;
