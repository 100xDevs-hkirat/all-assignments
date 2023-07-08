
import React from "react";
import { Link } from "react-router-dom";
import propTypes from 'prop-types';

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
    const [authToken, setAuthToken] = React.useState(localStorage.getItem("token") || '');

    function logout() {
        setAuthToken('');
        localStorage.removeItem("token");
    }

    return <div>
        <h1>Welcome to course selling website!</h1>
        {/* <a href="/register">Register</a> */}
        <br/>
        <Link to="courses">Courses</Link>
        <br />
        <Link to="about">About</Link>
        <br />
        <Link to="editcourse">Edit Course</Link>
        <br />
        <Login_status token={authToken} logout={logout} />
        {/* {

            if(!authToken) <a href="/login">Login</a>
            else <button onClick={() => localStorage.removeItem("token")}>Logout</button>
        } */}

    </div>
}

function Login_status(props) {
    if(!props.token) {
        return <>
        <Link to="/register">Register</Link>
        <br />
        <Link to="/login">Login</Link>
        </>
    }
    else return <button onClick={props.logout}>Logout</button>
}

Login_status.propTypes = {
    token: propTypes.string,
    logout: propTypes.func
}
export default Landing;