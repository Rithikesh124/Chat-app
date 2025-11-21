import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin, apiUrl }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? '/register' : '/login';
    try {
      const response = await axios.post(`${apiUrl}${endpoint}`, { username, password });
      setMessage(response.data.message || 'Success!');
      if (!isRegister) {
        // On successful login, pass the username to the App component
        onLogin(response.data.username);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      <button onClick={() => setIsRegister(!isRegister)} className="toggle-button" style={{ marginTop: '10px', width: '100%' }}>
        {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
      </button>
      {message && <p className={message.includes('error') || message.includes('Invalid') ? 'error' : 'success'}>{message}</p>}
    </div>
  );
};

export default Login;
