import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
import { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../constants'
import useToken from '../hooks/useToken'
import { AsyncContext } from './common/Layout'

const CourseDetail = () => {
  const { state: data } = useLocation()
  const [userInput, setUserInput] = useState(() => ({ ...data }))
  const { token } = useToken()
  const navigate = useNavigate()

  const { setShowLoading, setShowErrorModal, setError } =
    useContext(AsyncContext)

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      const res = await axios.put(
        `${BASE_URL}/admin/courses/${data?._id}`,
        {
          ...userInput,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )

      if (res.data.message) {
        setShowLoading(false)
      }
    } catch (error) {
      setShowErrorModal(true)
      setError(error?.response?.data?.message)
    } finally {
      setShowLoading(false)
      navigate(-1)
    }
  }

  const handleChange = e => {
    const { name, value, checked } = e.target
    if (name === 'published') {
      setUserInput({
        ...userInput,
        [name]: checked,
      })
    } else {
      setUserInput({
        ...userInput,
        [name]: value,
      })
    }
  }

  const handlePurchase = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/users/courses/${data._id}`,
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )

      if (res.data.message) {
        setShowLoading(false)

        navigate(data?.isAdmin ? '/admin/dashboard' : '/user/dashboard', {
          state: { isAdmin: data?.isAdmin },
        })
      }
    } catch (error) {
      setShowErrorModal(true)
      setError(error?.response?.data?.message)
    } finally {
      setShowLoading(false)
    }
  }

  return (
    <Stack
      direction={'column'}
      spacing={'40px'}
      sx={{ width: '80%', margin: '0 auto', pt: '40px' }}
    >
      <Typography variant='h4' align='center'>
        {data?.title}
      </Typography>

      {data?.isAdmin ? (
        <Stack direction={'row'} gap={'40px'}>
          <Stack
            component={'form'}
            direction={'column'}
            onSubmit={handleSubmit}
            spacing={{ md: 2 }}
            useFlexGap
            sx={{
              '&': {
                width: '50%',
              },

              '& *': {
                width: '100%',
              },
            }}
            noValidate
            autoComplete='off'
          >
            <TextField
              name='title'
              id='outlined-error'
              label='Title'
              fullWidth
              value={userInput.title || data.title}
              onChange={handleChange}
            />
            <TextField
              name='description'
              id='outlined-error'
              label='Description'
              value={data.description}
              onChange={handleChange}
            />
            <TextField
              name='price'
              id='outlined-error'
              label='Price'
              type='number'
              value={userInput.price || data.price}
              onChange={handleChange}
            />
            <TextField
              name='imageLink'
              id='outlined-error'
              label='Image Link'
              type='text'
              value={userInput.imageLink || data.imageLink}
              onChange={handleChange}
            />

            <FormControlLabel
              name='published'
              control={
                <Checkbox
                  checked={userInput?.published ?? data?.published}
                  onChange={handleChange}
                />
              }
              label='IsPublished?'
              sx={{
                width: '30%',
                '& span': {
                  width: '30%',
                },
              }}
            />

            <Button type='submit' variant='contained' color='primary'>
              Submit
            </Button>
          </Stack>

          <Box>
            <img src={userInput.imageLink || data?.imageLink} width={'400'} />
          </Box>
        </Stack>
      ) : (
        <Stack direction={'column'} gap={'40px'}>
          <Stack direction={'row'} justifyContent={'center'}>
            <img src={userInput.imageLink || data?.imageLink} width={'400'} />
          </Stack>

          <Typography variant='h6' align='center'>
            {data?.description}
          </Typography>
          <Typography variant='h6' align='center'>
            Price : {data?.price} Rupees
          </Typography>

          <Button
            type='submit'
            variant='contained'
            color='primary'
            sx={{ width: 'max-content', margin: '0 auto' }}
            onClick={handlePurchase}
          >
            Purchase Course
          </Button>
        </Stack>
      )}
    </Stack>
  )
}

export default CourseDetail
