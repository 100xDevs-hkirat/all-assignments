import React from "react";
import useFetch from "./FetchData";

function CreateCourse() {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [imgLink, setImglink] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [published, setPublished] = React.useState("");
    const fetch = useFetch("http://localhost:3000/admin/courses", "POST", "/courses");
    const body = {
        title: title,
        description: description,
        price: price,
        published: published
    };
    const header = new Headers();
    header.append('content-type', 'application/json');
    header.append('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhhcmtpcmF0MUBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDk3MzY0NjQsImV4cCI6MTcwOTc0MDA2NH0.K7GRMddeAUydUStaAlFY25q4JHXqi5Tg7XBHEeZpnX8');

    return <div>
        <h1>Create Course Page</h1>
        <h5>Title</h5>
        <input type={"text"} onChange={e => setTitle(e.target.value)} />
        <h5 >Description</h5>
        <input type={"text"} onChange={e => setDescription(e.target.value)} />
        <h5 >Image Link</h5>
        <input type={"text"} onChange={e => setImglink(e.target.value)} />
        <h5 >Price</h5>
        <input type={"text"} onChange={e => setPrice(e.target.value)} />
        <h5 >Published</h5>
        <input type={"text"} onChange={e => setPublished(e.target.value)} />
        <button onClick={() => fetch(body, header)}>Create Course</button>
    </div>
}
export default CreateCourse;