import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('waiter');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    axios.post('http://localhost:5000/register', { username, password, role })
      .then(response => {
        if (response.data.success) {
          setSuccess('Registration successful! You can now log in.');
          navigate('/login'); // Redirect to login page after successful registration
        } else {
          setError('Registration failed. Please try again.');
        }
      })
      .catch(error => {
        console.error('Registration error:', error);
        setError('An error occurred. Please try again.');
      });
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="waiter">Waiter</option>
            <option value="chef">Chef</option>
            <option value="customer">Customer</option>
          </select>
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
}

export default Register;
