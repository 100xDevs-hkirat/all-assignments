/* eslint-disable */
import axios from "axios";
import { useEffect, useState } from "react";
import propTypes from "prop-types";

function ShowCourses() {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    axios("http://localhost:3000/admin/courses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.data)
      .then((data) => setCourses(data.courses))
      .catch((err) => console.error(err));
  }, [courses]);

  return (
    <div>
      <h1>All Courses</h1>
      {courses.map((c) => (
        <Course key={c.id} {...c} />
      ))}
    </div>
  );
}

function Course(props) {
  let { id, title, description, price, published, imageLink } = props;
  return (
    <div key={id}>
      <h3>Title: {title}</h3>
      <h4>Price: {price}</h4>
      <h4>published: {published ? "yes" : "no"}</h4>
      <p>{description}</p>
      <img src={imageLink} alt={title} />
    </div>
  );
}

Course.propTypes = {
  id: propTypes.number,
  title: propTypes.string,
  price: propTypes.string,
  published: propTypes.bool,
  description: propTypes.string,
  imageLink: propTypes.string,
};

export default ShowCourses;
