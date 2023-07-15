import { useState } from "react";
import { Link } from "react-router-dom";

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("token" || "")
  );

  function logout() {
    setAuthToken("");
    localStorage.removeItem("token");
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ margin: "auto", textAlign: "center", marginBottom: "10px" }}>
        Welcome to course selling website!
      </h1>
      <br />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link to="/courses">Courses</Link>
        <br />
        <Link to="/create">Create a Course</Link>
        <br />
        <Link to="/edit">Edit Course</Link>
        <br />
        <LoginStatus token={authToken} logout={logout} />
      </div>
    </div>
  );
}

function LoginStatus(props) {
  // eslint-disable-next-line react/prop-types
  const { token, logout } = props;
  if (!token) {
    return (
      <>
        <Link to="/register">Register</Link>
        <br />
        <Link to="/login">Login</Link>
      </>
    );
  } else return <button onClick={logout}>Logout</button>;
}

export default Landing;
