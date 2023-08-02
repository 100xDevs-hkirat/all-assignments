import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Button, Typography, TextField } from '@mui/material'
import axios from 'axios'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import editImg from '../assets/pen.png'
import deleteImg from '../assets/delete.png'

const titleState = atom({
  key: 'titleState',
  default: '',
})
const descriptionState = atom({
  key: 'descriptionState',
  default: '',
})

const imageState = atom({
  key: 'imageState',
  default: '',
})

const priceState = atom({
  key: 'priceState',
  default: '',
})

const publishedState = atom({
  key: 'publishedState',
  default: '',
})

const courseState = atom({
  key: 'courseState',
  default: '',
})

const EditCourse = () => {
  let { courseId } = useParams()
  const [course, setCourse] = useRecoilState(courseState)
  const setTitle = useSetRecoilState(titleState)
  const setDescription = useSetRecoilState(descriptionState)
  const setImage = useSetRecoilState(imageState)
  const setPublished = useSetRecoilState(publishedState)
  const setPrice = useSetRecoilState(priceState)
  const [showEditForm, setShowEditForm] = useState(false) // State to manage the form visibility

  useEffect(() => {
    axios
      .get('http://localhost:3000/admin/course/' + courseId, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        setCourse(res.data.Course)
        setTitle(res.data.Course.title)
        setDescription(res.data.Course.description)
        setImage(res.data.Course.imageLink)
        setPrice(res.data.Course.price)
        setPublished(res.data.Course.published)
      })
  }, [])
  // Function to handle the "Edit Course" button click
  const handleEditClick = () => {
    setShowEditForm(true) // Show the edit form when the button is clicked
  }
  if (!course) {
    return (
      <div
        style={{
          height: '100vh',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        Loading....
      </div>
    )
  }
  return (
    <div>
      <div
        style={{
          width: '100%',
          height: 100,
          backgroundColor: 'black',
        }}
      >
        <Typography
          variant="h4"
          style={{ textAlign: 'center', color: 'white', paddingTop: 20 }}
        >
          {course.title}
        </Typography>
      </div>
      <div style={{ display: 'flex' }}>
        <CourseCard onEditClick={handleEditClick} />
        {/* Display the edit form if showEditForm is true */}
        {showEditForm && (
          <div style={{ marginLeft: 20, flex: 1 }}>
            <EditForm />
          </div>
        )}
      </div>
    </div>
  )
}

function CourseCard(props) {
  const { onEditClick } = props
  const course = useRecoilValue(courseState)
  return (
    <Card
      style={{
        margin: 10,
        width: 300,
        minHeight: 200,
        maxHeight: 450,
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
      <Typography style={{ marginTop: 5 }}>
        <b style={{ backgroundColor: 'black', color: 'white' }}>Description:</b>{' '}
        {course.description}
      </Typography>
      <Typography style={{ marginTop: 5, display: 'flex' }}>
        <b style={{ backgroundColor: 'black', color: 'white', marginRight: 4 }}>
          Published:
        </b>{' '}
        {course.published ? <p> True</p> : <p>False</p>}
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
        <div>
          <button
            style={{
              backgroundImage: `url(${editImg})`,
              width: 30,
              height: 30,
              backgroundSize: 'cover',
              border: 'none',
              backgroundColor: 'white',
              marginRight: 5,
            }}
            onClick={onEditClick}
          ></button>
          <button
            style={{
              backgroundImage: `url(${deleteImg})`,
              width: 30,
              height: 30,
              backgroundSize: 'cover',
              border: 'none',
              backgroundColor: 'white',
              marginRight: 5,
            }}
            onClick={async () => {
              const res = await axios.delete(
                'http://localhost:3000/admin/course/' + course._id,
                {
                  headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                  },
                }
              )
              alert('Course deleted successfully')
              window.location = '/courses'
            }}
          ></button>
        </div>
      </div>
    </Card>
  )
}

function EditForm() {
  const [title, setTitle] = useRecoilState(titleState)
  const [description, setDescription] = useRecoilState(descriptionState)
  const [image, setImage] = useRecoilState(imageState)
  const [price, setPrice] = useRecoilState(priceState)
  const [published, setPublished] = useRecoilState(publishedState)
  const [course, setCourse] = useRecoilState(courseState)

  return (
    <Card style={{ padding: 20, width: 500, margin: 10 }}>
      <Typography variant="h5" style={{ marginBottom: 10 }}>
        Edit Course
      </Typography>
      <TextField
        value={title}
        style={{ marginBottom: 10 }}
        onChange={(e) => {
          setTitle(e.target.value)
        }}
        fullWidth={true}
        label="Title"
        variant="outlined"
      />

      <TextField
        value={description}
        style={{ marginBottom: 10 }}
        onChange={(e) => {
          setDescription(e.target.value)
        }}
        fullWidth={true}
        label="Description"
        variant="outlined"
      />

      <TextField
        value={image}
        style={{ marginBottom: 10 }}
        onChange={(e) => {
          setImage(e.target.value)
        }}
        fullWidth={true}
        label="Image link"
        variant="outlined"
      />
      <TextField
        value={price}
        style={{ marginBottom: 10 }}
        onChange={(e) => {
          setPrice(e.target.value)
        }}
        fullWidth={true}
        label="Price"
        variant="outlined"
      />
      <TextField
        value={published}
        style={{ marginBottom: 10 }}
        onChange={(e) => {
          setPublished(e.target.value)
        }}
        fullWidth={true}
        label="Published"
        variant="outlined"
      />

      <Button
        variant="contained"
        onClick={() => {
          axios
            .put(
              'http://localhost:3000/admin/course/' + course._id,
              {
                title: title,
                description: description,
                price: price,
                imageLink: image,
                published: published,
              },
              {
                headers: {
                  Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
              }
            )
            .then((res) => {
              let updatedCourse = {
                _id: course._id,
                title: res.data.course.title,
                description: res.data.course.description,
                imageLink: res.data.course.imageLink,
                price: res.data.course.price,
                published: res.data.course.published,
              }
              setCourse(updatedCourse)
            })
        }}
      >
        {' '}
        Update course
      </Button>
    </Card>
  )
}

export default EditCourse
