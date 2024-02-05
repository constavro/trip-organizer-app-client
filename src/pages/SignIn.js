import React, { useState } from 'react';
import { Link } from "react-router-dom"

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoint = 'http://localhost:5000/signin';
        const data = { email, password };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();
            if (!response.ok) {
                alert(responseData.message);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            if (responseData.success) {
                localStorage.setItem('token', responseData.token);
                window.location.href = '/';
            }

        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                <button type="submit">Log in</button>
                <ul>
                    <li><Link to='/signup'>Create an account</Link></li>
                    <li><Link to='/passwordreset'>Forgot my password</Link></li>
                </ul>
            </form>
        </React.Fragment>)
}

export default SignIn