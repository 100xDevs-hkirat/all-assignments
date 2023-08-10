import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BuyCourses = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({});

  useEffect(() => {
    axios(`http://localhost:3000/users/courses/${courseId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.data)
      .then((data) => setCourse(data.course))
      .catch((err) => console.log(err));
  }, [courseId]);

  function handleClick(id) {
    axios(`http://localhost:3000/users/courses/${id}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-type": "application/json",
      },
    })
      .then((res) => res.data)
      .then((data) => {
        console.log(data.course);
        navigate("/courses/purchased");
      })
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <h1>Enroll for the course:</h1>
      <br />
      <h3>{course.title}</h3>
      <br />
      <h4>{course.description}</h4>
      <br />
      <h4>{course.price}</h4>
      <button onClick={() => handleClick(course.id)}>Enroll Now</button>
    </div>
  );
};

export default BuyCourses;
