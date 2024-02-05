import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom"

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  let history = useHistory()

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = 'http://localhost:5000/signup';
    const data = { email, password };

    if (password === confirmPassword) {

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        if (responseData.success) {
          console.log('User created successfully')

          history.push('/signin');
        }

      } catch (error) {
        console.error('Error:', error.message);
      }
      // Passwords match, you can proceed with your form submission logic
      console.log('Passwords match');
    } else {
      // Passwords don't match, you may want to handle this case
      console.log('Passwords do not match');
    }
  };

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>Confirm password</label>
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Sign up</button>
        <ul>
          <li><Link to='/signin'>Sign in</Link></li>
        </ul>
      </form>
    </React.Fragment>)
}

export default SignUp