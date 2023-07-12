import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function UpdateCourse() {
    const location = useLocation();
    const navigate = useNavigate();

  // Access the passed props from the location state
    const data = location.state;
    let title = data.course.title;
    let description = data.course.description;
    let price = data.course.price;
    let image = data.course.image;
    let published = data.course.published;
    let id = data.course.id;

    const updateCourse = ()=>{
        console.log(title,description,price,image,published);
        fetch("http://localhost:3000/admin/courses/" + id,{
            method : "PUT",
            headers : {
                'Content-Type' : 'application/json',
                'authorization' : localStorage.getItem("token")
            },
            body : JSON.stringify({
                title,description,price,image,published
            })
        }).then((res)=>{
            if(res.ok){
                navigate("/courses");
            }
        })
    }


    return <div>
        <h1>Update Course Page</h1>
        <input
        type="text"
        onChange={(e) => title = e.target.value}
        placeholder="title"
      />
      <br />
      <input
        type="text"
        onChange={(e) => description = e.target.value}
        placeholder="description"
      />
      <br />
      <input
        type="text"
        onChange={(e) => price = e.target.value}
        placeholder="price"
      />
      <br />
      <input
        type="text"
        onChange={(e) => image = e.target.value}
        placeholder="image"
      />
      <br />
      Published
      <form>
        <input type="radio" id="option1" name="options" value="true" onClick={()=>published="true"}/>
        <label htmlFor="option1">true</label>
        <br />

        <input type="radio" id="option2" name="options" value="false" onClick={()=>published="false"}/>
        <label htmlFor="option2">false</label>
        <br />
      </form>
      <button style={{ marginTop: "20px" }} onClick={updateCourse}>
        UPDATE COURSE
      </button>
    </div>
}
export default UpdateCourse;