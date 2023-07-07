import { useState } from "react";
import { useEffect } from "react";

const ShowCourse = () => {
  const [courses, setCourses] = useState();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    fetch("http://localhost:3000/users/courses", {
      method: "GET",
      headers: headers,
    })
      .then((res) => res.json())
      .then((data) => setCourses(data.courses));
  }, []);
  return (
    <div>
      <div>All Courses</div>
      <br />
      <br />
      <div>
        {courses &&
          courses.map((course) => {
            return (
              <div key={course.id}>
                <div>
                  <h1>{course.title}</h1>
                </div>
                <div>
                  <p>{course.description}</p>
                </div>
                <div>
                  <h3>₹{course.price}</h3>
                </div>
                <br />
                <br />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ShowCourse;
