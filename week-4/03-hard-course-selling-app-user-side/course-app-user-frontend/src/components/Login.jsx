import React from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import AppBar from "./AppBar";
import Card from "@mui/material/Card"
import Button from "@mui/material/Button"
import { Alert, Snackbar, TextField, Typography } from "@mui/material";
import { useSetRecoilState } from "recoil";
import { userState } from "./stores/atoms/user";

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const setUesr = useSetRecoilState(userState);

    const handleClose = () => {
        setOpen(false);
    };

    let navigate = useNavigate();

    const onPress = () => {
        if (email === "" || password === "") {
            return;
        }
        axios.post("http://localhost:3000/users/login", {}, {
            headers: {
                username: email,
                password: password,
                "Content-Type": "application/json"
            }
        }).then((res) => {
            console.log(res.status);
            if (res.status == 200) {
                localStorage.setItem("token", "Bearer " + res.data.token);
                setUesr({
                    isLoading: false,
                    user: email
                })
                navigate('/', { replace: true });
            }
        }).catch((err => {
            setOpen(true); // Show the Snackbar component on error
            console.error(err);
        }));
    }

    return <div>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 150 }}>
            <div>
                <Typography variant={"h4"}>
                    Login to user dashboard
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
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
                        Invalid username and password
                    </Alert>
                </Snackbar>
                <br /><br />
                <Typography>
                    New here? <a href="/register">Register</a>
                </Typography>

            </Card>
        </div>
    </div>
}

export default Login;