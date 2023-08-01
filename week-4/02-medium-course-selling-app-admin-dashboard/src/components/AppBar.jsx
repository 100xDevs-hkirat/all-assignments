import { Avatar, Button, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { deepPurple } from '@mui/material/colors';
import Box from '@mui/material/Box';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userName } from "./stores/selector/userName";
import { isLoading } from "./stores/selector/isLoading";
import { userState } from "./stores/atoms/user";

function AppBar() {
    const user = useRecoilValue(userName);
    const loding = useRecoilValue(isLoading);
    const setUser = useSetRecoilState(userState);
    const navigate = useNavigate();


    if (loding) {
        <div>
            <Typography variant="h3">
                Loding...
            </Typography>
        </div>
    }

    if (user) {
        return <div>
            <Box
                sx={{
                    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)', // Add your desired shadow style here
                    borderRadius: '5px', // Optional: Add border-radius for rounded corners
                    p: 0.3, // Optional: Add padding to the box if needed
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 5,
                        paddingBottom: 6,
                    }}
                >
                    <div style={{ marginLeft: 10, display: "flex" }}>
                        <div style={{ marginLeft: 10, cursor: "pointer" }} onClick={() => {
                            navigate("/")
                        }}>
                            <Typography variant={"h5"}>Coursera</Typography>
                        </div>

                        <div style={{ display: "flex", marginLeft: 10 }}>
                            <div style={{ marginLeft: 10 }}>
                                <Button onClick={(e) => {
                                    navigate('/createCourse')
                                }}>
                                    Create Course
                                </Button>
                            </div>
                            <div style={{ marginLeft: 10 }}>
                                <Button onClick={(e) => {
                                    navigate('/courses')
                                }}>
                                    Courses
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginRight: 15, display: "flex" }}>
                        <div style={{ marginTop: 1, marginRight: 15, width: 100, height: 35 }}>
                            <Button variant="contained" onClick={(e) => {
                                localStorage.setItem("token", null);
                                setUser({
                                    isLoading: false,
                                    user: null
                                })
                            }}>
                                Logout
                            </Button>
                        </div>
                        <Avatar sx={{ bgcolor: deepPurple[500] }}></Avatar>
                    </div>
                </div>
            </Box>
        </div >
    } else {
        return <div>
            <Box
                sx={{
                    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)', // Add your desired shadow style here
                    borderRadius: '8px', // Optional: Add border-radius for rounded corners
                    p: 0.3, // Optional: Add padding to the box if needed
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 6,
                        paddingBottom: 6,
                    }}
                >
                    <div style={{ marginLeft: 5 }}>
                        <div style={{ marginLeft: 10, cursor: "pointer" }} onClick={() => {
                            navigate("/")
                        }}>
                            <Typography variant={"h6"}>Coursera</Typography>
                        </div>
                    </div>
                    <div>
                        <Button variant="contained" onClick={(e) => {
                            navigate("/register")
                        }}
                            style={{ marginRight: 5 }}>
                            SignUp
                        </Button>
                        <Button variant="contained" onClick={(e) => {
                            navigate("/login")
                        }}
                            style={{ marginRight: 5 }}>
                            SignIn
                        </Button>
                    </div>
                </div>
            </Box>
        </div>
    }

}

export default AppBar;