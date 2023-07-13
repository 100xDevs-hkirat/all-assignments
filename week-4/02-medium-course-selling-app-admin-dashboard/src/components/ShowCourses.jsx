import React from "react";

function ShowCourses() {
  const [courses, setCourses] = React.useState([]);
  const [count, setCount] = React.useState(0)

  // Add code to fetch courses from the server
  // and set it in the courses state variable.
  React.useEffect(() => {
    fetch("http://localhost:3000/admin/courses", {
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
      console.log(data.courses);
      setCourses(data.courses)
    });
  }, [count])
  
  return (
    <div>
      <h1>Create Course Page</h1>
      {courses.map((course) => <Course key={course.id} id={course.id} title={course.title} />)}
    </div>
  );
}

function Course(props) {
  return (
    <div>
      <span><h3>{props.id} {props.title}</h3></span>
    </div>
  );
}

export default ShowCourses;
