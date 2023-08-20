import axios from 'axios'
import { useEffect, useState } from 'react'
import { BASE_URL } from '../constants'
import useToken from '../hooks/useToken'
import { Grid, Stack, Typography } from '@mui/material'
import { Course } from './ShowCourses'

const PurchasedCourses = () => {
  const { token } = useToken()

  const [courses, setCourses] = useState([])

  useEffect(() => {
    const getCourses = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/users/courses`,

          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        )
        const purchaseRes = await axios.get(
          `${BASE_URL}/users/purchasedCourses`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        )

        const purchasedCourses = res.data.courses.filter(item =>
          purchaseRes.data.courses.includes(item._id)
        )

        setCourses(purchasedCourses)
      } catch (error) {
        console.log('error=====>', error)
      }
    }

    getCourses()
  }, [])

  return (
    <Stack
      direction={'column'}
      spacing={'40px'}
      sx={{ width: '80%', margin: '0 auto', pt: '40px' }}
    >
      <Typography variant='h4' align='center'>
        Purchased Courses
      </Typography>
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
          <Course key={course._id} {...course} />
        ))}
      </Grid>
    </Stack>
  )
}

export default PurchasedCourses
