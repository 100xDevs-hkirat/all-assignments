import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios("http://localhost:3000/users/courses", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.data)
      .then((data) => {
        setCourses(data.courses);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h1>All Courses</h1>
      {courses.map((c) => (
        <Course key={c.id} {...c} />
      ))}
    </div>
  );
};

function Course(props) {
  // eslint-disable-next-line react/prop-types
  let { id, title, description, price, published } = props;
  return (
    <div key={id}>
      <h3>Title: {title}</h3>
      <p>{description}</p>
      <h4>published: {published ? "yes" : "no"}</h4>
      <h4>Price: {price}</h4>
      {/* <img src={imageLink} alt={title} /> */}
      <button>
        <Link to={`/courses/${id}`}>BuyCourse</Link>
      </button>
    </div>
  );
}

export default Courses;
