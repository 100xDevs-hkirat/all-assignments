import {Card} from '@mui/material'
import {TextField} from '@mui/material'
import {Button} from '@mui/material'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import { isSignedInState } from './SignIn'
import { useNavigate } from 'react-router-dom'

function SignUp(){

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
                <ShowButton/>
            </div>
            
        </Card>
    </div>
}

function ShowButton(){
    const username = useRecoilValue(usernameState);
    const password = useRecoilValue(passwordState);
    const navigate = useNavigate();
    const isSignedIn = useSetRecoilState(isSignedInState);

    return <Button variant="contained" onClick={() => {signUpUser(username, password,navigate,isSignedIn)}}>SignUp</Button>
}

function signUpUser(username, password, navigate, isSignedIn){

    fetch('http://localhost:3000/admin/signup', {
        method:'POST',
        headers:{'content-type': 'application/json'},
        body:JSON.stringify({username,password})
    }).then((response) => {
        response.json().then((responseBody) => {
            if(response.status === 200){
                localStorage.setItem('token',responseBody.token);
                isSignedIn(true);
                navigate('/createCourse');
            }else if(response.status === 403){
                alert(responseBody.message);
            }else{
                alert("Something went wrong");
            }
        });
    });
}

export default SignUp;

const usernameState = atom({
    key: 'usernameState', // unique ID (with respect to other atoms/selectors)
    default: '', // default value (aka initial value)
});

const passwordState = atom({
    key: 'passwordState', // unique ID (with respect to other atoms/selectors)
    default: '', // default value (aka initial value)
});