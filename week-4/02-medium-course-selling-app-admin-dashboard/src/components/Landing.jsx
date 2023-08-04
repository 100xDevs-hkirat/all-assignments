import React from "react";
import "./Landing.css";
import girl from "../assets/girl.png";

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
  return (
    <div className="landing-page">
      <img src={girl} alt="girl" width={500} />
      <div className="title">
        <h1>Welcome to course selling website!</h1>
      </div>

      <div className="btns">
        <a href="/register">Register</a>
        <br />
        <a href="/login">Login</a>
      </div>
    </div>
  );
}

export default Landing;
