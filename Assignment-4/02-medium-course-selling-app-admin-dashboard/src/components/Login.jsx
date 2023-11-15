import React from "react";

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    const [email, setEmail] = React.useState("");

    return <div>
        <h1>Login to admin dashboard</h1>
        <br/>
        Email - <input type={"text"} onChange={e => setEmail(e.target.value)} />
        <br/>
        <button>Login</button>
        <br/>
        New here? <a href="/register">Register</a>
    </div>
}

export default Login;