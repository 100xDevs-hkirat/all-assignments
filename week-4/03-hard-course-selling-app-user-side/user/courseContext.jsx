import { createContext, useEffect, useState } from "react";

export const CourseDetails = createContext();

export const CourseData = (props) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);
      const response = await fetch("http://localhost:3000/users/courses", {
        method: "GET",
        headers: headers,
      });

      const data = await response.json();

      setCourses(data.courses);
    };
    fetchData();
  }, []);

  return (
    <CourseDetails.Provider value={[courses, setCourses]}>
      {props.children}
    </CourseDetails.Provider>
  );
};

CourseDetails.propTypes;
