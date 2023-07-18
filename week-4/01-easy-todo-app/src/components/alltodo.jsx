import React, { useState } from "react";
import { useEffect } from "react";

function Todolist(){
    const[list,setlist]=useState([]);
    useEffect(()=>{
        const url="http://localhost:3000/alltodo";
        fetch(url,{
            method:"GET",

        }).then((response)=>{
            if(!response.ok){
                throw new Error("Some error from backend");
            }
            return response.json();
        }).then((data)=>{
            setlist(data);
        }).catch((err)=>{
            console.log("Error : "+err); 
        })
    },[]);
    function handleDelete(id){
        const url=`http://localhost:3000/delete/${id}`;
        fetch(url,{
            method:"DELETE"
        }).then((response)=>{
            if(!response.ok){
                throw new Error("Some proble from backend");
            }
            return response.text();
        }).then((data)=>{
            console.log(data);
        }).catch((err)=>{
            console.log("Error : "+err);
        })
    }
    return(
        <>
        <h1>To Do List</h1>
        <br/>
        <br/>
        {list !== null ? (
                      list.map(todo => (
                        <div key={todo.id}>
                          <b>{todo.title}</b>
                          <>{"  "+ todo.description}</>
                          <button
                            onClick = {() => {handleDelete(todo.id)}}
                          >Delete</button>
                        </div>
                      ))
                    ) : (
                      <p>Loading todos...</p>
                    )}
        </>
    )
}
export default Todolist;