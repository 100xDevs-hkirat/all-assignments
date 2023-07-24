import { useEffect, useState } from "react";
import { URL } from "./constants";
import { CourseCard } from "./Course";

function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    fetch(`${URL}/admin/courses`, options)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data?.courses);
      });
  }, []);

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {courses.map((course, index) => (
        <CourseCard course={course} key={index} />
      ))}
    </div>
  );
}

export default Courses;
