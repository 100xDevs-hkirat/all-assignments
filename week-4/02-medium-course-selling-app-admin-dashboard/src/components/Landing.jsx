import { Link } from "react-router-dom"; 'react-router-dom'

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
    return <div>
        <h1>Welcome to course selling website!</h1>
        <Link to="/register">Register</Link>
        <br />
        <Link to="/login">Login</Link>
    </div>
}

export default Landing;