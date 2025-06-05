// src/components/Trips/TripEditForm/FormSection.jsx
import React from 'react';

const FormSection = ({ title, children }) => {
  return (
    <fieldset>
      {title && <legend>{title}</legend>}
      {children}
    </fieldset>
  );
};

export default FormSection;