import React from "react";


function ShowCourses() {
    const [courses, setCourses] = React.useState([]);
    setTimeout(fetch("http://localhost:3000/admin/courses", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": localStorage.getItem('token')
        }
    }).then(resp => {
        resp.json().then((parsedResp) => {
            console.log(parsedResp);
           setCourses(parsedResp);
        })
    }),10000); //fetching updated course list every 10 seconds
    // Add code to fetch courses from the server
    // and set it in the courses state variable.
    return <div>
         <h1>List of Courses </h1>
        {courses.map(c => <Course title={c.title} description={c.description} price={c.price} imageLink={c.imageLink} published={c.published} />)}
    </div>
}

function Course(props) {
    return <div>
        <p>
            <span>Title- {props.title} </span>
            <span>Description- {props.description} </span>
            <span>Price- {props.price} </span>
            <span>ImageLink- {props.imageLink} </span>
            <span>Published- {props.published}</span>
        </p>
    </div>
}

export default ShowCourses;