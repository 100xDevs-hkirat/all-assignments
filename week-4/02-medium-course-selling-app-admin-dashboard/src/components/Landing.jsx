import { Link } from "react-router-dom";
import "./Landing.css";

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
  return (
    <div className="container">
      <h1>Welcome to course selling website!</h1>
      <Link to="/register" className="link">
        Register
      </Link>
      <br />
      <Link to="/login" className="link">
        Login
      </Link>
    </div>
  );
}

export default Landing;
