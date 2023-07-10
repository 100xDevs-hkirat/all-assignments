import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function PurchaseCourse() {
    const { courseId } = useParams();
    const [course, setCourse] = React.useState({});
    const navigate = useNavigate();

    React.useEffect(() => {
        axios.get(`http://localhost:3000/users/courses/${courseId}`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem("token")}`
            }
        }).then(res => {
            setCourse(res.data.course);
        }).catch(err => console.error(err));
    }, [courseId]);

    function purchaseCourse() {
        axios.post(`http://localhost:3000/users/courses/${courseId}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(res => {
            alert(res.data.message);
            navigate("/courses/purchased");
        }).catch(err => console.error(err));
    }

    return (
        <div> 
            <h1>Purchase Course</h1>
            <br />
            <div>
                <p>Title: {course.title}</p>
                <br />
                <p>Price: {course.price}</p>
                <br />
                <p>Published: {course.published ? "Yes" : "No"}</p>
                <br />
                <p>Description: {course.description}</p>
                <br />
                <img src={course.imageLink} alt={course.title} />
                <br />
                <button onClick={purchaseCourse}>Purchase</button>
            </div>
        </div>
    )
}

export default PurchaseCourse;