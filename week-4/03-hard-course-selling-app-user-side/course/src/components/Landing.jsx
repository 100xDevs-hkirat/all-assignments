import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

const Landing = () => {
    const navigate = useNavigate();
    const [loggedin, setLoggedin] = useState(false)
    const token = localStorage.getItem('token')

    const loginFetch = async () => {
        try {

            const response = await axios({
                url: 'http://localhost:3000/admin/loggedin',
                method: 'post',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })

            const res = response.data;

            if (res.message === "Logged in") {
                setLoggedin(true)
            }

        } catch (err) {
            console.log(err)
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
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
                            onClick={() => navigate('/courses')}
                        >Get Courses</Button>
                        <Button size={'large'} style={{ width: '20%', margin: '5px' }} variant="outlined"
                            onClick={() => navigate('/purchasedCourses')}
                        >Purchased courses</Button>
                    </>
                }

            </div>
        </>
    )
}

export default Landing