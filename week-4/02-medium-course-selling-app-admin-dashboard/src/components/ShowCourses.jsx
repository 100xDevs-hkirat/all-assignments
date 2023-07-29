import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ShowCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = React.useState([
    { id: -1, title: "JS basics" },
    { id: -1, title: "REACT basics" },
    { id: -1, title: "mongoDB" },
  ]);

  const [title, setTitle] = React.useState("");

  // Add code to fetch courses from the server

  const fetchCourses = () => {
    fetch("http://localhost:3000/admin/courses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCourses([...courses, ...data.courses]);
      });
  };
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div>
      <h1>Show Course Page</h1>
      <button
        onClick={() => {
          navigate("/create");
        }}
      >
        Add Course
      </button>
      <div
        style={{
          border: "1px solid pink",
          display: "flex",
          textAlign: "center",
          flexDirection: "column",
        }}
      >
        Our Courses
        {courses.map((c) => (
          <Course title={c.title} id={c.id} />
        ))}
      </div>
    </div>
  );
}

function Course(props) {
  const navigate = useNavigate();
  return (
    <div>
      <h1>
        {props.id}. {props.title}
        {JSON.stringify(props)}
      </h1>{" "}
      <button
        onClick={() => {
          navigate(`/editCourse/${props.id}`);
        }}
      >
        edit
      </button>
      <hr></hr>
    </div>
  );
}

export default ShowCourses;
