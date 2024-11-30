// // src/components/Auth/Signup.js
// import React, { useState, useContext } from 'react';
// // import { AuthContext } from '../../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';

// function Signup() {
// //   const { signup } = useContext(AuthContext);
//   const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
//   // const [firstName, setFirstName] = useState('');
//   // const [lastName, setLastName] = useState('');
//   // const [email, setEmail] = useState('');
//   // const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleChange = e => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       console.log(formData)
//       const res = await fetch('http://localhost:5000/api/auth/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       });
  
//       if (!res.ok) {
//         throw new Error((await res.json()).message);
//       }
  
//       const data = await res.json();
//       localStorage.setItem('token', data.token); // Store JWT
//       navigate('/trips');
//     } catch (error) {
//       console.error(error.message);
//     }
//   };

//   return (
//     <div>
//       <h1>Signup</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>First Name</label>
//           <input
//             type="text"
//             name="firstName"
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>Last Name</label>
//           <input
//             type="text"
//             name="lastName"
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>Email</label>
//           <input
//             type="email"
//             name="email"
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             onChange={handleChange}
//           />
//         </div>
//         <button type="submit">Signup</button>
//       </form>
//     </div>
//   );
// }

// export default Signup;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(''); // To show error messages
  const [loading, setLoading] = useState(false); // To manage loading state
  const navigate = useNavigate();

  // Handle form input changes dynamically
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error messages
    setLoading(true); // Set loading state

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token); // Store JWT token
      localStorage.setItem('userId', data.user.id);
      navigate('/trips'); // Redirect to trips page after successful signup
    } catch (error) {
      setError(error.message); // Display error message to user
      console.error('Signup failed:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="signup-container">
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="Enter your first name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Enter your last name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Signup'}
        </button>
      </form>
    </div>
  );
}

export default Signup;
