import { Card, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

function Courses(){
    const setCourses = useSetRecoilState(coursesState);

    useEffect(() => {
        fetch('http://localhost:3000/admin/courses',{
            headers:{
                'authorization':'Bearer '+localStorage.getItem('token')
            }
        }).then(response => {
            if(response.status !== 200){
                alert("Something went wrong");
            }else{
                response.json().then(responseBody => {
                    console.log(`Returned courses ${JSON.stringify(responseBody)}`)
                    setCourses(responseBody.courses);
                });
            }
        })
    }, []);

    return (
        <ShowCourses/>
    )
}

function ShowCourses(){
    const courses = useRecoilValue(coursesState);

    return <div style={{display:"flex", flexWrap:"wrap", justifyContent:"center"}}>
        {courses.map(course => <Course  course={course}></Course>)}
    </div>
}

function Course(props){
    const navigate = useNavigate();
    const course = props.course;
    return <>
        <Card onClick={() => navigate("/course/"+course.id)} variant="outlined" style={{display:"inline-block",margin:10,padding:10}}>
            <Typography style={{display:"block"}} variant="h6">{course.title}</Typography >
            <img style={{display:"block",width:300, height:300}} src={course.imageLink}/>
            <Typography style={{display:"block"}} variant="h7">{course.description}</Typography >
            <Typography style={{display:"block"}} variant="h7">{course.price}/-</Typography >
        </Card>
    </>
    
}

export default Courses;

const coursesState = atom({
    key:'coursesState',
    default:[]
})