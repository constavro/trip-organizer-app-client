import React from 'react';

const TripTagsStep = ({ formData, setFormData, setError }) => {
  const handleTagChange = (index, value) => {
    const updatedTags = [...formData.tags];
    updatedTags[index] = value;
    setFormData((prev) => ({ ...prev, tags: updatedTags }));
    if (setError) setError('');
  };

  const addTag = () => {
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, ''] }));
    if (setError) setError('');
  };

  const removeTag = (index) => {
    if (formData.tags.length <= 1) {
        // If it's the last tag, clear its content instead of removing the input field
        const updatedTags = [...formData.tags];
        updatedTags[index] = '';
        setFormData((prev) => ({ ...prev, tags: updatedTags }));
        return;
    }
    const updatedTags = [...formData.tags];
    updatedTags.splice(index, 1);
    setFormData((prev) => ({ ...prev, tags: updatedTags }));
    if (setError) setError('');
  };

  return (
    <div className="form-step">
      <div className="form-group">
        <label>Tags</label>
        {formData.tags.map((tag, index) => (
          <div className="list-item" key={index}>
            <input
              type="text"
              id={`tag-${index}`}
              value={tag}
              onChange={(e) => handleTagChange(index, e.target.value)}
              placeholder={`Tag ${index + 1}`}
            />
            {formData.tags.length > 1 && (
              <button className="btn-remove-item" type="button" onClick={() => removeTag(index)}>
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      <button className="btn btn-add-item btn-secondary" type="button" onClick={addTag}>
        + Add Another Tag
      </button>
    </div>
  );
};

export default TripTagsStep;