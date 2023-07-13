import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"


const ParticularCourse = () => {
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const [course, setCourse] = useState({})
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [courses, setCourses] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    const fetchAllCourse = async () => {
      try {
        const responseCourse = await fetch(`http://localhost:3000/admin/courses`, {
          method: "GET",
          headers: {
            'Content-Type': 'Application/json',
            'authorization': `Bearer ${token}`
          }
        })
        if (!responseCourse.ok) {

          console.log(responseCourse);
          alert(responseCourse.statusText);
          // throw new Error('something went wtong'),
          return
        }
        const data = await responseCourse.json()
        console.log(data.courses)
        const course_ = data.courses.filter(c => c.id === parseInt(id))
        setCourse(...course_)
        setCourses([...data.courses])
      } catch (error) {
        console.log(error)
      }
    }
    fetchAllCourse()
  }, [token])

  console.log(course)
  // console.log(typeof(id))
  const purchaseCourse = async (id) => {
    try {
      const responseCourse = await fetch(`http://localhost:3000/users/courses/${id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'Application/json',
          'authorization': `Bearer ${token}`
        },
      })
      if (!responseCourse.ok) {

        console.log(responseCourse);
        alert(responseCourse.statusText);
        // throw new Error('something went wtong'),
        return
      }
      const res_data = await responseCourse.json()
      alert(res_data.message);
      navigate('/course')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <div>
        <p>ID: {course.id}</p>
        <p>Title: {course.title}</p>
        <p>Description: {course.description || ""}</p>
        <p>Price: {course.price || ""}</p>
        <p>Published: {(course.published ? "true" : "false") || ""}</p>
      </div>
      <button type="submit" onClick={() => purchaseCourse(course.id)}>Submit</button>

    </div>
  )
}

export default ParticularCourse