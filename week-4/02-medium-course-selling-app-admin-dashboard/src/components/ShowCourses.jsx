/* eslint-disable react/prop-types */
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import { BASE_URL } from '../constants'
import { AsyncContext } from './common/Layout'
import useToken from '../hooks/useToken'
import { useLocation, useNavigate } from 'react-router-dom'

function ShowCourses() {
  const [courses, setCourses] = React.useState([])
  const { token } = useToken()
  const {
    state: { isAdmin },
  } = useLocation()

  const navigate = useNavigate()

  const { setShowLoading, setShowErrorModal, setError } =
    useContext(AsyncContext)

  useEffect(() => {
    const getCourses = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/${isAdmin ? 'admin' : 'users'}/courses`,

          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        )

        if (res.data.courses) {
          setShowLoading(false)
          setCourses(res.data.courses)
        }
      } catch (error) {
        setShowErrorModal(true)
        setError(error?.response?.data?.message)
      } finally {
        setShowLoading(false)
      }
    }

    getCourses()
  }, [])

  return (
    <Stack
      direction={'column'}
      spacing={'40px'}
      sx={{ width: '80%', margin: '0 auto', pt: '40px', position: 'relative' }}
    >
      <Typography variant='h4' align='center'>
        Courses Page
      </Typography>

      {!isAdmin && (
        <Button
          variant='contained'
          id='purchase'
          onClick={() => navigate('/user/purchased')}
        >
          Purchased courses
        </Button>
      )}
      <Grid
        container
        direction='row'
        justifyContent='flex-start'
        alignItems='center'
        spacing={4}
        sx={{
          '&': {
            gap: '40px',
          },
        }}
      >
        {courses.map(course => (
          <Course key={course._id} {...course} isAdmin={isAdmin} />
        ))}
      </Grid>
    </Stack>
  )
}

export const Course = props => {
  const navigate = useNavigate()
  return (
    <Card
      sx={{
        maxWidth: 805,
        transition: '0.5s ease',
        '&:hover': {
          cursor: 'pointer',
          outline: '1px solid black',
          transform: 'scale(1.05)',
        },
      }}
      onClick={() => {
        navigate(
          props.isAdmin
            ? `/admin/course/${props._id}`
            : `/user/course/${props._id}`,
          {
            state: {
              ...props,
            },
          }
        )
      }}
    >
      <CardMedia
        sx={{ height: 300 }}
        image={props.imageLink}
        title={props.title}
      />
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {props.title}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {props.description}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default ShowCourses
