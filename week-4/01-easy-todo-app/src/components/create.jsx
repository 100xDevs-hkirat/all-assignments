import React from "react";
import { useState } from "react";

function Create(){
    const[title ,setitle]=useState("");
    const[description,setdescription]=useState("");
    function addtodo(){
        const url="http://localhost:3000/addtodo";
        const data={
            id:100,title:title,description:description
        }
        console.log(JSON.stringify(data));
           fetch(url,{
            method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data,
        }).then((response)=>{
            if(!response.ok){
                throw new Error("Some problem from backend");
            }
            return response.text();            
        }).then((data)=>{
            console.log(data);
        }).catch((err)=>{
            console.log(err);
        })}
    return (
        <>
        <form id ="add to do">
            <h4>Add To Do</h4>
            <br/>
            <br/>
            <label htmlFor="title">Title</label>
            <input id="title" name="title" value={title} type="text" placeholder="play" onChange={(e)=>setitle(e.target.value)}/>
            <br/>
            <br/>
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={description} onChange={(e)=>setdescription(e.target.value)}></textarea>
            <br/>
            <br/>
            <input type="submit" onClick={addtodo}></input>
        </form>
        </>
    )
}

export default Create;