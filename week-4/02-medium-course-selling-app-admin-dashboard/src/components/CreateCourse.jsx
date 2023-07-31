import React from "react";
import { Link } from "react-router-dom";
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [image, setImage] = React.useState("");
    const [created, setCreadted] = React.useState("");
 const token=localStorage.getItem('token')
  let createCourse=()=>{
    fetch("http://localhost:3000/admin/courses",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`
        },
       body:JSON.stringify({
         title:title,
         description:description,
         price:price,
         image:image,

       })
        
    }).then((response)=>response.json()).then((data)=>{
        if(data=="Course created successfully"){
            setCreadted(true)
        }
        console.log(data)
    })
}
   
    return <div>
        <h1>Create Course Page</h1>
        <br/><br/>
        Title:<input type={"text"} placeholder="title" onChange={e => setTitle(e.target.value)} />
        <br/><br/>
        Description:<input type={"text"} placeholder="description" onChange={e => setDescription(e.target.value)} />
        <br/><br/>
        Price:<input type={"text"} placeholder="price" onChange={e => setPrice(e.target.value)} />
        <br/><br/>
        Image:<input type={"text"} placeholder="url" onChange={e => setImage(e.target.value)} />
        <br/><br/>
        <button onClick={createCourse}>Create Course</button>


        {created &&(
       <div> 
        <br></br>             
            <b>Course Created Successfully</b>
            <br/><br/>
                <button><Link to="/courses">Courses</Link></button>
         </div>
            )}
            {!created && (
               <div>
                Provide Required Details 
                </div>
              )}
    </div>
}
export default CreateCourse;