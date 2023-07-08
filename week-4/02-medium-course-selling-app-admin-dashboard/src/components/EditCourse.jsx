import { useState } from 'react'
import axios from 'axios'

function EditCourse() {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [published, setPublished] = useState(false);
    const [description, setDescription] = useState('');
    const [imageLink, setImageLink] = useState('');
    const [courseId, setCourseId] = useState('');

    function update(event) {
        event.preventDefault();
        axios.put(`http://localhost:3000/admin/courses/${courseId}`, {
            title,
            price,
            published,
            description,
            imageLink
        },
        {
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(res => console.log(res.data))
        .catch(err => console.error(err));
    }

    function getCourse() {
        console.log(courseId);
        axios.get(`http://localhost:3000/courses/${courseId}`, {
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${localStorage.getItem("token")}`
            }
        }).then(res => res.data)
        .then(data => {
            setTitle(data.title);
            setPrice(data.price);
            setPublished(data.published);
            setDescription(data.description);
            setImageLink(data.imageLink);
        }).catch(err => console.error(err));
    }

    return <div>
        <div>
        Course - <input type="text" onChange={e => setCourseId(e.target.value)} />
        <button onClick={getCourse}>Get course</button>
        <br />
        </div>
        <form>
        Title - <input type="text" value={title} onChange={e => setTitle(e.target.value)} required={true}/>
        <br />
        Course Id - {courseId}
        <br />
        Price - <input type="text" value={price} onChange={e => setPrice(e.target.value)} required={true}/>
        <br />
        Published - <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} />
        <br />
        Description - <input type="text" value={description} onChange={e => setDescription(e.target.value)} required={true}/>
        <br />
        ImageLink - <input type="text" value={imageLink} onChange={e => setImageLink(e.target.value)} required={true}/>
        <br />
        <button onClick={update}>Update</button>
        </form>
    </div>
}

export default EditCourse;