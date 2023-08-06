import React from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

//have to take params to compleate
function Course() {

  const param = useParams()
  const [courses, setCourses] = React.useState([])

  const token = {
    Authorization: "Bearer " + JSON.parse(localStorage.getItem("auth"))
  }
  React.useEffect(() => {
    const getCourses = async () => {
      const res = await axios.get("http://localhost:3000/users/courses", {
        headers: token
      })
      setCourses(res.data.courses)
    }
    getCourses()

  }, [])

  const handleClick = () => {
    axios.post("http://localhost:3000/users/courses/" + param.id,{}, {
      headers: token
    }).then((res) => {
      console.log(res);
    }).catch((err)=>{
      console.log(err);
    })
  }
  
  let render = <div>hii</div>
  if (courses.length > 0) {
    const ele = courses.find((ele) => ele.id === Number(param.id))
    const { title, description, price, published } = ele
    render = <div>
      <h1>title - {title}</h1>
      <p>description - {description}</p>
      <p>price - {price}</p>
      <p>published - {published}</p>
      <button onClick={handleClick}>purchase</button>
    </div>
  }
  return (
    <div>
      {render}
    </div>
  )
}

export default Course