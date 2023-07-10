import React from 'react';
import { Link } from 'react-router-dom';

// Custon auth hooh
function useAuthToken() {
    const [authToken, setAuthToken] = React.useState(localStorage.getItem("token") || '');

    function updateAuthToken(token) {
        setAuthToken(token);
        if(!token) {
            localStorage.removeItem("token");
        } else {
            localStorage.setItem("token", token);
        }
    }
    return [authToken, updateAuthToken];
}

// Landing page component
function Landing() {
    const [authToken, setAuthToken] = useAuthToken();

    function logout() {
        setAuthToken('');
    }

    return (
    <div>
        <h1>Landing Page</h1>
        { !authToken && (
            <>
            <Link to="/Login">Login</Link>
            <br />
            <Link to="/Register">Register</Link>
            <br />
            </>
        )}
        { authToken && <button onClick={logout}>Logout</button>}
        <br />
        <Link to="/courses">Courses</Link>
        <br />
        <Link to="/courses/purchased">Purchased Courses</Link>
    </div>
    );
}

export default Landing;