import React from 'react';

const TripDescriptionStep = ({ formData, setFormData, setError }) => {
  const handleOverviewChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        overview: value,
      },
    }));
    if (setError) setError('');
  };

  const handleListChange = (type, index, value) => {
    const updatedList = [...formData.description[type]];
    updatedList[index] = value;
    setFormData((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        [type]: updatedList,
      },
    }));
    if (setError) setError('');
  };

  const addListItem = (type) => {
    setFormData((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        [type]: [...prev.description[type], ''],
      },
    }));
    if (setError) setError('');
  };

  const removeListItem = (type, index) => {
    if (formData.description[type].length <= 1 && (type === "inclusions" || type === "exclusions")) {
      // Keep at least one item for inclusions/exclusions, but allow clearing its content
      const updatedList = [...formData.description[type]];
      updatedList[index] = ''; // Clear the content instead of removing the item
       setFormData((prev) => ({
        ...prev,
        description: { ...prev.description, [type]: updatedList },
      }));
      return;
    }
    const updatedList = [...formData.description[type]];
    updatedList.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        [type]: updatedList,
      },
    }));
    if (setError) setError('');
  };

  return (
    <div className="form-step">
      <div className="form-group">
        <label htmlFor="overview">Trip Overview</label>
        <textarea
          id="overview"
          name="description.overview" // Keep name for potential direct form submission
          placeholder="Provide a captivating overview of the trip..."
          value={formData.description.overview}
          onChange={handleOverviewChange}
          required
        />
      </div>

      {['inclusions', 'exclusions'].map((type) => (
        <div className="list-item-group" key={type}>
          <h4>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
          {formData.description[type].map((item, idx) => (
            <div className="list-item" key={`${type}-${idx}`}>
              <input
                type="text"
                id={`${type}-${idx}`}
                value={item}
                onChange={(e) => handleListChange(type, idx, e.target.value)}
                placeholder={`e.g. Guided tours, Meals`}
              />
              {formData.description[type].length > 1 && ( // Show remove button only if more than one item
                <button className="btn-remove-item" type="button" onClick={() => removeListItem(type, idx)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button className="btn btn-add-item btn-secondary" type="button" onClick={() => addListItem(type)}>
            Add extra {type.slice(0, -1)}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TripDescriptionStep;