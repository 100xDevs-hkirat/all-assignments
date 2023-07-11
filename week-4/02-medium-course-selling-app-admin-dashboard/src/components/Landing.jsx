/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.

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
