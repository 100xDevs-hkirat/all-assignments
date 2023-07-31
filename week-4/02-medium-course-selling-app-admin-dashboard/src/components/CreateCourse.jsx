import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
  const navigate = useNavigate();
  const [title, setTitle] = React.useState("");
  const addCourse = () => {
    fetch("http://localhost:3000/admin/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title }),
    }).then(() => {
      navigate("/courses");
    });
  };

  return (
    <div>
      <h1>Create Course Page</h1>
      <div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <button
          onClick={() => {
            addCourse();
          }}
        >
          Add Course
        </button>
      </div>
    </div>
  );
}
export default CreateCourse;
