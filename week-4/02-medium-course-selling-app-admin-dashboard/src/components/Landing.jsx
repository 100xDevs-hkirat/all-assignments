import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
    const navigate = useNavigate();
    const [loggedin, setLoggedin] = useState(false)
    const token = localStorage.getItem('token')



    const loginFetch = async () => {
        await fetch('http://localhost:3000/admin/loggedin', {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then(res => res.json())
            .then(res => {
                if (res.message === "Logged in") {
                    setLoggedin(true)
                } else {
                    setLoggedin(false)
                }
            })
            .catch(err => console.log(err))

    }

    const logout = () => {
        localStorage.removeItem('token');
        setLoggedin(false)
    }

    useEffect(() => {
        loginFetch()
    }, [])



    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography mt={3} variant="h3" component="h3">
                    Welcome to course selling website!
                </Typography>

                {
                    !(loggedin) &&
                    <>

                        <Button size={'large'} style={{ width: '20%', marginBlock: '15% 5px' }} onClick={() => navigate('/Register')} variant="outlined">Register</Button>

                        <Button size={'large'} style={{ width: '20%', margin: '5px' }} onClick={() => navigate('/login')} variant="outlined">Login</Button>
                    </>
                }

                {
                    (loggedin) &&
                    <>
                        <Button size={'large'} style={{ width: '20%', marginBlock: '15% 5px' }} variant="outlined"
                            onClick={logout}
                        >Logout</Button>
                        <Button size={'large'} style={{ width: '20%', margin: '5px' }} variant="outlined"
                            onClick={()=>navigate('/courses')}
                        >Get Courses</Button>
                        <Button size={'large'} style={{ width: '20%', margin: '5px' }} variant="outlined"
                            onClick={()=>navigate('/about')}
                        >Add Courses</Button>
                    </>
                }

            </div>
        </>
    )
}

export default Landing;