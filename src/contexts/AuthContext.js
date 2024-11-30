// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    user: null,
  });

  useEffect(() => {
    if (auth.token) {
      const user = jwtDecode(auth.token);
      setAuth((prevAuth) => ({ ...prevAuth, user }));
    }
  }, [auth.token]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    const user = jwtDecode(token);
    setAuth({ token, user });
  };

  const signup = async (name, email, password) => {
    await api.post('/auth/signup', { name, email, password });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
