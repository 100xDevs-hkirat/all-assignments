
import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userName } from "./stores/selector/user";
import { isLoading } from "./stores/selector/isLoaing";

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
    const navigate = useNavigate();
    const user = useRecoilValue(userName);
    const loading = useRecoilValue(isLoading);

    return <div>
        <Grid container style={{ padding: "5vw" }}>
            <Grid item lg={6} md={12} sm={12} >
                <div style={{ marginTop: 100 }}>
                    <div>
                        <Typography variant="h2">
                            Welcome to Coursera
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="h5">
                            Unlock Your Potential, Empower Yourself with us!
                        </Typography>
                    </div>
                    {!user && !loading && <div style={{ display: "flex", marginTop: 20 }}>
                        <div style={{ marginRight: 10 }} >
                            <Button
                                size={"large"}
                                variant="contained"
                                onClick={() => {
                                    navigate("/register")
                                }}>
                                SignUp
                            </Button>
                        </div>
                        <div>
                            <Button
                                variant="contained"
                                size={"large"}
                                onClick={(e) => {
                                    navigate("/login")
                                }}>
                                SignIn
                            </Button>
                        </div>
                    </div>}
                    <div>
                    </div>
                </div>
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
                <div style={{ paddingTop: 100, display: "flex", justifyContent: "center" }}>
                    <img src={"/mainLogo.jpeg"}></img>
                </div>
            </Grid>
        </Grid>
    </div >
}

export default Landing;