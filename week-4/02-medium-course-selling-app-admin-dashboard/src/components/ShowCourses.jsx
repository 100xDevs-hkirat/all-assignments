import React from "react";
import { Link } from "react-router-dom";

function ShowCourses() {
    const [courses, setCourses] = React.useState([]);
   setTimeout(()=>{
    const elements = document.getElementsByTagName('b');
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.color = 'red';
    }
       },1)
    React.useEffect(()=>{fetch("http://localhost:3000/admin/courses",{
        method:"GET",
}).then((response)=>response.json()).then((data)=>{
    setCourses(data)
})
    },[])

    return <div>
        <h1>Show Courses Page</h1>
        {courses.map(c => <Course title={c.title} description={c.description} price={c.price} id={c.id} image={c.image}/>)}
    </div>
}



function Course(props) {
    
    return <div>
       <b>Title :</b>{" "+props.title+" "}
       <b>Description :</b>{" "+props.description+" "}
       <b>Price :</b>{" "+props.price+" "}
       <b>id :</b>{" "+props.id}
       <img src={props.image} alt=" Image "/>
       <button><Link to={`/courses/${props.id}`}>Update</Link></button>

    </div>
}

export default ShowCourses;