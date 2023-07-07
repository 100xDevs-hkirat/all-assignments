import { useState } from "react";
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const handleOnClick = () => {
    const courseDetails = {
      title: title,
      description: description,
      price: price,
      image: image,
      published: isPublished,
    };
    const token = localStorage.getItem("token");
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);

    fetch("http://localhost:3000/admin/courses", {
      method: "POST",
      body: JSON.stringify(courseDetails),
      headers: headers,
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h1>Create Course Page</h1>
      <input type={"text"} onChange={(e) => setTitle(e.target.value)} />
      <input type={"text"} onChange={(e) => setDescription(e.target.value)} />
      <input type={"number"} onChange={(e) => setPrice(e.target.value)} />
      <input type={"file"} onChange={(e) => setImage(e.target.value)} />
      <input type="checkbox" onClick={() => setIsPublished(!isPublished)} />
      <button onClick={handleOnClick}>Create Course</button>
    </div>
  );
}
export default CreateCourse;
