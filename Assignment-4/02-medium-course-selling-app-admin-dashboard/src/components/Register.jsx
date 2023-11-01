import React from "react";

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
    const [email, setEmail] = React.useState("");

    return <div>
        <h1>Register to the website</h1>
        <br/>
        <input type={"text"} onChange={e => setEmail(e.target.value)} />
        <br/>
        Already a user? <a href="/login">Login</a>
    </div>
}

export default Register;