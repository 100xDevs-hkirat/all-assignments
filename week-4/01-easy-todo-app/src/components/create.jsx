import React from "react";
import { useState } from "react";

function Create(){
    const[title ,setitle]=useState("");
    const[description,setdescription]=useState("");
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
            <input type="submit"></input>
        </form>
        </>
    )
}

export default Create;