import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  Heading,
  Spacer,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setisLoggedIn] = useState(!!localStorage.getItem('token'));

  const navigate = useNavigate();

  useEffect(() => {
    setisLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setisLoggedIn(false);
    navigate('/', { replace: true });
  };

  return (
    <Box as='header' shadow={'sm'} backgroundColor={'white'}>
      <Container maxW={'8xl'}>
        <Flex alignItems='center' gap='2' p={4}>
          <Link to='/'>
            <Heading size='md'>Course App</Heading>
          </Link>
          <Spacer />
          {isLoggedIn ? (
            <ButtonGroup gap='2' colorScheme='blue'>
              <Link to='/create'>
                <Button variant={'ghost'}>Add new</Button>
              </Link>
              <Button onClick={logout}>Logout</Button>
            </ButtonGroup>
          ) : (
            <ButtonGroup gap='2' colorScheme='blue'>
              <Link to='/login'>
                <Button>Log in</Button>
              </Link>
              <Link to='/register'>
                <Button>Sign up</Button>
              </Link>
            </ButtonGroup>
          )}
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
