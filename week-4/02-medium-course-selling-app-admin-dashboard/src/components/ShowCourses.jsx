import { useEffect, useState } from 'react';
import { fetchCourses } from '../api';
import {
  Card,
  CardBody,
  Box,
  Heading,
  Badge,
  Image,
  Grid,
  Stack,
  GridItem,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';

function ShowCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const { courses } = await fetchCourses();
        setCourses(courses);
        setLoaded(true);
      } catch (error) {
        localStorage.clear('token');
        navigate('/login');
      }
    };

    fetchCoursesData();
  }, []);

  return (
    <Box>
      <Heading size='lg' fontWeight={500} my={8}>
        Courses
      </Heading>

      {!loaded ? (
        <SkeletonCards />
      ) : (
        <Grid
          gridTemplateColumns='repeat(auto-fill, minmax(275px, 1fr))'
          gap={'40px'}
          mt={4}>
          {courses.map(({ courseId, title, imageLink, published }) => (
            <CourseCard
              key={courseId}
              title={title}
              courseId={courseId}
              imageLink={imageLink}
              published={published}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
}

export const CourseCard = ({ title, courseId, imageLink, published }) => {
  return (
    <GridItem>
      <Link to={`/courses/${courseId}`}>
        <Card height={'full'}>
          <Image src={imageLink} alt={title} borderTopRadius='lg' />
          <CardBody>
            <Badge colorScheme={published ? 'green' : 'red'}>
              {published ? 'Published' : 'Unpublished'}
            </Badge>
            <Stack spacing='3'>
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

export default ShowCourses;
