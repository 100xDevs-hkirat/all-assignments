import React from "react";
import axios from "axios";
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
    const [data, setData] = React.useState({
        "title": "",
        "description": "",
        "price": 5999,
        "imageLink": "",
        "published": false
    });

    function handleSubmit(event) {
        event.preventDefault()
        if (data.title.length ===0 || data.description.length ===0 || data.imageLink.length ===0) {
            alert("email or password is empty")
            return;
        }
        const body = {
            "title": data.title,
            "description": data.description,
            "price": data.price,
            "imageLink": data.imageLink,
            "published": data.published
        }
        const token = {
            Authorization: "Bearer "+JSON.parse(localStorage.getItem("auth"))
        }
        console.log(token);
        axios.post("http://localhost:3000/admin/courses", body, {
            headers: token
        }).then((res) => {
            console.log(res.data);
        })
    }

    function handleChange(e) {
        const { type, checked, name, value } = e.target
        console.log(value);
        setData((prev) => {
            return {
                ...prev,
                [name]: type === checked ? checked : value
            }
        })
    }

    return <div>
        <h1>Create Course Page</h1>
        <h3>title</h3>
        <input
            type="text"
            onChange={handleChange}
            name="title"
            value={data.title}
        />
        <h3>description</h3>
        <input
            type="text"
            onChange={handleChange}
            name="description"
            value={data.description}
        />
        <h3>price</h3>
        <input
            type="number"
            onChange={handleChange}
            name="price"
            value={data.price}
        />
        <h3>imageLink</h3>
        <input
            type="text"
            onChange={handleChange}
            name="imageLink"
            value={data.imageLink}
        />
        <h3>published</h3>
        <input
            type="checkbox"
            checked={data.published}
            onChange={handleChange}
            name="published"
        />
        <br />
        <button onClick={handleSubmit}>Create Course</button>
    </div>
}
export default CreateCourse;