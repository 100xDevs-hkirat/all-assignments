import React from "react";
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
    const [title, setTitle] = React.useState("");

    return <div>
        <h1>Create Course Page</h1>
        <input type={"text"} onChange={e => setTitle(e.target.value)} />
        <button onClick={() => console.log(title)}>Create Course</button>
    </div>
}
export default CreateCourse;