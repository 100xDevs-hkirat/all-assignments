import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import useToken from '../../hooks/useToken'

const PublicRoutes = () => {
  const navigate = useNavigate()
  const { token } = useToken()

  useEffect(() => {
    if (token) {
      return navigate('/admin/dashboard', {
        state: {
          isAdmin: false,
        },
      })
    }
  }, [])
  return <Outlet />
}

export default PublicRoutes
