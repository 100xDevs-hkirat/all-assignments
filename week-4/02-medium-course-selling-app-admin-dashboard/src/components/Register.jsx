import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  Link,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { Link as RouteLink, useNavigate } from 'react-router-dom';
import { registerAdmin } from '../api';
import { useEffect } from 'react';

const signUpSchema = Joi.object({
  username: Joi.string()
    .required()
    .max(20)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .message('Username must contains only alphnumeric characters and _'),
  password: Joi.string()
    .required()
    .min(6)
    .max(120)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]+$/
    )
    .message(
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
    ),
});

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: joiResolver(signUpSchema) });

  const navigate = useNavigate();
  const toast = useToast();

  const onSubmit = async (data) => {
    try {
      const res = await registerAdmin(data);
      const token = res.token;
      localStorage.setItem('token', token);
      navigate('/courses');
    } catch (error) {
      console.log(error);
      toast({
        title: 'Authentication Failed',
        description: error.response.data.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/courses');
    }
  }, []);
  if (localStorage.getItem('token')) {
    return null;
  }

  return (
    <Flex direction={'column'} justify={'center'} align={'center'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack
          width={'lg'}
          p={8}
          mt={16}
          background={'white'}
          rounded={'md'}
          shadow={'sm'}>
          <Heading as={'h2'} size={'lg'} my={4} fontWeight={500}>
            Create your account
          </Heading>
          <FormControl isInvalid={errors.username}>
            <FormLabel>Username</FormLabel>
            <Input
              type='text'
              size={'lg'}
              placeholder='Username'
              {...register('username')}
            />
            <FormErrorMessage>
              {errors.username && errors.username.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type='password'
              size={'lg'}
              placeholder='Password'
              {...register('password')}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          <Button
            colorScheme='blue'
            size={'lg'}
            w={'100%'}
            mt={4}
            type='submit'>
            Register
          </Button>
          <Text>
            Already a user?
            <Link as={RouteLink} to='/login'>
              Login
            </Link>
          </Text>
        </VStack>
      </form>
    </Flex>
  );
};

export default Register;
