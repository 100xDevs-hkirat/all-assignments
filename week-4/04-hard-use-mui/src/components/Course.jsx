import { Button, Card, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import {  useParams } from "react-router-dom";
import {atom, useRecoilCallback, useRecoilState, useSetRecoilState} from "recoil";

function Course(){
    const{id} = useParams("courseId");

    return <div style={{
        display:"flex",
        justifyContent:"center"
    }}>
        <ShowCourse id={id}></ShowCourse>
        <UpdateCourse></UpdateCourse>
    </div>
}

function ShowCourse(props){
    const id=props.id;

    const [course, setCourse] = useRecoilState(courseState)

    useEffect(() => {
        fetch('http://localhost:3000/admin/courses/'+id,{
            headers:{
                'authorization':'Bearer '+localStorage.getItem('token')
            }
        }).then(response => {
            response.json().then(responseBody => {
                if(response.status === 200){
                    setCourse(responseBody);
                }else if(response.status === 404){
                    alert(responseBody.message);
                }else{
                    alert("Something went wrong")
                }
            });
        })
    }, []);

    return <Card variant="outlined" style={{display:"inline-block",margin:10,padding:10}}>
            <Typography style={{display:"block"}} variant="h6">{course.title}</Typography >
            <img style={{display:"block",width:300, height:300}} src={course.imageLink}/>
            <Typography style={{display:"block"}} variant="h7">{course.description}</Typography >
            <Typography style={{display:"block"}} variant="h7">{course.price}/-</Typography >
        </Card>
}

function UpdateCourse(){

    const setTitle = useSetRecoilState(editTitleState)
    const setDescription = useSetRecoilState(editDescriptionState)
    const setImageLink = useSetRecoilState(editImageLinkState)

    return <div style={{
        display:'inline-block'
    }}>
        <Card variant="outlined" style={{display:'inline-block',margin:10,padding:10}}>
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
                <ShowButton/>
            </div>
            
        </Card>
    </div>
}

function ShowButton(){
    const [origCourse,setCourse] = useRecoilState(courseState)

    const handleClick = useRecoilCallback( ({snapshot}) => async() => {
        
        const title = snapshot.getLoadable(editTitleState).contents;
        const description = snapshot.getLoadable(editDescriptionState).contents;
        const imageLink = snapshot.getLoadable(editImageLinkState).contents;

        updateCourse(title, description, imageLink, origCourse, setCourse);
    })

    return <Button variant="contained" onClick={handleClick}>Update</Button>
}

function updateCourse(newTitle, newDescription, newImageLink, origCourse, setCourse){
    if(newTitle === origCourse.title && newDescription === origCourse.description && newImageLink === origCourse.imageLink){
        return;
    }

    fetch('http://localhost:3000/admin/courses/'+origCourse.id,{
        method:'PUT',
        headers:{
            'authorization':"Bearer "+localStorage.getItem('token'),
            'content-type':'application/json'
        },
        body:JSON.stringify({
            id:origCourse.id,
            title:newTitle,
            description:newDescription,
            imageLink:newImageLink,
            price:origCourse.price,
            published:origCourse.published
        })
    }).then(response => {
            response.json().then(responseBody => {
                if(response.status === 200){
                    alert(responseBody.message);
                    setCourse({
                        id:origCourse.id,
                        title:newTitle,
                        description:newDescription,
                        imageLink:newImageLink,
                        price:origCourse.price,
                        published:origCourse.published
                    });
                }else if(responseBody === 404){
                    alert(responseBody.message);
                }else{
                    alert("Something went wrong")
                }
            })
        })
}

export default Course;

const editTitleState = atom({
    key:'editTitleState',
    default:''
})

const editDescriptionState = atom({
    key:'editDescriptionState',
    default:''
})

const editImageLinkState = atom({
    key:'editImageLinkState',
    default:''
})

const courseState = atom({
    key:'courseState',
    default:{}
})