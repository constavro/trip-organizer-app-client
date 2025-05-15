import React from 'react';

const TripDescriptionStep = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const key = name.split('.')[1];
    setFormData((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        [key]: value,
      },
    }));
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
  };

  const addListItem = (type) => {
    setFormData((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        [type]: [...prev.description[type], ''],
      },
    }));
  };

  const removeListItem = (type, index) => {
    const updatedList = [...formData.description[type]];
    updatedList.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        [type]: updatedList,
      },
    }));
  };

  return (
    <div className="form-step">
      <h3>Trip Description</h3>

      <label>
        Overview:
        <input
          name="description.overview"
          placeholder="Overview"
          value={formData.description.overview}
          onChange={handleChange}
          required
        />
      </label>

      {['inclusions', 'exclusions'].map((type) => (
        <div key={type}>
          <h4>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
          {formData.description[type].map((item, idx) => (
            <div key={idx}>
              <input
                value={item}
                onChange={(e) => handleListChange(type, idx, e.target.value)}
                placeholder={`${type.slice(0, -1)} ${idx + 1}`}
              />
              <button type="button" onClick={() => removeListItem(type, idx)}>X</button>
            </div>
          ))}
          <button type="button" onClick={() => addListItem(type)}>
            + Add {type.slice(0, -1)}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TripDescriptionStep;
