import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPurchasedCourses } from '../helpers/server.helper';

export default function PurchasedCourses() {
  const [purchaseCourses, setPurchaseCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPurchasedCourses()
      .then((res) => setPurchaseCourses(res.data.purchaseCourses))
      .catch((error) => {
        if (error.response.status === 401) navigate('/login');
      });
  }, [navigate]);

  return (
    <div>
      <h1>Show Purchsed Course Page</h1>
      <ol>
        {purchaseCourses.map(
          ({ courseId, title, description, price, imageLink }) => (
            <Course
              key={courseId}
              title={title}
              description={description}
              price={price}
              imageLink={imageLink}
            />
          )
        )}
      </ol>
    </div>
  );
}

function Course({ title, description, price, imageLink }) {
  return (
    <li>
      <p>{title}</p>
      <p>{description}</p>
      <p>{price}</p>
      <img src={imageLink} />
    </li>
  );
}
