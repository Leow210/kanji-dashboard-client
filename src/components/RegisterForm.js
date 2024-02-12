import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Register.css';


const RegisterForm = () => {
  const navigate = useNavigate();


  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    //an example POST request is sent to the backend registration endpoint
    //the registration request
    const regResponse = await fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!regResponse.ok) {
      const data = await regResponse.json();
      setError(data.error || 'Failed to register.');
    } else {
      // Login request right after successful registration
      const loginResponse = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!loginResponse.ok) {
        const data = await loginResponse.json();
        setError(data.error || 'Failed to log in.');
      } else {
        const data = await loginResponse.json();
        //the token is stored in data.token
        localStorage.setItem('authToken', data.token); //save the token



        navigate('/'); //redirect user to the homepage
      }
    }
  };

  return (
    <div class="register-form">
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;