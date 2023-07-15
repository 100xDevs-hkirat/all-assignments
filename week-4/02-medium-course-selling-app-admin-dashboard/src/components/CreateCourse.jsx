import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [published, setPublished] = useState(false);
  const [description, setDescription] = useState("");
  const [imageLink, setImageLink] = useState("");
  const navigate = useNavigate();

  function handleClick() {
    axios
      .post(
        "http://localhost:3000/admin/courses",
        {
          title,
          description,
          price,
          published,
          imageLink,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        navigate("/");
      })
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <h1>Create Course Page</h1>
      <input
        type={"text"}
        placeholder={"Enter title"}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <input
        type={"text"}
        placeholder={"Enter description"}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <input
        type={"number"}
        placeholder={"Price"}
        onChange={(e) => setPrice(e.target.value)}
      />
      <br />
      <input
        type={"text"}
        placeholder={"Paste image link here"}
        onChange={(e) => setImageLink(e.target.value)}
      />
      <br />
      <label htmlFor="published">To be published?</label>
      <input
        type="checkbox"
        checked={published}
        onChange={(e) => setPublished(e.target.checked)}
      />
      <br />
      <button onClick={() => handleClick()}>Create Course</button>
    </div>
  );
}
export default CreateCourse;
