import React from "react";
import Header from "../sub-components/Header";
import { Typography, TextField, Button, Card } from "@mui/material";

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
    const [email, setEmail] = React.useState("");

    return <div>
        <Header/>
        <center style={{marginTop: 150}}>
            <Typography variant="h5">Welcome to CourseWise, Signup Below</Typography>
            <br />
            <Card variant="outlined" style={{width: 400, padding: 20}}>
                <div>
                    <TextField fullWidth={true} variant="outlined" label="Email" type={"text"} onChange={e => setEmail(e.target.value)} />
                    <br />
                    <br />
                    <TextField fullWidth={true} variant="outlined" label="Password" type={"password"} />
                    <br /> <br />
                    <Button variant="contained">Sign In</Button>
                </div>
                <div>
                    <br />
                    <Typography> Already a user? <a href="/login">Login</a> </Typography>
                </div>
            </Card>
        </center>
    </div>
}

export default Register;