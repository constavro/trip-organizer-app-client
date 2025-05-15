import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance Monitoring (optional)
if (process.env.NODE_ENV === 'development') {
  reportWebVitals(console.log); // Logs performance metrics during development
}