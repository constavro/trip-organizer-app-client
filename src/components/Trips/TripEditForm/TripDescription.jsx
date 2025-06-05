// src/components/Trips/TripEditForm/TripDescription.jsx
import React from 'react';
import FormSection from './FormSection';
import EditableListItem from './EditableListItem';

const TripDescription = ({ description, handleChange, handleListChange, addListItem, removeListItem }) => {
  return (
    <FormSection title="Description">
      <div className="form-group">
        <label htmlFor="description.overview">Overview</label>
        <textarea id="description.overview" name="description.overview" value={description.overview || ''} onChange={handleChange} required />
      </div>
      
      <div className="list-item-group">
        <h4>Inclusions</h4>
        {(description.inclusions || []).map((item, index) => (
          <EditableListItem
            key={`inclusion-${index}`}
            item={item}
            index={index}
            onChange={(e, idx) => handleListChange(e, idx, 'description.inclusions')}
            onRemove={(idx) => removeListItem(idx, 'description.inclusions')}
            placeholder="e.g., Accommodation"
          />
        ))}
        <button type="button" className="btn-add-item" onClick={() => addListItem('description.inclusions')}>+ Add Inclusion</button>
      </div>

      <div className="list-item-group">
        <h4>Exclusions</h4>
        {(description.exclusions || []).map((item, index) => (
          <EditableListItem
            key={`exclusion-${index}`}
            item={item}
            index={index}
            onChange={(e, idx) => handleListChange(e, idx, 'description.exclusions')}
            onRemove={(idx) => removeListItem(idx, 'description.exclusions')}
            placeholder="e.g., Flights"
          />
        ))}
        <button type="button" className="btn-add-item" onClick={() => addListItem('description.exclusions')}>+ Add Exclusion</button>
      </div>
    </FormSection>
  );
};

export default TripDescription;