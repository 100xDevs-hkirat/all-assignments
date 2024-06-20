
import React from "react";
import {Link} from 'react-router-dom';

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
   const token=localStorage.getItem('token')
   console.log(localStorage.getItem('token'))
   if(token){
   localStorage.removeItem('token')
   
   }
    return <div>
        <h1>Welcome to course selling website!</h1>
        <nav>
            <ul>
                <li>
                <Link to="/login" >Login</Link>
                </li>
                <br/>
                <li>
                <Link to="/register" >Register</Link>   
               </li>
        
        </ul>
       </nav>
        
    </div>
}

export default Landing;