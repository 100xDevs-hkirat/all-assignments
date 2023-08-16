import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourses, buyCourse } from '../helpers/server.helper';

export default function BuyCourse() {
  const { courseId } = useParams();
  const [course, setCourse] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    getCourses()
      .then((res) => {
        const course = res.data.courses.find((c) => c.courseId == courseId);
        if (!course) navigate('/courses');
        setCourse(course);
      })
      .catch((error) => {
        if (error.response.status === 401) navigate('/login');
      });
  }, [courseId, navigate]);

  function handleBuy() {
    buyCourse(courseId)
      .then(() => navigate('/courses/purchased'))
      .catch((error) => {
        if (error.response.status === 401) navigate('/login');
      });
  }

  return (
    <div>
      <h1>Buy Course Page</h1>
      <Course
        courseId={course?.courseId}
        title={course?.title}
        description={course?.description}
        price={course?.price}
        imageLink={course?.imageLink}
        published={course?.published}
      />
      <button onClick={handleBuy}>Buy Course</button>
    </div>
  );
}

function Course({ title, description, price, imageLink, published }) {
  return (
    <div>
      <p>{title}</p>
      <p>{description}</p>
      <p>{price}</p>
      <img src={imageLink} />
      <p>{published}</p>
    </div>
  );
}
