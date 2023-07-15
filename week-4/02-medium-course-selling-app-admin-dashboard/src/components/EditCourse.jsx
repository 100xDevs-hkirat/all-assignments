// import { useState, useEffect } from "react";
// import axios from "axios";
// import PropTypes from "prop-types";

// const EditCourse = () => {
//   const [courses, setCourses] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:3000/admin/courses", {
//         headers: {
//           authorization: "Bearer " + localStorage.getItem("token"),
//           "Content-Type": "application/json",
//         },
//       })
//       .then((res) => res.data)
//       .then((data) => {
//         setCourses(data.courses);
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   function handleEdit(id) {

//   }

//   function handleClick(id) {
//     axios;
//   }

//   return (
//     <div>
//       {courses.map((c) => (
//         <div key={c.id}>
//           <h2>{c.title}</h2>
//           <button onClick={() => handleEdit(c.id)}>Edit</button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default EditCourse;

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditCourse() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [published, setPublished] = useState(false);
  const [description, setDescription] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courseLoaded, setCourseLoaded] = useState(false);
  const navigate = useNavigate();

  function update(event) {
    event.preventDefault();
    axios
      .put(
        `http://localhost:3000/admin/courses/${courseId}`,
        {
          title,
          price,
          published,
          description,
          imageLink,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        navigate("/");
      })
      .catch((err) => console.error(err));
  }

  function getCourse(event) {
    event.preventDefault();
    if (!courseId) {
      return alert("Please enter a course id");
    }
    axios(`http://localhost:3000/admin/courses/${courseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.data)
      .then((data) => {
        console.log(data.courses);
        setTitle(data.courses.title);
        setPrice(data.courses.price);
        setPublished(data.courses.published);
        setDescription(data.courses.description);
        setImageLink(data.courses.imageLink);
        setCourseLoaded(true);
      })
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <div>
        <form onSubmit={getCourse}>
          Course Id-
          <input type="text" onChange={(e) => setCourseId(e.target.value)} />
          <button type="submit">Get course</button>
        </form>
      </div>
      <br />
      <form onSubmit={update}>
        Title -{" "}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required={true}
          disabled={!courseLoaded}
        />
        <br />
        Price -{" "}
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          disabled={!courseLoaded}
        />
        <br />
        Published -{" "}
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          disabled={!courseLoaded}
        />
        <br />
        Description -{" "}
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={!courseLoaded}
        />
        <br />
        ImageLink -{" "}
        <input
          type="text"
          value={imageLink}
          onChange={(e) => setImageLink(e.target.value)}
          disabled={!courseLoaded}
        />
        <br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default EditCourse;
