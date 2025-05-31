// src/pages/ConfirmEmail.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ConfirmEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/confirm/${token}`);
        if (res.ok) {
          alert('✅ Email confirmed successfully!');
          navigate('/auth');
        } else {
          const data = await res.json();
          alert(`❌ ${data.message}`);
        }
      } catch (error) {
        console.error('Error confirming email:', error);
        alert('Something went wrong.');
      }
    };

    confirmEmail();
  }, [token, navigate]);

  return <p>Confirming your email...</p>;
};

export default ConfirmEmail;
