import React from "react";
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
    const [title, setTitle] = React.useState("");

    const createCourseHandler = () => {

        fetch('http://localhost:3000/admin/courses', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                title: title,
            })
        })
        .then((res) => {
            if(res.ok) {
                return res.json();
            }

            return Promise.reject(res);
        })
        .then((data) => {
            alert(`${data.message} Course Id: ${data.courseId}`);
        })
        .catch((err) => {
            console.log("Error: " + err);
        });
    }

    return <div>
        <h1>Create Course Page</h1>
        Title <input type={"text"} onChange={e => setTitle(e.target.value)} />
        <br/><br/>
        <button onClick={createCourseHandler}>Create Course</button>
        <br />
        <br />
        Show list of all courses <a href="/courses">click here</a>
    </div>
}
export default CreateCourse;