/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Box, Container } from '@chakra-ui/react';

/// Logging a user out is as simple as deleting the token from the local storage.

function Landing() {
  return (
    <Box h={'100%'} background={'blackAlpha.50'}>
      <Navbar />

      <Container maxW={'8xl'} h={'calc(100% - 72px)'}>
        <Outlet />
      </Container>
    </Box>
  );
}

export default Landing;
