import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourses, putCourse } from '../helpers/server.helper';

export default function UpdateCourse() {
  const { courseId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [imageLink, setImageLink] = useState('');
  const [published, setPublished] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCourses()
      .then((res) => {
        const course = res.data.courses.find((c) => c.courseId == courseId);
        if (course) {
          setTitle(course.title);
          setDescription(course.description);
          setPrice(course.price);
          setImageLink(course.imageLink);
          setPublished(course.published);
        }
      })
      .catch((error) => {
        if (error.response.status === 401) navigate('/login');
      });
  }, [courseId, navigate]);

  function handleUpdate(e) {
    e.preventDefault();
    putCourse(courseId, {
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
      <h1>Update Course Page</h1>
      <form onSubmit={handleUpdate}>
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
        <button type="submit">Update Course</button>
      </form>
    </div>
  );
}
