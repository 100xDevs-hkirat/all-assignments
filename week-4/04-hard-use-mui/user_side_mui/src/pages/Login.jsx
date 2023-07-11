import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../helpers/server.helper.js';
import TokenContext from '../helpers/TokenContext';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
} from '@mui/material';

export default function Login() {
  const { jwtToken, setJwtToken } = useContext(TokenContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    login({ username: email, password })
      .then((token) => setJwtToken(token))
      .catch((error) => console.log(error))
      .finally(() => {
        setEmail('');
        setPassword('');
      });
  }

  useEffect(() => {
    if (jwtToken) navigate('/courses');
  }, [jwtToken, navigate]);

  return (
    <Container
      component="main"
      maxWidth="xs">
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography
          component="h2"
          variant="h5">
          Sign In
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            required
            autoFocus
            id="email"
            type="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            required
            id="password"
            type="password"
            label="Password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Link
            href="/register"
            variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
