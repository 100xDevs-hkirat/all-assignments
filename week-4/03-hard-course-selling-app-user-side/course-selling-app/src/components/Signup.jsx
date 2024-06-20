import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
    
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
      e.preventDefault();     
    // Here, you can handle the form submission logic, e.g., send data to the server.
      console.log(formData);
      const email = formData.email;
      const url = "http://localhost:3000/users/signup";
        fetch(url, {
            method: "POST",           
            headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify(formData), 
        }).then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    localStorage.setItem("token", data.token);
                    window.location = "/"
                })
            }
            else { 
                throw new Error(response.data);
            }           
        })
  };

  return (
      <Container maxWidth="sm">
                <h2>Sign Up Page</h2>
          <form onSubmit={handleSubmit}>              
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          typeof="text"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          typeof="email"
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          margin="normal"
          variant="outlined"
          typeof="password"
              />
              <span>Already a user  ? <Link to="/login">Login</Link></span>
              <br />
              <br/>
        <Button type="submit" variant="contained" color="primary" >
          Sign Up
        </Button>
      </form>
    </Container>
  );
};

export default SignUp;
