import React from 'react';
import axios from 'axios';
import propTypes from 'prop-types';

function Courses() {
    const [courses, setCourses] = React.useState([]);

    React.useEffect(() => {
        axios.get('http://localhost:3000/users/courses', {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            }).then(res => {
                setCourses(res.data.courses);
            }).catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1>Courses Page</h1>
            <br />
            <div>
                {courses.map(course => {
                    return Course(course);
                })}
            </div>
        </div>
    )
}

function Course(props) {
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

Course.propTypes = {
    id: propTypes.number,
    title: propTypes.string,
    price: propTypes.number,
    published: propTypes.bool,
    description: propTypes.string,
    imageLink: propTypes.string
}
export default Courses;