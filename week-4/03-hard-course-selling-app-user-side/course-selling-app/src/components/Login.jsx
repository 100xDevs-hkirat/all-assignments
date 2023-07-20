import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';

const Login = () => {
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
  };

  return (
      <Container maxWidth="sm">
                <h2>Login Page</h2>
          <form onSubmit={handleSubmit}>                      
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
              <span>New here ? <Link to="/signup">SignUp</Link></span>
              <br />
              <br/>
        <Button type="submit" variant="contained" color="primary">
          Login 
        </Button>
      </form>
    </Container>
  );
};

export default Login;
