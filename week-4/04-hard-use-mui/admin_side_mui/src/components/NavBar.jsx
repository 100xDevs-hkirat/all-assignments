import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TokenContext from '../helpers/TokenContext';

export default function NavBar() {
  const { jwtToken, setJwtToken } = useContext(TokenContext);
  const navigate = useNavigate();

  function handleLogout() {
    setJwtToken(null);
    navigate('/');
  }

  return (
    <div>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center">
        <Grid
          item
          onClick={() => navigate('/')}>
          <Typography
            variant="h4"
            noWrap
            sx={{ padding: 2 }}>
            Coursera
          </Typography>
        </Grid>
        {jwtToken ? (
          <Grid item>
            <Button
              variant="contained"
              sx={{ marginRight: 2 }}
              onClick={handleLogout}>
              Logout
            </Button>
          </Grid>
        ) : (
          <Grid item>
            <Button
              variant="contained"
              sx={{ marginRight: 2 }}
              onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button
              variant="contained"
              sx={{ marginRight: 2 }}
              onClick={() => navigate('/register')}>
              Sign Up
            </Button>
          </Grid>
        )}
      </Grid>
    </div>
  );
}
