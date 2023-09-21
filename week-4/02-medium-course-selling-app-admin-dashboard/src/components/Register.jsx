import React from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import AppBar from "./AppBar";
import Card from "@mui/material/Card"
import Button from "@mui/material/Button"
import { TextField, Typography } from "@mui/material";
import { userState } from "./stores/atoms/user";
import { useSetRecoilState } from 'recoil';

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const setUser = useSetRecoilState(userState);
    let navigate = useNavigate();

    const onPress = () => {
        if (email === "" || password === "") {
            alert("required fields");
            return;
        }
        axios.post("http://localhost:3000/admin/signup", { username: email, password: password }).then((res) => {
            console.log(res.status);
            console.log(res.data.token);
            if (res.status == 200) {
                localStorage.setItem("token", "Bearer " + res.data.token);
                setUser({
                    isLoading: false,
                    userName: email
                })
                navigate('/courses', { replace: true });
            } else if (res.status == 404) {
                alert("Admin already exits");
            } else {
                alert("fill required fields");
            }
        });
    }

    return <div>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 150 }}>
            <div>
                <Typography variant={"h4"}>
                    Register to admin dashboard
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
                    SignUp
                </Button>
                <br /><br />
                <Typography>
                    Already a user? <a href="/login">Login</a>
                </Typography>

            </Card>
        </div>
    </div>
}

export default Register;