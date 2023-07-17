import React from "react";

function create(){
    return (
        <>
        <form id ="add to do">
            <h4>Add To Do</h4>
            <br></br>
            <label for="title">Title</label>
            <input id="title" name="title" type="text" placeholder="play"/>
            <br></br>
            <label for="descriptiotn">Description</label>
            <textarea id="descriptiotn" name="descriptiotn"></textarea>
            <input type="submit"></input>
        </form>
        </>
    )
}

export default create;