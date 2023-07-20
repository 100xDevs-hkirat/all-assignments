import React from "react";
import { useParams } from 'react-router';

function CourseDetails() {
  const [title, setTitle] = React.useState("");
  const [count, setCount] = React.useState(0);
  const [newTitle, setNewTitle] = React.useState("");
  const { id } = useParams();

  React.useEffect(() => {
    fetch(`http://localhost:3000/courses/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
      }
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(res);
    })
    .then((data) => {
      setTitle(data.title);
    });
  }, [count]);

  const updateCourseHandler = () => {
    fetch(`http://localhost:3000/admin/courses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        title: newTitle,
      })
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(res);
    })
    .then((data) => {
      alert(`${data.message}`);
    })
    .catch((err) => {
        console.log("Error: " + err);
    });
  }
  
  return (
    <div>
      <h1>Course Details Page</h1>
      <Course key={id} id={id} title={title}></Course>
      <br/>
      <input type={"text"} placeholder={"Enter Title to Update"} onChange={e => setNewTitle(e.target.value)} />
      <button onClick={updateCourseHandler}>Update Course</button>
    </div>
  );
}

function Course(props) {
  return (
    <div>
      <b>Id:</b> {props.id}
      <br/>
      <b>Title:</b> {props.title}
    </div>
  );
}

export default CourseDetails;