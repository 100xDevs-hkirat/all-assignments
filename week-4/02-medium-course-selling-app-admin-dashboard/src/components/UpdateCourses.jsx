import React from "react";
import { useState } from "react";
import { Link, useParams } from 'react-router-dom';

function UpdateCourses(){
    const[title,setTitle]=useState("")
    const[description,setDescription]=useState("")
    const[price,setPrice]=useState("")
    const[updated,setUpdated]=useState("")
    const id=useParams().id;
    const token=localStorage.getItem('token')
    if (!token) {
        return <>
        <b>You are not logged in</b>
        <br/><br/>
        <li>
        <Link to="/login">Login</Link>
        </li>
        </>
      }
    function update(){
        fetch("http://localhost:3000/admin/courses/"+id,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
           body:JSON.stringify({
             title:title,
             description:description,
             price:price,
             
    
           })
            
        }).then((response)=>response.json()).then((data)=>{
            if(data="updated Successfully"){
                setUpdated(true)
            }
            console.log(data)
        })
    }
    return(
        <>
        <h3><b>Updating Course</b></h3>
        <br/><br/>
         <b>Title :</b><input type="text" placeholder="Edit title" onChange={(e)=>setTitle(e.target.value)}></input>
         <br/><br/>
         <b>Description :</b><input type="text" placeholder="Edit description" onChange={(e)=>setDescription(e.target.value)}></input>
         <br/><br/>
         <b>Price :</b><input type="text" placeholder="Edit price" onChange={(e)=>setPrice(e.target.value)}></input>
         <br/><br/>
         <button onClick={update}>Submit</button>
         

         
        {updated &&(
       <div> 
        <br></br>             
            <b>Updated Successfully</b>
            <br/><br/>
                <button><Link to="/courses">Courses</Link></button>
         </div>
            )}
            {!updated && (
               <div>
                Provide Required Details
                </div>
              )}
        </>
    )
}
export default UpdateCourses;