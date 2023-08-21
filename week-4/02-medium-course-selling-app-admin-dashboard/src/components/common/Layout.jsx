import { createContext, useState } from 'react'
import Navbar from '../Navbar'
import { Outlet } from 'react-router-dom'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { Box, Modal, Typography } from '@mui/material'

export const AsyncContext = createContext()

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const Layout = () => {
  const [showLoading, setShowLoading] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [error, setError] = useState('')

  const handleClose = () => {
    setShowErrorModal(false)
  }
  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={showLoading}
      >
        <CircularProgress color='inherit' />
      </Backdrop>

      <Modal
        open={showErrorModal}
        onClose={handleClose}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
      >
        <Box sx={style}>
          <Typography
            id='modal-modal-title'
            variant='h6'
            component='h2'
            color={'red'}
          >
            Error
          </Typography>
          <Typography id='modal-modal-description' sx={{ mt: 2 }} color={'red'}>
            {error}
          </Typography>
        </Box>
      </Modal>

      <AsyncContext.Provider
        value={{ showLoading, setShowLoading, setError, setShowErrorModal }}
      >
        <Navbar />

        <Box sx={{ background: '#e4e4e4', height: '100vh' }}>
          <Outlet />
        </Box>
      </AsyncContext.Provider>
    </>
  )
}

export default Layout
