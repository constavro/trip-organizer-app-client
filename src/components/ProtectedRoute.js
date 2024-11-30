// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { auth } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        auth.token ? (
          <Component {...props} />
        ) : (
          <Navigate to="/login" />
        )
      }
    />
  );
};

export default ProtectedRoute;
