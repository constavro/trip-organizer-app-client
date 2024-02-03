import React, { useState, useEffect } from 'react';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    useEffect(() => {
      // This effect runs whenever 'isSignUp' changes
      console.log('Switched to:', isSignUp ? 'Sign Up' : 'Login');
    }, [isSignUp]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const endpoint = isSignUp ? '/signup' : '/signin';
      const data = {username, email, password };
  
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
        console.log(responseData)
        setIsAuthenticated(true);
        console.log("isAuthenticated",isAuthenticated); // Assuming the server responds with some data
      } catch (error) {
        console.error('Error:', error.message);
        // Handle error appropriately (e.g., display error message to the user)
      }
    };
  
    const handleLogout = async () => {
      try {
  
        const data = {username, email, password };
        const response = await fetch('/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // You may include additional headers if needed
          },
          body: JSON.stringify(data),
          credentials: 'include',
        });
  
        console.log(response)
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        // Assuming the server responds with some data
        const responseData = await response.json();
        console.log(responseData); // Log the response data
    
        // For simplicity, let's just set isAuthenticated to false
        setIsAuthenticated(false);
      } catch (error) {
        console.error('Error during logout:', error.message);
        // Handle error appropriately (e.g., display an error message to the user)
      }
    };
    
    
  
    return (
      <div>
        <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
  
          <label>Username:</label>
          <input
            type="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
  
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
  
          <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Switch to Login' : 'Switch to Sign Up'}
          </button>
  
          <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
          
        </form>
  
        {isAuthenticated && (
          <div>
            <p>Welcome, {username}!</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
  
      </div>
    );
  };
  
  export default SignUp;
  