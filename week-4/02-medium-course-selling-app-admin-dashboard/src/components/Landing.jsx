
import React from "react";

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {

    
    const [login, setLogin] = React.useState(
        localStorage.getItem("auth") ? true:false
    )
    console.log(login);
    function logout(){
        localStorage.removeItem("auth")
        setLogin(!login)
    }

    const reg = <div>
        <a href="/register">Register</a>
        <br />
        <a href="/login">Login</a>
    </div>

    const out = <div><button onClick={logout}>Logout</button></div>

    return <div>
        <h1>Welcome to course selling website!</h1>
        {login ? out:reg}
        
    </div>
}

export default Landing;