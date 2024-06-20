// Layout.jsx
import React from 'react';
import { Button, Container } from "@mui/material";
import { useEffect } from 'react';
import Typography from '@mui/material/Typography';

const Layout = () => {
    const [Email, setEmail] = React.useState("");
    function signup() { 
            window.location = "/signup"
    }
    function login() { 
            window.location = "/login"
    }
    function logout() { 
        localStorage.setItem("token", null);
        window.location = "/";
    }
    useEffect(() => {
        const url= "http://localhost:3000/test";
        fetch(url, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            response.json().then((data) => {
                console.log(data.user.email);
                setEmail(data.user.email);
            })
        })
    }, []);
    if (Email) {
        return (      
    <>
<nav>
             <Container maxWidth="sm" style={{
                display:"flex",
                justifyContent: "space-between",
                marginBottom:"2rem",
                
                }}>
                    <h1>Grow Course</h1>
<Typography variant="h5" component="h2">
          {Email}
                        </Typography> 
                        <Button styl={{
            
                        }} variant="contained" color="primary" onClick={logout}>Logout</Button>
                
            </Container>
          </nav>
    </>
  );
     }
    return (      
    <>
<nav>
             <Container maxWidth="sm" style={{
                display:"flex",
                justifyContent: "space-between",
                marginBottom:"2rem",
                
                }}>
                    <h1>Grow Course</h1>
         <Button  variant="contained" color="primary" onClick={signup}>SignUp</Button>
                <Button  variant="contained" color="primary" onClick={login}>Login</Button>
                
            </Container>
          </nav>
    </>
  );
};

export default Layout;
