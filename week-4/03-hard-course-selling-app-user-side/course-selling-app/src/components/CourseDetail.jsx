import React from "react";
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button } from "@mui/material";

const Coursedetail = () => { 
    const courses = [
    { id: 1, title: 'Course 1', description: 'Description for Course 1' ,price :1000},
    { id: 2, title: 'Course 2', description: 'Description for Course 2' ,price :1000},
    { id: 3, title: 'Course 3', description: 'Description for Course 3' ,price :1000},
    // Add more course objects here as needed
    ];
    const { id } = useParams();
    let detail = courses.findIndex((item) => item.id == id);
    return (
        <>
            <div style={{
                justifyContent: "center",
                marginLeft: "10rem",
                marginTop:"5rem",
            }}>
                     <h3>Title - {courses[id].title}</h3>
                <br />              
                <span>
                    <h4>Description - </h4>
                <p>
                    { courses[id].description}
                </p>
                </span>                
                <br />                
                <h3>Price - {courses[id].price}</h3>
                <br />
                <Button>Purchase</Button>
           </div>
        </>
    )
}
export default Coursedetail;