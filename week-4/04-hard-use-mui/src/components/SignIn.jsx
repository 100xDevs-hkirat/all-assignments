import {Card} from '@mui/material'
import {TextField} from '@mui/material'
import {Button} from '@mui/material'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecoilRoot,atom,useRecoilCallback,useSetRecoilState} from 'recoil';

function SignIn(){

    const setUsername = useSetRecoilState(usernameState);
    const setPassword = useSetRecoilState(passwordState)

    return <div style={{
            display:'flex',
            justifyContent:'center',
            marginTop:100
        }}>
            
            <Card variant="outlined">
                <div style={{margin:50}}>
                    <TextField id="outlined-basic" label="Username" variant="outlined" 
                    onChange={e => setUsername(e.target.value)}/>
                    <br/><br/>
                    <TextField id="outlined-basic" label="Password" variant="outlined" 
                    onChange={e => setPassword(e.target.value)}/>
                    <br/><br/>
                    <SubmitButton />
                </div>
            
            </Card>
        </div>
}

function signInUser(username, password, navigate,setIsSignedIn){

    fetch('http://localhost:3000/admin/login', {
        method:'POST',
        headers:{
            username,
            password
        }
    }).then((response) => {
        response.json().then((responseBody) => {
            if(response.status === 200){
                localStorage.setItem('token',responseBody.token);
                setIsSignedIn(true);
                navigate('/createCourse');
            }else if(response.status === 403){
                alert(responseBody.message);
            }else{
                alert("Something went wrong");
            }
        });
    });
}

function SubmitButton(){
    const setIsSignedIn = useSetRecoilState(isSignedInState);
    const navigate = useNavigate();

    //Check signup page for a better solution to this
    const handleSubmit = useRecoilCallback(({ snapshot }) => async () => {
        const username = await snapshot.getPromise(usernameState);
        const password = await snapshot.getPromise(passwordState);

        signInUser(username,password,navigate,setIsSignedIn);
    });
    return <Button variant="contained" onClick={handleSubmit}>SignIn</Button>
}

export default SignIn;

const usernameState = atom({
    key: 'usernameState_SignIn', // unique ID (with respect to other atoms/selectors)
    default: '', // default value (aka initial value)
});

const passwordState = atom({
    key: 'passwordState_SignIn', // unique ID (with respect to other atoms/selectors)
    default: '', // default value (aka initial value)
});

export const isSignedInState = atom({
    key:'isSignedInState',
    default:false
});