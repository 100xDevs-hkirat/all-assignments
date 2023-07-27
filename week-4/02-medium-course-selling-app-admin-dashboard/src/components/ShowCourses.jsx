import { useEffect, useState } from "react";
import { Avatar, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from "react-router-dom";

function ShowCourses() {
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);


    const getCourses = async () => {
        await fetch('http://localhost:3000/admin/courses/', {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => res.json())
            .then(res => setCourses(res.courses))
            .catch(err => console.log(err))

    }
    useEffect(() => {
        getCourses()

    }, [])


    // Add code to fetch courses from the server
    // and set it in the courses state variable.
    return <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1>All Available Courses</h1>
        <Button size={'large'} style={{ width: '20%', margin: '5px' }} variant="outlined"
            onClick={() => navigate('/about')}
        >Add Courses</Button>
        {
            courses.map(c => <Course key={c.id} title={c.title} description={c.description} price={c.price} imageLink={c.imageLink} published={c.published} />)
        }
    </div>
}

function Course({ title, description, price, imageLink, published }) {
    return (
        <Card style={{ marginBlock: '.5rem', display: 'flex', backgroundColor: 'lightgray' }}>
            <Avatar alt={title} src={imageLink} style={{ margin: '1rem' }} />
            <CardContent style={{ flex: 1 }}>
                <div style={{ color: 'darkblue', marginBottom: '0.5rem' }}>
                    {title}
                </div>
                <div style={{ color: 'darkgray', marginBottom: '0.5rem' }}>
                    {description}
                </div>
                <div style={{ color: 'green', marginBottom: '0.5rem' }}>
                    Price: {price}
                </div>
                <div style={{ color: 'red', marginBottom: '0.5rem' }}>
                    Published: {published}
                </div>
            </CardContent>
        </Card>
    )
}

export default ShowCourses;