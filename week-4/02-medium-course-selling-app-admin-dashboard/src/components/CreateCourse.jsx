import React from "react";
import axios from 'axios';

/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [imageLink, setImageLink] = React.useState("");
    const [published, setPublished] = React.useState("");
    const createCourse = () => {
        console.log(localStorage.getItem('token'))
        axios.post('http://localhost:3000/admin/courses', {
            "title": title,
            "description": description,
            "price": price,
            "imageLink": imageLink,
            "published": published
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then(function (response) {
                console.log(response.data.message);
                alert(response.data.message);
            })
            .catch(function (error) {
                console.log(error.response.data);
                alert(error.response.data.message);
            });
    }
    return <div>
        <h1>Create Course Page</h1>
        Title: <input type={"text"} onChange={e => setTitle(e.target.value)} />
        <br />
        description: <input type={"text"} onChange={e => setDescription(e.target.value)} /><br />
        price: <input type={"text"} onChange={e => setPrice(e.target.value)} /><br />
        imageLink: <input type={"text"} onChange={e => setImageLink(e.target.value)} /><br />
        published: <input type={"text"} onChange={e => setPublished(e.target.value)} /><br /><br />
        <button onClick={createCourse}>Create Course</button>
    </div>
}
export default CreateCourse;