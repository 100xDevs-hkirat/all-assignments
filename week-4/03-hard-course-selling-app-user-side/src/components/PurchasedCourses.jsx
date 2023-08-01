import { useEffect, useState } from 'react';
import { fetchPurchasedCourses } from '../api';
import {
  Card,
  CardBody,
  Box,
  Heading,
  Image,
  Grid,
  Stack,
  GridItem,
  Skeleton,
  SkeletonText,
  Badge,
  Flex,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';

function PurchasedCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchPurchasedCoursesData = async () => {
      try {
        const { purchasedCourses } = await fetchPurchasedCourses();
        setCourses(purchasedCourses);
        setLoaded(true);
      } catch (error) {
        localStorage.clear('token');
        navigate('/login');
      }
    };

    fetchPurchasedCoursesData();
  }, []);

  if (!courses.length) {
    return (
      <Flex justify={'center'} align={'center'} h={'full'}>
        <Heading size={'md'} color='gray.500'>
          You have not purchased any courses.
        </Heading>
      </Flex>
    );
  }

  if (courses.length) {
    return (
      <Box>
        <Heading size='lg' fontWeight={500} my={8}>
          My Courses
        </Heading>

        {!loaded ? (
          <SkeletonCards />
        ) : (
          <Grid
            gridTemplateColumns='repeat(auto-fill, minmax(275px, 1fr))'
            gap={'40px'}
            mt={4}>
            {courses.map(({ courseId, title, imageLink }) => (
              <CourseCard
                key={courseId}
                title={title}
                courseId={courseId}
                imageLink={imageLink}
              />
            ))}
          </Grid>
        )}
      </Box>
    );
  }
}

export const CourseCard = ({ title, courseId, imageLink }) => {
  return (
    <GridItem>
      <Link to={`/courses/${courseId}`}>
        <Card height={'full'}>
          <Image src={imageLink} alt={title} borderTopRadius='lg' />
          <CardBody>
            <Stack spacing='3'>
              <Badge alignSelf={'start'} colorScheme={'green'}>
                Purchased
              </Badge>
              <Heading size='md' noOfLines={2}>
                {title}
              </Heading>
            </Stack>
          </CardBody>
        </Card>
      </Link>
    </GridItem>
  );
};

export const SkeletonCards = () => {
  return (
    <Grid
      gridTemplateColumns='repeat(auto-fill, minmax(275px, 1fr))'
      gap={'40px'}
      mt={4}>
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <Skeleton height='200px' />
          <CardBody>
            <SkeletonText />
          </CardBody>
        </Card>
      ))}
    </Grid>
  );
};

export default PurchasedCourses;
