// src/components/Trips/TripEditForm/TripSettingsPolicy.jsx
import React from 'react';
import FormSection from './FormSection';
import EditableListItem from './EditableListItem';

const TripSettingsPolicy = ({
  privacy,
  bookingDeadline,
  tags,
  handleChange,
  handleListChange,
  addListItem,
  removeListItem
}) => {
  return (
    <FormSection title="Settings & Policy">
      <div className="form-group">
        <label>Privacy</label>
        <div className="radio-group">
          <label><input type="radio" name="privacy" value="public" checked={privacy === 'public'} onChange={handleChange} /> Public</label>
          <label><input type="radio" name="privacy" value="private" checked={privacy === 'private'} onChange={handleChange} /> Private</label>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="bookingDeadline">Booking Deadline</label>
        <input type="date" id="bookingDeadline" name="bookingDeadline" value={bookingDeadline || ''} onChange={handleChange} />
      </div>
      
      <div className="list-item-group">
        <h4>Tags</h4>
        {(tags || []).map((tag, index) => (
          <EditableListItem
            key={`tag-${index}`}
            item={tag}
            index={index}
            onChange={(e, idx) => handleListChange(e, idx, 'tags')}
            onRemove={(idx) => removeListItem(idx, 'tags')}
            placeholder="e.g., Adventure"
          />
        ))}
        <button type="button" className="btn-add-item" onClick={() => addListItem('tags')}>+ Add Tag</button>
      </div>
    </FormSection>
  );
};

export default TripSettingsPolicy;