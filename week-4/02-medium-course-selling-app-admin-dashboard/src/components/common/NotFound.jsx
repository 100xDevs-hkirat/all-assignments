import { Stack, Typography } from '@mui/material'

const NotFound = () => {
  return (
    <Stack
      direction={'column'}
      sx={{ height: '80vh' }}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Typography variant='h2'>404, Page not found</Typography>
    </Stack>
  )
}

export default NotFound
