// src/components/Trips/TripEditForm/EditableListItem.jsx
import React from 'react';

const EditableListItem = ({ item, index, onChange, onRemove, placeholder = "Enter value" }) => {
  return (
    <div className="list-item">
      <input
        type="text"
        value={item}
        onChange={(e) => onChange(e, index)}
        placeholder={placeholder}
      />
      <button type="button" className="btn-remove-item" onClick={() => onRemove(index)}>
        Remove
      </button>
    </div>
  );
};

export default EditableListItem;