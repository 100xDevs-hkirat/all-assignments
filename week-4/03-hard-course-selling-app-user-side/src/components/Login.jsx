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

import { Link as RouteLink } from 'react-router-dom';
import { loginUser } from '../api';
const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: joiResolver(loginSchema) });

  const toast = useToast();

  const onSubmit = async (data, e) => {
    e.preventDefault();
    try {
      const res = await loginUser(data);

      const token = res.token;
      console.log(token);
      localStorage.setItem('token', token);
      window.location = '/courses';
    } catch (error) {
      console.log(error);
      toast({
        title: 'Authentication Failed',
        description: 'Incorrect username or password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

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
            Sign in to your account
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
            Login
          </Button>
          <Text>
            New here?
            <Link as={RouteLink} to='/register'>
              Register
            </Link>
          </Text>
        </VStack>
      </form>
    </Flex>
  );
};

export default Login;
