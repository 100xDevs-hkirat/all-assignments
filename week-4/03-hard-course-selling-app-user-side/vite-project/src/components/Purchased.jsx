import React from 'react'
import axios from 'axios'

function Purchased() {
  const [courses, setCourses] = React.useState([])

  const token = {
    Authorization: "Bearer " + JSON.parse(localStorage.getItem("auth"))
  }
  React.useEffect(() => {
    axios.get("http://localhost:3000/users/purchasedCourses", {
      headers: token
    }).then((res) => {
      console.log(res);
      setCourses(res.data.purchasedCourses)
    })
  }, [])

  return (
    <div>{courses.map((ele) => <Show title={ele} />)}</div>
  )
}

function Show(props) {
  const { title, description, price, published } = props.title
  return <div>
    <h1>title - {title}</h1>
    <p>description - {description}</p>
    <p>price - {price}</p>
    <p>published - {published}</p>
  </div>
}

export default Purchased