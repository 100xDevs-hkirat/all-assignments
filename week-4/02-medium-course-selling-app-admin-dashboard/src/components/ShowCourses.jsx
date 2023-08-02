import React from 'react'
import { useEffect } from 'react'
import { Typography, Card, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function ShowCourses() {
  const [courses, setCourses] = React.useState([])
  // Add code to fetch courses from the server
  // and set it in the courses state variable.
  useEffect(() => {
    axios
      .get('http://localhost:3000/admin/courses', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        setCourses(res.data.Courses)
      })
    // fetch('http://localhost:3000/admin/courses', {
    //   method: 'GET',
    //   headers: {
    //     'Content-type': 'application/json',
    //     Authorization: 'Bearer ' + localStorage.getItem('token'),
    //   },
    // }).then((res) => {
    //   res.json().then((data) => {
    //     setCourses(data.Courses)
    //   })
    // })
  }, [])

  if (courses.length==0) {
    return (
      <div>
        <Typography variant="h4" style={{ textAlign: 'center',marginTop:10 }}>
          To see all the course you have to login first
        </Typography>
      </div>
    )
  }
  return (
    <div>
      <Typography variant="h4" style={{ textAlign: 'center' }}>
        All Courses
      </Typography>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {courses.map((course) => (
          <Course course={course} />
        ))}
      </div>
    </div>
  )
}

function Course(props) {
  const course = props.course
  const navigate = useNavigate()
  return (
    <Card
      style={{
        margin: 10,
        width: 300,
        minHeight: 200,
      }}
    >
      <img
        src={course.imageLink}
        alt="Image not available"
        style={{ width: 300 }}
      />
      <Typography style={{ textAlign: 'center', backgroundColor: '#03fccf' }}>
        {course.title}
      </Typography>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: 5,
        }}
      >
        <Typography
          style={{
            backgroundColor: '#f51d5a',
            borderRadius: 10,
            textAlign: 'center',
            padding: 5,
          }}
        >
          Price: {course.price}
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            navigate('/course/' + course._id)
          }}
        >
          View Course
        </Button>
      </div>
    </Card>
  )
}

export default ShowCourses
