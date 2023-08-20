/* eslint-disable react/prop-types */
import { Button, Container, Stack, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { BASE_URL, isStrongPassword } from '../../constants'
import { AsyncContext } from './Layout'

/// File is incomplete. You need to add input boxes to take input for users to login.
function Auth({ isLogin, isAdmin }) {
  const [data, setData] = useState({
    username: '',
    password: '',
  })
  const [errorInput, setErrorInput] = useState({
    username: '',
    password: '',
  })

  const navigate = useNavigate()

  const { setShowLoading, setShowErrorModal, setError } =
    useContext(AsyncContext)

  const handleSubmit = async e => {
    e.preventDefault()

    if (isLogin) {
      setShowLoading(true)

      try {
        const res = await axios.post(
          `${BASE_URL}/${isAdmin ? 'admin' : 'users'}/login`,
          {},
          {
            headers: {
              ...data,
            },
          }
        )

        if (res.data.token) {
          setShowLoading(false)
          localStorage.setItem('token', res.data.token)

          navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard', {
            state: { isAdmin },
          })
        }
      } catch (error) {
        setShowErrorModal(true)
        setError(error?.response?.data?.message)
      } finally {
        setShowLoading(false)
      }
    } else {
      setShowLoading(true)

      try {
        const res = await axios.post(
          `${BASE_URL}/${isAdmin ? 'admin' : 'users'}/signup`,
          {
            ...data,
          }
        )

        if (res.data.token) {
          setShowLoading(false)
          localStorage.setItem('token', res.data.token)
          navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard', {
            state: { isAdmin },
          })
        }
      } catch (error) {
        setShowErrorModal(true)
        setError(error?.response?.data?.message)
      } finally {
        setShowLoading(false)
      }
    }
  }

  return (
    <Container sx={{ pt: '10px' }}>
      <Stack
        direction={'column'}
        spacing={{ xs: 4 }}
        useFlexGap
        sx={{
          '&': {
            width: '100%',
            height: '80vh',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          },
        }}
      >
        {isAdmin ? (
          <Typography variant='h4'>
            {isLogin ? 'Admin Login' : 'Admin Register'}
          </Typography>
        ) : (
          <Typography variant='h4'>{isLogin ? 'Login' : 'Register'}</Typography>
        )}
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
            id='outlined-error'
            label='Username'
            fullWidth
            onBlur={() => {
              if (data.username.length < 5) {
                setErrorInput({
                  ...errorInput,
                  username: 'Username must be greater than 4 characters',
                })
              } else {
                setErrorInput({
                  ...errorInput,
                  username: '',
                })
              }
            }}
            error={!isLogin && !!errorInput?.username}
            helperText={!isLogin && errorInput?.username}
            value={data.username}
            onChange={e => {
              setData({ ...data, username: e.target.value.trim() })
            }}
          />
          <TextField
            id='outlined-error'
            label='Password'
            type='password'
            value={data.password}
            onBlur={() => {
              if (!isStrongPassword(data?.password)) {
                setErrorInput({
                  ...errorInput,
                  password:
                    'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character.',
                })
              } else {
                setErrorInput({
                  ...errorInput,
                  password: '',
                })
              }
            }}
            error={!isLogin && !!errorInput?.password}
            helperText={!isLogin && errorInput?.password}
            onChange={e => {
              setData({ ...data, password: e.target.value })
            }}
          />

          <Button
            type='submit'
            variant='contained'
            color='primary'
            disabled={
              !data.password ||
              !data.username ||
              Boolean(errorInput?.username) ||
              Boolean(errorInput?.password)
            }
          >
            {isLogin ? 'Login' : 'Register'}
          </Button>
        </Stack>

        <Typography>
          {isLogin ? 'New here' : 'Already have an account'}?{' '}
          {isAdmin ? (
            <Link
              to={isLogin ? '/admin/register' : '/admin/login'}
              className='link'
            >
              {isLogin ? 'Register' : 'Login'}
            </Link>
          ) : (
            <Link to={isLogin ? '/register' : '/login'} className='link'>
              {isLogin ? 'Register' : 'Login'}
            </Link>
          )}
        </Typography>
      </Stack>
    </Container>
  )
}

export default Auth
