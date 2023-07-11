// Add code to fetch courses from the server
// and set it in the courses state variable.

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses } from '../helpers/server.helper';

export default function ShowCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCourses()
      .then((res) => setCourses(res.data.courses))
      .catch((error) => {
        if (error.response.status === 401) navigate('/login');
      });
  }, [navigate]);

  return (
    <div>
      <h1>Show Course Page</h1>
      <ol>
        {courses.map(
          ({ courseId, title, description, price, imageLink, published }) => (
            <Course
              key={courseId}
              courseId={courseId}
              title={title}
              description={description}
              price={price}
              imageLink={imageLink}
              published={published}
            />
          )
        )}
      </ol>
    </div>
  );
}

function Course({ courseId, title, description, price, imageLink, published }) {
  const navigate = useNavigate();
  function handleClick() {
    navigate(`/courses/${courseId}`);
  }
  return (
    <li onClick={handleClick}>
      <p>{title}</p>
      <p>{description}</p>
      <p>{price}</p>
      <img src={imageLink} />
      <p>{published}</p>
    </li>
  );
}
