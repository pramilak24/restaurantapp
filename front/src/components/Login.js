import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('waiter');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password, role });

        if (response.data.success) {
          if (role === 'waiter') {
            navigate('/tables');
          } else if (role === 'chef') {
            navigate('/kitchen');
          } else if (role === 'customer') {
            navigate('/homepage');
          }
        } else {
          setErrorMessage(response.data.message || 'Login failed');
        }
      }
      catch(error) {
        console.error('Login error:', error);
        const message = error.response?.data?.message || 'An error occurred. Please try again.';
      setErrorMessage(message);
     }
  };
  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
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
        <button type="submit" className="login-button">Login</button>
        <button type="button" className="register-button" onClick={handleRegister}>
          Register
        </button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default Login;
