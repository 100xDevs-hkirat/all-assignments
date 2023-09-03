import React from "react";
import axios from "axios";

/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
    const [title, setTitle] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [published, setPublished] = React.useState(false);
    const [description, setDescription] = React.useState("");
    const [imageLink, setImageLink] = React.useState("");

    function createCourse() {
        axios.post("http://localhost:3000/admin/courses",{ 
            title, 
            price, 
            published,
            description, 
            imageLink 
        },
        {
            headers: {
                
                "Content-Type": "application/json",
                "authorization": `Bearer ${localStorage.getItem("token")}`
        }
        }).then(res => console.log(res.data))
        .catch(err => console.log(err));
    }

    return <div>
        <h1>Create Course Page</h1>
        Title - <input type={"text"} onChange={e => setTitle(e.target.value)} />
        <br />
        Price - <input type={"text"} onChange={e => setPrice(e.target.value)} />
        <br />
        Description - <input type={"text"} onChange={e => setDescription(e.target.value)} />
        <br />
        Image Link - <input type={"text"} onChange={e => setImageLink(e.target.value)} />
        <br />
        Publish - <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} />
        <br />
        <button onClick={createCourse}>Create course</button>

        {/* <button onClick={() => console.log(title)}>Create Course</button> */}
    </div>
}
export default CreateCourse;