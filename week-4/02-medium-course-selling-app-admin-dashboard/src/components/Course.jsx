import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from 'axios'

const MAX_DESCRIPTION_LINES = 5;

function Course(props) {

    const navigate = useNavigate();
    const [published, setpublished] = React.useState(props.published)

    const truncateText = (text) => {
        const words = text.split(' ');
        if (words.length > MAX_DESCRIPTION_LINES * 3) {
          return words.slice(0, MAX_DESCRIPTION_LINES * 3).join(' ') + '...';
        }
        return text;
      };
    
    const truncatedDescription = truncateText(props.description);

    const updateCourse = () => {
        navigate("/updateCourse/" + props.id);
    }

    const publishCourse = async() => {
        const token = localStorage.getItem('token')
        try {
            const response = await axios.put('http://localhost:3000/admin/courses/' + props.id,{
                published: true
            }, {
              headers: {
                Authorization: `Bearer ${token}`,
                // Other headers if needed
              },
            });
            setpublished(true)
            
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    }

    return <div className="course-component">
      {published  ? <div className="course-state"> <Typography variant="h6"> Published</Typography></div> : <div className="course-state" style={{width: 110, backgroundColor: "red", left: "200px"}}><Typography variant="h6"> Unpublished</Typography> </div>}
      <Card className="course-card" variant="outlined">
        <CardActionArea>
        <CardMedia
            component="img"
            image={props.link}
            height='250px'
            alt="Course Image"
            
        />
        <CardContent>
            <Typography gutterBottom variant="h5" component="div">
            {props.title}
            </Typography>
            <Typography gutterBottom variant="body2" color="text.secondary" sx={{width: 1, height: 50}}>
            {truncatedDescription}
            </Typography>
            <Typography mt={2} variant="subtitle2" component="div">
              Price: ${props.price}
            </Typography>
        </CardContent>
        </CardActionArea>
        {props.show ? <CardActions>
        <Button onClick={updateCourse} variant="contained" size="medium" color="warning">
            Update
        </Button>
        {published ? <Button variant="contained" size="medium" color="primary" disabled> Publish</Button> : <Button variant="contained" onClick={publishCourse} size="medium" color="primary"> Publish</Button>}
        </CardActions> : <></>}
      </Card>
    </div>
    
}

export default Course