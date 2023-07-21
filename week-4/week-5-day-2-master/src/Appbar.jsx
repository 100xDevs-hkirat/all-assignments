import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

async function fetchData(token) {
    try {
        const response = await fetch("http://localhost:3000/admin/me", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}
function Appbar() {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const fetchDataAsync = async () => {
                try {
                    const data = await fetchData(token);
                    console.log(data);
                    if (data.username) {
                        setUserEmail(data.username);
                    }
                } catch (error) {
                    // Handle error as per your requirements
                }
            }
            fetchDataAsync();
        }
    }, []);

    if (userEmail) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: 4,
                }}
            >
                <div>
                    <Typography variant={"h6"}>Coursera</Typography>
                </div>

                <div style={{ display: "flex",justifyContent:'space-between',alignItems:'center',width:500 }}>
                    <Button
                        variant={"outlined"}
                        onClick={() => {
                            navigate('/addcourse')
                        }}
                    >
                        Add Course
                    </Button>
                    <Button
                        variant={"outlined"}
                        onClick={() => {
                            navigate('/courses')
                        }}
                    >
                        Courses
                    </Button>
                    <div>{userEmail}</div>
                    <div style={{ marginRight: 10 }}>
                        <Button
                            variant={"contained"}
                            onClick={() => {
                                localStorage.setItem("token", null);
                                window.location = "/";
                            }}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: 4,
                }}
            >
                <div>
                    <Typography variant={"h6"}>Coursera</Typography>
                </div>

                <div style={{ display: "flex" }}>
                    <div style={{ marginRight: 10 }}>
                        <Button
                            variant={"contained"}
                            onClick={() => {
                                navigate("/signup");
                            }}
                        >
                            Signup
                        </Button>
                    </div>
                    <div>
                        <Button
                            variant={"contained"}
                            onClick={() => {
                                navigate("/signin");
                            }}
                        >
                            Signin
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Appbar;
