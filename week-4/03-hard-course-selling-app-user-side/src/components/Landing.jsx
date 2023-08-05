import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from './Copyright';

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Landing() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="right"
              marginRight={3}
            >
              <Button variant="contained" href="/login">Login</Button>
              <Button variant="outlined" href="/register">Register</Button>
            </Stack>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              The Learning Curve
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Simple and meaningful courses to make you ready for future jobs.
            Learn and imporve yourself day by day.
            </Typography>
            
          </Container>
        </Box>
        
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h3" align="center" gutterBottom>
          Join us
        </Typography>
        <Typography   variant="h5" align="center" gutterBottom>
          <Link href="mailto:info@thelearningcurve.com">info@thelearningcurve.com</Link>
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
          position= "bottom"
        >
          Always try and fails. Never fail to try.
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}