
import React from "react";
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
    return <div>
        <CssBaseline/>
        <Container maxWidth="sm">
        <h1>Welcome to course selling website!</h1>
        <Link href="/register">Register</Link>
        <br/>
        <Link href="/login">Login</Link>
        </Container>
    </div>
}

export default Landing;