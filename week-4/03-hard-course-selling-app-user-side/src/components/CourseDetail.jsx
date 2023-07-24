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
  CardFooter,
} from '@chakra-ui/react';

import Joi from 'joi';
import { useParams } from 'react-router-dom';
import { buyCourse, fetchCourse } from '../api';
import { useEffect, useState } from 'react';

const CourseDetail = () => {
  let { courseId } = useParams();
  const toast = useToast();

  const [course, setCourse] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const purchaseCourse = async (courseId) => {
    try {
      const res = await buyCourse(courseId);
      toast({
        title: res.message,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getCourse = async () => {
      const { course } = await fetchCourse(courseId);
      try {
        setCourse(course);
        setLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };

    getCourse();
  }, [courseId]);

  return (
    <Flex direction={'row'} justify={'center'} align={'center'} mt={12}>
      <Box>
        <Skeleton maxW='sm' height='400px' isLoaded={loaded}>
          <Card minW={['xs', 'sm']}>
            <Image
              src={course?.imageLink}
              alt={course?.title}
              roundedTop={'md'}
            />
            <CardBody>
              <Stack spacing='3'>
                <Heading size='md'>{course?.title} </Heading>
                <Text fontSize='md'>{course?.description}</Text>
                <Heading size={'md'}>${course?.price}</Heading>
                <Button
                  colorScheme='pink'
                  onClick={() => purchaseCourse(courseId)}>
                  Purchase
                </Button>
              </Stack>
            </CardBody>
          </Card>
        </Skeleton>
      </Box>
    </Flex>
  );
};

export default CourseDetail;
