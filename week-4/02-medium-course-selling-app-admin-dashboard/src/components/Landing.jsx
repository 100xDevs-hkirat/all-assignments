import { Link } from 'react-router-dom'
import { Stack, Typography } from '@mui/material'

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
  return (
    <Stack
      direction={'column'}
      alignItems={'center'}
      sx={{ height: '80vh' }}
      justifyContent={'center'}
    >
      <Typography variant='h3'>Welcome to Coursemy</Typography>
      <Typography variant='h6'>
        A place to find and share the best courses
      </Typography>

      <Stack direction={'row'} gap={'20px'} sx={{ mt: '40px' }}>
        <Link to={'/register'} className='link'>
          Register
        </Link>
        <br />
        <Link to='/login' className='link'>
          Login
        </Link>
      </Stack>
    </Stack>
  )
}

export default Landing
