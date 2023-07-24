import { useEffect } from "react";
import { useRecoilState } from "recoil";

import { coursesState } from "./states";
import { URL } from "./constants";
import { CourseCard } from "./Course";

function Courses() {
  const [courses, setCourses] = useRecoilState(coursesState);

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
        <CourseCard courseId={course._id} key={index} />
      ))}
    </div>
  );
}

export default Courses;
