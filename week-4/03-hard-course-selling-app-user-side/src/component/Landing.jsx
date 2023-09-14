import React from 'react'
import { Box, Typography } from '@mui/material'
import NaveBar from './NavBar'

const Landing = () => {
  return (
    <Box>
      <NaveBar/>
      <Typography sx={{ margin: 2 }} variant='h5'>Welcome to course selling website</Typography>
    </Box>
  )
}

export default Landing