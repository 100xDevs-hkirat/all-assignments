import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { InputLabel } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from './Copyright';
import axios from '../config/requestLibrary';
import { useNavigate } from 'react-router-dom';

// TODO remove, this demo shouldn't need to reset the theme.
let resp = null;
const defaultTheme = createTheme();

export default function CreateCourse() {
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if(! /^\d*\.?\d+$/.test(data.get('price'))) alert('Prrice should contain only numbers');
    else{
    try{
      const response = await axios({
        method: 'post',
        url: '/admin/courses',
        data:{
          'title': data.get('title'),
          'description': data.get('description'),
          'price': data.get('price'),
          'imageLink': data.get('imageLink'),
          'published': data.get('published')
      },
      headers:{
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    }
      });
      //response.status === 201 && alert(response.data.message) && localStorage.setItem('accessToken', response.data.token);
      if(response.status === 200){
        alert(response.data.message);
        navigate('/courses');
      }
    }catch(err){
      err.response.status === 403 && alert(err.response.data.message);
    }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          
          <Typography component="h1" variant="h5">
            Please fill all the fields
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="title"
                  label="Course Title"
                  name="title"
                  autoComplete="title"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="description"
                  label="Description"
                  type="text"
                  id="description"
                  autoComplete="description"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="price"
                  label="Price"
                  type="number"
                  id="price"
                  autoComplete="price"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="imageLink"
                  label="Paste course image url here"
                  type="url"
                  id="imageLink"
                  autoComplete="imageLink"
                />
              </Grid>
             <SelectComponent/>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{ mt: 3, mb: 2, gap:2, mrgin:2 }}
            >
              Publish
            </Button>
            <Button
              type="submit"
              variant="outlined"
              href="/courses"
              sx={{ mt: 3, mb: 2,  gap:2 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
  function SelectComponent() {
    const [selectedValue, setSelectedValue] = React.useState('');
  
    const handleChange = (event) => {
      setSelectedValue(event.target.value);
    };
  
    return (
      <Grid item xs={12}>
        <InputLabel id="published">Ready to publish?</InputLabel>
        <Select
          labelId="published"
          name="published"
          id="published"
          label="Published"
          value={selectedValue}
          autoWidth={true}
          onChange={handleChange}
        >
          <MenuItem value={true}>Yes</MenuItem>
          <MenuItem value={false}>No</MenuItem>
        </Select>
      </Grid>
    );
  }
  
}