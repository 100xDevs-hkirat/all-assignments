import { useState } from "react";
import "./formComponents.css";

function FormComponent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageLink, setImageLink] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform any necessary form submission logic here
    // You can access the form data using the state values (title, description, price, imageLink)
    console.log("Form submitted!");
  };

  return (
    <div className="container">
      <h1>Product Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <label htmlFor="price">Price:</label>
        <input
          type="text"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <label htmlFor="imageLink">Image Link:</label>
        <input
          type="text"
          id="imageLink"
          value={imageLink}
          onChange={(e) => setImageLink(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default FormComponent;
