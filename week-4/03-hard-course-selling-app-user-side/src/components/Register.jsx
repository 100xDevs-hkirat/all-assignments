import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../helpers/server.helper.js';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    register({ username, password })
      .then(() => navigate('/courses'))
      .catch((error) => console.log(error))
      .finally(() => {
        setUsername('');
        setPassword('');
      });
  }

  return (
    <>
      <h1>Register to user dashboard</h1>
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
        <button type="submit">Register</button>
        <br />
      </form>
      <span>Already a user? {` `}</span>
      <a href="/login">Login</a>
    </>
  );
}

export default Register;
