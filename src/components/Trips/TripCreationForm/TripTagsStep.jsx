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
      <div className="list-item-group">
        <h4>Tags (comma-separated or add individually)</h4>
        <p style={{fontSize: '0.9em', color: 'var(--text-color-muted)', marginTop: '-1rem', marginBottom: '1rem'}}>
            Help travelers find your trip! Examples: Adventure, Relaxing, Budget-friendly, Cultural, Hiking.
        </p>
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