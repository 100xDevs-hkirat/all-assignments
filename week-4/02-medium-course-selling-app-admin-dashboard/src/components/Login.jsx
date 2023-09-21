import React from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card"
import Button from "@mui/material/Button"
import { TextField, Typography } from "@mui/material";
import { userState } from "./stores/atoms/user";
import { useSetRecoilState } from 'recoil';

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const setUser = useSetRecoilState(userState);
    let navigate = useNavigate();

    const onPress = () => {
        if (email === "" || password === "") {
            return;
        }
        axios.post("http://localhost:3000/admin/login", {}, {
            headers: {
                username: email,
                password: password,
                "Content-Type": "application/json"
            }
        }).then((res) => {
            console.log(res.data.token);
            localStorage.setItem("token", "Bearer " + res.data.token);
            setUser({
                isLoading: false,
                userName: email
            })
            navigate('/', { replace: true });
        })
    }

    return <div>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 150 }}>
            <div>
                <Typography variant={"h4"}>
                    Login to admin dashboard
                </Typography>
                <br />
            </div>
        </div>
        <div
            style={{
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Card variant="outlined" style={{ width: 400, padding: 20 }}>
                <TextField
                    fullWidth={true}
                    label="Username"
                    variant="outlined"
                    onChange={e => setEmail(e.target.value)} />
                <br /><br />
                <TextField
                    fullWidth={true}
                    label="Password"
                    variant="outlined"
                    type="password"
                    onChange={e => setPassword(e.target.value)} />
                <br /><br />
                <Button
                    variant="contained"
                    onClick={onPress}
                >
                    SignIn
                </Button>
                <br /><br />
                <Typography>
                    New here? <a href="/register">Register</a>
                </Typography>

            </Card>
        </div>
    </div>
}

export default Login;