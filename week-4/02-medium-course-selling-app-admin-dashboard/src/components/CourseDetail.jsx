import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  FormErrorMessage,
  Box,
  Card,
  CardBody,
  Stack,
  Image,
  useToast,
  Switch,
  Skeleton,
  Badge,
} from '@chakra-ui/react';
import { useForm, useWatch } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { useParams } from 'react-router-dom';
import { fetchCourse, updateCourse } from '../api';
import { useEffect, useState } from 'react';

const courseSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  imageLink: Joi.string().required(),
  price: Joi.number().required(),
  published: Joi.boolean().default(false),
});
const CourseDetail = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(courseSchema),
  });

  let { courseId } = useParams();
  const toast = useToast();

  const [course, setCourse] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const onSubmit = async (data) => {
    try {
      await updateCourse(data, courseId);
      toast({
        title: 'Course updated successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setCourse(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getCourse = async () => {
      const { course } = await fetchCourse(courseId);
      try {
        setCourse(course);
      } catch (error) {
        console.log(error);
      }
    };

    getCourse();
  }, [courseId]);

  useEffect(() => {
    if (course) {
      reset({
        title: course.title,
        description: course.description,
        imageLink: course.imageLink,
        price: course.price,
        published: course.published,
      });
      setLoaded(true);
    }
  }, [course, reset]);

  const isPublished = useWatch({
    name: 'published',
    control,
    defaultValue: false,
  });

  return (
    <Flex
      direction={'row'}
      justify={'center'}
      align={'center'}
      gap={8}
      wrap={'wrap'}>
      <Box>
        <Skeleton maxW='sm' height='400px' isLoaded={loaded}>
          <Card minW={['xs', 'sm']}>
            <Image
              src={course?.imageLink}
              alt={course?.title}
              roundedTop={'md'}
            />
            <CardBody>
              <Badge colorScheme={course?.published ? 'green' : 'red'}>
                {course?.published ? 'Published' : 'Unpublished'}
              </Badge>
              <Stack spacing='3'>
                <Heading size='md'>{course?.title} </Heading>
                <Text fontSize='md'>{course?.description}</Text>
                <Heading size={'sm'}>${course?.price}</Heading>
              </Stack>
            </CardBody>
          </Card>
        </Skeleton>
      </Box>
      <Box p={4}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack
            width={['sm', 'lg']}
            p={8}
            mt={[16, 4]}
            background={'white'}
            rounded={'md'}
            shadow={'sm'}>
            <Heading as={'h2'} size={'lg'} my={4} fontWeight={500}>
              Update course
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
                placeholder='description'
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
                placeholder='imageLink'
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
                placeholder='price'
                {...register('price')}
              />
              <FormErrorMessage>
                {errors.price && errors.price.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.published}>
              <FormLabel>Published</FormLabel>
              <Switch
                size={'lg'}
                {...register('published')}
                isChecked={isPublished}
              />
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
              Update
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default CourseDetail;
