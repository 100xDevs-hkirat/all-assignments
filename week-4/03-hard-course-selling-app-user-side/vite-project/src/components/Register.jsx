import React from 'react';
import axios from 'axios';

function Register() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    function register(event) {
        event.preventDefault();
        axios.post('http://localhost:3000/users/signup', {
            headers: {
                'Content-Type': 'application/json',
            },
            username: email,
            password,
        }).then(res => console.log(res.data))
        .catch(err => console.error(err));
    }

    return (
        <div>
            <h1>Register Page</h1>
            <br />
            <form onSubmit={register}>
                Email - <input type="email" onChange={e => setEmail(e.target.value)} />
                <br />
                Password - <input type="password" onChange={e => setPassword(e.target.value)} />
                <br />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;