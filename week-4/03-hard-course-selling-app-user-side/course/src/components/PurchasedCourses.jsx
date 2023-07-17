import { Avatar, Card, CardContent, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import axios from 'axios'


const PurchasedCourses = () => {
    const [allCourses, setAllCourses] = useState([])
    const getCourses = async () => {
        try {
            const res = await axios.get('http://localhost:3000/users/purchasedCourses', {
                headers: {
                    'authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            setAllCourses(res.data.courses);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCourses();
    }, []);


    return (
        <div className="center" style={{ marginTop: '1rem', flexDirection: 'column' }}>
            <Typography variant="h5" component="h5">
                Purchased Courses
            </Typography>
            {
                allCourses.map(e => (
                    <Course
                        key={e.id}
                        title={e.title}
                        description={e.description}
                        imageLink={e.imageLink}
                        price={e.price}
                    />
                ))
            }

        </div>
    )
}


function Course({ title, description, price, imageLink }) {
    return (
        <Card style={{ marginBlock: '.5rem', display: 'flex', backgroundColor: '#22D1EE', width: '45%' }}>
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
                </div>
            </CardContent>
        </Card>
    )
}

export default PurchasedCourses