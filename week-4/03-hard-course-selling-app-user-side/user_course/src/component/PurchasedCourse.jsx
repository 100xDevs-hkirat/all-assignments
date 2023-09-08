import { useEffect, useState } from "react"

const PurchasedCourse = () => {
  const [pCourse, setPCourse] = useState([])
  const token = localStorage.getItem('token')
  useEffect(() => {
    const fetchAllPurchasedCourse = async () => {
      const resPurchasedCourse = await fetch(`http://localhost:3000/users/purchasedCourses`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'Application/json',
            'authorization': `Bearer ${token}`
          }
        })
      if (!resPurchasedCourse.ok) {
        alert(resPurchasedCourse.statusText)
        return
      }
      const purchasedData = await resPurchasedCourse.json()
      console.log(purchasedData)
      setPCourse([...purchasedData.purchasedCourses])
    }
    fetchAllPurchasedCourse()
  }, [token])

  return (
    <div>
      <h1>PurchasedCourse</h1>
      {pCourse.length === 0 ? <div>Sorry no Courses purchased</div>
        :
        pCourse.map((movie) => (
          <div key={movie.id}>
            <h2> movie name : {movie.title}</h2>
            <p> movie description : {movie.description}</p>
            <p>Price: {movie.price || "Not specified"}</p>
            <p>Published: {movie.published ? "true" : "false"}</p>
            <hr />
          </div>
        ))
      }
    </div>
  )
}

export default PurchasedCourse