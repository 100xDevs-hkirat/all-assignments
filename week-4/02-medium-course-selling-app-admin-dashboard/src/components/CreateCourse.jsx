import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  FormErrorMessage,
  Switch,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';
import { addCourse } from '../api';

const courseSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  imageLink: Joi.string().required(),
  price: Joi.number().required(),
  published: Joi.boolean().default(false),
});

const CreateCourse = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: joiResolver(courseSchema) });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log(data);
    try {
      await addCourse(data);

      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     navigate('/courses');
  //   }
  // }, []);
  // if (localStorage.getItem('token')) {
  //   return null;
  // }

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
            Add a course
          </Heading>
          <FormControl isInvalid={errors.title}>
            <FormLabel>Title</FormLabel>
            <Input
              type='text'
              size={'lg'}
              placeholder='Title'
              {...register('title')}
            />
            <FormErrorMessage>
              {errors.title && errors.title.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.description}>
            <FormLabel>Description</FormLabel>
            <Input
              type='text'
              size={'lg'}
              placeholder='Description'
              {...register('description')}
            />
            <FormErrorMessage>
              {errors.description && errors.description.message}
            </FormErrorMessage>
          </FormControl>{' '}
          <FormControl isInvalid={errors.imageLink}>
            <FormLabel>Image URL</FormLabel>
            <Input
              type='text'
              size={'lg'}
              placeholder='ImageLink'
              {...register('imageLink')}
            />
            <FormErrorMessage>
              {errors.imageLink && errors.imageLink.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.price}>
            <FormLabel>Price</FormLabel>
            <Input
              type='number'
              step='any'
              size={'lg'}
              placeholder='Price'
              {...register('price')}
            />
            <FormErrorMessage>
              {errors.price && errors.price.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.published}>
            <FormLabel>Published</FormLabel>
            <Switch size={'lg'} {...register('published')} />
            <FormErrorMessage>
              {errors.published && errors.published.message}
            </FormErrorMessage>
          </FormControl>
          <Button
            colorScheme='blue'
            size={'lg'}
            w={'100%'}
            mt={4}
            type='submit'>
            Add
          </Button>
        </VStack>
      </form>
    </Flex>
  );
};
export default CreateCourse;
