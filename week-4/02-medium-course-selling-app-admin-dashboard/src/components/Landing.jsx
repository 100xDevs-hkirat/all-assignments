import React from "react";
import '../CSS/landing.css'
/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
  return (
    <div className="landingContainer">
      <div className="landing">
        <h1>Welcome to course selling website!</h1>
       <div className="landingLinks">

       {(localStorage.getItem('Token'))?
        <>
       <div>You are logged In</div>
        </>
      :<>
      <a  className="landingRegister" href="/register">Register</a>
      <a  className="landingRegister" href="/login">Login</a>
      </>}
{/* 
        {(!localStorage.getItem('authtoken'))?

      :""} */}
  
       </div>
      </div>
    </div>
  );
}

export default Landing;
