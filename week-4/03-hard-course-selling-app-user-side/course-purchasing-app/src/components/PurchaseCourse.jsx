import React, { useEffect } from "react";
import Card from '@mui/material/Card';

function purchaseCourse() {
    const [courses, setCourses] = React.useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000/users/purchasedCourses`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                "token": "Bearer " + localStorage.getItem("token")
            }
        }).then((res) => {
            return res.json();
        }).then((data) => {
            console.log(data);
            setCourses(data.coursesPurchased);
        })
    }, [])

    return <>
        <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"87vh"}}>
        <Card style={{ overflow:"scroll",  width:"300px", height:"400px", padding:"40px"}}>
            {courses.map(c => <ShowPurchasedCourses _id={c._id}/>)}
        </Card>
        </div>
    </>
}

function ShowPurchasedCourses(props) {
    return <>
        <div>
            <Card>
                <h3>{props._id}</h3>
            </Card>
        </div>
    </>
}

export default purchaseCourse;