/// File is incomplete. You need to add input boxes to take input for users to login.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../helpers/server.helper.js';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    login({ username, password })
      .then(() => navigate('/courses'))
      .catch((error) => console.log(error))
      .finally(() => {
        setUsername('');
        setPassword('');
      });
  }

  return (
    <>
      <h1>Login to admin dashboard</h1>
      <form onSubmit={handleSubmit}>
        <br />
        <label htmlFor="username">Username - {` `}</label>
        <input
          id="username"
          name="username"
          type="email"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label htmlFor="password">Password - {` `}</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Login</button>
        <br />
      </form>
      <span>New here? {` `}</span>
      <a href="/register">Register</a>
    </>
  );
}

export default Login;
