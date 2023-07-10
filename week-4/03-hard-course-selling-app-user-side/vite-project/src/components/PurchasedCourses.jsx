import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

function PurchasedCourses() {
    const [courses, setCourses] = React.useState([]);

    React.useEffect(() => {
        axios.get('http://localhost:3000/users/purchasedCourses', {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(res => {
            setCourses(res.data.purchasedCourses || []);
        }).catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1>Purchased Courses</h1>
            <br />
            <div>
                {console.log(courses)}
                {courses.map(course => Courses(course))}
            </div>
        </div>
    )
}

function Courses(props) {
    const { id, title, price, published, description, imageLink } = props;
    return (
        <div key={id}>
            <p>Title: {title}</p>
            <p>Price: {price}</p>
            <p>Published: {published ? "Yes" : "No"}</p>
            <p>Description: {description}</p>
            <img src={imageLink} alt={title} />
        </div>
    )
}

Courses.propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    price: PropTypes.number,
    published: PropTypes.bool,
    description: PropTypes.string,
    imageLink: PropTypes.string
}

export default PurchasedCourses;