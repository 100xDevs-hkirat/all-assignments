import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourses, putCourse } from '../helpers/server.helper';
import TokenContext from '../helpers/TokenContext';
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  TextField,
  Typography,
  Checkbox,
} from '@mui/material';

export default function UpdateCourse() {
  const { jwtToken } = useContext(TokenContext);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [imageLink, setImageLink] = useState('');
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (!jwtToken) navigate('/login');
    getCourses()
      .then((res) => {
        const course = res.data.courses.find((c) => c.courseId == courseId);
        if (course) {
          setTitle(course.title);
          setDescription(course.description);
          setPrice(course.price);
          setImageLink(course.imageLink);
          setPublished(course.published);
        }
      })
      .catch((error) => {
        if (error.response.status === 401) navigate('/login');
      });
  }, [jwtToken, courseId, navigate]);

  function handleUpdate(e) {
    e.preventDefault();
    putCourse(courseId, {
      title,
      description,
      price,
      imageLink,
      published,
    })
      .then(() => navigate('/courses'))
      .catch((error) => {
        if (error.response.status === 401) navigate('/login');
      });
  }

  return (
    <Container>
      <Typography
        component="h2"
        variant="h4"
        textAlign="center">
        Update Course
      </Typography>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          component="form"
          onSubmit={handleUpdate}
          noValidate
          sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            required
            id="title"
            type="text"
            label="Title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            required
            multiline
            id="description"
            type="description"
            label="Description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            required
            id="price"
            type="number"
            label="Price"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            required
            id="imageLink"
            type="imageLink"
            label="Image Link"
            name="imageLink"
            value={imageLink}
            onChange={(e) => setImageLink(e.target.value)}
          />
          <FormControlLabel
            label={'Published'}
            control={
              <Checkbox
                name="published"
                label={'Published'}
                checked={published}
                onChange={() => setPublished((prev) => !prev)}
              />
            }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Update Course
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
