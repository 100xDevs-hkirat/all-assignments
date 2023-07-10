import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';

function Register() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const navigate = useNavigate();

    function register(event) {
        event.preventDefault();
        axios.post('http://localhost:3000/users/signup', {
            headers: {
                'Content-Type': 'application/json',
            },
            username: email,
            password,
        }).then(res => {
            if(res.data.token) {
                localStorage.setItem('token', res.data.token);
                alert(res.data.message);
                navigate('/');
            }
        })
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
                <Button type="submit" variant="contained">Register</Button>
            </form>
        </div>
    );
}

export default Register;