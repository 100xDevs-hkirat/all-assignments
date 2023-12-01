import { useEffect, useState } from "react";

function ShowCourses() {
  const [courses, setCourses] = useState([]);

  // Add code to fetch courses from the server
  // and set it in the courses state variable.

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    fetch("http://localhost:3000/admin/courses", {
      method: "GET",
      headers: headers,
    })
      .then((res) => res.json())
      .then((data) => setCourses(data.courses));
  }, []);

  return (
    <div>
      <h1>Available Courses</h1>
      {courses.map((c) => (
        <Course key={c.id} title={c.title} />
      ))}
    </div>
  );
}

function Course(props) {
  return (
    <div>
      <h1>{props.title}</h1>
    </div>
  );
}

Course.propTypes;

export default ShowCourses;
