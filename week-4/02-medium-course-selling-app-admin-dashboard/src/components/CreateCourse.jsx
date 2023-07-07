import React from "react";
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
    function handleClick() {
        fetch("http://localhost:3000/admin/courses", {
            method: "POST",
            body: JSON.stringify({
                title: document.getElementById("title").value,
                description: document.getElementById("description").value,
                price: document.getElementById("price").value,
                imageLink: document.getElementById("imageLink").value,
                published: document.getElementById("published").value
            }),
            headers: {
                "Content-Type": "application/json",
                "authorization": localStorage.getItem('token')
            },
        }).then(resp => {
            resp.json().then((parsedResp)=>{
                console.log(parsedResp);
            })
        })
    }

    return <div>
        <h1>Create Course Page</h1>
        <br />
        Title <input type="text" name="title" id="title"></input>
        <br /> <br />
        Description <input type="text" name="description" id="description"></input>
        <br /><br />
        Price <input type="text" name="price" id="price"></input>
        <br /> <br />
        ImageLink <input type="text" name="imageLink" id="imageLink"></input>
        <br /> <br />
        Published <input type="text" name="published" id="published"></input>
        <br /> <br />
        <button onClick={handleClick}>Create Course</button>
    </div>
}
export default CreateCourse;