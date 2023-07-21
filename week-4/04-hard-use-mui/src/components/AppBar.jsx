import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isSignedInState } from "./SignIn";
import { atom, useRecoilState, useRecoilValue } from "recoil";

function AppBar(){
    const [username, setUsername] = useRecoilState(usernameState);
    const isSignedIn = useRecoilValue(isSignedInState);

    useEffect(() => {
        fetch("http://localhost:3000/admin/me", {
            headers:{
                authorization:"Bearer "+localStorage.getItem('token')
            }
        }).then((response) => {
            if(response.status === 200){
                response.json().then((responseBody) => {
                    setUsername(responseBody.username);
                })
            }
        })
    }, [isSignedIn]);

    if(username){
        return <UsernameLogout/>
    }

    return <SignUpSignIn/>
}

function UsernameLogout(){
    const [username,setUsername] = useRecoilState(usernameState);
    return <>
        <div style = {{
            display:'flex',
            justifyContent:'space-between'
        }}>
            <div>
                <Typography>Coursera</Typography>
            </div>
            <div>
                {username}
                <Button onClick={() => {logout(setUsername)}} variant={"contained"}>Logout</Button>
            </div>
        </div>
    </>
}

function logout(navigate, setUsername){
    localStorage.setItem('token', null);
    setUsername(null);
    navigate("/signin")
}

function SignUpSignIn(){
    const navigate = useNavigate(usernameState);
    return <>
        <div style = {{
            display:'flex',
            justifyContent:'space-between'
        }}>
            <div>
                <Typography>Coursera</Typography>
            </div>
            <div>
                <Button onClick={() => {navigate("/signup")}} style={{marginRight:10}} variant={"contained"}>SignUp</Button>
                <Button onClick={() => {navigate("/signin")}} variant={"contained"}>SignIn</Button>
            </div>
        </div>
    </>
}

export default AppBar;

const usernameState = atom({
    key:'usernameState_AppBar',
    default:null
})

