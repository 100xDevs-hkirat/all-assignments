import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const getCourses = (setCourses) => {
  fetch("http://localhost:3000/admin/courses", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("token"),
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      setCourses(data.courses);
    });
};

function ShowCourses() {
  const [courses, setCourses] = React.useState([]);

  useEffect(() => {
    getCourses(setCourses);
  }, []);
  // Add code to fetch courses from the server
  // and set it in the courses state variable.
  //   console.log(courses);
  return (
    <div>
      <h1>Create Course Page</h1>
      <CreateCourse setCourses={setCourses} />
      {courses.map((c, index) => (
        <Course courses = {c} key={index} setCourses={setCourses}/> // Provide a unique key prop for each rendered item
      ))}
    </div>
  );
}

function CreateCourse(props) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [image, setImage] = React.useState("");
  let published = "";

  const addCourse = () => {
    const newCourse = {
      title,
      description,
      price,
      image,
      published,
    };
    fetch("http://localhost:3000/admin/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'authorization': localStorage.getItem("token"),
      },
      body: JSON.stringify(newCourse),
    }).then((res) => {
      res.json;
      getCourses(props.setCourses);
    });
  };

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="title"
      />
      <br />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="description"
      />
      <br />
      <input
        type="text"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="price"
      />
      <br />
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="image"
      />
      <br />
      Published
      <form>
        <input type="radio" id="option1" name="options" value="true" onClick={()=>published="true"}/>
        <label htmlFor="option1">true</label>
        <br />

        <input type="radio" id="option2" name="options" value="false" onClick={()=>published="false"}/>
        <label htmlFor="option2">false</label>
        <br />
      </form>
      <button style={{ marginTop: "20px" }} onClick={addCourse}>
        ADD COURSE
      </button>
    </div>
  );
}

function Course(props) {
  const navigate = useNavigate();
  const update = ()=>{
    const data = {
      course : props.courses
    }
    navigate("/about",{state : data});
    getCourses(props.setCourses);
  }
  return (
    <div>
      <h1>{props.courses.title}</h1>
      <h2>{props.courses.description}</h2>
      <h2>{props.courses.price}</h2>
      <h2>{props.courses.image}</h2>
      <h2>{props.courses.published}</h2>
      <button onClick={update}>UPDATE</button>
    </div>
  );
}

export default ShowCourses;
