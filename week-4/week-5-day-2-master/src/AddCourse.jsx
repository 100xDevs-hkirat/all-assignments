import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Card } from "@mui/material";
import { useState } from "react";
import axios from "axios";

function AddCourse() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [price, setPrice] = useState("");

    return <div style={{ display: "flex", justifyContent: "center", minHeight: '80vh', flexDirection: 'column' }}>
        <div style={{
            display:'flex',
            justifyContent:'center'
        }}>
            <Card varint={"outlined"} style={{ width: 400, padding: 20, }}>
                <TextField
                    onChange={(e) => {
                        setTitle(e.target.value)
                    }}
                    style={{
                        margin: '10px 0'
                    }}
                    value={title}
                    fullWidth={true}
                    label="Title"
                    variant="outlined"
                />

                <TextField
                    style={{
                        margin: '10px 0'
                    }}
                    onChange={(e) => {
                        setDescription(e.target.value)
                    }}
                    value={description}
                    fullWidth={true}
                    label="Description"
                    variant="outlined"
                />

                <TextField
                    style={{
                        margin: '10px 0'
                    }}
                    onChange={(e) => {
                        setImage(e.target.value)
                    }}
                    value={image}
                    fullWidth={true}
                    label="Image link"
                    variant="outlined"
                />

                <TextField
                    style={{
                        margin: '10px 0'
                    }}
                    onChange={(e) => {
                        setPrice(e.target.value)
                    }}
                    value={price}
                    fullWidth={true}
                    label="Price"
                    variant="outlined"
                />

                <Button
                    style={{
                        margin: '10px 0'
                    }}
                    size={"large"}
                    variant="contained"
                    onClick={async () => {


                        const res = await axios.post("http://localhost:3000/admin/courses",
                            {
                                title: title,
                                description: description,
                                imageLink: image,
                                published: true
                            }, {
                            headers: {
                                "Content-type": "application/json",
                                "Authorization": "Bearer " + localStorage.getItem("token")
                            }
                        }
                        )

                        const data = res.data;
                        console.log(data.message)
                        alert(data.message)
                        setTitle('')
                        setImage('')
                        setDescription('')
                        setPrice('')
                    }}
                > Add course</Button>
            </Card>
        </div>
    </div>
}

export default AddCourse;