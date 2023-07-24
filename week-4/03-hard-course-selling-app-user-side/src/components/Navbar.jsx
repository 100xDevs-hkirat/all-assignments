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
import { Link } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import { fetchUser } from '../api';

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { user } = await fetchUser();
        setUser(user);
      } catch (error) {
        console.log(error);
        localStorage.clear('token');
      }
    };

    fetchUserData();
  }, []);

  return (
    <Box as='header' shadow={'sm'} backgroundColor={'white'}>
      <Container maxW={'8xl'}>
        <Flex alignItems='center' gap='2' p={4}>
          <Link to='/'>
            <Heading size='md'>Course App</Heading>
          </Link>
          <Spacer />
          {user ? (
            <ButtonGroup gap='2' colorScheme='blue'>
              <Link to='/my-courses'>
                <Button variant={'ghost'}>My Courses</Button>
              </Link>
              <UserAvatar user={user} setisLoggedIn={setUser} />
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
