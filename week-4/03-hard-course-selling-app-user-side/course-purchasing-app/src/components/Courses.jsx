import React, { useEffect } from "react";
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

function Courses() {
    const [courses,setCourses] = React.useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/users/courses', {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                "token": "Bearer " + localStorage.getItem("token")
            }
        }).then((res)=>{
            return res.json();
        }).then((data) => {
            console.log(data.courses);
            setCourses(data.courses);
        })
    }, [])

    return <>
    <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"87vh"}}>
        <h2>Courses</h2>
        <Card style={{ overflow:"scroll",  width:"300px", height:"400px", padding:"40px"}}>
            {courses.map(c => <ShowCourses title={c.title} description={c.description} _id={c._id}/>)}
        </Card>
    </div>
    </>
}


function ShowCourses(props) {

    const purchaseCourse = async (_id) => {
        console.log(_id);
        try {
            const response = await fetch(`http://localhost:3000/users/courses/${_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": "Bearer " + localStorage.getItem("token")
                }
            });

            if (response.ok) {
                console.log("Course purchased successfully");
            } else {
                const data = await response.json();
                console.error("Error purchasing course:", data.message);
            }
        } catch (error) {
            console.error("Error purchasing course:", error.message);
        }

    }

    return <div>
        <Card>
            <h3>{props.title}</h3>
            <h2>{props.description}</h2>
            <Button style={{margin:"2px"}} variant="outlined" onClick={() => purchaseCourse(props._id)}>Purchase</Button>
        </Card>
    </div>
}

export default Courses;