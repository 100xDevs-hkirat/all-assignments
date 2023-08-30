import {useEffect ,useState} from "react";
import Navbar from "./Navbar";
import Course from "./Course";
import axios from 'axios'


function ShowCourses() {

    const abc = {
        title: "Full stack development",
        description: "Full stack dev course by harkirat",
        price: 5999,
        imageLink: "https://d33g7sdvsfd029.cloudfront.net/subject/2023-01-17-0.3698267942851394.jpg",
        published: true
    }

    const abc1 = {
        title: "Full stack development",
        description: "Full stack dev course by harkirat jhsduhiusdh cbusdhuihc jcbushcb cjbubscu cjhbjkscb cjhcjkh cbkjbkjhbc jhbchkbkshb ckhbskhbckjab cbkjsbakjbak ckhbskjbckj ckhbakjb",
        price: 5999,
        imageLink: "https://d33g7sdvsfd029.cloudfront.net/subject/2023-01-17-0.3698267942851394.jpg",
        published: false
    }

    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token')
        const fetchData = async () => {
            try {
              const response = await axios.get('http://localhost:3000/admin/courses/', {
                headers: {
                  Authorization: `Bearer ${token}`,
                  // Other headers if needed
                },
              });
              console.log(response)
              setCourses(response.data.courses);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
      
          fetchData();
    }, [])

    // Add code to fetch courses from the server
    // and set it in the courses state variable.
    return <div>
        <div style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "9vh",
                color: "white"
            }}>
          <h1>All Courses</h1>
        </div>
        <div style={{
                display: "flex",
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
          {courses.map((c, i) => <Course key={i} id={c._id} title={c.title} description={c.description} link={c.imageLink} published={c.published} price={c.price} show={true}/>)}
        </div>
    </div>
}


export default ShowCourses;