import axios from "axios";
import React from "react";

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    const useLocalStorage = (storageKey, fallbackState) => {
        const [value, setValue] = React.useState(
            (localStorage.getItem(storageKey) && JSON.parse(localStorage.getItem(storageKey)))  ?? fallbackState
        );
        React.useEffect(() => {
            localStorage.setItem(storageKey, JSON.stringify(value));
        }, [value, setValue]);
        return [value, setValue];
    };

    const [auth, setAuth] = useLocalStorage("auth", "");
    const [userInput, setUserInput] = React.useState({
        email: "",
        password: ""
    });

    function handleChange(e) {
        const { type, checked, name, value } = e.target
        setUserInput((prev) => {
            return {
                ...prev,
                [name]: type === checked ? checked : value
            }
        })
    }

    function handleSubmit(event) {
        event.preventDefault()
        if (userInput.email.length === 0 || userInput.password.length === 0) {
            alert("email or password is empty")
            return;
        }
        const user = {
            "username": userInput.email,
            "password": userInput.password
        }
        axios.post("http://localhost:3000/admin/login", {}, {
            headers: user
        }).then((res) => {
            setAuth(res.data.token)
        })
    }

    return (
        <div className="container">
            <h1>Login to the website</h1>
            <h3>Email</h3>
            <input
                type="text"
                name="email"
                onChange={handleChange}
                value={userInput.email}
            />
            <h3>Password</h3>
            <input
                type="text"
                name="password"
                onChange={handleChange}
                value={userInput.password}
            />
            <br />
            <button onClick={handleSubmit} className="input">submit</button>
            <br />
            Not a user? <a href="/register">register</a>
        </div>
    )
}

export default Login;