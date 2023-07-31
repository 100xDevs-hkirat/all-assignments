import React from "react";

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const loginAdmin = async () => {
        const Admin = {

            password: password,
            username: username
        }
        try {
            const response = await fetch("http://localhost:3000/admin/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Admin)
            })
        } catch (error) {

        }
    }

    return <div>
        <h1>Login to admin dashboard</h1>
        <br />
        Email - <input type={"text"} onChange={e => setUsername(e.target.value)} />
        password - <input type={"text"} onChange={e => setPassword(e.target.value)} />
        <button onClick={loginAdmin}></button>
        <br />
        <button>Login</button>
        <br />
        New here? <a href="/register">Register</a>
    </div>
}

export default Login;