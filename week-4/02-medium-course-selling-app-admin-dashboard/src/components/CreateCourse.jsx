import React from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [price, setPrice] = React.useState(0);
    const [published, setPublished] = React.useState(false);


    const createCourse = () =>{
        fetch('http://localhost:3000/admin/courses', {
            method: "POST",
            body: JSON.stringify({
                title,
                description,
                price: price,
                imageLink: "",
                published: published
            }),
            headers: {
                "Content-Type": "application/json",
                "token": "Bearer " + localStorage.getItem("token")
            }
        });
    }

    return <div>
        <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"87vh"}}>
        <h1>Create Course Page</h1>
        <TextField style={{margin:"7px"}} id="standard-basic" label="Title" variant="standard" onChange={(e) => { setTitle(e.target.value)}}/>
        <TextField style={{margin:"7px"}} id="standard-basic" label="Description" variant="standard" onChange={(e) => { setDescription(e.target.value)}}/>
        <TextField style={{margin:"7px"}} type="number" id="standard-basic" label="Price" variant="standard" onChange={(e) => { setPrice(parseInt(e.target.value))}}/>
        <TextField style={{margin:"7px"}} id="standard-basic" label="Published" variant="standard" onChange={(e) => { setPublished(e.target.value)}}/>
        {/* <button onClick={() => console.log(title)}>Create Course</button> */}
        <Button style={{marginTop:"20px"}} variant="outlined" onClick={createCourse}>Create Course</Button>
        </div>
    </div>
}
export default CreateCourse;