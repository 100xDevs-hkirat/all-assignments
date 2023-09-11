import { Button, Card, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {atom, useSetRecoilState, useRecoilCallback} from 'recoil'

function CreateCourse(){

    const setTitle = useSetRecoilState(titleState);
    const setDescription = useSetRecoilState(descriptionState);
    const setImageLink = useSetRecoilState(imageLinkState);

    return  <div style={{
                    display:'flex',
                    justifyContent:'center',
                    marginTop:100
                }}>
                    <Card variant="outlined">
                        <div style={{margin:50}}>
                            <TextField id="outlined-basic" label="Title" variant="outlined" 
                            onChange={e => setTitle(e.target.value)}/>
                            <br/><br/>
                            <TextField id="outlined-basic" label="description" variant="outlined" 
                            onChange={e => setDescription(e.target.value)}/>
                            <br/><br/>
                            <TextField id="outlined-basic" label="imageLink" variant="outlined" 
                            onChange={e => setImageLink(e.target.value)}/>
                            <br/><br/>
                            {/* <Button variant="contained" onClick={() => createCourse(title,description,imageLink,navigate)}>Create</Button> */}
                            <ShowButton/>
                        </div>
                        
                    </Card>
                </div>
}

function ShowButton(){
    const navigate = useNavigate();

    const handleClick = useRecoilCallback( ({snapshot}) => async() => {
        const title = snapshot.getLoadable(titleState).contents;
        const description = snapshot.getLoadable(descriptionState).contents;
        const imageLink = snapshot.getLoadable(imageLinkState).contents;

        createCourse(title, description, imageLink, navigate);
    })

    return <Button variant="contained" onClick={handleClick}>Create</Button>
}

function createCourse(title, description, imageLink, navigate){
    fetch('http://localhost:3000/admin/courses', {
        method:'POST',
        headers:{
            'content-type':'application/json',
            'authorization':'Bearer '+localStorage.getItem('token')
        },
        body:JSON.stringify({title,description,imageLink,price:100,published:true})
    }).then(response => {
        response.json().then(responseBody => {
            if(response.status === 200){
                alert("course created successfully");
                navigate('/courses')
            }else if(response.status === 404) {
                alert(responseBody.message);
            }    
            else{
                alert('Something went wrong');
            }
        })
    })
}

const titleState = atom({
    key:'titleState',
    default:''
});

const descriptionState = atom({
    key:'descriptionState',
    default:''
});

const imageLinkState = atom({
    key:'imageLinkState',
    default:''
});

export default CreateCourse;