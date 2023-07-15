import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
    const navigate = useNavigate();

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [imageLink, setImageLink] = useState('')
    const [published, setPublished] = useState('')

    const addCourse = async () => {
        await fetch('http://localhost:3000/admin/courses', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title, description, price, imageLink, published })
        })
        navigate('/courses')

    }

    return <div>
        <form >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography mt={3} variant="h3" component="h3">
                    Create Course Page
                </Typography>
                <TextField id="outlined-basic1" style={{ marginBlock: '10% 5px' }} value={title} label="title" variant="outlined"
                    onChange={e => setTitle(e.target.value)}
                />
                <TextField id="outlined-basic2" style={{ margin: '5px' }} value={description} label="description" variant="outlined"
                    onChange={e => setDescription(e.target.value)}
                />
                <TextField id="outlined-basic3" style={{ margin: '5px' }} value={price} label="price" variant="outlined"
                    onChange={e => setPrice(e.target.value)}
                />
                <TextField id="outlined-basic4" style={{ margin: '5px' }} value={imageLink} label="imageLink" variant="outlined"
                    onChange={e => setImageLink(e.target.value)}
                />
                <TextField id="outlined-basic5" style={{ margin: '5px' }} value={published} label="published" variant="outlined"
                    onChange={e => setPublished(e.target.value)}
                />
                <Button size={'large'} style={{ margin: '5px' }} variant="outlined" onClick={addCourse}>
                    Submit
                </Button>





            </div>
        </form>

    </div>
}
export default CreateCourse;