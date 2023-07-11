import { useState } from 'react';

export default function Landing() {
  const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwt_token'));

  function handleLogout() {
    localStorage.removeItem('jwt_token');
    setJwtToken(null);
  }

  return (
    <div>
      <h1>Welcome to course selling website!</h1>
      <a href="/register">Register</a>
      <br />
      <a href="/login">Login</a>
      <br />
      {jwtToken && <button onClick={handleLogout}>Logout</button>}
    </div>
  );
}
