/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse } from '../helpers/server.helper.js';

function CreateCourse() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [imageLink, setImageLink] = useState('');
  const [published, setPublished] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    createCourse({
      title,
      description,
      price,
      imageLink,
      published,
    })
      .then(() => navigate('/courses'))
      .catch((error) => {
        if (error.response.status === 401) navigate('/login');
      });
  }

  return (
    <div>
      <h1>Create Course Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="price">Price</label>
          <input
            type="number"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="title">Image Link</label>
          <input
            type="text"
            name="imageLink"
            value={imageLink}
            onChange={(e) => setImageLink(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="published">Published</label>
          <input
            type="checkbox"
            name="published"
            checked={published}
            onChange={() => setPublished((prev) => !prev)}
          />
        </div>
        <button type="submit">Create Course</button>
      </form>
    </div>
  );
}
export default CreateCourse;
