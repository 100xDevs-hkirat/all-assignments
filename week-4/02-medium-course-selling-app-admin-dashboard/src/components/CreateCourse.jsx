import React, { useEffect, useState } from "react";
import CourseForm from "./CourseForm";
import { useNavigate } from "react-router-dom";

/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse(props) {
  const navigate = useNavigate();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (props.isUpdate) {
      setTitle(props.course.title);
      setDescription(props.course.description);
      setPrice(props.course.price);
      setImageLink(props.course.imageLink);
      setPublished(props.course.published);
    }
  }, [props.course]);

  function createCourse() {
    fetch("http://localhost:3000/admin/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        title,
        description,
        price,
        imageLink,
        published,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        setDescription("");
        setImageLink("");
        setTitle("");
        setPrice("");
        setPublished("");
        navigate("/courses");
      })
      .catch((err) => console.log(err));
  }
  function updateCourse() {
    fetch(`http://localhost:3000/admin/courses/${props.course._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        title,
        description,
        price,
        imageLink,
        published,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        navigate("/courses");
      })
      .catch((err) => console.log(err));
  }

  return (
    <CourseForm
      isUpdate={props.isUpdate}
      createCourse={createCourse}
      updateCourse={updateCourse}
      title={title}
      setTitle={setTitle}
      description={description}
      setDescription={setDescription}
      price={price}
      setPrice={setPrice}
      imageLink={imageLink}
      setImageLink={setImageLink}
      published={published}
      setPublished={setPublished}
    ></CourseForm>
  );
}
export default CreateCourse;
