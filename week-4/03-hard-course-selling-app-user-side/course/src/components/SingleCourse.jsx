import { Avatar, Button, Card, CardContent } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios'


const SingleCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token')

  const [courses, setCourses] = useState([])




  const getCourses = async () => {
    try {
      const res = await axios.get('http://localhost:3000/users/courses',{
        headers: {
          'authorization': `Bearer ${token}`
        }
      });
      const filteredCourses = res.data.courses.filter(e => e.id == courseId);
      setCourses(filteredCourses);
    } catch (error) {
      console.log(error);
    }
  };


  const buyCourse = async () => {
    try {
      await axios.post( `http://localhost:3000/users/courses/${courseId}`,{}, {
        headers: {
          'authorization': `Bearer ${token}`
        }
      }).then(() => navigate('/purchasedCourses'))


    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    getCourses()
  }, [])

  if (courses.length == 0) {
    return <div className="">Loading ...</div>
  }


  return (
    <div className="center">
      <Card style={{ marginBlock: '.5rem', display: 'flex', backgroundColor: '#22D1EE', width: '45%' }}>
        <Avatar src={courses[0].imageLink} style={{ margin: '1rem' }} />
        <CardContent style={{ flex: 1 }}>
          <div style={{ color: 'darkblue', marginBottom: '0.5rem' }}>
            {courses[0].title}
          </div>
          <div style={{ color: 'darkgray', marginBottom: '0.5rem' }}>
            {courses[0].description}
          </div>
          <div style={{ color: 'green', marginBottom: '0.5rem' }}>
            Price: {courses[0].price}
          </div>
          <div style={{ color: 'red', marginBottom: '0.5rem' }}>
          </div>
          <Button size='large' style={{ backgroundColor: "#B9CCED" }} variant="contained"
            onClick={buyCourse}
          >Buy</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default SingleCourse